# Section Drawer — Gravity Platform

> Fonte di verità per il pattern "Drawer con navigazione verticale a sezioni" (LAYOUT.md §3.9).
> Estratto e componentizzato dal drawer "Nuovo Impianto" (`prototype/inventory-systems`,
> `NewImpiantoFullDrawer`) — che resta l'implementazione di riferimento originale, non ancora
> migrata a questo componente. Ogni nuovo drawer che ha bisogno dello stesso layout usa
> `GravitySectionDrawer`, non ricostruisce nav/scroll/aree inline.

---

## Componenti condivisi

Sorgente: `prototype/_shared/section-drawer.js`.

```html
<script src="../../section-drawer.js"></script>
```
```js
const { GravitySectionDrawer, GravityFormArea } = window;

React.createElement(GravitySectionDrawer, {
  open, title, extra,            // stessi props del Drawer AntD "semplice" (LAYOUT.md §3.2):
  dirty, onClose,                // title/extra già costruiti dal chiamante (DiscardCloseIcon/
                                  // DiscardButton restano locali al prototipo, non sono ancora
                                  // condivisi — il componente non li assume)
  width,                         // default '90%' (styles.wrapper.width, come
                                  // ConnettiImpiantiDrawer), non i 640 dei drawer semplici
                                  // (LAYOUT.md §3.9) — px o percentuale
  navLabel: 'Sezioni',           // etichetta sopra l'elenco (facoltativa, default 'Sezioni')
  activeKey, onActiveKeyChange,  // sezione attiva — controllata dal chiamante
  sections: [
    { key: 'info', label: 'Informazioni', title: 'Informazioni', description: '…',
      disabled: false, children: [...] },
    { key: 'impianti', label: 'Impianti autorizzati', title: 'Impianti autorizzati',
      description: '…', disabled: !tipoScelto, children: [...] },
  ],
})
```

- `sections[].label` → testo nella sidebar. `sections[].title`/`description` → intestazione
  dentro l'area di contenuto (facoltativi: se assenti, la sezione non mostra header, solo
  `children`). `sections[].disabledReason` → motivo del blocco, mostrato in tooltip in hover sulla voce disabilitata (stesso principio di LAYOUT.md §6.2: mai testo statico). `sections[].disabled` → voce non cliccabile, testo attenuato, resta in elenco
  (LAYOUT.md §6.2 — disabilitato non nascosto).
- Solo la sezione con `key === activeKey` viene renderizzata nel pannello di contenuto (le altre
  non montano — stesso comportamento del `sec()` locale di `NewImpiantoFullDrawer`).

```js
React.createElement(GravityFormArea, {
  title, description,   // facoltativi — card senza header se entrambi assenti
  extra,                 // nodo allineato a destra nell'header (es. un pulsante)
  children,               // contenuto — tipicamente Row/Col o Form.Item di AntD
})
```

Card bianca che raggruppa campi correlati dentro una sezione — una sezione può contenere più
`GravityFormArea` in sequenza (`marginBottom` già incluso tra una e l'altra).

## Tracciamento modifiche (pallino viola + stroke sul campo)

Sistema unico per mostrare cosa è stato modificato e non ancora salvato, nato in "Nuovo
Impianto" (`inventory-systems`) e ora condiviso dai drawer sezionati (Autorizzazione,
Concessione, Contratto Privato).

| Livello | Segnale | Come |
|---------|---------|------|
| Campo | stroke `colorPrimary` (`#3E00FB`) sul controllo | `window.GravityModified(modificato, controllo)` — avvolge in `.input-modified` (Input, InputNumber, Select, DatePicker) |
| Sezione | pallino pieno primary 5px a destra della voce di menu, tooltip "Modifiche non salvate in questa sezione" | `sections[].dirty: true` |
| Drawer | `dirty` del drawer (conferma di uscita, vedi LAYOUT.md §6.6) | invariato |

Regole:
- **Base di confronto**: in creazione è lo stato vuoto iniziale (ogni campo compilato è "da
  salvare"); in modifica è l'ultimo salvataggio. Il confronto è per valore (`JSON.stringify`), non
  per evento: tornare al valore originale spegne il segnale.
- **Il segnale sparisce al salvataggio** (nuova base = stato salvato), non alla chiusura della
  sezione.
- **Sezione dirty = almeno un suo campo modificato**: si dichiara la lista delle chiavi per
  sezione (es. `SECTION_FIELDS` in Nuovo Impianto, `sectionMod([...])` nei permessi).
- **Righe di elenco** (Impianti collegati): la sezione è dirty se esiste una riga non-seed; il
  singolo campo di riga è modificato se non vuoto.
- **Checkbox e valori derivati** non hanno stroke (non c'è un bordo da colorare): segnalano la
  modifica solo tramite il pallino di sezione.
- **Sezione disabilitata** non mostra pallino.
- Il colore è sempre e solo il primary (mai un colore dedicato al "modificato"), coerente con
  LAYOUT.md §6.2 (attivo/selezionato = primary).

Esempio:

```js
const isMod = k => JSON.stringify(f[k]) !== JSON.stringify(EMPTY[k]);
const mod = (k, control) => window.GravityModified(isMod(k), control);

sections: [{
  key: 'info', label: 'Dati dell\'Atto',
  dirty: ['enteEmittente', 'dataStipula'].some(isMod),
  children: [ /* ... */ mod('enteEmittente', React.createElement(Select, { value: f.enteEmittente, ... })) ],
}]
```

## Struttura visiva

```
┌──────────────┬──────────────────────────────────────────────┐
│  Sezioni     │  ░░░░░░░░░░░░░░░░ sfondo grigio ░░░░░░░░░░░░  │
│  ─────────   │  ░░  Titolo sezione                       ░░  │
│  ▸ Sezione A │  ░░  Descrizione sezione                  ░░  │
│    Sezione B │  ░░  ┌────────────────────────────────┐  ░░  │
│    Sezione C │  ░░  │ Titolo area      [azione extra] │  ░░  │
│  (disabled)  │  ░░  │ Descrizione area                │  ░░  │
│              │  ░░  │  campi…                          │  ░░  │
│              │  ░░  └────────────────────────────────┘  ░░  │
└──────────────┴──────────────────────────────────────────────┘
```

- **Sidebar** (`.grav-section-drawer-nav`): 220px, sfondo `colorBgContainer` (`#fff`), bordo destro
  `colorBorderSecondary` (`#F0F0F0`), padding `24px 16px` (paddingLG/padding).
- **Area contenuto** (`.grav-section-drawer-scroll`): scrollabile, sfondo `colorBgLayout`
  (`#F5F5F5`) — **non un grigio a scelta libera**, è lo stesso token dello sfondo pagina
  (LAYOUT.md §4), colonna centrale `width: 90%` (in proporzione alla larghezza del drawer, non
  un valore fisso) con `max-width: 960px` come tetto di leggibilità sui drawer più larghi.
- **Titolo sezione**: 20px/600 (stesso stile di "Section title", LAYOUT.md §5). **Descrizione
  sezione**: 13px, `colorTextTertiary` (`rgba(0,0,0,0.45)`).
- **`GravityFormArea`**: sfondo bianco, bordo `#E8E8E8` (**non** `colorBorderSecondary`
  `#F0F0F0`: su sfondo `colorBgLayout` un bordo più chiaro dello sfondo circostante è invisibile —
  vedi LAYOUT.md §4, nuova riga dedicata), `borderRadius: 8`, header con bottom-border
  `colorBorderSecondary` se presente titolo/descrizione/extra. **Altezza header stabile**:
  `min-height: 70px` (20+18 padding + 32 `controlHeight`) e blocco testo `flex: 1; min-width: 0` —
  quando il pulsante passa dallo stato vuoto all'`extra` l'header non cambia altezza (nessuno
  "scalino") e il testo non si sposta.

## Decisioni di design

- **Perché non riusare `NewImpiantoFullDrawer` così com'è**: quel componente è una pagina
  full-screen (`Drawer` con `width: '100%'`), con `sec()`/`box()`/`boxX()`/`g2`/`g3`/`g4` definiti
  localmente — non condivisibile senza refactor. Questa estrazione ne isola il layout (nav +
  scroll grigio + card), lasciando `NewImpiantoFullDrawer` invariato: nessuna migrazione
  retroattiva in questo giro di lavoro, i due convivono finché non si decide di allineare anche
  quello al componente condiviso.
- **Larghezza 90% della viewport, non full-screen**: i drawer Gravity restano overlay sulla lista
  (LAYOUT.md §1/§3.2), non pagine dedicate — la sidebar ha comunque bisogno di più spazio di un
  pannello semplice. Applicata via `styles.wrapper.width` (non la prop `width` del Drawer
  direttamente), stesso pattern già in uso in `ConnettiImpiantiDrawer`.
- **Scroll**: la sezione attiva riparte sempre dall'inizio dello scroll al cambio sezione (senza
  reset l'utente atterrerebbe a metà/oltre la fine del contenuto della sezione precedente) —
  scrollbar sottile e `scroll-behavior: smooth` per un'esperienza meno "a scatti" del browser
  default.
- **`title`/`extra` non gestiti dal componente**: ogni prototipo ha ancora la propria copia locale
  di `DiscardCloseIcon`/`DiscardButton` (non condivisi) — il chiamante li usa per costruire
  `title`/`extra` come già fa con il Drawer semplice, `GravitySectionDrawer` li passa al Drawer
  AntD sottostante senza assumerne la forma.
- **Grid dei campi**: nessun helper `g2`/`g3`/`g4` incluso in questo componente — dentro
  `GravityFormArea` usare `Row`/`Col` di AntD (gutter da `tokens.js`, LAYOUT.md §2.1), coerente col
  resto del repo, invece di introdurre una seconda convenzione di grid CSS.

## Esempio reale

`prototype/inventory-licenses` — i tre drawer di creazione Permesso in v2 usano tutti questo
pattern, per un'esperienza di creazione coerente tra i tipi (note
'concessione-contratto-drawer-a-sezioni' e 'concessione-contratto-impianti-collegati'): la
sezione con l'elenco a righe degli impianti è sempre la terza, in tutti e tre i tipi — ma il
suo **nome è specifico per tipo**, non più il generico "Impianti collegati" identico ovunque:
un'etichetta come "Cimasa e CUP" comunica da subito cosa si autorizza in quella sezione, prima
ancora di aprirla, invece di farlo scoprire solo dopo (stessa logica di "Documentazione viva" —
il nome scelto in un primo giro può rivelarsi non abbastanza esplicito e va corretto).
- **Nuova Autorizzazione**: "Dati dell'Atto" (dati generali dell'atto), "Diritto sul Suolo"
  (incluso nell'atto o ereditato da un altro, disabilitata se il Tipo non è Esposizione
  pubblicitaria) e **"Cimasa e CUP"** (elenco a righe, disabilitata finché il Tipo non è
  scelto in "Dati dell'Atto").
- **Nuova Concessione**: "Dati dell'Atto", **"Area e Attribuzione"** (area concessa e modalità di
  attribuzione: bando pubblico, affidamento diretto o rinnovo) e **"Impianti collegati"**
  (numero utenza per impianto) — "Area e Attribuzione" e "Impianti collegati" disabilitate finché il Tipo
  Documento non è scelto (area del tipo sempre visibile).
- **Nuovo Contratto Privato**: "Dati del Contratto" (dati del contratto), "Riferimento
  Catastale" (facoltativo) e **"Impianti collegati"** (numero utenza per
  impianto) — "Impianti collegati" disabilitata finché il Tipo Contratto non è scelto (area del
  tipo sempre visibile); "Riferimento Catastale" è facoltativo e sempre raggiungibile.

> Nota: "Diritto sul Suolo" e "Modalità di Attribuzione" erano entrambe etichettate "Origine"
> (a sua volta rinominata da "Provenienza") finché non si è notato che, pur trattando entrambe
> di come si è ottenuto il diritto sottostante, il contenuto delle due sezioni è specifico per
> tipo — lo stesso motivo per cui "Impianti collegati" è già specifico per tipo (sopra). "Dati
> dell'Atto"/"Dati del Contratto" sostituiscono il generico "Informazioni" comune a tutti e tre.

Concessione V1 e Autorizzazione V1 restano invece sul Drawer semplice a 640px (LAYOUT.md §3.2):
solo la v2 usa `GravitySectionDrawer` per questi tre form.

> **Regola di struttura**: la seconda sezione dei drawer di Permesso parla sempre dell'*origine
> dell'atto* ("Diritto sul Suolo" in Autorizzazione, "Area e Attribuzione" in Concessione); l'ultima è sempre
> "Impianti collegati". Il Contratto Privato ha invece "Riferimento Catastale" (facoltativo).

## Sotto-pattern: elenco collegato con ricerca via drawer (non ancora un componente condiviso)

Le sezioni "Impianti collegati" (le tre sopra) e "Diritto sul
Suolo" (solo Autorizzazione, campo "Concessioni o Contratti di riferimento") condividono un
sotto-pattern per collegare
un'altra entità quando una `Select` semplice non basta a trovarla — caso reale quando le
opzioni sono migliaia con nomi simili (nota 'permessi-collegamento-drawer-card'). **Non è
ancora estratto in `prototype/_shared/`**: vive per ora duplicato in
`prototype/inventory-licenses/index.html`, con varianti concettualmente identiche anche in
`prototype/inventory-systems` (Moduli) e nel "Collega Spazi" di questo stesso file — un
candidato naturale per una futura estrazione, segnalato ma non ancora deciso.

- **Stato vuoto**: illustrazione tenue (`link-entity-astronaut.png`, stesso asset del pattern
  "Nuovo Impianto") + testo + le azioni disponibili, impilate verticalmente e centrate
  (`Space direction="vertical" align="center"`).
- **Collegamento multiplo (impianti)**: un drawer di ricerca (640px, `rootClassName`
  dedicato per nascondere la dev bar handoff — vedi sotto) con `Input` di ricerca + elenco
  selezionabile a checkbox, pre-selezionato con quanto già collegato. Il risultato **non è
  una griglia di card**: resta un elenco a righe (una per elemento), perché a scala reale
  (20.000+ impianti) una card fitta di informazioni per ciascuna riga è meno leggibile di una
  riga compatta, e perché il drawer già risolve la ricerca — le righe non devono più farlo.
- **Collegamento multiplo a manciata (atti di provenienza)**: stesso drawer e stessa selezione a
  checkbox del collegamento impianti sopra, ma il risultato è una **griglia di `GravityEntityCard`**
  a fill per larghezza (`grid` `auto-fit minmax`, non colonne fisse, non un elenco a righe): la
  cardinalità tipica è 0-2 atti collegati, non migliaia, quindi la card resta più leggibile di
  una riga anche con più di un elemento, e con una sola card collegata questa riempie l'intera
  larghezza del box invece di lasciare spazio vuoto accanto. Il pulsante che apre il drawer vive
  nello stato vuoto (`gravLinkEmpty`) finché non c'è nulla collegato, poi si sposta nell'`extra`
  dell'header del box ("Collega permesso", stessa etichetta in entrambi gli stati) — mai sotto la griglia; ogni card ha il proprio
  "Scollega" nel kebab `menu` (non un'azione unica per l'intero collegamento) — dettaglio in
  `components/entity-card.md` → "Griglia a manciata, fill per larghezza" e "Pulsante 'Collega' e
  stato vuoto".
- **Riga (collegamento multiplo)**: `Row`/`Col` a 4 colonne (9/7/5/3, `gutter: 16`), una riga
  per elemento con `marginBottom: 20` tra una riga e l'altra — più ariosa del `gutter: 16` /
  `marginBottom: 12` della sola intestazione colonne, per dare respiro a un elenco che può
  avere più righe di un form normale. La prima colonna è **sola lettura** (l'elemento si
  sceglie nel drawer, non più con una `Select` per riga): icona tipologia (asset custom
  `systemstype-icons` via `GravityMap.systypeIconSrc(tipo, canale)` — LAYOUT.md §6.5 — fallback
  `TagOutlined` se il tipo non ha un'icona custom) + identificativo + indirizzo troncato
  (`text-overflow: ellipsis`). Le colonne successive restano `Input`/`InputNumber` editabili
  inline, come nell'editor a righe che questo pattern sostituisce.
- **Riconoscimento in hover**: quando l'identità sola-lettura non basta a distinguere elementi
  simili (stesso tipo, indirizzi vicini), un'icona Ⓘ esplicita (`InfoCircleOutlined`, non
  l'intero blocco identità — LAYOUT.md §6.2, va scoperta non capitata per caso) apre un
  `Popover` in hover con 3-4 campi reali (icona + label + valore, stesso stile delle
  `GravityEntityCard`) — mai una foto segnaposto: se l'asset non è una vera foto per elemento
  (es. `FOTO_IMPIANTO`, assegnazione pseudo-casuale per id usata altrove nel repo), è
  fuorviante invece che utile al riconoscimento.
- **Elemento non ancora esistente in anagrafica**: un'azione secondaria e diretta — "Aggiungi
  senza impianto" (`Button type="link"`), non dentro al drawer di ricerca — aggiunge subito una
  riga con un `Tag` di stato ("Da censire") al posto dell'identità, con gli stessi campi
  editabili delle altre righe. Va tenuta fuori dal drawer: è un caso d'uso a sé, non una
  sottovoce della ricerca, e nasconderla in fondo a un elenco di centinaia di risultati la
  rende difficile da trovare.
- **Risolvere una riga "Da censire"**: quando l'impianto viene poi censito in Inventario, la
  riga resta comunque **collegabile a posteriori** — un'azione "Seleziona impianto" accanto al
  `Tag` di stato riapre lo stesso drawer di ricerca, ma in modalità a scelta singola (`Radio`
  invece di `Checkbox`, nessuna preselezione, candidati filtrati per escludere gli impianti già
  collegati in un'altra riga). Confermando, quella riga specifica passa da sola-lettura-assente a
  identità reale, **senza perdere** i campi già compilati (cimasa/CUP o numero utenza/canone):
  non si crea una riga nuova e non si cancella quella vecchia, si aggiorna la stessa riga.
- **Pulsanti "Collega…"**: sempre **size default** (mai `size: 'small'`) — sono l'azione
  primaria della sezione, non un'azione minore accessoria. Solo quando l'elenco non è vuoto
  compaiono anche nell'header del box, accanto al titolo.
- **Contatore nel titolo del box**: stesso `countBadge` del drawer "Nuovo Impianto"
  (`inventory-systems`) — pillola piena `colorPrimary` (`#3E00FB`) con numero bianco (`#fff`),
  18×18px, `borderRadius: 9`, **accanto al titolo**, non tra le azioni:
  ```js
  const countBadge = (n) => React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
      background: window.GRAVITY_THEME.token.colorPrimary, color: '#fff',
      fontSize: 12, fontWeight: 700, lineHeight: 1,
    },
  }, n);
  ```
- **Dev bar handoff nei drawer piccoli**: nascosta automaticamente dal motore (nessun CSS
  per-prototipo) — regola completa nella sezione qui sotto.

## Dev bar handoff — regola nei drawer

La dev bar handoff (`#ghf-nav-slot`) è gestita **centralmente da `prototype/_shared/handoff.js`**:
il drawer non deve fare nulla e i prototipi **non** devono avere CSS/JS propri per spostarla.

- Drawer di **primo livello** a schermo intero o largo **≥ 90%** viewport (es.
  `GravitySectionDrawer`): la dev bar resta visibile, riparentata su `<body>` (fuori dallo
  stacking context della navbar) e agganciata a sinistra del gruppo azioni dell'header
  (`.ant-drawer-extra`, es. Annulla/Salva).
- Drawer **stretti** (< 90%, es. 640px) e drawer **di secondo livello in poi** (più di un drawer
  aperto): dev bar **nascosta** finché sono aperti, perché si sovrapporrebbe all'header.
- Nessun drawer aperto: posizione nativa (navbar, accanto alla campanella).

Dettagli e motivazione in `components/handoff-engine.md` → "Dev bar e drawer".

## Trasposizione Figma

Non esiste ancora un componente Figma dedicato — da definire insieme al reparto design. Nel
frattempo: sidebar → `*List Item*`/`*Menu*` con stato Active/Default, area contenuto → frame con
fill `colorBgLayout`, `GravityFormArea` → `*Card*` (Bordered) con header opzionale. Varianti dei
primitivi (Select, InputNumber, Row/Col): `components/react-figma-map.md`.
