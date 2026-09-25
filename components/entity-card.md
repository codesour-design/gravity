# Entity Card — card condivisa per entità collegate

> Fonte di verità per qualunque **card che rappresenta un'entità** in una griglia o in un punto di
> collegamento singolo (`LAYOUT.md` §3.4 "Connected Systems"/"Spazi collegati", §3.9 collegamento
> singolo). Ogni prototipo che mostra entità come card — non come riga di tabella — DEVE usare il
> componente condiviso `prototype/_shared/entity-card.js` (`window.GravityEntityCard`). Non
> ricostruire la card per-prototipo: è già lo stesso shape (header/badge + immagine opzionale +
> campi icona-label-valore + footer opzionale) riusato identico tra Inventory Licenses
> ("Spazi collegati", "Atto di provenienza") e i pattern di collegamento di `section-drawer.md`.

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
| `showMenu` | `boolean` | mostra ⋮ kebab nell'header (default `false`) |
| `image` | `{ id, placeholder, aspectRatio, heightPx }` | opzionale — `id`: chiave univoca per image-slot · `placeholder`: testo dell'empty state · `aspectRatio`: es. `'16/9'` (default) · `heightPx`: alternativa numerica per altezza fissa |
| `fields` | `[{ icon, label, value, valueStyle, valueNode }]` | corpo della card, una riga per campo — vedi sotto |
| `bodyColumns` | `1 \| 2` | default `1`; `2` per corpo a griglia quando i campi sono molti |
| `footer` | `React node` | opzionale — contenuto in fondo alla card (tipicamente un'azione, es. "Scollega") |
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
| Header | `padding: 14px 16px`, `border-bottom: 1px solid #F5F5F5`; titolo `16px/600`, badge affiancati con `flex-wrap` |
| Immagine (`image`) | opzionale, subito sotto l'header, `width: 100%` all'`aspectRatio`/`heightPx` indicato — usa `<image-slot>` se il custom element è caricato, altrimenti un placeholder coerente (icona `PictureOutlined` attenuata + testo) |
| Corpo (`fields`) | `padding: 14px 16px`; una riga per campo (`bodyColumns: 1`, gap verticale 9px) o griglia 2 colonne (`bodyColumns: 2`, `column-gap: 16px`); ogni riga: icona 14px attenuata + label `600`/`rgba(0,0,0,0.88)` + valore `400`/`rgba(0,0,0,0.65)`, tutto a `12px` |
| Footer | opzionale, `padding: 11px 16px`, `border-top: 1px solid #F5F5F5`, sfondo `#FCFCFD` leggermente distinto dal corpo — per un'azione contestuale alla card (link, non pulsante pieno) |

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

## Pattern d'uso: singola card vs. griglia

Lo stesso componente copre due casi d'uso distinti (dettaglio in `components/section-drawer.md`
→ "Sotto-pattern: elenco collegato con ricerca via drawer"):

- **Collegamento singolo** (es. atto di provenienza di un Permesso): un solo `GravityEntityCard`,
  non una riga — con un solo elemento possibile la card è più leggibile di una riga isolata.
  Footer con l'azione di scollegamento (`Button type="link" danger`).
- **Collegamento multiplo in griglia** (es. "Spazi collegati"/"Connected Systems",
  `LAYOUT.md` §3.4): `<Row gutter={[16, 16]}>` con un `<Col span={8}>` per card (3 per riga) —
  badge per identificativo + canale, campi per gli attributi dell'entità, eventuali campi
  aggiuntivi editabili nel footer quando la card rappresenta anche una relazione con dati propri
  (es. codice/CUP per-impianto).
- **Non usarla** per liste a scala reale (migliaia di righe) dove la ricerca è già risolta da un
  drawer dedicato: in quel caso resta un elenco a righe compatto, non una griglia di card (vedi
  `components/section-drawer.md`) — la card è per un numero di elementi che sta comodamente a
  schermo (una manciata, non centinaia).

---

## Riferimento implementativo

- `prototype/inventory-licenses/index.html` → `PermitDetailPage`, sezione "Spazi collegati":
  griglia `GravityEntityCard` (3 colonne, `Row gutter={[16,16]}`), campi variabili per v1/v2 e
  per tipo record, footer con `Popover` di riconoscimento in hover.
- `prototype/inventory-licenses/index.html` → campo "Concessione o Contratto di riferimento":
  singola `GravityEntityCard` per il collegamento 1:1 all'atto di provenienza.
