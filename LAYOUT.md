# Gravity — Layout & Struttura File Figma

> Documento in due parti. **Parte 1** definisce le regole di layout universali di Gravity: valgono
> per ogni prototipo HTML/React, indipendentemente da Figma, e sono la fonte di verità. **Parte 2**
> descrive come quelle stesse regole si traspongono sui file Figma — si applica *dopo* aver
> costruito e validato il prototipo (workflow completo in `CLAUDE.md` → "Workflow HTML → Figma").
> Leggi questo file insieme a `CLAUDE.md` prima di costruire qualsiasi prototipo.

---

# PARTE 1 — Regole universali Gravity (prototipo)

## 1. Viewport e dimensioni schermate

| Tipo schermata | Larghezza | Altezza | Note |
|---------------|-----------|---------|------|
| List view | 1728px | 1117px | Viewport desktop standard |
| Detail view | 1748px | 1117px | Leggermente più larga (pannello laterale) |
| Detail con panel | 1748px | 1168px | Include spazio extra per panel aperto |
| Form panel (drawer) | ~480px | full height | Sempre a destra, overlay sulla lista |

---

## 2. App Shell — Layout principale

> **IMPORTANTE:** Gravity ha **solo una Navbar orizzontale**. Non esiste sidebar verticale.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (height: ~73px)                                 │
│  [Logo Gravity]  [Overview] [Inventory] [...]   🔔 👤  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  MAIN CONTENT AREA (full width)                         │
│                                                         │
│  Page Title                      [Primary Action Btn]   │
│  ─────────────────────────────────────────────────────  │
│  [Tab1] [Tab2]                                          │
│                                                         │
│  Total: xxx items                                       │
│                                                         │
│  [TABLE / CONTENT]                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Navbar
- **Componente condiviso:** `prototype/_shared/navbar.js` (`GravityNavbar`) — non ricostruire per-prototipo
- **Altezza:** 73px
- **Larghezza:** FILL (si estende a tutta la larghezza del frame)
- **Sinistra:** Logo Gravity (solo logotipo tipografico) + voci di navigazione con dropdown
- **Destra:** icona campanella (24px) + avatar utente (32px, circolare)
- **Varianti per ruolo:** Super Admin, Systems Admin, Sales Leader, Planner, Data Analyst, Creative, Advertiser, Commercial, Publisher
- **Non usare** frame/componenti custom al posto di questo

> Per misure esatte, pattern HTML completo e API del componente → **`components/navbar.md`**.
> Per il componente Figma corrispondente → **Parte 2, §14**.

### Main Content Area
- **Larghezza:** full width (non c'è sidebar — occupa tutto lo spazio sotto la Navbar)
- **Padding:** 24px (horizontal e vertical)
- **Sfondo:** `colorBgLayout` (#F5F5F5)

---

### 2.1 Grid system — Row / Col

Ant Design usa un sistema **a 24 colonne** basato su Flexbox ([documentazione](https://ant.design/components/grid)).
Regole base:

- Il contenitore orizzontale è sempre `<Row>`; i suoi figli diretti sono sempre `<Col>` — il
  contenuto va dentro il `Col`, mai direttamente nella `Row`.
- `span` (1–24) definisce quante colonne occupa un `Col`. Tre colonne uguali → `span={8}` ciascuna
  (24 ÷ 3); quattro card KPI → `span={6}` ciascuna.
- Se la somma degli `span` in una `Row` supera 24, i `Col` in eccesso vanno automaticamente a capo.

#### Gutter (spaziatura tra colonne)

Usa sempre `gutter` su `<Row>` — mai margini/padding manuali sui singoli `<Col>`. Il valore va preso
da `prototype/_shared/tokens.js`, mai hardcodato:

| Uso | Token | Valore |
|-----|-------|--------|
| Grid dense (filtri, chip) | `token.marginXS` | 8px |
| Default (KPI card, grid standard) | `token.margin` | 16px |
| Grid più ariosa (sezioni ampie) | `token.marginLG` | 24px |
| Layout con molto respiro | `token.marginXL` | 32px |

```jsx
React.createElement(Row, { gutter: token.margin }, // 16px — scala Gravity, non hardcodare
  React.createElement(Col, { span: 6 }, /* KPI card */),
  React.createElement(Col, { span: 6 }, /* KPI card */),
)
```

Per spaziatura orizzontale e verticale insieme usa l'array `[orizzontale, verticale]`:
`gutter: [token.margin, token.marginLG]`.

**Pattern già in uso in Gravity:** KPI cards nel Detail View (§3.4) →
`<Row gutter={16}><Col span={6}>` per 4 card che riempiono la riga (4 × 6 = 24).

#### Altre prop utili di `Col`

| Prop | Uso |
|------|-----|
| `offset` | sposta il `Col` a destra di N colonne (es. centrare un form: `offset={6}` su `span={12}`) |
| `flex` | colonna a larghezza fissa/auto dentro una riga flessibile (es. `flex="200px"` per un pannello interno fisso) |
| `push` / `pull` | riordina visivamente senza cambiare l'ordine nel markup |

#### Breakpoint responsive

Gravity progetta **desktop-first a viewport fisso** (1728px, §1): per la maggior parte dei
prototipi i breakpoint non servono. Diventano rilevanti per le varianti mobile (naming `--mobile`,
es. `planning--mobile`, vedi CLAUDE.md). `tokens.js` non ridefinisce i breakpoint di Ant Design,
quindi restano quelli standard:

| Breakpoint | Larghezza minima |
|-----------|------------------|
| `xs` | < 576px |
| `sm` | ≥ 576px |
| `md` | ≥ 768px |
| `lg` | ≥ 992px |
| `xl` | ≥ 1200px |
| `xxl` | ≥ 1600px |

Su `Col` si usano come alternativa a `span`: `<Col xs={24} md={12} lg={8}>` (mobile full width →
metà su tablet → un terzo su desktop).

---

### 2.2 Layout (Header / Content / Sider / Footer)

Ant Design offre `<Layout>` come contenitore strutturale di pagina
([documentazione](https://ant.design/components/layout)), con i sotto-componenti `Header`, `Sider`,
`Content`, `Footer` — già destrutturati da `Layout` in `_template.html`, pronti all'uso.

**In Gravity si usano solo `Layout` + `Header` + `Content`:**

- **`<Header>`** ospita la Navbar orizzontale (`GravityNavbar`, §2) — **non** l'header scuro
  di default di Ant Design. `tokens.js` non sovrascrive i component token di `Layout`, quindi vanno
  forzati a mano: sfondo `colorBgContainer` (bianco), altezza 73px — mai il default Ant Design
  (`headerBg` #001529, `headerHeight` 64px).
- **`<Content>`** è la Main Content Area (§2) — full width, `padding: token.paddingLG` (24px),
  sfondo `colorBgLayout`.
- **Mai `<Sider>`.** Gravity non ha sidebar verticale (regola non negoziabile, §2). Se un
  pattern sembra richiedere una sidebar, è quasi sempre un `<Col>` fissa dentro la `Row` di
  contenuto (Left Fixed Panel, §3.3) o un `<Drawer>` — non `Layout.Sider`.
- **`<Footer>` non è usato** — nessuna schermata Gravity attuale lo prevede.

```jsx
React.createElement(Layout, null,
  React.createElement(Header, {
    style: { background: token.colorBgContainer, height: 73, padding: 0 },
  },
    React.createElement(GravityNavbar, { /* props da navbar.js */ })
  ),
  React.createElement(Content, {
    style: { padding: token.paddingLG, background: token.colorBgLayout },
  },
    /* contenuto pagina — usa Row/Col qui dentro per KPI, grid, form multi-colonna */
  )
)
```

---

## 3. Pattern di layout — viste disponibili

### 3.1 List View (vista lista)

La vista più comune. Struttura interna:

```
[Page Title]                      [Primary Action Button ▾]
──────────────────────────────────────────────────────────
[Tab Grants] [Tab Authorizations]
Total: xxx items

[TABLE]
  [Col fissa SX: ID, Grant Type]
  [Colonne scrollabili: ...]
  [Colonne fisse DX: State, Actions ...]
```

**Componenti Ant Design usati:**
- `<Typography.Title level={2}>` — titolo pagina
- `<Button type="primary" size="large">` con `<DownOutlined />` — azione principale con split
- `<Tabs type="line">` — sotto il titolo
- `<Table>` con `fixed` columns + scroll orizzontale
- Badge stato: `<Badge status="success" text="Active">` / `<Badge status="error" text="Expired">`
- Azioni riga: `<Button type="text" icon={<MoreOutlined />}>` (tre puntini)

---

### 3.2 List + Right Drawer (lista + form laterale)

Aperto da un'azione sulla lista (es. "New Grant"). La lista rimane visibile a sinistra, dimmed (~50%), il drawer occupa la metà destra.

```
[Lista dimmed ~50% width]  │  [DRAWER]
                           │  ✕  New Grant          [Save]
                           │  ─────────────────────────
                           │  * Grant Type: ● Public ○ Private
                           │  * Issuing Authority: [input]  VAT: [input]
                           │  * Document Type: [select]  * Doc ID: [input]
                           │  * Signing Date: [datepicker]  Exp Date: [datepicker]
                           │    Reminder: [select]
                           │
                           │  Account Numbers        + Add number
                           │  * Account number: [input]  Tax: [input] €/y  🗑
```

**Componenti Ant Design:**
- `<Drawer placement="right" width="50%">` — contenitore
- Header drawer: `<CloseOutlined />` + titolo + `<Button>Save</Button>`
- `<Form layout="horizontal">` con label a sinistra
- `<Radio.Group>` per Grant Type
- `<Input>`, `<Select>`, `<DatePicker>` per i campi
- `<Button type="link" icon={<PlusOutlined />}>Add number</Button>` — azione ripetibile
- `<Button type="link" danger icon={<DeleteOutlined />}>Remove</Button>`

---

### 3.3 List + Left Fixed Panel (filtri/dettaglio laterale sinistro)

Variante della lista dove il pannello sinistro mostra un'entità secondaria (es. "Issuing Authority") mentre la tabella scrolla a destra.

---

### 3.4 Detail View (vista dettaglio)

Schermata dedicata a una singola entità. Struttura:

```
← [Breadcrumb: Authorizations list]

[Entity Title]  [Tag: Document ID]          [Edit] [Connect Systems ▾]
#0101  Issuing Authority: [value]  Signing Date: [value]  State: ● Active
─────────────────────────────────────────────────────────────────────────

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Auth Type    │ │ Expiration   │ │ Duration     │ │ CUP          │
│ Comunale     │ │ 21/01/2031   │ │ 5 years      │ │ 960 €/year   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Connected Systems
Total: 4 systems  [Filter by channel ▾]  [Filter by system type ▾]

┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│ [System Card]  │ │ [System Card]  │ │ [System Card]  │ │ [System Card]  │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘
```

**Componenti Ant Design:**
- `<Breadcrumb>` con freccia sinistra — navigazione back
- `<Typography.Title level={2}>` + `<Tag>` per l'identificativo
- Metadata bar: `<Descriptions layout="horizontal" size="small" bordered={false}>`
- KPI cards: `<Row gutter={16}><Col span={6}>` con `<Card>` + `<Statistic>`
- Sezione sistemi: titolo + filtri `<Select size="small">` + grid di card

---

### 3.5 Detail + Edit Form (dettaglio con modifica inline)

Il dettaglio rimane visibile, un drawer laterale destro o un overlay mostra il form di modifica.

---

### 3.6 Detail + Connect Systems (collegamento entità)

Vista per associare sistemi/impianti a una concessione/autorizzazione. Mostra una lista selezionabile di sistemi con checkbox.

---

### 3.7 Public/Guest View (senza App Shell)

Schermate pubbliche/non autenticate: nessuna Navbar, nessun App Shell (§2) — solo logo Gravity
(tipografico, centrato in cima) e contenuto centrato nel viewport, spesso in un box/card isolato.

```
         [sfondo chiaro standard, o radiale viola come variante decorativa]

                    Gravity (logo tipografico centrato)

              ┌───────────────────────────────┐
              │   [contenuto centrato:        │
              │    form OTP, quote guest,      │
              │    messaggio di errore, …]     │
              └───────────────────────────────┘
```

- **Quando usarlo:** accesso via link condiviso senza login (quote/contratto guest), verifica OTP,
  pagine di errore di accesso (link scaduto/non valido).
- **Componenti Ant Design:** `<Result>` per stati di errore; per il resto niente di specifico al
  pattern — il contenuto interno (card quote, form OTP) segue le proprie regole.
- **Esempi reali:** Guest: Quote Detail/Card, OTP Insert, Expired Link — vedi
  `docs/modules/commercial.md` §11.10–§11.12.

---

### 3.8 Modal Wizard multi-step

Flusso guidato a step dentro un `<Modal>` (o full-page per contenuti più lunghi), con `<Steps>` a
inizio modale e navigazione Cancel/Next/Finish in footer.

```
[Titolo step]
[Sottotitolo/istruzioni]

[Steps: ① ── ② ── ③ ── ④]

[contenuto specifico dello step]

                        [Cancel]  [Next →]
```

- **Componenti Ant Design:** `<Modal>` + `<Steps current={n} items={[...]}>`; contenuto per step
  libero (Checkbox.Group, Radio.Group, Select, InputNumber, ecc. secondo il dato richiesto);
  footer `<Button>Cancel</Button>` + `<Button type="primary">Next</Button>` (ultimo step:
  `Finish`/`Save`).
- **Alternativa:** per wizard con molti campi per step, full-page invece di Modal (stessa logica
  Steps, senza overlay).
- **Esempi reali:** Wizard/Strategy, Slot Wizard — vedi `docs/modules/commercial.md` §11.4, §11.14.

---

> Per la corrispondenza di ciascun pattern con il nome del frame Figma → **Parte 2, §11**.

---

## 4. Colori nella UI (osservati dalle schermate)

| Elemento | Colore | Token |
|---------|--------|-------|
| Top bar background | `#ffffff` | `colorBgContainer` |
| Sidebar background | `#ffffff` | `colorBgContainer` |
| Page background | `#F5F5F5` | `colorBgLayout` |
| Primary button | `#3E00FB` | `colorPrimary` |
| Active nav item | `#3E00FB` + sfondo viola chiaro | `colorPrimary` |
| Tab attivo underline | `#3E00FB` | `colorPrimary` |
| Badge Active | verde `#52C41A` | `colorSuccess` |
| Badge Expired | rosso `#FF4A1C` | `colorError` |
| Table header bg | `#FAFAFA` | `colorFillQuaternary` |
| Tag tipo sistema OOH | `#3E00FB` (outline) | `colorPrimary` |
| Tag tipo sistema DOOH | `#FF4A1C` (outline) | `colorError` |
| KPI card border | `#F0F0F0` | `colorBorderSecondary` |

---

## 5. Tipografia nelle schermate (osservata)

| Elemento | Font | Size | Weight |
|---------|------|------|--------|
| Page title ("Licenses List") | SF Pro Text | 30px | 600 |
| Section title ("Connected Systems") | SF Pro Text | 20px | 600 |
| Table header cell | SF Pro Text | 14px | 500 |
| Table cell | SF Pro Text | 14px | 400 |
| KPI valore ("5 years") | SF Pro Text | 24px | 600 |
| KPI label ("Duration") | SF Pro Text | 14px | 400 |
| Metadata bar | SF Pro Text | 14px | 400 |
| Breadcrumb | SF Pro Text | 14px | 400 |
| Form label | SF Pro Text | 14px | 400 |

> Per la corrispondenza di ciascuna riga con il token Figma → **Parte 2, §13**.

---

## 6. Standard UI/UX trasversali

> Regole che valgono su più componenti/moduli e non hanno un posto naturale in un singolo file di
> `components/`. Per lo standard di un componente specifico (form, navbar, filtri, mappa…) vale
> prima il suo file dedicato — qui c'è solo ciò che è davvero cross-modulo.

### 6.1 Spaziatura

Tutta la spaziatura viene dai token di `prototype/_shared/tokens.js` (`margin*`/`padding*`), mai da
valori inventati:

| Token | Valore | Uso tipico |
|-------|--------|------------|
| `marginXXS` / `paddingXXS` | 4px | gap minimi (icona-testo) |
| `marginXS` / `paddingXS` | 8px | gap piccoli tra elementi correlati |
| `marginSM` / `paddingSM` | 12px | padding sezioni compatte (es. filter-drawer) |
| `margin` / `padding` | 16px | padding standard di contenuto |
| `marginMD` / `paddingMD` | 20px | **gap verticale tra `Form.Item`** — vedi `components/form-patterns.md` §1 |
| `marginLG` / `paddingLG` | 24px | padding pagina/card, gap tra sezioni |
| `marginXL`+ | 32px+ | separazioni ampie tra blocchi |

- `controlHeight` (32px) è l'altezza standard dei controlli form (`size` default `middle`);
  `controlHeightLG` (40px) solo se **tutto** il form è `large` — mai un controllo isolato più
  alto degli altri (`components/form-patterns.md` §6).
- `borderRadius` (6px) per controlli, `borderRadiusLG` (8px) per card/box/Alert — non introdurre
  un terzo valore intermedio senza motivo.

### 6.2 Stati interattivi (hover / focus / disabled / dimmed)

- **Attivo/selezionato**: sempre il primary `#3E00FB` (o la sua bg chiara `#F0EAFF`) — mai un
  colore diverso per "selezionato" da un modulo all'altro.
- **Hover su chip/filtro**: bordo che scurisce (`#b0b0b0`) + testo pieno, senza cambiare sfondo
  (riferimento: `.filter-chip:hover` in `prototype/_shared/filter-drawer.js`).
- **Disabilitato con motivo**: se il perché non è ovvio dal contesto, il motivo va in un
  **tooltip in hover** — mai un'etichetta statica accanto al controllo, mai lasciare l'utente a
  indovinare. Pattern: `components/form-patterns.md` §4 (opzioni Select) e
  `components/filter-drawer.md` (sezioni disabilitate).
- **Dimmed**: quando un elemento ha il focus (es. marker mappa), gli altri passano a
  `opacity: 0.2` invece di sparire — si mantiene il contesto spaziale
  (`components/map-interactions.md`).

### 6.3 Colore come informazione di stato

Il colore non è mai l'unico canale di uno stato: sempre accompagnato da testo, numero o icona.
Palette di stato in uso — riusarle, non inventarne di nuove per lo stesso significato (per i
colori strutturali/di chrome dell'interfaccia vedi invece §4):

| Stato | Colore | Dove |
|-------|--------|------|
| Disponibile / Available | `#52C41A` | Planning — stato spazi |
| In Opzione / In Option | `#EB2F96` | Planning — stato spazi |
| Riservato / Reserved | `#1677FF` | Planning — stato spazi |
| Attivo | `#1677FF` (blue-6) | Inventory — stato amministrativo |
| In Manutenzione | `#FA8C16` (orange-6) | Inventory — stato amministrativo |
| Inizializzato | `#FAAD14` (gold-6) | Inventory — stato amministrativo |
| Rimosso | `rgba(0,0,0,0.45)` | Inventory — stato amministrativo |
| Canale OOH / DOOH | `#52C41A` / `#EB2F96` | chip e filtri (in tabella anche outline `#3E00FB` / `#FF4A1C`, vedi §4) |

### 6.4 Accessibilità e contrasto

- **Testo su superfici colorate**: contrasto ≥ 3:1 per testo bold (limite accettato), ≥ 4.5:1
  (AA) dove possibile. La scala dei cluster mappa è già tarata e verificata WCAG
  (`components/map-interactions.md` — sezione scala cromatica cluster): non usare tinte più
  chiare di `#A47CFF`, diventano illeggibili anche contro la mappa chiara.
- Le palette sono tarate su **superficie chiara** (`#F5F5F5`/`#fff`): se si introduce una
  superficie scura, i contrasti vanno rivalutati, non riusati alla cieca.

### 6.5 Icone

- Libreria unica: **Ant Design Icons** (`window.icons`). Dove il dato di dominio ha casing
  incoerente tra prototipi (es. "Palo Luce"/"Palo luce"), lookup **case-insensitive** — pattern:
  `TYPE_ICON_NAMES` in `prototype/_shared/filter-drawer.js`.
- Gli **asset custom** delle tipologie impianto (`window.GravityMap.systypeIconSrc`) sono il
  glifo UI (tabella, card, chip filtri, tag) e sono **indipendenti dai marker mappa** (asset
  folder separata) — se il tipo non ha un'icona custom, fallback sull'icona Ant Design
  equivalente (`components/map-interactions.md`).
- **Icone a significato riservato — non riusarle per altro:**
  - `BulbOutlined` / `BulbFilled` = faccia impianto illuminata/retroilluminata (dominio);
  - `CoffeeOutlined` **rossa** (`#FF4A1C`) = nota di design negli handoff, marker inline
    contestuale con popover "Nota di design" (`components/handoff-engine.md`).

---

## 7. Struttura cartelle per i prototipi HTML

Naming completo in `CLAUDE.md` ("Naming cartelle prototipi"): kebab-case, inglese, senza numeri
progressivi né spazi, doppio trattino per le varianti.

```
prototype/
  <modulo>-list/              ← lista + tabella (es. grants-list)
  <modulo>-list--<variante>/  ← variante (es. planning--mobile)
  <modulo>-detail/            ← dettaglio entità
  <modulo>-detail-edit/       ← dettaglio + modifica
```

Ogni prototipo simula **una singola schermata** (uno stato della US), non l'intero flusso.

---

## 8. Come costruire un prototipo — checklist

1. **Identifica il pattern** dalla sezione 3 (List, Drawer, Detail, ecc.)
2. **Costruisci l'App Shell** con Navbar orizzontale + Content (`<Layout>` Ant Design, mai Sidebar
   — vedi §2.2)
3. **Usa le dimensioni corrette** (il canvas deve essere 1728px wide come viewport, §1)
4. **Segui il naming** delle cartelle (§7)
5. **Quando il prototipo è validato**, passa alla trasposizione Figma → **Parte 2**

---

# PARTE 2 — Trasposizione Figma (dopo il prototipo)

> Questa parte si applica **dopo** aver costruito e verificato il prototipo in Parte 1. Non contiene
> regole nuove: mappa le stesse regole universali sui file/frame/componenti della libreria Figma
> **Ant Design System for Gravity**.

## 9. Struttura dei file Figma

### Organizzazione delle pagine

Ogni pagina Figma corrisponde a un **modulo funzionale** della piattaforma.
Il nome della pagina segue il pattern: `⭐️ (A) NomeModuloA / (B) NomeModuloB`

Esempio: `⭐️ (A) Grants / (B) Authorizations`

### Struttura gerarchica dentro ogni pagina

```
PAGE  →  Modulo
  SECTION  →  Sub-modulo (es. "A - Grants")
    SECTION  →  User Story (es. "US#A1")
      frame  →  "US + User"     ← descrizione US + ruolo utente
      symbol / frame  →  Schermata 1 (stato base)
      frame  →  Schermata 2 (stato variante)
      frame  →  Schermata 3 (stato finale)
      instance  →  Arrow        ← freccia di flusso tra schermate
      instance  →  Post-it      ← nota di design
      instance  →  Manina       ← puntatore su elemento interattivo
```

### Layer type convention

| Tipo layer Figma | Significato |
|-----------------|-------------|
| `symbol`        | Schermata **base/riferimento** (stato iniziale della US) |
| `frame`         | Variante costruita sopra la base (mostra la UI dopo un'azione) |
| `instance`      | Istanza di componente della libreria (Arrow, Post-it, Manina, ecc.) |
| `section`       | Raggruppamento logico (US, sub-modulo, pagina) |

### Flusso di lettura

Le schermate dentro ogni US si leggono **da sinistra a destra** seguendo le frecce (Arrow).
Ogni schermata mostra lo stato della UI dopo un'interazione utente.

### Il frame "US + User"

Contiene sempre:
- **Label** (striscia verticale teal con il numero US, es. "A1")
- **Testo US** — storia utente in italiano nel formato:
  `"TITOLO MAIUSCOLO\nCome [ruolo], voglio [azione], così da [valore]."`
- **User** — nome ruolo + Avatar Gravity in basso a sinistra

---

## 10. Naming convention delle schermate (frame Figma)

Il nome del frame segue una **gerarchia a slash** che descrive lo stato della UI:

```
[Modulo] [Tipo vista]
[Modulo] [Tipo vista]/[Azione attiva]
[Modulo] [Tipo vista]/[Azione attiva]/[Stato specifico]
[Modulo] [Tipo vista]/[Feedback]
```

### Esempi reali

| Nome frame | Significato |
|-----------|-------------|
| `Grants List` | Lista concessioni — stato neutro |
| `Grants List/New Grant` | Lista + form di creazione aperto |
| `Grants List/New Grant/DocumentTypeActive` | Lista + form + dropdown tipo documento aperto |
| `Grants List/New Grant/ReminderActive` | Lista + form + sezione reminder espansa |
| `Grants List/New Grant/AddNumber` | Lista + form + aggiunta numero utenza |
| `Grants List/New Grant/NoAccountNumbers` | Lista + form senza numeri utenza |
| `Grants List/Toast Message` | Lista dopo azione completata (toast visibile) |
| `Grants List/LeftFixedActions` | Lista con colonne fisse visibili a destra |
| `Grant Detail` | Schermata dettaglio concessione |
| `Grant Detail/EditHover` | Dettaglio + hover su pulsante Edit |
| `Grant Detail/ Edit Grant` | Dettaglio + form modifica aperto |
| `Grant Detail/ Edit Grant Changes` | Dettaglio + form con modifiche pending |
| `Grant Detail/ Connect Systems` | Dettaglio + pannello collegamento sistemi |
| `Grant Detail/ Connect Systems Selected` | Come sopra + selezioni attive |
| `Grant Detail/Message` | Dettaglio dopo azione (toast visibile) |
| `Autorizations List/LeftFixedActions` | Analogo per le autorizzazioni |

### Regola generale
- **Primo segmento** = nome della schermata base (es. `Grants List`, `Grant Detail`)
- **Segmenti successivi** = stato/azione attiva nella UI
- **`/Toast Message`** o **`/Message`** = sempre l'ultimo step di una US

---

## 11. Mappa pattern → frame Figma

Corrispondenza tra i pattern di layout della Parte 1 (§3) e il nome del frame Figma da cercare/creare:

| Pattern (Parte 1) | Frame Figma |
|--------------------|-------------|
| §3.1 List View | `[Modulo] List` |
| §3.2 List + Right Drawer | `[Modulo] List/[ActionName]` |
| §3.3 List + Left Fixed Panel | `[Modulo] List/LeftFixedActions` |
| §3.4 Detail View | `[Entity] Detail` |
| §3.5 Detail + Edit Form | `[Entity] Detail / Edit [Entity]` |
| §3.6 Detail + Connect Systems | `[Entity] Detail / Connect Systems` |
| §3.7 Public/Guest View | `[Modulo]: [Screen]` — frame a parte, fuori dallo schema App Shell |
| §3.8 Modal Wizard | `[Modulo]/Wizard/[Nome]` (un frame per step) |

---

## 12. Componenti custom Gravity (non Ant Design standard)

Questi componenti sono disegnati da Gloria e presenti nella libreria Figma Gravity:

| Nome componente | Descrizione | Dove appare |
|----------------|-------------|-------------|
| `Avatar Gravity` | Avatar personalizzato del profilo utente | Top bar (destra), US frame |
| `Label` | Striscia verticale teal con numero US | Solo nei frame UX flow (non nella UI finale) |
| `Post-it` | Nota gialla di annotazione | Solo nei frame UX flow |
| `Arrow` | Freccia di flusso tra schermate | Solo nei frame UX flow |
| `Manina` | Icona mano puntatore | Solo nei frame UX flow |
| `Filter Dropdown` | Dropdown filtro colonna tabella | Tables |
| `Search Dropdown` | Input ricerca inline colonna | Tables |
| `multi-select icon` | Icona selezione multipla | Tables |
| `Issuing Authority` | Pannello autorità emittente | Side panels |
| `Table/Grants` | Variante tabella specifica Grants | Module Grants |
| `Table/Authorizations` | Variante tabella specifica Auth | Module Authorizations |

> **Nota:** I componenti custom elencati sopra sono da **ignorare nei prototipi HTML** — usa i componenti Ant Design standard (Parte 1). Usali solo quando trasferisci su Figma.

---

## 13. Mappa tipografia → token Figma

Corrispondenza tra le righe della tabella tipografia (Parte 1, §5) e il token/variabile Figma:

| Elemento | Token Figma |
|---------|-------------|
| Page title | `Heading/2` (`fontSizeHeading2`) |
| Section title | `fontSizeXL` |
| Table header cell | `Base/Normal` |
| Table cell | `Base/Normal` |
| KPI valore | `Heading/3` |
| KPI label | `Base/Normal` |
| Metadata bar | `Base/Normal` |
| Breadcrumb | `Base/Normal` |
| Form label | `Base/Normal` |

---

## 14. Componente Navbar → Figma

- **Componente libreria:** `* Navbar *` — pagina "Navbar [CUSTOM]" nella libreria **Ant Design System for Gravity**
- **Figma DS:** https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity?node-id=48-1331
- **Component key (set):** `7d9a0ca68bfd3d9417be55173f174c6e396934b1`

> Regole di comportamento e HTML del componente → Parte 1, §2 e **`components/navbar.md`**.

---

## 15. Modulo Commercial — Strategy Configurator

> Sezione spostata in **`docs/modules/commercial.md`** (2026-07-02): spec vista-per-vista del modulo
> Commercial (Negotiations, Wizard Strategy, Quote Editor, viste Sales/Guest, OTP, email).
> La numerazione 11.x è conservata nel nuovo file (numero storico, riferito alla vecchia posizione
> in questo documento).
