# List Table — Card tabella nelle schermate lista

> Fonte di verità per **qualsiasi schermata lista con tabella** (Planning, Negotiations,
> Inventory Systems/Licenses, e ogni futuro modulo). Regole ricavate analizzando
> `prototype/planning/index.html` (tabella "Pianificazioni" — riferimento primario) e
> confrontate con `prototype/negotiations/index.html` (stessa struttura, conferma il pattern).
> Applicale sempre in una nuova schermata lista, non solo in Planning/Negotiations.
>
> Vedi anche `LAYOUT.md` §3.1 (pattern generico List View) — questo file ne è la specifica di
> dettaglio: colori testo, altezze cella, card container, intestazioni.

---

## 1. Struttura verticale della pagina

Una schermata lista è sempre **3 blocchi impilati** dentro `.page-content` (`padding: 20px 24px`),
mai una tabella "nuda" senza header card né KPI:

```
[Header card]      titolo + metadati di competenza (sx)     [CTA primaria] (dx)
[KPI cards row]     3 (o più) DataCard in griglia
[Table card]        conteggio totale + Table + paginazione
```

```js
React.createElement('div', { className: 'page-content' },
  /* 1. Header card — vedi §2 */,
  /* 2. KPI cards — vedi §3 */,
  /* 3. Table card — vedi §4 */,
)
```

❌ Non saltare la KPI cards row "perché la tabella già mostra i dati": è lo stesso pattern in
Planning e Negotiations, dà contesto immediato prima di scendere ai dettagli riga per riga.

---

## 2. Header card

```js
{
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'var(--gravity-bg-container)',
  borderRadius: 8,                        // token.borderRadiusLG
  padding: '16px 20px',
  border: '1px solid rgba(0,0,0,0.06)',    // o var(--gravity-split)
  marginBottom: 20,
}
```

- **Sx**: `<Title level={3}>` (titolo pagina) +, se rilevante, una riga di metadati di competenza
  sotto (area, canali, filtri di contesto) in `fontSize: 13`, label `rgba(0,0,0,0.45)` / valore
  `rgba(0,0,0,0.88)`.
- **Dx**: CTA primaria (`<Button type="primary" icon={<PlusOutlined />}>`) o azioni di contesto
  (es. `RangePicker` + CTA in Negotiations).

---

## 3. KPI cards row

```js
{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }
```

- 3 card (adatta il numero al contesto, non forzare sempre 3) via il componente `DataCard`
  (icona + label + valore, opzionale `valueExtra` sotto in `Typography.Text type="secondary"`,
  12px).
- Card singola: `.data-card` — `background: var(--gravity-bg-container)`, `borderRadius:
  var(--gravity-radius-lg)` (8px), `border: 1px solid var(--gravity-border-secondary)`.
- Non usare `Card`/`Statistic` di Ant Design qui: usa sempre `DataCard` per coerenza tra
  Planning, Negotiations e ogni futura lista.

---

## 4. Card tabella

```js
React.createElement('div', {
  style: {
    background: 'var(--gravity-bg-container)',
    borderRadius: 10,                      // valore dedicato ai container tabella/sezione — vedi nota
    border: '1px solid rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
},
  React.createElement('div', { style: { padding: '16px 20px 20px' } },
    React.createElement(Table, { /* §5 */ }),
  ),
)
```

> **Nota `borderRadius: 10`**: non è un valore "a caso" — è il raggio già usato in modo coerente
> per i container che avvolgono una tabella o una sezione di dati (Planning, Negotiations,
> KPI/mini-card di Inventory Systems), distinto dagli 8px (`borderRadiusLG`) di Card/Modal/Alert
> generici e dai 6px (`borderRadius`) dei controlli. Non introdurne un quarto: per un container
> tabella/sezione usa sempre `10`, per tutto il resto vale la scala in `LAYOUT.md` §6.1.

### Conteggio totale

Due posizioni valide, secondo se la tabella ha un gestore colonne o non serve:

- **In alto nel card** (Negotiations): `<Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)' }}>` —
  `"N trattative"` — in un blocco `padding: '16px 20px 4px'` sopra la Table (che poi ha
  `padding: '0 20px 20px'`).
- **Nel footer di paginazione** (Planning, quando c'è anche il gestore colonne): via
  `pagination.showTotal`, stesso `fontSize: 12, color: 'rgba(0,0,0,0.35)'`, accostato al
  `Popover` "Gestisci colonne" (icona `SettingOutlined`, `Tooltip` "Gestisci colonne").

---

## 5. Table — props canoniche

```js
React.createElement(Table, {
  dataSource,
  columns: visibleColumns,
  rowKey: 'id',
  size: 'middle',                          // mai 'small' in una lista con questa struttura
  scroll: { x: totalColumnsWidth },        // somma dei width delle colonne visibili
  style: { borderRadius: 0 },              // il border-radius vive sul card esterno, non sulla Table
  pagination: { pageSize: 10, showSizeChanger: false /* + showTotal, vedi §4 */ },
  onRow: row => ({ onClick: () => onSelect(row), style: { cursor: 'pointer' } }),
})
```

- `size: 'middle'` sempre — è lo standard confermato da Planning e Negotiations. `size: 'small'`
  (visto in Inventory Systems/Licenses) è il pattern precedente, da non replicare in nuove liste.

### Header colonna

```css
.ant-table-thead > tr > th { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
```

Intestazione sempre su una riga, mai a capo: se il testo è lungo, va in ellissi (eventualmente con
`Tooltip` sul testo completo se il taglio crea ambiguità).

### Colonne fisse (`fixed: 'left' | 'right'`)

```css
.ant-table-cell-fix-left,
.ant-table-cell-fix-right { z-index: 2 !important; background: #fff !important; }
.ant-table-thead .ant-table-cell-fix-left,
.ant-table-thead .ant-table-cell-fix-right { z-index: 3 !important; background: #fafafa !important; }
.ant-table-tbody > tr.ant-table-row:hover .ant-table-cell-fix-left,
.ant-table-tbody > tr.ant-table-row:hover .ant-table-cell-fix-right { background: #f7f5ff !important; }
```

Le celle fisse restano opache sopra le colonne scrollabili durante lo scroll orizzontale: bianco
in stato normale, `#fafafa` nell'header (identico al resto dell'header, `colorFillQuaternary`),
tinta primary chiarissima (`#f7f5ff`) in hover riga — coerente con il tint di hover riga (sotto).

### Hover riga

```css
.ant-table-tbody > tr.ant-table-row:hover > td { background: rgba(62,0,251,0.04) !important; }
```

Tinta primary al 4% su tutta la riga in hover — non un grigio neutro. Va applicato via CSS
(rgba diretto: non esiste una CSS var per l'alpha derivata dal primary), non via `rowClassName`
per riga.

---

## 6. Colori testo nelle celle

| Contenuto cella | Colore | Size | Note |
|---|---|---|---|
| Valore identità riga (es. nome entità) | `rgba(0,0,0,0.88)` | 13px | eventuale icona `EyeOutlined` a comparsa in hover (`opacity: 0 → 1`, `transition: opacity 0.15s`), mai visibile di default |
| Link verso un'altra entità (es. trattativa collegata) | `var(--gravity-primary)` / `#3E00FB` | 13px, weight 500 | prefisso icona `ExportOutlined` 11px, `textDecoration: none` di default, underline in hover |
| Metadato secondario (es. data ultimo aggiornamento) | `rgba(0,0,0,0.65)` | 13px | |
| Valore semplice non enfatizzato (es. data inizio/fine) | eredita `colorText` (`rgba(0,0,0,0.88)`) | 13px | nessuno style di colore esplicito necessario |
| Placeholder valore assente (`—`) | `rgba(0,0,0,0.2)` | 13px | **sempre `0.2`**, non `0.25` — vedi nota sotto |
| Badge numerico (conteggio, es. impianti/facce collegate) | testo `#3E00FB` su tag `background: var(--gravity-primary-bg)`, `border: 1px solid #D3B8FF` | 12px, weight 600 | avvolto in `Tooltip` col conteggio esplicito |
| Azione riga secondaria disabilitata (icona) | `rgba(0,0,0,0.3)` | — | sempre con `Tooltip` che spiega il motivo (§6.2 `LAYOUT.md`) |

> **Nota placeholder**: nella tabella Planning il valore vuoto è quasi sempre `rgba(0,0,0,0.2)`
> (Inserzionista, Campagna, contatori Impianti/Facce). Una sola colonna (Pianificatore, quando
> l'utente non ha ancora preso in carico nulla) usa `0.25` — è una svista, non una variante
> intenzionale: in nuove liste usa sempre `0.2`.

---

## 7. Tag "Canale" (OOH / DOOH) in tabella

```js
React.createElement(Tag, { color: category === 'DOOH' ? 'magenta' : 'green', style: { marginRight: 0 } }, category)
```

Confermato identico in Planning (`CategoryTag`, colori hardcoded equivalenti al preset:
`#389E0D`/`#F6FFED`/`#B7EB8F` per OOH, `#C41D7F`/`#FFF0F6`/`#FFADD2` per DOOH) e in Inventory
Systems (`color: 'green'` / `color: 'magenta'` letterale). Questo è il colore reale e coerente in
tutte le tabelle esistenti — **non** l'outline viola/arancio (`#3E00FB`/`#FF4A1C`) citato in
precedenza in `LAYOUT.md` §4, che non risulta implementato in nessuna tabella e va considerato
superato (corretto in `LAYOUT.md`, vedi changelog in fondo a quel file).

Il chip "Canale" fuori tabella (es. header card, filtri) resta invece sul pallino
`#52C41A`/`#EB2F96` già documentato in `LAYOUT.md` §6.3 (`ChannelChip`/`CHANNEL_DOT_STYLE`) — sono
due componenti diversi per due contesti diversi, non un'incoerenza da correggere.

---

## 8. Badge di stato (pallino + testo)

```js
React.createElement('span', { style: { display: 'inline-flex', alignItems: 'center', gap: 6 } },
  React.createElement('span', { style: { width: 7, height: 7, borderRadius: '50%', background: STATE_DOT[state], flexShrink: 0 } }),
  React.createElement(Text, { style: { fontSize: 13 } }, state),
)
```

Pallino 7px (non 6px, che è la dimensione usata nei chip canale — dimensione diversa per non
confondere i due badge), colore da mappare sulla palette di stato di `LAYOUT.md` §6.3. Colonna
sempre `fixed: 'right'`, subito prima delle Azioni.

---

## 9. Colonna Azioni

- `fixed: 'right'`, `width: 64`, `title: ''`.
- Icona a tre puntini: `<Button type="text" size="small" icon={<MoreOutlined />} style={{ color: 'rgba(0,0,0,0.3)' }}>`, dentro un `<Dropdown trigger={['click']} placement="bottomRight">`.
- Voci disabilitate del menu (es. "Modifica" solo in Bozza) sempre con `Tooltip` sul motivo,
  mai senza spiegazione — stesso principio di `form-patterns.md` §4.
- `onClick` delle voci menu: sempre `domEvent.stopPropagation()` prima di agire, per non
  triggerare anche il click di riga (`onRow.onClick`).

---

## Riferimento implementativo

- `prototype/planning/index.html` → componente lista `PlanningsList` (header card, KPI cards,
  `columns`, card tabella) — riferimento primario di questo file.
- `prototype/negotiations/index.html` → stessa struttura (header card/KPI/table card),
  conferma indipendente del pattern.

**Da non replicare in nuove liste** (pattern precedente, non canonico):
- `prototype/inventory-systems/index.html` e `prototype/inventory-licenses/index.html` →
  tabella senza header card né KPI cards, riga "Totale: N" inline, `size: 'small'`.

Usa questi come riferimento concreto prima di costruire una nuova schermata lista altrove
nell'app: le stesse regole si applicano, non solo a Planning/Negotiations.
