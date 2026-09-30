# Entity Picker Drawer — Gravity Platform

> Fonte di verità per il pattern "Drawer di selezione entità" (LAYOUT.md §3.10): un drawer che
> permette di **trovare e scegliere** una o più entità (impianti, atti, clienti…) tra un parco
> ampio, con ricerca, filtri a cascata e griglia di card selezionabili.
> Estratto dal drawer "Seleziona impianto" di `prototype/inventory-licenses`, che resta l'esempio
> reale. Ogni nuovo drawer di selezione con logica simile usa `GravityEntityPickerDrawer`, non
> ricostruisce intestazione, riga filtri e griglia inline.

---

## Quando usarlo

- L'utente deve **scegliere un'entità esistente** e le opzioni sono troppe o troppo simili per una
  `Select` (decine → migliaia di record).
- Il riconoscimento beneficia di un'anteprima ricca (foto, più campi) → card, non righe.
- Non per form di creazione/modifica (→ Drawer semplice, LAYOUT.md §3.2, o Section Drawer §3.9) né
  per pochi elementi (< ~10: basta una `Select`).

## Componente condiviso

Sorgente: `prototype/_shared/entity-picker-drawer.js` (caricarlo dopo `entity-card.js`).

```html
<script src="../_shared/entity-card.js"></script>
<script src="../_shared/entity-picker-drawer.js"></script>
```
```js
React.createElement(window.GravityEntityPickerDrawer, {
  open, onClose, dirty,
  title, cancelAction,            // nodi costruiti dal chiamante (DiscardCloseIcon / DiscardButton
                                   // restano locali al prototipo, come per GravitySectionDrawer)
  width,                          // default 1080 → 3 card da ~320px (vedi "Larghezza")
  confirmText, confirmIcon, confirmDisabled, onConfirm,   // default 'Seleziona' + PlusOutlined
  heading: { title, description },
  search:  { value, onChange, placeholder },
  filters: [{ key, value, onChange, options, placeholder, width }],   // l'ordine è l'ordine di cascata
  sort:    { label, icon, onToggle },   // facoltativo
  total, countLabel,              // countLabel(n) → "N impianti trovati"
  items,                          // SOLO la pagina corrente (paginazione a carico del chiamante)
  getKey, selectedKeys, onToggle, renderCard,   // renderCard(item, selected) → GravityEntityCard
  columns,                        // default 3
  pagination: { current, pageSize, onChange },
  emptyText,
})
```

Il chiamante possiede dati, stato dei filtri, ordinamento e contenuto delle card; il componente
possiede **layout, spacing e intestazione** (le regole qui sotto). Selezione singola o multipla è
decisa da `onToggle` (es. `prev => prev.includes(k) ? [] : [k]` per la singola).

Helper statici per i filtri a cascata:

- `GravityEntityPickerDrawer.facetItems(items, filters, key)` → elementi compatibili con **tutti gli
  altri** filtri attivi: serve a calcolare le opzioni della select `key`.
- `GravityEntityPickerDrawer.cascade(items, filters, changedKey, value, autofillKeys)` → nuovo
  oggetto filtri: azzera i filtri incompatibili con la nuova scelta e autocompila (solo
  `autofillKeys`) quelli che restano con un unico valore possibile.

## Struttura

```
┌──────────────────────────────────────────────────────────────────┐
│ ✕ Seleziona impianto                          [Annulla] [+ Seleziona] │  ← titolo drawer = COSA
├──────────────────────────────────────────────────────────────────┤
│  Trova l'impianto da collegare                       ← heading.title   (H4)
│  Cerca o filtra per … Gli impianti già collegati …   ← heading.description
│                                                      ↕ 20
│  [ Cerca per ID, Alias o Indirizzo…        ][Canale][Tipologia][Formato]
│                                                      ↕ 20
│  24 impianti trovati                       ⇅ Creati di recente
│                                                      ↕ 16
│  ┌────────┐ ┌────────┐ ┌────────┐
│  │  card  │ │  card  │ │  card  │   ← gutter 16 × 16
│  └────────┘ └────────┘ └────────┘
│                                                      ↕ 20
│                                            ‹ 1 / 3 ›  ← paginazione, a destra
└──────────────────────────────────────────────────────────────────┘
```

## Regole di intestazione

Due livelli, **senza ridondanza tra loro**:

1. **Titolo del drawer** (header AntD) = l'oggetto dell'azione, breve: "Seleziona impianto". È
   sempre accompagnato da `DiscardCloseIcon` (✕ con Popconfirm se `dirty`, LAYOUT.md §6.6) e, a
   destra, `Annulla` + azione primaria.
2. **Intestazione di contenuto** (`heading`), sotto l'header e sopra i controlli:
   - `title` — **verbo + scopo** in una riga ("Trova l'impianto da collegare"): non ripete il
     titolo del drawer, dice cosa sta per succedere. `Typography.Title level={4}`, `margin: 0`.
   - `description` — **una o due frasi**: (a) come restringere ("Cerca o filtra per canale,
     tipologia e formato"), (b) i **vincoli** non ovvi ("Gli impianti già collegati non vengono
     mostrati"). `Typography.Text type="secondary"`. Non ripete i campi già leggibili nel
     placeholder della ricerca.
   - Copy in stile SaaS: imperativo, frasi brevi, niente "Usa…", niente avvisi gialli che
     invitano a "restringere" (la lista vuota/lunga si spiega da sola con conteggio e filtri).
   - Le note di design dell'handoff (`HandoffDesignNote`) vanno a fine `description`, mai in un
     blocco separato sopra l'intestazione.

## Regole di spacing

Scala unica (allineata ai token di `tokens.js`, LAYOUT.md §6.1) — **niente valori fuori scala**:

| Spazio | Valore | Token | Dove |
|--------|--------|-------|------|
| Padding del corpo drawer | 24 | `marginLG` | `styles.body.padding` |
| Titolo ↔ descrizione dell'intestazione | 4 | `marginXXS` | dentro un gruppo |
| Tra i controlli della riga filtri | 12 | `marginSM` | ricerca / select |
| Intestazione → riga controlli | 20 | `marginMD` | tra blocchi |
| Riga controlli → conteggio | 20 | `marginMD` | tra blocchi |
| Conteggio → griglia | 16 | `margin` | legame stretto (etichetta della griglia) |
| Tra le card | 16 × 16 | `margin` | `Row gutter={[16,16]}` |
| Griglia → paginazione | 20 | `marginMD` | tra blocchi |
| Stato vuoto | 24 sopra e sotto | `marginLG` | `Empty` con illustrazione semplice |

Principio: **4 dentro un gruppo, 12 tra controlli affini, 16 per ciò che etichetta il blocco
sotto, 20 tra blocchi, 24 al bordo**. Lo spazio cresce con la distanza logica.

## Riga ricerca + filtri

- **Sempre una sola riga**: ricerca `flex: 1` (assorbe lo spazio), select a larghezza fissa
  (`width` per filtro: 110–180px). Placeholder corti ("Canale", non "Tutti i canali").
- Il **placeholder della ricerca elenca i campi cercati** ("Cerca per ID, Alias o Indirizzo…"), così
  la descrizione non deve ripeterli.
- Le opzioni dei filtri possono avere contenuto ricco: tag colorati per Canale (preset AntD
  `green`/`magenta`, come in tabella — LAYOUT.md §4), icone tipologia (`GravityMap.systypeIconSrc`,
  §6.5) per Tipologia.
- **Cascata**: ogni select propone solo i valori compatibili con gli altri filtri attivi
  (`facetItems`); scegliere un valore azzera i filtri incompatibili e autocompila quelli con un
  unico valore possibile (`cascade`, tipicamente non il filtro più granulare — es. Formato non si
  autocompila mai). L'ordine in `filters` è l'ordine logico gerarchico (es. Canale → Tipologia →
  Formato).

## Conteggio e ordinamento

- A sinistra il conteggio dopo i filtri ("N impianti trovati", singolare gestito), a destra un
  **pulsante-toggle** `type="text" size="small"` con icona (`SortAscending/DescendingOutlined`) che
  mostra lo stato attuale ("Creati di recente"). Non una `Select`: due sole direzioni. Cambiare
  ordinamento riporta a pagina 1. Default: elementi più recenti prima.

## Griglia e card

- **3 per riga** a `width: 1080` (`columns: 3`): la `GravityEntityCard` verticale ha larghezza
  naturale 320px — ogni colonna deve poterla contenere. Con 2 colonne bastano ~720px; 4 colonne
  richiedono ~1400px (poco realistico in un drawer: preferire 3).
- Le card ricevono sempre `style: { width: '100%', height: '100%' }`: larghezza piena (altrimenti
  restano a 320px fissi e si sovrappongono nelle colonne più strette) e altezza piena, così le card
  della stessa riga hanno la stessa altezza anche se una ha un campo in più (es. ID con Alias).
- **Selezione**: il wrapper disegna un `outline` 2px `colorPrimary` (`transparent` da non
  selezionata, per non far saltare il layout); la card riceve `background: #F5F2FF` quando
  selezionata (`renderCard(item, sel)`).
- **Dati identici ovunque**: gli stessi campi (stessa lista, stesse etichette e icone) nella card
  del drawer e nell'anteprima in hover altrove (es. colonna Impianto delle righe) — definirli in
  un'unica funzione del chiamante (`impiantoFieldsOf`).
- **Nome mostrato**: se l'entità ha un Alias lo usa al posto dell'ID come titolo; l'ID resta come
  primo campo.
- **Paginazione** `simple`, allineata **in basso a destra**, 9 card a pagina (3×3). Mai scroll
  infinito su centinaia di card (`components/entity-card.md`).

## Larghezza

| Colonne | Larghezza drawer |
|---------|------------------|
| 3 (default) | 1080px |
| 2 | ~760px |

Il drawer resta un overlay sulla lista (LAYOUT.md §1/§3.2): non superare ~1100px.

## Cose da non fare

- Non ricostruire intestazione, riga filtri, conteggio o paginazione inline in un prototipo.
- Non aggiungere avvisi/Tag in banda gialla sopra i risultati per "invitare a filtrare".
- Non usare due righe per ricerca e filtri: se non stanno in una riga, riduci le larghezze o togli
  un filtro.
- Non introdurre valori di spacing fuori scala (es. 10, 14, 18, 28).

## Esempio reale

`prototype/inventory-licenses` — drawer "Seleziona impianto" (collega un impianto a una riga di
Autorizzazione/Concessione/Contratto Privato), con filtri Canale → Tipologia → Formato a cascata,
ordinamento per data di creazione e card con Alias/foto. Nota di handoff
`permessi-collegamento-drawer-scala-reale`.

---

## Variante: elenco ad accordion (atti con più righe selezionabili)

Quando l'entità da collegare è un **atto che contiene più righe** e si sceglie la riga, non l'atto
(Concessione/Contratto Privato → **utenza**, Autorizzazione → **codice cimasa**), al posto della
griglia di `GravityEntityCard` si usa un elenco ad accordion (`antd Collapse`). Stessa intestazione,
ricerca, conteggio e paginazione del picker; cambia solo il corpo. Esempio reale:
`prototype/inventory-systems`, drawer "Collega Concessione / Contratto Privato / Autorizzazione" del
form Nuovo impianto (`PermitUtenzeAccordion`, `AutorizzazioniEsposizioneList`).

- **Ordine dei blocchi:** ricerca (`marginBottom: 16`) → riga conteggio + ordinamento
  (`marginBottom: 12`) → `Collapse` → paginazione in basso a destra (`paddingTop: 20`).
- **Riga conteggio + ordinamento:** identica al picker — "N concessioni trovate" a sinistra
  (singolare e genere gestiti), a destra il pulsante-toggle `type="text" size="small"`:
  "Creati di recente" (`SortDescendingOutlined`, **default**) / "Creati da più tempo"
  (`SortAscendingOutlined`). Il cambio riporta a pagina 1.
- **Header dell'accordion:** titolo (peso 500) + `Tag` identificativo + metadati grigi 12px con
  pallino di stato; a destra "Selezionata" (primary + `CheckCircleFilled`) quando una riga dell'atto
  è scelta.
- **Righe:** dentro un box `1px solid #e8e8e8`, `borderRadius: 6`, con sottointestazione grigia
  (`#fafafa`, 12px) e una **`Radio` a destra** — selezione singola, chiave `attoKey-riga`. Riga
  selezionata `#f9f7ff`; riga non selezionabile (es. codice già in uso) `#fafafa`, testo attenuato
  e motivo in chiaro ("In uso · …").
- **Colonne:** solo il dato che identifica la riga (es. Numero Utenza). Importi e canoni non
  stanno nel drawer: vivono nella sezione Oneri economici.
- **Primo accordion aperto:** all'apertura del drawer, e a ogni cambio di pagina, ricerca o
  ordinamento, si apre **il primo accordion della pagina** (gli altri chiusi). L'utente può aprire e
  chiudere liberamente; lo stato manuale si azzera al cambio di pagina/ricerca/ordinamento.
- **Ordine di creazione:** il dato di creazione è quello del record (nel mock, l'ordine
  dell'array: l'ultimo è il più recente).
- **Paginazione:** 5 atti per pagina; il controllo compare solo oltre il quinto record.
- **Azione di conferma "Collega":** il pulsante primary in header si chiama **Collega** (icona
  `LinkOutlined`), non "Aggiungi". Se il collegamento compila un campo del form in sola lettura,
  il click apre un **`Popconfirm` ancorato al pulsante** (`placement: bottomRight`, OK "Collega",
  Annulla) che lo dichiara: titolo "Il Numero Utenza verrà compilato e messo in sola lettura",
  descrizione con l'azione ("Per modificarlo a mano dovrai prima scollegare la concessione") —
  LAYOUT.md §6.6, mai un `Alert` nel corpo del drawer.
