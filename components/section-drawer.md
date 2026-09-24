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

`prototype/inventory-licenses` — drawer "Nuova Autorizzazione" (v2): due sezioni, "Informazioni"
(dati generali dell'atto) e "Impianti autorizzati" (editor a righe, disabilitata finché il Tipo
Autorizzazione non è scelto in "Informazioni").

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
