# Form Layout Patterns — Modali e Drawer

> Questo file è la fonte di verità per **qualsiasi form dentro una Modal o un Drawer** (creazione,
> modifica, duplicazione, collegamento...) in tutti i prototipi Gravity.
> Regole ricavate lavorando su Planning → Duplica pianificazione / Nuova-Modifica pianificazione
> (`prototipi/prototipo approvato/planning/index.html`, funzioni `DuplicateModal`, `PlanningFormDrawer`,
> `TrattativaCascade`, `SaleTypeDates`). Applicale sempre, non solo in Planning.

---

## 1. Ritmo verticale tra i campi

Tutti i `Form.Item` di uno stesso form (Modal o Drawer) devono avere lo **stesso gap verticale**,
indipendentemente dal fatto che tra due campi compaia o meno un elemento condizionale (es. un box
di dati ereditati).

- **Gap standard tra campi: `20px`** (token `marginMD` in `tokens.js`).
- Imposta `style: { marginBottom: 20 }` su ogni `Form.Item` invece di lasciare il default
  di Ant Design (`itemMarginBottom: 24` in `tokens.js`) o azzerarlo a `0`.
- L'ultimo `Form.Item` del gruppo/form ha `marginBottom: 0`.
- Se dopo un `Form.Item` può comparire un **box condizionale** (vedi §3), il box NON deve avere
  `marginTop`: il gap sopra è già dato dal `marginBottom: 20` del `Form.Item` precedente. Il box
  ha invece il proprio `marginBottom: 20` per lo spazio sotto. Così il gap resta identico sia che
  il box compaia sia che non compaia.
- Con separatori strutturali (`Divider`, es. nei Drawer con sezioni Nome / Trattativa / Canale),
  il `Divider` resta lo spaziatore tra sezioni — non sommare anche un `marginBottom: 20` extra sopra
  di esso oltre al proprio margin.
- Un `Alert` alla fine del form usa `marginTop: 20` (non un margine diverso).

❌ Non lasciare `marginBottom: 0` "di comodo" tra un campo e il successivo per poi compensare con
il margin del box condizionale: se il box non compare, i campi restano troppo vicini.

---

## 2. Campi facoltativi: label + descrizione

Quando un campo (o gruppo di campi, es. una cascata trattativa → campagna) è facoltativo:

- Il testo **"(facoltativo)"** va **dentro la label**, come `span` con peso normale e colore
  attenuato — mai come prefisso della descrizione ("Facoltativo: ...").
- L'eventuale testo esplicativo va **subito sotto la label, sopra il controllo** — non come `extra`
  di Ant Design (che renderizza sotto il controllo). Si ottiene passando alla prop `label` un nodo
  composito (titolo + paragrafo), non solo una stringa.

```js
React.createElement(Form.Item, {
  label: React.createElement('div', null,
    React.createElement('div', null,
      'Scegli trattativa e campagna ',
      React.createElement('span', { style: { fontWeight: 400, color: 'rgba(0,0,0,0.45)' } }, '(facoltativo)'),
    ),
    React.createElement('div', { style: { fontSize: 12, fontWeight: 400, color: 'rgba(0,0,0,0.45)', marginTop: 4 } },
      'Testo esplicativo specifico del contesto (es. filtro canale, cosa viene compilato...).'),
  ),
  style: { marginBottom: 20 },
}, /* controllo */)
```

La formula del titolo (`'Scegli trattativa e campagna'`) resta identica in ogni form che propone la
stessa interazione (drawer creazione/modifica, modale duplica...); il testo descrittivo sotto può
variare per contesto (es. la duplica menziona il filtro canale, la creazione menziona cosa viene
compilato), ma **lo stile è sempre lo stesso**.

---

## 3. Box "Dati ereditati da…" (post-selezione)

Quando una selezione (es. una campagna) compila automaticamente altri campi, mostrali in un box
grigio **solo dopo che la selezione è completa** — mai prima, e mai con dati parziali.

- **Non mostrare un box "vuoto" o con un solo campo prima della selezione.** Se un dato (es. il
  canale) è sempre noto anche senza selezione, mostralo altrove (es. un chip nel titolo della
  Modal/Drawer), non in questo box.
- Stile del box:
  ```js
  {
    display: 'flex', flexDirection: 'column', gap: 12,
    background: 'var(--gravity-bg-subtle, #FAFAFA)', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 8, padding: '14px 16px',
    // niente marginTop — vedi §1. marginBottom: 20 se non è l'ultimo elemento del form.
  }
  ```
- Titolo del box: `"Dati ereditati da…"` seguito, in **grassetto** e colore pieno
  (`rgba(0,0,0,0.88)`), dal nome dell'entità selezionata (es. il nome della campagna). Il nome
  dell'entità **non** va ripetuto come riga separata sotto.
  ```js
  React.createElement('div', { style: { fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.65)' } },
    'Dati ereditati dalla campagna ',
    React.createElement('b', { style: { fontWeight: 700, color: 'rgba(0,0,0,0.88)' } }, campagna.name))
  ```
- Righe campo con `deducedRow(label, value)` (funzione condivisa), **sempre nello stesso ordine**
  in tutti i form che mostrano lo stesso box:
  1. Inserzionista
  2. Canale
  3. Tipo di vendita
  4. Periodo di esposizione
- Riusa lo stesso ordine/etichette identici in ogni Modal/Drawer che eredita dati da una campagna:
  non rinominare "Periodo" in un posto e "Periodo di esposizione" in un altro.

---

## 4. Tooltip sulle opzioni disabilitate

Qualsiasi `Select` con opzioni disabilitate (già usate altrove, canale incompatibile, ecc.) deve
spiegare il motivo **in hover**, non lasciare l'utente a indovinare (e non usare un'etichetta
statica tipo "altro canale" accanto all'opzione: usa il tooltip).

- Calcola un `disabledReason` leggibile per ogni opzione disabilitata al momento in cui costruisci
  la lista `options` (non nel render).
- Nell'`optionRender`, avvolgi la riga in un `Tooltip` **solo se** l'opzione ha un `disabledReason`:
  ```js
  optionRender: opt => {
    const row = /* riga normale */;
    return opt.data.disabledReason
      ? React.createElement(Tooltip, { title: opt.data.disabledReason, placement: 'left' }, row)
      : row;
  }
  ```
- Le opzioni disabilitate di Ant Design (`.ant-select-item-option-disabled`) non bloccano gli eventi
  mouse (`cursor: not-allowed`, non `pointer-events: none`): l'hover funziona senza hack aggiuntivi.
- Esempio di motivi già in uso: *"Campagna già collegata a un'altra pianificazione."*,
  *"Canale {X}: questa pianificazione richiede {Y}."*

---

## 5. Alert dentro un form

- **Un solo messaggio compatto** (`message`), senza `description` a meno che serva davvero un
  secondo livello di dettaglio: un Alert con `description` occupa troppo spazio verticale in un
  form già denso.
- Posizionalo **alla fine del form**, dopo tutti i campi (`marginTop: 20`) — non in cima, dove
  spinge in basso tutti i campi prima ancora che l'utente li veda.
- `borderRadius: 8` sempre, per coerenza con gli altri Alert dell'app.
- La parte più importante del messaggio (l'azione richiesta all'utente) va in **grassetto** dentro
  il testo, es.:
  ```js
  message: React.createElement(React.Fragment, null,
    'Testo di contesto: ',
    React.createElement('b', null, 'azione richiesta all\'utente.'),
  )
  ```

---

## 6. Dimensione dei campi: sempre uniforme

- **Non impostare `size: 'large'` su un singolo campo** (tipicamente il primo `Input` del form) se
  il resto dei controlli (Select, DatePicker, RangePicker) resta a `size` di default (`middle`,
  32px — token `controlHeight` in `tokens.js`). Il risultato è un campo più alto di tutti gli altri
  nello stesso form, visivamente incoerente.
- Default: **nessun `size` esplicito** su Input/Select/DatePicker dentro un form → tutti a
  `middle` (32px), altezze identiche.
- Se davvero serve un form con controlli grandi (`large`, 40px — `controlHeightLG`), imposta la
  size su **tutti** i campi del form, mai su uno solo.

---

## 7. Titolo di Modal/Drawer con tag contestuale

Quando il titolo di una Modal/Drawer include un tag/chip informativo sempre noto (es. il canale
della pianificazione che si sta duplicando):

- Il tag va **subito accanto al testo del titolo**, non spinto al bordo destro della finestra.
- Usa `display: 'flex', alignItems: 'center', gap: 8` — **non** `justifyContent: 'space-between'`
  (che allontana il tag dal titolo invece di accostarlo).
  ```js
  title: React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8 } },
    React.createElement('span', null, 'Titolo della modale'),
    React.createElement(ChannelChip, { channel }),
  )
  ```

---

## Riferimento implementativo

Tutte le regole sopra sono applicate in:
- `prototipi/prototipo approvato/planning/index.html` → `DuplicateModal` (Modal "Duplica pianificazione")
- `prototipi/prototipo approvato/planning/index.html` → `PlanningFormDrawer` (Drawer "Nuova/Modifica pianificazione")
- `prototipi/prototipo approvato/planning/index.html` → `TrattativaCascade` (tooltip su opzioni disabilitate)

Usa questi come riferimento concreto prima di costruire un nuovo form in Modal o Drawer altrove
nell'app (Inventory, Campaigns, ecc.): le stesse regole si applicano, non solo a Planning.
