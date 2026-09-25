# Page Header — header condiviso per le viste Dettaglio

> Fonte di verità per l'header di **qualsiasi Detail View** (`LAYOUT.md` §3.4). Ogni prototipo con
> una schermata di dettaglio (Trattativa, Campagna, Permesso, …) DEVE usare il componente
> condiviso `prototype/_shared/page-header.js` (`window.GravityPageHeader`). Non ricostruire
> l'header per-prototipo: è già successo due volte (Negotiations, Campaign Delivery) con codice
> duplicato identico prima di essere centralizzato qui.

---

## Componente condiviso: `window.GravityPageHeader`

Sorgente: `prototype/_shared/page-header.js`. Da caricare dopo React, antd, `@ant-design/icons` e
`tokens.js`:

```html
<script src="../_shared/page-header.js"></script>
```

```js
React.createElement(window.GravityPageHeader, {
  backLabel: 'Lista Trattative',        // testo del link indietro (default 'Indietro')
  onBack:    () => setView('list'),     // se assente, il link indietro non compare
  title:     'Trattativa Nike',         // titolo principale (Title level=4)
  entityName: 'Nike Italia',            // opzionale — nome secondario dopo un separatore "|"
  tag:        React.createElement(Tag, null, 'AUT-2024-001'), // opzionale — accanto al titolo
  meta: [                               // opzionale — riga "label: valore · label: valore"
    { label: 'Inserzionista', value: 'Nike Italia' },
    { label: 'Stato', value: statoNode },   // value può essere string o node (es. pallino+testo)
  ],
  actions: [                            // opzionale — pulsanti allineati a destra
    React.createElement(Button, { key: 'modifica' }, 'Modifica'),
  ],
})
```

Nessun wrapper esterno richiesto: il componente include già il proprio contenitore a card.

---

## Specifiche visive

| Elemento | Valore |
|---|---|
| Contenitore | card bianca — `colorBgContainer`, `borderRadiusLG` (8px), `border: 1px solid var(--gravity-split)`, `padding: 16px 20px`, `marginBottom: 20` — stessa ricetta della header-card di lista (`components/list-table.md` §2) |
| Link indietro | `Button type="link"` + `ArrowLeftOutlined`, colore primary, sopra al titolo — non un `Breadcrumb` |
| Titolo | `Typography.Title level={4}` |
| Entità secondaria (`entityName`) | separata dal titolo da un `\|` sottile (`fontWeight:200`), testo secondario |
| Tag | libero (di solito `<Tag>` con l'identificativo del record) |
| Metadati (`meta`) | riga inline, non una tabella `Descriptions`: `label: valore` separati da `·`, tutto su un'unica riga che va a capo (`flexWrap`) se serve |
| Azioni (`actions`) | allineate a destra, `gap: 8` |

---

## Perché non `Breadcrumb` + `Descriptions` (LAYOUT.md §3.4 storico)

`LAYOUT.md` §3.4 descriveva in origine l'header di dettaglio come `Breadcrumb` (back) + `Title`/`Tag`
+ metadata bar `Descriptions` **senza contenitore card**, sullo sfondo pagina. `GravityPageHeader`
è l'evoluzione emersa in Negotiations e poi Campaign Delivery: stesso contenuto, ma
- wrappato in una card (coerenza visiva con l'header-card di lista);
- back link invece di `Breadcrumb` (più leggero per un solo livello di risalita);
- metadati come riga inline invece di tabella `Descriptions` (più compatto, si adatta meglio a
  valori-nodo come badge di stato).

`LAYOUT.md` §3.4 è stato aggiornato di conseguenza: usa questo file come riferimento, non la
versione precedente.

---

## KPI cards nel dettaglio: `DataCard`, non `Card`+`Statistic`

Le 3-4 KPI card sotto l'header (LAYOUT.md §3.4) usano lo stesso componente `DataCard` (icona +
label + valore) delle KPI di lista (`components/list-table.md` §3), non `Card`+`Statistic` di Ant
Design — confermato in Negotiations (`TrattativaDetailView`). `DataCard` non è ancora in
`_shared/`: oggi è definito localmente in ogni prototipo che lo usa (Negotiations, Inventory
Licenses) — stesso identico shape (`{ icon, label, value, valueExtra }`). Se in futuro se ne
aggiunge una terza copia, va centralizzato come `GravityPageHeader`.

---

## Riferimento implementativo

- `prototype/negotiations/index.html` → `TrattativaDetailView`, `ConfiguratoreView` — origine del
  pattern.
- `prototype/campaign-delivery/index.html` → `CampagnaDettaglioView` — seconda copia (ora
  migrata al componente condiviso).
- `prototype/inventory-licenses/index.html` → `PermitDetailPage` — terzo consumo, KPI `DataCard` +
  card laterali/principale (`.info-card`, vedi nota in `LAYOUT.md` §3.4).
