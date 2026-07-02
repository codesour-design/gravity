# Mappa — Logica dei cluster (specifica per sviluppo)

> Documento di handoff per chi implementa la clusterizzazione delle mappe Gravity
> (**Planning** e **Inventory / Parco impianti**) in produzione.
> Fonte di verità del comportamento: i prototipi
> `planning/index.html` e `inventory-systems/index.html`.

Lo stack dei prototipi è Google Maps JS API + [`@googlemaps/markerclusterer`](https://github.com/googlemaps/js-markerclusterer).
La logica qui descritta è indipendente dal framework: il rendering del cluster è
una funzione pura `(count) → icona SVG`, riusabile con qualsiasi clusterer.

---

## 1. Anatomia di un cluster

Ogni cluster è un'icona SVG composta da:

1. **Alone** (`halo`) — disco esterno della **stessa tinta** della bolla, in
   trasparenza. Dà profondità e stacca il cluster dalla mappa.
2. **Bolla** (`bg`) — cerchio pieno opaco, colore dello scaglione.
3. **Numero** (`fg`) — conteggio degli elementi aggregati, bold, centrato.

```
        ╭───────────╮
      ╭─┤   alone    ├─╮   ← stessa tinta, alpha 0.40
      │ │  ╭─────╮   │ │
      │ │  │ 137 │   │ │   ← bolla piena + numero bianco
      │ │  ╰─────╯   │ │
      ╰─┤            ├─╯
        ╰───────────╯
```

Dimensioni (diametro **bolla** in px, in base al conteggio):

| Conteggio | Diametro bolla |
|-----------|----------------|
| ≤ 5       | 32 px          |
| 6 – 20    | 36 px          |
| > 20      | 40 px          |

L'alone aggiunge `6 px` di spessore tutt'intorno; il box SVG totale è quindi
`diametro_bolla + 6*2 + 2`. L'**anchor** dell'icona è il centro del box.

---

## 2. Scala cromatica (scaglioni)

La scala è **derivata dal primary Gravity `#3E00FB`**: dal viola medio per i
cluster piccoli all'indaco profondo per quelli grandi. Sei scaglioni, con **passi
di luminosità uniformi** (~0.05 ciascuno) perché la differenza tra uno scaglione
e l'altro sia leggibile a colpo d'occhio.

| Scaglione | Conteggio | Sfondo (`bg`) | Testo (`fg`) | Luminanza | Contrasto testo |
|-----------|-----------|---------------|--------------|-----------|-----------------|
| 1 | ≤ 2    | `#A47CFF` | `#FFFFFF` | 0.295 | 3.0:1 |
| 2 | 3 – 5  | `#976AFF` | `#FFFFFF` | 0.241 | 3.6:1 |
| 3 | 6 – 10 | `#8A52FF` | `#FFFFFF` | 0.187 | 4.4:1 |
| 4 | 11 – 20| `#7838FB` | `#FFFFFF` | 0.138 | 5.6:1 |
| 5 | 21 – 50| `#3E00FB` (primary) | `#FFFFFF` | 0.080 | 8.1:1 |
| 6 | > 50   | `#2900A0` | `#FFFFFF` | 0.030 | 13:1 |

**Vincoli di leggibilità** (entrambi rispettati dalla scala):
- **Testo / sfondo:** testo bianco su tutti gli scaglioni, contrasto ≥ 3:1 (lo
  scaglione 1 è il limite, accettabile per testo **bold**; dallo scaglione 3 in
  su si è ≥ 4.5:1, AA pieno).
- **Sfondo / mappa:** anche lo scaglione più chiaro ha ~2.9:1 contro la mappa
  chiara (`#f5f5f5`), quindi è sempre visibile. Questo è il motivo per cui non si
  usano tinte più chiare di `#A47CFF`: diventerebbero invisibili sulla mappa.

> Se in futuro si cambia il tema della mappa (es. dark mode), va rivalutato sia
> il contrasto sfondo/mappa sia testo/sfondo: la scala qui sopra è tarata su
> **mappa chiara**.

L'`halo` è la stessa tinta della bolla con `alpha = 0.40`:

| Scaglione | `halo` |
|-----------|--------|
| 1 | `rgba(164,124,255,0.40)` |
| 2 | `rgba(151,106,255,0.40)` |
| 3 | `rgba(138,82,255,0.40)`  |
| 4 | `rgba(120,56,251,0.40)`  |
| 5 | `rgba(62,0,251,0.40)`    |
| 6 | `rgba(41,0,160,0.40)`    |

---

## 3. Funzioni di rendering

Sono identiche nei due prototipi e vanno trattate come **unico modulo condiviso**.

### `clusterColor(n)` — mappa conteggio → colori

```js
// Scala derivata dal primary Gravity (#3E00FB). Testo bianco ovunque,
// contrasto verificato WCAG (>= 3:1 testo, >= 2.9:1 contro mappa chiara).
// `halo` = stessa tinta della bolla in trasparenza.
const clusterColor = (n) => {
  if (n <= 2)  return { bg: '#A47CFF', fg: '#ffffff', halo: 'rgba(164,124,255,0.40)' };
  if (n <= 5)  return { bg: '#976AFF', fg: '#ffffff', halo: 'rgba(151,106,255,0.40)' };
  if (n <= 10) return { bg: '#8A52FF', fg: '#ffffff', halo: 'rgba(138,82,255,0.40)' };
  if (n <= 20) return { bg: '#7838FB', fg: '#ffffff', halo: 'rgba(120,56,251,0.40)' };
  if (n <= 50) return { bg: '#3E00FB', fg: '#ffffff', halo: 'rgba(62,0,251,0.40)'  };
  return               { bg: '#2900A0', fg: '#ffffff', halo: 'rgba(41,0,160,0.40)'  };
};
```

### `makeClusterSvg(count)` — genera l'icona

```js
const makeClusterSvg = (count) => {
  const { bg, fg, halo } = clusterColor(count);
  const core = count <= 5 ? 32 : count <= 20 ? 36 : 40;  // diametro bolla solida
  const ring = 6;                                         // spessore alone trasparente
  const s = core + ring * 2 + 2;                          // box: lascia spazio all'alone
  const c = s / 2;
  const rCore = core / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">
    <circle cx="${c}" cy="${c}" r="${rCore + ring}" fill="${halo}"/>
    <circle cx="${c}" cy="${c}" r="${rCore}" fill="${bg}"/>
    <text x="${c}" y="${c + 4.5}" text-anchor="middle" fill="${fg}"
          font-size="12" font-weight="700" font-family="sans-serif">${count}</text>
  </svg>`;
  const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  return { url, size: s };  // size serve a calcolare scaledSize/anchor
};
```

**Note importanti:**
- Disegnare l'alone **prima** (cerchio dietro) e la bolla **sopra**: così il
  bordo della bolla resta netto, senza l'artefatto che si avrebbe usando uno
  `stroke` trasparente sovrapposto al fill.
- `font-family: sans-serif` nell'SVG: in produzione usare lo stack del design
  system (SF Pro Text) — vedi `tokens.js`.
- L'icona è un data-URI SVG. Per molti marker conviene **memoizzare** per
  `count` (vedi §6 — Performance).

---

## 4. Logica di clusterizzazione

I prototipi usano due strategie. **Per la produzione si raccomanda la libreria**
(opzione A); l'opzione B è documentata perché è quella attiva nel prototipo
Planning.

### A. Libreria `@googlemaps/markerclusterer` — consigliata (Inventory)

```js
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';

const clusterer = new MarkerClusterer({
  map,
  markers: allMarkers,
  // raggio piu' ampio (default 60px) + clustering esteso ai livelli di zoom alti
  algorithm: new SuperClusterAlgorithm({ radius: 160, maxZoom: 19 }),
  renderer: {
    render: ({ count, position }) => {
      const { url, size } = makeClusterSvg(count);
      return new google.maps.Marker({
        position,
        icon: {
          url,
          scaledSize: new google.maps.Size(size, size),
          anchor:     new google.maps.Point(size / 2, size / 2),
        },
        zIndex: 10000 + count,  // i cluster grandi stanno sopra
      });
    },
  },
});
```

**Parametri da tarare** (sono la leva principale su "quanto" si clusterizza):

| Parametro | Default libreria | Valore prototipo | Effetto |
|-----------|------------------|------------------|---------|
| `radius`  | 60               | **160**          | px entro cui due punti vengono aggregati. Più alto = clusterizza di più. |
| `maxZoom` | 16               | **19**           | livello di zoom oltre il quale i cluster si sciolgono in marker singoli. Più alto = cluster visibili più a lungo. |

Default click-handler della libreria: lo zoom sul cluster. Va bene; in alternativa
si può centrare/espandere manualmente come nell'opzione B.

### B. Clustering a griglia manuale (Planning)

Aggrega per **celle di griglia** in coordinate "world point" proiettate, ricalcolando
ad ogni cambio di zoom/bounds. È più semplice ma meno efficiente e meno "fluido"
della libreria; utile solo se non si vuole una dipendenza esterna.

```js
const GRID = 60;                       // lato cella in px
const ZOOM_SCIOGLIMENTO = 15;          // oltre questo zoom: tutti i marker singoli

function applyClustering(map, markers) {
  const zoom = map.getZoom() || 10;
  if (zoom > ZOOM_SCIOGLIMENTO) {       // mostra i marker individuali
    markers.forEach(({ marker }) => marker.setMap(map));
    return;
  }
  const proj  = map.getProjection();
  const scale = Math.pow(2, zoom);
  const groups = {};
  markers.forEach(entry => {
    const wp  = proj.fromLatLngToPoint(entry.marker.getPosition());
    const key = `${Math.floor(wp.x * scale / GRID)}_${Math.floor(wp.y * scale / GRID)}`;
    (groups[key] ||= []).push(entry);
  });
  Object.values(groups).forEach(group => {
    if (group.length === 1) { group[0].marker.setMap(map); return; }
    group.forEach(({ marker }) => marker.setMap(null));          // nascondi i singoli
    const center = baricentro(group);                            // media lat/lng
    new google.maps.Marker({
      position: center,
      icon: makeClusterSvg(group.length),
      map,
      zIndex: google.maps.Marker.MAX_ZINDEX + group.length,
    }).addListener('click', () => {                              // espandi al click
      map.setZoom(Math.min(zoom + 3, 20));
      map.panTo(center);
    });
  });
}
// va richiamata su 'idle' / 'zoom_changed' / 'bounds_changed'
```

> **Confronto soglie:** `radius`/`maxZoom` della libreria e `GRID`/`ZOOM_SCIOGLIMENTO`
> della griglia non sono direttamente confrontabili (la libreria usa un super-cluster
> gerarchico, la griglia un binning fisso). Tarare a vista sul comportamento desiderato.

---

## 5. Forma dei dati (marker)

Ogni elemento mappato deve esporre almeno una posizione geografica:

```js
{ id, lat, lng, /* …campi di dominio: tipo, stato, ecc. */ }
```

Nel prototipo Inventory l'oggetto impianto ha `lat`/`lng` più i campi di dominio
(`tipo`, `stato`, `stato_amm`, `faces`, `zona`, …). Il cluster **non** dipende da
questi campi: gli serve solo il **conteggio** dei punti aggregati.

> Il dataset demo del prototipo è generato sinteticamente (RNG con seed) in
> "blob" di densità crescente, solo per mostrare tutti gli scaglioni di cluster.
> In produzione i dati arrivano dal backend: rimuovere il generatore.

---

## 6. Note per la produzione

- **Performance / memoizzazione.** `makeClusterSvg` produce un data-URI: con
  centinaia/migliaia di marker, memoizzare l'output per `count` (es. `Map` o cache
  per fascia) evita di rigenerare SVG identici. Valutare anche il rendering dei
  marker base come SVG/simboli leggeri.
- **Hit area.** L'alone aumenta leggermente l'area cliccabile del cluster: è
  voluto. Tenerne conto se si calcolano overlap o tooltip.
- **Tipografia.** Sostituire `font-family: sans-serif` con il font del design
  system; non sovrascrivere altri token tipografici.
- **Tema.** Colori e contrasti sono tarati su **mappa chiara**. Per dark mode
  serve una seconda scala (rivalutare luminanze e contrasti).
- **Accessibilità.** Il numero è l'informazione primaria: mantenerlo bold e ad
  alto contrasto. Non affidarsi al solo colore per comunicare la "dimensione" del
  cluster — il numero lo rende esplicito.
- **Coerenza.** `clusterColor` + `makeClusterSvg` devono restare **un unico
  modulo condiviso** tra le mappe (Planning, Inventory ed eventuali future), per
  evitare derive di palette tra una mappa e l'altra.

---

## 7. Checklist di implementazione

- [ ] Estrarre `clusterColor` e `makeClusterSvg` in un modulo condiviso.
- [ ] Collegare il renderer del clusterer a `makeClusterSvg`.
- [ ] Impostare `algorithm` con `radius`/`maxZoom` (partire da 160 / 19 e tarare).
- [ ] Memoizzare le icone per `count`.
- [ ] Sostituire il font SVG con il token del design system.
- [ ] Verificare il comportamento del click sul cluster (zoom/espansione).
- [ ] Verificare i contrasti se la mappa non è chiara.
- [ ] Rimuovere ogni dato sintetico/generatore di demo.
