# Gravity — Layout & Struttura File Figma

> Documentazione estratta direttamente dai file Figma di Gravity.
> Leggi questo file insieme a CLAUDE.md prima di costruire qualsiasi prototipo.

---

## 1. Struttura dei file Figma

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

## 2. Naming convention delle schermate

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

## 3. Dimensioni delle schermate

| Tipo schermata | Larghezza | Altezza | Note |
|---------------|-----------|---------|------|
| List view | 1728px | 1117px | Viewport desktop standard |
| Detail view | 1748px | 1117px | Leggermente più larga (pannello laterale) |
| Detail con panel | 1748px | 1168px | Include spazio extra per panel aperto |
| Form panel (drawer) | ~480px | full height | Sempre a destra, overlay sulla lista |

---

## 4. App Shell — Layout principale

> **IMPORTANTE:** Gravity ha **solo una Navbar orizzontale**. Non esiste sidebar verticale.
> Il componente da usare è `* Navbar *` dalla libreria **Ant Design System for Gravity**
> (pagina "Navbar [CUSTOM]", file `uR6CBOh0Y7dUQvH30SyD0P`).

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

### Navbar (`* Navbar *`)
- **Componente libreria:** `* Navbar *` — pagina "Navbar [CUSTOM]" nella libreria Gravity
- **Figma DS:** https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity?node-id=48-1331
- **Component key (set):** `7d9a0ca68bfd3d9417be55173f174c6e396934b1`
- **Altezza:** 73px
- **Larghezza:** FILL (si estende a tutta la larghezza del frame)
- **Sinistra:** Logo Gravity (solo logotipo tipografico) + voci di navigazione con dropdown
- **Destra:** icona campanella (24px) + avatar utente (32px, circolare)
- **Varianti per ruolo:** Super Admin, Systems Admin, Sales Leader, Planner, Data Analyst, Creative, Advertiser, Commercial, Publisher
- **Non usare** frame custom al posto di questo componente

> Per misure esatte, pattern HTML completo e istruzioni di trasposizione Figma → **`components/navbar.md`**

### Main Content Area
- **Larghezza:** full width (non c'è sidebar — occupa tutto lo spazio sotto la Navbar)
- **Padding:** 24px (horizontal e vertical)
- **Sfondo:** `colorBgLayout` (#F5F5F5)

---

## 5. Pattern di layout — viste disponibili

### 5.1 List View (vista lista)

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

**Figma:** schermata `[Modulo] List`

---

### 5.2 List + Right Drawer (lista + form laterale)

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

**Figma:** schermata `[Modulo] List/[ActionName]`

---

### 5.3 List + Left Fixed Panel (filtri/dettaglio laterale sinistro)

Variante della lista dove il pannello sinistro mostra un'entità secondaria (es. "Issuing Authority") mentre la tabella scrolla a destra.

**Figma:** schermata `[Modulo] List/LeftFixedActions`

---

### 5.4 Detail View (vista dettaglio)

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

**Figma:** schermata `[Entity] Detail`

---

### 5.5 Detail + Edit Form (dettaglio con modifica inline)

Il dettaglio rimane visibile, un drawer laterale destro o un overlay mostra il form di modifica.

**Figma:** schermata `[Entity] Detail / Edit [Entity]`

---

### 5.6 Detail + Connect Systems (collegamento entità)

Vista per associare sistemi/impianti a una concessione/autorizzazione. Mostra una lista selezionabile di sistemi con checkbox.

**Figma:** schermata `[Entity] Detail / Connect Systems`

---

## 6. Componenti custom Gravity (non Ant Design standard)

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

> **Nota:** I componenti custom elencati sopra sono da **ignorare nei prototipi HTML** — usa i componenti Ant Design standard. Usali solo quando trasferisci su Figma.

---

## 7. Colori nella UI (osservati dalle schermate)

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

## 8. Tipografia nelle schermate (osservata)

| Elemento | Font | Size | Weight | Figma token |
|---------|------|------|--------|-------------|
| Page title ("Licenses List") | SF Pro Text | 30px | 600 | `Heading/2` (`fontSizeHeading2`) |
| Section title ("Connected Systems") | SF Pro Text | 20px | 600 | `fontSizeXL` |
| Table header cell | SF Pro Text | 14px | 500 | `Base/Normal` |
| Table cell | SF Pro Text | 14px | 400 | `Base/Normal` |
| KPI valore ("5 years") | SF Pro Text | 24px | 600 | `Heading/3` |
| KPI label ("Duration") | SF Pro Text | 14px | 400 | `Base/Normal` |
| Metadata bar | SF Pro Text | 14px | 400 | `Base/Normal` |
| Breadcrumb | SF Pro Text | 14px | 400 | `Base/Normal` |
| Form label | SF Pro Text | 14px | 400 | `Base/Normal` |

---

## 9. Come usare questa documentazione nei prototipi

Quando costruisci un prototipo:

1. **Identifica il pattern** dalla sezione 5 (List, Drawer, Detail, ecc.)
2. **Costruisci l'App Shell** con Top Bar + Sidebar (`<Layout>` Ant Design)
3. **Usa le dimensioni corrette** (il canvas deve essere 1728px wide come viewport)
4. **Segui il naming** per dare nome ai file: `[modulo]-[tipo-vista]` (es. `02-grants-list`)
5. **Quando trasferisci su Figma**, usa il nome schermata della sezione 2 per trovare il frame corretto

---

## 10. Struttura consigliata per i prototipi HTML

```
prototipi/
  01-login-otp/         ← autenticazione
  02-[modulo]-list/     ← lista + tabella
  03-[modulo]-list-drawer/  ← lista + form laterale
  04-[modulo]-detail/   ← dettaglio entità
  05-[modulo]-detail-edit/  ← dettaglio + modifica
```

Ogni prototipo simula **una singola schermata** (uno stato della US), non l'intero flusso.

---
## 11. Modulo Commercial — Strategy Configurator

> Sezione spostata in **`docs/modules/commercial.md`** (2026-07-02): spec vista-per-vista del modulo
> Commercial (Negotiations, Wizard Strategy, Quote Editor, viste Sales/Guest, OTP, email).
> La numerazione 11.x è conservata nel nuovo file.
