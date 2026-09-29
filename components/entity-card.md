# Entity Card — card condivisa per entità collegate

> Fonte di verità per qualunque **card che rappresenta un'entità** in una griglia di collegamento
> (`LAYOUT.md` §3.4 "Connected Systems"/"Spazi collegati", §3.9 sezione "Diritto sul Suolo"). Ogni
> prototipo che mostra entità come card — non come riga di tabella — DEVE usare il componente
> condiviso `prototype/_shared/entity-card.js` (`window.GravityEntityCard`). Non ricostruire la
> card per-prototipo: è già lo stesso shape (header/badge + immagine opzionale + campi
> icona-label-valore + footer opzionale) riusato identico tra Inventory Licenses ("Spazi
> collegati", "Atti di provenienza") e i pattern di collegamento di `section-drawer.md`.

---

## Componente condiviso: `window.GravityEntityCard`

Sorgente: `prototype/_shared/entity-card.js`. Da caricare dopo React, `@ant-design/icons` e
`tokens.js`:

```html
<script src="../_shared/entity-card.js"></script>
```

```js
React.createElement(window.GravityEntityCard, {
  title: 'Impianto Via Maqueda 148',
  badge: { text: 'PA-001', variant: 'default' },
  image: { id: 'imp-001', placeholder: 'foto impianto' },
  fields: [
    { icon: 'TagOutlined',    label: 'Tipologia:', value: 'Pensilina' },
    { icon: 'ExpandOutlined', label: 'Formato:',   value: '140×200 cm' },
  ],
})
```

Nessun wrapper esterno richiesto: il componente include già il proprio contenitore a card
(bordo, radius, sezioni interne).

### Props

| Prop | Tipo | Note |
|---|---|---|
| `title` | `string` | titolo principale nell'header |
| `badge` | `{ text, variant }` | opzionale — badge singolo |
| `badges` | `[{ text, variant }]` | opzionale — badge multipli, alternativo a `badge` |
| `showMenu` | `boolean` | mostra un ⋮ puramente decorativo nell'header, senza azioni (default `false`) — per un kebab funzionante usare `menu` sotto |
| `menu` | `[{ key, label, icon, danger, onClick }]` | opzionale — azioni nell'header via kebab ⋮ cliccabile (Ant Design `Dropdown`); `icon` è il nome di un'icona AntD (es. `'DeleteOutlined'`); se presente e non vuoto ha priorità su `showMenu` |
| `image` | `{ id, src, placeholder, aspectRatio, heightPx }` | opzionale — `src`: URL di una foto reale, sempre prioritaria su image-slot/placeholder quando presente (es. la foto di copertina di un impianto — nota `impianto-foto-copertina-non-pseudo-casuale`) · `id`: chiave univoca per image-slot (nessun effetto se `src` è presente) · `placeholder`: testo dell'empty state quando non c'è né `src` né image-slot · `aspectRatio`: es. `'16/9'` (default) · `heightPx`: alternativa numerica per altezza fissa |
| `fields` | `[{ icon, label, value, valueStyle, valueNode }]` | corpo della card, una riga per campo — vedi sotto |
| `bodyColumns` | `1 \| 2` | default `1`; `2` per corpo a griglia quando i campi sono molti |
| `footer` | `React node` | opzionale — testo di chiusura (es. "Scade il ...") oppure un'azione di interfaccia abilitata dall'entità (es. "Richiedi pianificazione") — mai un'azione CRUD/di relazione sull'entità stessa, quella va in `menu` — vedi "Header `menu` vs. footer" sotto |
| `style` / `className` | — | aggiuntivi sul wrapper esterno |

Ogni voce di `fields`:

| Campo | Note |
|---|---|
| `icon` | nome icona Ant Design (es. `'TagOutlined'`), oppure `null` |
| `label` | stringa **con il due-punti incluso** (es. `'Tipologia:'`) |
| `value` | testo del valore — opzionale se è presente `valueNode` |
| `valueStyle` | `CSSProperties` aggiuntivo sul valore |
| `valueNode` | `React node` per valori complessi (es. stato con pallino colorato) |

### Helper esposti su `GravityEntityCard`

| Helper | Uso |
|---|---|
| `GravityEntityCard.statusDot(color, label)` | node — pallino colorato (8px) + testo, per un campo `valueNode` che rappresenta uno stato (coerente con `LAYOUT.md` §6.3: il colore non è mai l'unico canale) |
| `GravityEntityCard.badgeVariants` | mappa `variant → stili CSS`, se serve leggere/estendere i colori badge invece di reimplementarli |

---

## Specifiche visive

| Elemento | Valore |
|---|---|
| Contenitore | `border-radius: 8px`, `border: 1px solid #F0F0F0`, sfondo bianco, `overflow: hidden` |
| Header | `padding: 14px 16px`, `border-bottom: 1px solid #F5F5F5`; titolo `16px/600`, badge affiancati con `flex-wrap`; kebab ⋮ a destra quando `menu` è presente (Ant Design `Dropdown`, stesso trattamento di un `Button type="text" icon={<MoreOutlined/>}`) |
| Immagine (`image`) | opzionale, subito sotto l'header, `width: 100%` all'`aspectRatio`/`heightPx` indicato — usa `<image-slot>` se il custom element è caricato, altrimenti un placeholder coerente (icona `PictureOutlined` attenuata + testo) |
| Corpo (`fields`) | `padding: 14px 16px`; una riga per campo (`bodyColumns: 1`, gap verticale 9px) o griglia 2 colonne (`bodyColumns: 2`, `column-gap: 16px`); ogni riga: icona 14px attenuata + label `600`/`rgba(0,0,0,0.88)` + valore `400`/`rgba(0,0,0,0.65)`, tutto a `12px` |
| Footer | opzionale, `padding: 11px 16px`, `border-top: 1px solid #F5F5F5`, sfondo `#FCFCFD` leggermente distinto dal corpo — contenuto variabile: solo testo di chiusura (es. "Scade il ..."), oppure un'azione (vedi "Header `menu` vs. footer: quale azione dove" sotto) |

### Badge — variant → colore

| Variant | Uso |
|---|---|
| `default` | badge neutro (es. identificativo record, `PA-001`) |
| `primary` | evidenziato viola brand |
| `ooh` | canale OOH — verde, stessa palette dei chip canale (`LAYOUT.md` §4/§6.3) |
| `dooh` | canale DOOH — magenta, stessa palette dei chip canale |
| `success` / `warning` / `error` | stati semantici generici |
| `blue` | stato amministrativo "Attivo" (`LAYOUT.md` §6.3, blue-6) |

---

## Header `menu` vs. footer: quale azione dove

Le due sezioni ospitano azioni di natura diversa, mai la stessa azione in entrambe:

- **Kebab `menu` dell'header** — azioni che agiscono sull'entità o sulla sua relazione con
  chi la mostra: CRUD e collegamento/scollegamento (`Scollega`, `Elimina`, `Duplica`,
  `Sostituisci`, `Visualizza`...). Sempre lì, mai nel footer — coerente con la card di
  `prototype/inventory-systems` (form "Nuovo Impianto" → Iter autorizzativo), da cui questo
  trattamento è stato ripreso.
- **Footer** — non un'azione sull'entità-card in sé, ma un'azione più ampia dell'interfaccia che
  quell'entità **abilita**: tipicamente un `Button` (anche `type="primary"` se è l'azione
  principale del contesto) per un'azione di business legata al record, non alla sua gestione
  come record collegato. Esempio concettuale: una card Campagna da cui si può "Richiedi
  pianificazione" (permesso `request_planning`, `docs/product/role-matrix.md`) — non è un'azione
  CRUD sulla Campagna, è un'azione che quella Campagna rende disponibile. Il footer resta
  variabile: solo testo (`footer: 'Scade il 12/03/2027'`) quando non c'è nessuna azione di
  questo tipo da offrire.

---

## Pattern d'uso: griglia a scala reale vs. griglia a manciata

Lo stesso componente copre due varianti della stessa idea — collegamento multiplo mostrato come
griglia di card, mai come Select a valore singolo (dettaglio in `components/section-drawer.md`
→ "Sotto-pattern: elenco collegato con ricerca via drawer"):

- **Griglia a scala reale, colonne fisse** (es. "Spazi collegati"/"Connected Systems",
  `LAYOUT.md` §3.4): `<Row gutter={[16, 16]}>` con un `<Col span={8}>` per card (3 per riga) —
  badge per identificativo + canale, campi per gli attributi dell'entità, eventuali campi
  aggiuntivi editabili nel footer quando la card rappresenta anche una relazione con dati propri
  (es. codice/CUP per-impianto).
- **Larghezza: sempre fill.** La card ha `width: 100%` di default e riempie la cella di grid/Col che occupa, senza superarla; mai una larghezza fissa, salvo override esplicito via `style`.
- **Griglia a manciata, fill per larghezza** (es. "Concessioni o Contratti di riferimento" di
  un'Autorizzazione, `LAYOUT.md` §3.9 "Diritto sul Suolo"): `display: grid;
  gridTemplateColumns: repeat(2, minmax(0, 1fr))` — 2 colonne fisse — invece delle colonne fisse a 3 della griglia a scala
  reale: l'elemento tipico è 0, 1 o 2 atti collegati, quindi ogni card **riempie la propria cella**
  (mai oltre: 1 card = metà riga, 2 card = metà ciascuna, la terza va a capo). Azione di scollegamento **per singola card** nel
  kebab `menu` dell'header (es. `{ key: 'scollega', label: 'Scollega', icon: 'DeleteOutlined',
  danger: true, onClick }`), non nel footer (vedi sezione sopra).
- **Non usarla senza filtri+paginazione** per liste a scala reale (migliaia di righe): il
  **risultato** del collegamento (l'elenco di ciò che è già stato scelto, mostrato nel box dopo
  la chiusura del drawer) resta un elenco a righe compatto, non una griglia di card (vedi
  `components/section-drawer.md`) — lì la card è per un numero di elementi che sta comodamente a
  schermo (una manciata, non centinaia). Il **drawer di ricerca** stesso può invece mostrare i
  candidati come griglia di card anche a scala reale, ma solo se accompagnata da filtri (es.
  Canale/Tipologia) oltre alla ricerca testuale e da una paginazione della griglia (mai uno
  scroll infinito di centinaia di card) — pattern usato nel drawer "Seleziona impianto" di
  `prototype/inventory-licenses/index.html` per aiutare a riconoscere l'impianto giusto (foto di
  copertina reale in `image.src`) tra un parco che può contare migliaia di record.

### Pulsante "Collega" e stato vuoto

Regola trasversale a ogni box (`GravityFormArea`) che ospita una griglia di card collegate via
drawer (entrambe le varianti sopra, quando il box ammette aggiunte): il pulsante che apre il
drawer di collegamento **vive nello stato vuoto finché non c'è nulla da mostrare**, poi **si
sposta nell'header del box** (`extra` di `GravityFormArea`, allineato a destra del titolo) non
appena il primo elemento è collegato — mai un pulsante sotto la griglia. Motivo: un box vuoto non
ha ancora un header con contenuto da bilanciare, quindi l'azione resta nell'unico posto con
peso visivo (l'illustrazione centrale, `gravLinkEmpty`); un box pieno ha già un header con
titolo, ed è lì che vive convenzionalmente ogni azione di sezione (stesso posto di
`impiantiAddManualBtn` sulle sezioni "Impianti"/"Cimasa" di questo stesso form).

---

## Riferimento implementativo

- `prototype/inventory-licenses/index.html` → `PermitDetailPage`, sezione "Spazi collegati":
  griglia `GravityEntityCard` (3 colonne, `Row gutter={[16,16]}`), campi variabili per v1/v2 e
  per tipo record, footer con `Popover` di riconoscimento in hover.
- `prototype/inventory-licenses/index.html` → sezione "Diritto sul Suolo" dell'Autorizzazione,
  box "Concessioni o Contratti di riferimento" (drawer "Origine" del form e Detail View
  "Copertura"): griglia `GravityEntityCard` a fill per larghezza (0-N atti collegati, `grid`
  `auto-fit minmax`) per il collegamento multiplo agli atti di provenienza, con `menu` (kebab
  "Scollega") per card, campi Ente/Proprietario/Data Stipula/Stato, e pulsante "Collega
  permesso" (stessa etichetta nell'empty state e nell'`extra` del box una volta popolato, non
  varia con lo stato) — riferimento anche per l'uso di `menu` e per il pattern "pulsante
  nell'header dopo l'empty state" sopra.
