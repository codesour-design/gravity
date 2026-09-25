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
  `children`). `sections[].disabled` → voce non cliccabile, testo attenuato, resta in elenco
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
  `colorBorderSecondary` se presente titolo/descrizione/extra.

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
- **Nuova Autorizzazione**: "Informazioni" (dati generali dell'atto), "Origine" (diritto sul
  suolo — incluso nell'atto o ereditato da un altro, disabilitata se il Tipo non è Esposizione
  pubblicitaria) e **"Cimasa e CUP"** (elenco a righe, disabilitata finché il Tipo non è
  scelto in "Informazioni").
- **Nuova Concessione**: "Informazioni" (dati dell'atto + area concessa), "Origine" (modalità
  di attribuzione) e **"Canone Patrimoniale"** (numero utenza e canone patrimoniale per
  impianto) — nessuna sezione disabilitata.
- **Nuovo Contratto Privato**: "Informazioni" (dati del contratto), "Riferimento Catastale"
  (facoltativo) e **"Canone Locazione"** (numero utenza e canone di locazione per impianto) —
  nessuna sezione disabilitata.

Concessione V1 e Autorizzazione V1 restano invece sul Drawer semplice a 640px (LAYOUT.md §3.2):
solo la v2 usa `GravitySectionDrawer` per questi tre form.

## Sotto-pattern: elenco collegato con ricerca via drawer (non ancora un componente condiviso)

Le sezioni "Cimasa e CUP"/"Canone Patrimoniale"/"Canone Locazione" (le tre sopra) e "Origine" (solo Autorizzazione, campo
"Concessione o Contratto di riferimento") condividono un sotto-pattern per collegare
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
- **Collegamento singolo (atto di provenienza)**: stesso drawer, ma selezione a scelta unica
  (`Radio` invece di `Checkbox`) — il risultato è una singola `GravityEntityCard` (coerente
  con le card di "Spazi collegati"), non una riga: con un solo elemento possibile, la card è
  più leggibile di una riga isolata.
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
- **Dev bar handoff nei drawer piccoli**: a 640px non c'è spazio per riposizionarla come per
  il `GravitySectionDrawer` a 90% (§ sotto) — va nascosta del tutto finché il drawer piccolo è
  aperto: `rootClassName` dedicato sul `Drawer` + `body:has(.<classe>.ant-drawer-open)
  #ghf-nav-slot { display: none !important; }` (`!important` necessario: lo script della dev
  bar imposta `display` come stile inline, che altrimenti vince sempre sulla regola CSS).

## Dev bar handoff — ancoraggio al gruppo Annulla/Salva

`GravitySectionDrawer` non gestisce la dev bar handoff (`#ghf-nav-slot`): è wiring a livello di
pagina, non del componente. Alla larghezza di questo pattern (70–90%, LAYOUT.md §3.9), la misura
generica dello script di riposizionamento (bordo sinistro del Drawer) lascia poco margine — ogni
prototipo che usa `GravitySectionDrawer` deve aggiungere la stessa coppia CSS+JS già presente per
`NewImpiantoFullDrawer` (inventory-systems) e per il drawer Autorizzazione (inventory-licenses),
adattata al proprio selettore:

```css
/* nel <style> di testa, accanto alla regola base di #ghf-nav-slot */
body:has(.grav-section-drawer-nav) #ghf-nav-slot { right: <px calcolato>; }
```
```js
// nello script di riposizionamento, prima della misura generica sul bordo sinistro
if (document.querySelector('.grav-section-drawer-nav')) {
  slot.style.right = '';   // lascia vincere la regola CSS sopra
  return;
}
```

Il valore px va calibrato a occhio nel browser (misurare lo spazio tra il bordo destro della dev
bar e il pulsante "Annulla" del drawer, senza sovrapporsi) — non c'è una formula, dipende dalla
larghezza del drawer e dal testo dei pulsanti in `extra`.

## Trasposizione Figma

Non esiste ancora un componente Figma dedicato — da definire insieme al reparto design. Nel
frattempo: sidebar → `*List Item*`/`*Menu*` con stato Active/Default, area contenuto → frame con
fill `colorBgLayout`, `GravityFormArea` → `*Card*` (Bordered) con header opzionale. Varianti dei
primitivi (Select, InputNumber, Row/Col): `components/react-figma-map.md`.
