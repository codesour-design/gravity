# Map Popover — Gravity Platform

> Fonte di verità per il popover/card che appare al **click su un marker** mappa. Usato da
> `inventory-systems` e `planning`; basato sulla "ss-focus-card" del Planning.

## Filosofia

Il **guscio** (contenitore, animazione, close, titolo, sottotitolo, azione) è condiviso in
`prototipi/map-popover.js`; il **contenuto** (righe info) e la **posizione** restano per-app,
passati come props/children. Non spostare logica di dominio dentro il guscio.

## Componente condiviso: `window.GravityMapPopover`

Richiede React, `@ant-design/icons` e `tokens.js` (CSS variables); nessun setup oltre al caricamento dello script.

```js
React.createElement(window.GravityMapPopover, {
  position: { x, y },   // px relativi al contenitore mappa; null → fallback in basso al centro
  onClose:  () => {},
  title:    'Nome impianto',       // string | node
  subtitle: 'Indirizzo, zona',     // string | node
  action:   { label, onClick, danger?, variant? },  // opzionale
},
  // children: righe info costruite dall'app chiamante
  React.createElement(window.GravityMapPopover.Row,
    { icon: 'EnvironmentOutlined', label: 'Zona', right: 'Centro' }),
)
```

- **Ancoraggio sopra il marker** (`translate(-50%, -100%)`).
- **`GravityMapPopover.Row({ icon, label, right, divider })`**: icona AntD opzionale + label +
  valore a destra in grassetto; `divider: true` separa un gruppo di righe con bordo superiore.
- **Azione**: bottone pieno primary; `danger: true` → `#FFF0F0`/`#FF4D4F`;
  `variant: 'default'` → outline (azioni secondarie).

## Specifiche visive

| Proprietà | Valore |
|-----------|--------|
| Radius / bordo | `12px` (`--gravity-radius-xl`) / `1.5px solid rgba(62,0,251,0.15)` |
| Ombra | `0 8px 32px rgba(62,0,251,0.18), 0 2px 8px rgba(0,0,0,0.10)` |
| Larghezza | 260–320px |
| Animazione | fade + slide dal basso, `.15s ease` |
| Titolo / sottotitolo | 14px 600 `0.88` / 12px `0.45` |
| Riga info | 12px `0.65`, icona 11px `0.4` |
| Close | 20×20 cerchio in alto a destra, `CloseOutlined` |

Il click dentro la card non si propaga alla mappa (`stopPropagation` già gestito su card, close
e azione): per elementi interattivi custom nei children, fermare la propagazione anche lì.

## Trasposizione Figma

Nessun componente dedicato: componi `*Card*` (radius LG) + `*Text*` + `Icon /` + `*Button*` —
varianti in `components/react-figma-map.md`. Il popover appare allo stato `focused` del marker:
vedi `components/map-interactions.md`.
