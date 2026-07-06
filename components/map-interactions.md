# Map — Componente mappa condiviso (`GravityMap`)

> Fonte di verità unica per marker, cluster e icone tipologia impianto sulla mappa Gravity —
> condivisi tra `inventory-systems` e `planning`. Modulo: `prototype/_shared/map-interactions.js`,
> esposto come `window.GravityMap` (caricare **dopo** la Google Maps API).
> Il popover al click su un marker è documentato a parte in `components/map-popover.md`.

## Direzione futura

Oggi `GravityMap` unifica solo il **livello interazione** (marker/cluster/zoom) e le icone
tipologia; dato e ricerca restano per-app. L'obiettivo di prodotto è arrivare a un **componente
mappa unico** (non solo la logica sotto) usato sia da Planning sia da Systems/Inventory, con
**logica di ricerca unificata** e pensato per essere riusabile in feature future oltre queste
due. Quando si tocca la mappa, valutare le modifiche anche rispetto a questo obiettivo — non
solo al bisogno del singolo prototipo.

## Due livelli — non confonderli

- **DATO** (per-app, non si unifica): forma/icona del marker = `tipo` (OOH/DOOH → cartella
  asset) × `stato`. Inventory usa lo stato **amministrativo** (Attivo / In Manutenzione /
  Rimosso / Inizializzato); Planning quello **commerciale** (Available / In Option / Reserved).
  L'app risolve `src` e lo passa al modulo — `GravityMap` non conosce il dominio.
- **INTERAZIONE** (condivisa in `map-interactions.js`): come marker e cluster reagiscono a
  hover, click, selezione, zoom.

## Stati marker

| Stato | Trigger → trattamento | Inventory | Planning |
|-------|------------------------|-----------|----------|
| default | icona base, scala con lo zoom | ✓ | ✓ |
| hover | ×1.12 + card preview | ✓ | ✓ |
| focused | click → ×1.4 + drop-shadow viola, apre dettaglio/popover | ✓ | ✓ |
| selected | checkbox attivo → badge check (`CheckCircleFilled`) viola in basso a destra | — | ✓ |
| selected + hover | selezionato e mouse sopra → badge check + ×1.12 | — | ✓ |
| dimmed | esiste un focus altrove → opacity 0.2 | ✓ | ✓ |

La selezione multipla visibile è **esclusiva del Planning**; in Inventory il click apre sempre
il dettaglio. Colore accento stati: primary `#3E00FB`.

## Stati cluster

| Stato | Trigger → trattamento | Inventory | Planning |
|-------|------------------------|-----------|----------|
| default | bolla colorata per cardinalità + alone (`clusterColor`/`makeClusterSvg`) | ✓ | ✓ |
| hover | bolla ×1.1 + tooltip conteggio | ✓ | ✓ |
| con selezionati | label centrale `"selezionati/totale"` (es. `2/5`) + anello viola | — | ✓ |

Click sul cluster → **zoom-to-bounds preciso** sui marker contenuti (mai uno zoom fisso).

## Cluster — anatomia e scala cromatica

Ogni cluster è un'icona SVG data-URI composta da tre livelli, disegnati in quest'ordine (alone
**dietro**, bolla **sopra** — evita l'artefatto di uno stroke trasparente sovrapposto al fill):

1. **Alone** (`halo`) — disco esterno stessa tinta della bolla, `alpha 0.40`. Dà profondità e
   stacca il cluster dalla mappa.
2. **Bolla** (`bg`) — cerchio pieno opaco, colore dello scaglione.
3. **Numero/label** (`fg`) — conteggio (o `selezionati/totale`), bold, centrato; dimensione font
   ridotta automaticamente per label più lunghe (5 caratteri → 9px, 4 → 10px, altrimenti 12px).

Diametro bolla in base al conteggio: ≤ 5 → `32px`, 6–20 → `36px`, > 20 → `40px` (in hover,
`×1.1`). L'alone aggiunge `6px` di spessore tutt'intorno; il box SVG totale è
`diametro_bolla + 6*2 + 2`, anchor al centro.

La scala è **derivata dal primary Gravity `#3E00FB`**, sei scaglioni con passi di luminosità
uniformi, contrasto verificato WCAG (accoppiato al codice — `clusterColor()` in
`map-interactions.js`):

| Scaglione | Conteggio | `bg` | `fg` | Contrasto testo | `halo` |
|-----------|-----------|------|------|------------------|--------|
| 1 | ≤ 2    | `#A47CFF` | `#FFFFFF` | 3.0:1 | `rgba(164,124,255,0.40)` |
| 2 | 3 – 5  | `#976AFF` | `#FFFFFF` | 3.6:1 | `rgba(151,106,255,0.40)` |
| 3 | 6 – 10 | `#8A52FF` | `#FFFFFF` | 4.4:1 | `rgba(138,82,255,0.40)`  |
| 4 | 11 – 20| `#7838FB` | `#FFFFFF` | 5.6:1 | `rgba(120,56,251,0.40)`  |
| 5 | 21 – 50| `#3E00FB` (primary) | `#FFFFFF` | 8.1:1 | `rgba(62,0,251,0.40)` |
| 6 | > 50   | `#2900A0` | `#FFFFFF` | 13:1  | `rgba(41,0,160,0.40)`    |

**Vincoli di leggibilità** (entrambi già rispettati dalla scala — non introdurre tinte più
chiare di `#A47CFF`, diventano illeggibili anche contro la mappa chiara `#f5f5f5`):
- testo bianco su ogni scaglione, contrasto ≥ 3:1 (lo scaglione 1 è il limite, accettabile solo
  per testo **bold**; dallo scaglione 3 in su si è ≥ 4.5:1, AA pieno);
- sfondo bolla contro la mappa chiara sempre ≥ ~2.9:1.

> Palette tarata su **mappa chiara**. Se in futuro si introduce un tema mappa scuro, va
> rivalutata sia questa scala sia i contrasti — non riusare alla cieca.

## Motore di clustering

**Oggi**: un unico motore a **griglia condivisa** (`computeGridClusters`) usato da entrambe le
app — aggrega per celle in coordinate "world point" proiettate, ricalcolando a ogni cambio di
zoom/bounds; sopra la soglia di decluster (`DECLUSTER_ZOOM`) i marker tornano individuali.

**Se in produzione servisse più fluidità/performance con molte migliaia di marker**, valutare la
libreria [`@googlemaps/markerclusterer`](https://github.com/googlemaps/js-markerclusterer) con
`SuperClusterAlgorithm` (parametri di partenza indicativi: `radius: 160`, `maxZoom: 19` — non
direttamente confrontabili con `CLUSTER_GRID`/`DECLUSTER_ZOOM`, che usano un binning fisso
anziché un super-cluster gerarchico; tarare a vista). In tal caso il renderer della libreria
richiama comunque `makeClusterSvg` — la funzione di rendering resta la stessa, cambia solo il
motore che decide i gruppi.

## Icone tipologia impianto (glifo UI)

Icone custom locali per rappresentare il *tipo* di impianto ovunque nell'interfaccia (colonna
Tipologia in tabella, card dettaglio, chip del drawer filtri, tag dei filtri attivi) — non i
marker mappa, che sono un asset separato:

- Path: `prototype/_shared/assets/systemstype-icons/{OOH,DOOH}/<File>.svg`, glifo 16×16, colore
  `rgba(0,0,0,0.45)` (secondario).
- Risolte da `GravityMap.systypeIconSrc(type, channel)` — lookup case/spazi-insensitive; ritorna
  `null` se l'asset non esiste (il chiamante applica il proprio fallback, es. icona Ant Design
  generica).
- **Eccezione canale-dipendente**: solo il tipo **"Speciale"** ha icona e marker diversi tra
  OOH e DOOH (`Special.svg` / `SpecialDOOH.svg`, cartelle marker `OOH/speciale` /
  `DOOH/speciale`) — tutti gli altri tipi dipendono solo dal `tipo`, non dal canale. Il canale è
  risolto così: Inventory dal campo `canale` dell'impianto (`illuminato` → DOOH), Planning
  assume sempre OOH per "Speciale" (non ha il dato).
- **Rename di dominio**: il tipo storicamente chiamato "Poster" è oggi **"Cartello"** — icona
  `Cartello.svg`, cartella marker propria `cartello` (7 stati). Non toccare termini incidentali
  omonimi (Posterscope, Publiposter, nomi file foto).

## API del modulo `GravityMap`

| Funzione / costante | Cosa fa |
|---|---|
| `folderForType(type, channel)` | risolve la cartella marker per tipo, tollerante a case/spazi; "Speciale" è canale-dipendente |
| `markerSrc(type, stateFile, channel)` | path SVG del marker per tipo + stato (lo stato-file è già risolto dall'app) |
| `systypeIconSrc(type, channel)` | path icona glifo tipologia (UI), `null` se non esiste |
| `getMarkerSize(zoom)` | dimensione marker in base allo zoom |
| `clusterColor(n)` | conteggio → `{ bg, fg, halo }` |
| `makeClusterSvg(count, opts)` | icona cluster; `opts: { hovered, selectedCount }` (`selectedCount` solo planning) |
| `makeMarkerIcon(opts)` | icona marker con stati; `opts: { src, zoom, flags: { isHovered, isFocused, isSelected, hasFocus } }` |
| `preloadSvg(src)` / `preloadAll(list)` / `getCachedSvg(src)` | cache condivisa del contenuto SVG |
| `computeGridClusters(map, items, opts)` | motore di clustering a griglia condiviso |
| `fitBoundsToMembers(map, members, opts)` | zoom-to-bounds preciso sul click cluster |
| `ACCENT`, `ASSET_BASE`, `TIPO_TO_FOLDER`, `SYSTYPE_ICON`, `CLUSTER_GRID`, `DECLUSTER_ZOOM` | costanti — mappe tipo→cartella/icona e soglie, fonte di verità unica |

## Note per la produzione

- **Performance**: con centinaia/migliaia di marker, `makeClusterSvg` va memoizzato per
  `count`/`opts` (già in cache per URL via `preloadSvg`/`getCachedSvg` lato marker; il cluster
  no) — valutare anche il rendering dei marker base come SVG/simboli leggeri.
- **Tipografia SVG**: l'icona cluster usa `font-family: sans-serif` — in produzione sostituire
  con lo stack del design system (SF Pro Text via `tokens.js`), senza toccare altri token
  tipografici.
- **Tema**: colori e contrasti sono tarati su mappa chiara; per un'eventuale mappa scura serve
  una seconda scala, non riusare quella attuale.
- **Accessibilità**: il numero/label è l'informazione primaria del cluster — mantenerlo bold e
  ad alto contrasto; non affidarsi al solo colore per comunicare la dimensione del cluster.
- **Coerenza**: `clusterColor`/`makeClusterSvg`/le mappe tipo→cartella devono restare
  nell'**unico modulo condiviso**, mai duplicate per singola app.

## Quando aprire cosa

- Nuovo modulo con mappa, decidere gli stati/comportamenti → questa pagina.
- Card al click sul marker → `components/map-popover.md`.
- Trasposizione varianti AntD generiche (Card, Text, Icon, Button del popover) →
  `components/react-figma-map.md`.
