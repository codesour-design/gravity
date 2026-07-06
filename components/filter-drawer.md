# Filter Drawer — Gravity Platform

> Fonte di verità per il drawer "Filtri avanzati". Un solo componente condiviso per tutti i
> moduli (Planning, Inventory, …), come nel team di sviluppo: le sezioni si accendono/spengono
> per contesto. Non ricostruire un drawer filtri per-prototipo.

---

## Componente condiviso: `window.GravityFilterDrawer`

Sorgente: `prototype/_shared/filter-drawer.js`.

```html
<script src="../../filter-drawer.js"></script>
```
```js
React.createElement(window.GravityFilterDrawer, {
  open, onClose,                  // visibilità
  onApply, onReset,               // footer (Applica / Azzera tutto)
  activeCount,                    // badge nel titolo (n. filtri applicati)
  sections: ['statoSpazi', 'tipologia', 'numeroFacce', ...],  // sezioni del contesto, in ordine
  values:   { statoSpazi: [], tipologia: [], ... },           // stato BOZZA
  onChange: (key, value) => ...,
  options:  { allTypes, typeFormats, allFormats, mediaOwner }  // dati di contesto
})
```

Semantica: `[]` = nessun filtro (mostra tutto). Helper per il filtraggio facce:
`window.gravityFaceCountKey(n)` → `'1'…'6'` | `'7+'`.

## Sezioni disponibili

| Key | Sezione | Controllo | Contesto |
|-----|---------|-----------|----------|
| `statoSpazi` | Stato spazi | chip con dot colore (Disponibile/In Opzione/Riservato) | Planning |
| `statiAmm` | Status amministrativi | chip con dot (Attivo/In Manutenzione/Inizializzato/Rimosso) | Inventory |
| `canale` | Canale | **disabilitata** + tooltip | tutti |
| `suolo` | Suolo | chip Pubblico/Privato | Inventory |
| `mediaOwner` | Media owner | Select multiplo con gruppi | Inventory |
| `tipologia` | Tipologia impianto | chip per macro-categoria, con icona | tutti |
| `numeroFacce` | Numero facce | chip `1…6, 7+` (OR) | tutti |
| `illuminazione` | Illuminazione facce | chip Illuminato/Retroilluminato/Non illuminato | tutti |
| `formato` | Formato impianto | chip, dipendenti dalle tipologie selezionate | tutti |
| `modelloVendita` | Modello di vendita | chip Standard/Lungo termine | Planning |
| `prezzoMax` | Prezzo max per faccia | **disabilitata** + tooltip | tutti |

## Decisioni UX (giugno 2026 — non cambiare senza nuova decisione)

- **Bozza + Applica ovunque**: i filtri agiscono solo su "Applica" — nessun live-apply (il
  Planning è stato convertito a questo modello).
- **Numero facce**: chip multiselect `1/2/3/4/5/6/7+` (OR, vuoto = tutti) — non switch "Almeno N".
- **Illuminazione**: tre opzioni fisse; nei dati finti 1 illuminato su 3 è retroilluminato
  (derivazione deterministica, non casuale).
- **Sezioni non pronte: disabilitate con tooltip, non nascoste.**
  - `canale` → "serve redesign parco impianti; oggi il canale è gestito da tab esterne ai filtri"
  - `prezzoMax` → "Presto disponibile"
  - Attive ma con tooltip promemoria per il team: `tipologia` (icone impianti da definire con
    reparto design), `formato` (formati per tipologia da definire con reparto design)
- **Niente "Tutti"/"Azzera" per sezione**: si azzera solo dal footer o dalle chip nella strip
  filtri attivi fuori dal drawer.
- **Icone tipologia**: Ant Design con lookup case-insensitive (`TYPE_ICON_NAMES`); gli asset
  custom restano solo per i marker mappa.

## Costanti di dominio condivise (non ridefinirle altrove)

`SPACE_STATES` (stato commerciale Planning), `ADMIN_STATES` (stato amministrativo Inventory,
colori AntD blue-6/orange-6/gold-6/nero 45%), `CHANNELS` (OOH verde / DOOH rosa),
`DEFAULT_MEDIA_OWNER_OPTIONS` (Gestione diretta / Concessionarie) — tutte in `filter-drawer.js`.

## Trasposizione Figma

Non esiste un componente Figma dedicato: componi `*Drawer*` (Placement=Right, width 480) con le
sezioni; chip → `*Tag*` con colore coerente al dominio. Varianti dei primitivi (Select, Switch,
InputNumber, Tooltip): `components/react-figma-map.md`.
