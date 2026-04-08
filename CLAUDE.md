# Gravity Platform — Guida Prototipi

> Leggi questo file SEMPRE prima di iniziare a lavorare su un prototipo.
> Contiene tutto il necessario per costruire in HTML e trasferire su Figma.
>
> Leggi anche **LAYOUT.md** per capire i pattern di layout dell'app e la struttura dei file Figma.
>
> Per ogni elemento dell'interfaccia consulta la cartella **components/** che contiene le specifiche
> di implementazione HTML e Figma per ogni componente. I file in quella cartella sono fonte di verità:
> usali prima di iniziare a costruire un qualsiasi elemento UI e prima di trasferire su Figma.
>
> Componenti documentati finora:
> - **components/navbar.md** — Navbar (altezza, logo, menu, avatar, pattern HTML, componente Figma)

---

## Stack

- **HTML5** + **React 18** via CDN (no build tool)
- **Ant Design 5.x** via CDN
- **@ant-design/icons 5.x** via CDN
- Nessun Tailwind, nessun framework CSS aggiuntivo

### CDN da usare in ogni prototipo

```html
<!-- React 18 -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

<!-- Ant Design 5.x -->
<link rel="stylesheet" href="https://unpkg.com/antd@5/dist/reset.css" />
<script src="https://unpkg.com/dayjs@1/dayjs.min.js"></script>
<script src="https://unpkg.com/antd@5/dist/antd.min.js"></script>

<!-- Icons -->
<script src="https://unpkg.com/@ant-design/icons@5/dist/index.umd.js"></script>

<!-- Font UI: SF Pro Text è un font di sistema Apple, non richiede import.
     Oswald e Inter sono font del brand, NON vanno usati nell'interfaccia. -->
```

Globals esposti: `antd`, `React`, `ReactDOM`, `icons`

---

## Brand Gravity

### Colori

| Token | Valore | Uso |
|-------|--------|-----|
| Primary | `#3E00FB` | Azioni principali, link, focus |
| Secondary | `#FF4A1C` | Accento, alert, badge critici |
| BG dark | `#0A0A0A` | Sfondo dark mode |
| BG light | `#F5F5F5` | Sfondo light mode |
| Text primary | `rgba(0,0,0,0.88)` | Testo principale |
| Text secondary | `rgba(0,0,0,0.45)` | Testo secondario / placeholder |

### Tipografia

> **Regola:** nell'interfaccia si usa **esclusivamente la tipografia di Ant Design** (SF Pro Text, come definito nelle variabili del file "Ant Design System for Gravity").
> **Oswald e Inter sono i font del brand/materiali di comunicazione** — non vanno usati nell'interfaccia.

| Ruolo | Font | Uso |
|-------|------|-----|
| **Interfaccia (UI)** | SF Pro Text | Font del design system Ant Design for Gravity — tutti i testi UI |
| **Brand / Logo** | Oswald | Solo logotipo Gravity (SVG) — NON usare nell'interfaccia |
| **Brand / Comunicazione** | Inter | Materiali di brand, sito vetrina — NON usare nell'interfaccia |

SF Pro Text è un font di sistema Apple. Nei prototipi HTML non richiede import esterno:
usare il font stack `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`.

I token tipografici da usare sono quelli del design system (`tokens.js`):
`fontSizeHeading1`–`fontSizeHeading5`, `fontSize`, `fontSizeSM`, `fontSizeLG`, `fontSizeXL`.
In React usare sempre `<Typography.Title>` e `<Typography.Text>` — non sovrascrivere mai `fontFamily`.

### Logo

```
brand/Gravity_mark.svg   → monogramma (solo icona)
brand/Gravity_type.svg   → logotipo esteso
```

Percorso relativo dai prototipi in `prototipi/NN-nome/`: `../../brand/Gravity_type.svg`

> **Regola navbar:** nella navbar usa **solo il logotipo tipografico** (`Gravity_type.svg`).
> Non usare il mark da solo né entrambi insieme.
> Vedi `components/navbar.md` per il pattern completo.

---

## ConfigProvider — Tema Gravity

Il tema completo è definito in **`prototipi/tokens.js`** ed esposto come `window.GRAVITY_THEME`.
**Non ridefinire il tema inline nei prototipi** — usa sempre `window.GRAVITY_THEME` da tokens.js.

```js
// In ogni prototipo: chiama prima applyGravityTokens(), poi usa window.GRAVITY_THEME
window.applyGravityTokens();

// Nel render:
React.createElement(ConfigProvider, { theme: window.GRAVITY_THEME }, ...)
```

> `tokens.js` è la **fonte di verità unica** per colori, tipografia, spaziatura e border radius.
> Non sovrascrivere `fontFamily` nei componenti: il tema imposta già SF Pro Text.

---

## Struttura cartella prototipi

```
prototipi/
  _template.html         ← punto di partenza per ogni nuovo prototipo
  tokens.js              ← tema Gravity (unica fonte di verità)
  app/                   ← app shell / login / SSO
  planning/              ← modulo Planning
  feature-name/          ← un prototipo per modulo/feature
  feature-name--variant/ ← variante dello stesso modulo (doppio trattino)
```

### Regole di naming

| Regola | Esempio corretto | Esempio sbagliato |
|--------|-----------------|-------------------|
| Kebab-case, tutto minuscolo | `planning` | `Planning`, `PLANNING` |
| Inglese | `inventory` | `inventario` |
| Nessun numero progressivo | `planning` | `02-planning` |
| Parole separate da trattino singolo | `select-systems` | `selectSystems`, `select_systems` |
| Variante con doppio trattino | `planning--mobile` | `planning-mobile`, `planning_mobile` |
| Nessuno spazio | `sign-on` | `Single sign-on` |

Un prototipo = una cartella = un `index.html`. Se un modulo ha stati molto diversi (es. empty vs popolato) usa varianti `--` invece di mettere tutto in un unico file.

---

## Git workflow — regola obbligatoria

> **Non si lavora mai direttamente su `main`.**
> `main` è il branch stabile. Ogni designer lavora sul proprio branch e mergia solo quando il lavoro è pronto.

### Iniziare un nuovo prototipo

```bash
git checkout main
git pull origin main                      # parti sempre dall'ultimo main
git checkout -b nome/nome-prototipo       # crea il tuo branch
# es: git checkout -b gloria/planning
```

### Lavorare e salvare

```bash
git add .
git commit -m "descrizione del lavoro"
git push origin nome/nome-prototipo       # pusha il tuo branch, non main
```

### Quando il prototipo è pronto

1. Apri una **Pull Request** su GitHub: `nome/nome-prototipo` → `main`
2. L'altra designer fa una lettura veloce (review)
3. Si mergia su `main` — Vercel deploya automaticamente

### Ricevere le modifiche delle altre

```bash
git checkout main
git pull origin main                      # aggiorna il tuo main locale
git checkout nome/nome-prototipo
git rebase main                           # porta le novità nel tuo branch
```

### Naming dei branch

| Formato | Esempio |
|---------|---------|
| `nome/prototipo` | `gloria/planning` |
| `nome/prototipo` | `alice/campagne` |

Usa il tuo nome (o iniziali) come prefisso. Non lavorare sul branch di un'altra.

---

## Workflow: HTML → Figma

1. **Costruisci** il prototipo in HTML con i componenti React reali di Ant Design
2. **Verifica** visivamente nel browser
3. **Trasferisci** su Figma usando i componenti della libreria **Ant Design System for Gravity**
   - File Figma: `https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity`
   - Ogni componente React ha il suo corrispondente Figma (vedi mappa sotto)
   - Usa `use_figma` per piazzare i componenti sul canvas con le varianti corrette

---

## Mappa Componenti — React → Figma

### Regole generali per i nomi Figma
- I componenti nella libreria si chiamano `*NomeComponente*` (con asterischi)
- Le proprietà/varianti usano PascalCase: `Type`, `Size`, `State`, `Status`
- I valori delle varianti sono capitalizzati: `Primary`, `Default`, `Large`, `Disabled`

---

### GENERAL

#### Button — `<Button />`
Documentazione: https://ant.design/components/button

**Figma:** `*Button*`

| Prop React | Prop Figma | Valori Figma |
|-----------|-----------|-------------|
| `type="primary"` | `Type` | `Primary` |
| `type="default"` | `Type` | `Default` |
| `type="dashed"` | `Type` | `Dashed` |
| `type="text"` | `Type` | `Text` |
| `type="link"` | `Type` | `Link` |
| `size="large"` | `Size` | `Large` |
| `size="middle"` (default) | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| `disabled` | `State` | `Disabled` |
| `loading` | `State` | `Loading` |
| `:hover` | `State` | `Hover` |
| `:active` | `State` | `Active` |
| solo testo | `Content` | `Basic` |
| `icon={}` + testo | `Content` | `Icon` |
| solo `icon={}` | `Content` | `Icon Only` |
| `ghost` | `Ghost` | `True` |
| `danger` | `Danger` | `True` |
| `shape="circle"` | `Shape` | `Circle` |
| `shape="round"` | `Shape` | `Round` |
| default | `Shape` | `Default` |

```js
// React
<Button type="primary" size="large" icon={<ArrowRightOutlined />}>Conferma</Button>

// Figma: *Button* → Type=Primary, Size=Large, State=Default, Content=Icon, Ghost=False, Danger=False, Shape=Default
```

---

#### FloatButton — `<FloatButton />`
Documentazione: https://ant.design/components/float-button

**Figma:** `*FloatButton*`

| Prop React | Prop Figma | Valori Figma |
|-----------|-----------|-------------|
| `type="primary"` | `Type` | `Primary` |
| `type="default"` | `Type` | `Default` |
| `shape="circle"` | `Shape` | `Circle` |
| `shape="square"` | `Shape` | `Square` |

---

#### Icon — `<IconName />`
Documentazione: https://ant.design/components/icon

**Figma:** `Icon / NomeIcona`  (es. `Icon / ArrowRightOutlined`)

```js
// React
import { ArrowRightOutlined } from '@ant-design/icons';
// oppure via CDN: const { ArrowRightOutlined } = icons;

// Figma: Icon / ArrowRightOutlined
```

---

#### Typography — `<Typography.Title>`, `<Typography.Text>`, `<Typography.Paragraph>`
Documentazione: https://ant.design/components/typography

**Figma:** `*Title*`, `*Text*`, `*Paragraph*`

| Prop React | Prop Figma | Valori Figma |
|-----------|-----------|-------------|
| `level={1..5}` | `Level` | `1`..`5` |
| `type="secondary"` | `Type` | `Secondary` |
| `type="success"` | `Type` | `Success` |
| `type="warning"` | `Type` | `Warning` |
| `type="danger"` | `Type` | `Danger` |
| `disabled` | `State` | `Disabled` |
| `code` | `Code` | `True` |
| `underline` | `Underline` | `True` |
| `delete` | `Delete` | `True` |
| `strong` | `Strong` | `True` |

---

### LAYOUT

#### Divider — `<Divider />`
Documentazione: https://ant.design/components/divider

**Figma:** `*Divider Horizontal*`, `*Divider Vertical*`

| Prop React | Figma Component |
|-----------|----------------|
| `<Divider />` (orizzontale) | `*Divider Horizontal*` |
| `<Divider type="vertical" />` | `*Divider Vertical*` |
| `orientation="left"` | Prop `Orientation` = `Left` |
| `orientation="center"` | Prop `Orientation` = `Center` |
| `orientation="right"` | Prop `Orientation` = `Right` |
| con testo | `WithText` = `True` |

---

#### Space — `<Space />`
Documentazione: https://ant.design/components/space

**Figma:** Frame con Auto Layout (non è un componente Figma dedicato — usa Auto Layout con gap corrispondente)

---

### NAVIGATION

#### Breadcrumb — `<Breadcrumb />`
Documentazione: https://ant.design/components/breadcrumb

**Figma:** `*Breadcrumb*`

---

#### Dropdown — `<Dropdown />`
Documentazione: https://ant.design/components/dropdown

**Figma:** `*Dropdown*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `placement="bottomLeft"` | `Placement` | `BottomLeft` |
| `placement="bottomRight"` | `Placement` | `BottomRight` |

---

#### Menu — `<Menu />`
Documentazione: https://ant.design/components/menu

**Figma:** `*Menu*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `mode="horizontal"` | `Mode` | `Horizontal` |
| `mode="vertical"` | `Mode` | `Vertical` |
| `mode="inline"` | `Mode` | `Inline` |
| `theme="dark"` | `Theme` | `Dark` |
| `theme="light"` | `Theme` | `Light` |

---

#### Pagination — `<Pagination />`
Documentazione: https://ant.design/components/pagination

**Figma:** `*Pagination*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="small"` | `Size` | `Small` |
| default | `Size` | `Default` |
| `simple` | `Simple` | `True` |
| `showSizeChanger` | `SizeChanger` | `True` |

---

#### Steps — `<Steps />`
Documentazione: https://ant.design/components/steps

**Figma:** `*Steps*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `direction="horizontal"` | `Direction` | `Horizontal` |
| `direction="vertical"` | `Direction` | `Vertical` |
| `size="small"` | `Size` | `Small` |
| `type="navigation"` | `Type` | `Navigation` |
| `type="inline"` | `Type` | `Inline` |
| status del singolo step | `Status` | `Wait` / `Process` / `Finish` / `Error` |

---

### DATA ENTRY

#### Input — `<Input />`
Documentazione: https://ant.design/components/input

**Figma:** `*Input*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| default | `Status` | `Default` |
| `status="error"` | `Status` | `Error` |
| `status="warning"` | `Status` | `Warning` |
| `size="large"` | `Size` | `Large` |
| `size="middle"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| focus | `State` | `Focus` |
| `disabled` | `State` | `Disabled` |
| default | `State` | `Default` |
| `prefix={...}` | `Prefix` | `True` |
| `suffix={...}` | `Suffix` | `True` |
| `addonBefore` | `AddonBefore` | `True` |
| `addonAfter` | `AddonAfter` | `True` |
| `allowClear` | `AllowClear` | `True` |

**Varianti speciali:**
- `<Input.Password />` → `*Input*` con `Type=Password`
- `<Input.TextArea />` → `*TextArea*`
- `<Input.Search />` → `*Input*` con `Type=Search`

---

#### Select — `<Select />`
Documentazione: https://ant.design/components/select

**Figma:** `*Select*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="large"` | `Size` | `Large` |
| `size="middle"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| default | `State` | `Default` |
| `open` | `State` | `Open` |
| `disabled` | `State` | `Disabled` |
| valore selezionato | `State` | `Selected` |
| `mode="multiple"` | `Mode` | `Multiple` |
| `mode="tags"` | `Mode` | `Tags` |

---

#### Checkbox — `<Checkbox />`
Documentazione: https://ant.design/components/checkbox

**Figma:** `*Checkbox*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| unchecked | `State` | `Default` |
| `checked` | `State` | `Checked` |
| `indeterminate` | `State` | `Indeterminate` |
| `disabled` | `State` | `Disabled` |

---

#### Radio — `<Radio />`
Documentazione: https://ant.design/components/radio

**Figma:** `*Radio*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| unchecked | `State` | `Default` |
| `checked` | `State` | `Checked` |
| `disabled` | `State` | `Disabled` |

**Radio.Group con Button:**
- `<Radio.Group optionType="button" />` → `*Radio Button*`

---

#### Switch — `<Switch />`
Documentazione: https://ant.design/components/switch

**Figma:** `*Switch*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| off | `Checked` | `False` |
| `defaultChecked` / `checked` | `Checked` | `True` |
| `size="small"` | `Size` | `Small` |
| default | `Size` | `Default` |
| `disabled` | `State` | `Disabled` |
| `loading` | `State` | `Loading` |

---

#### DatePicker — `<DatePicker />`
Documentazione: https://ant.design/components/date-picker

**Figma:** `*DatePicker*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="large"` | `Size` | `Large` |
| `size="middle"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| `picker="week"` | `Picker` | `Week` |
| `picker="month"` | `Picker` | `Month` |
| `picker="quarter"` | `Picker` | `Quarter` |
| `picker="year"` | `Picker` | `Year` |
| `disabled` | `State` | `Disabled` |
| `status="error"` | `Status` | `Error` |

---

#### Form — `<Form />`
Documentazione: https://ant.design/components/form

**Figma:** `*Form Item*` (ogni campo individuale)

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `layout="horizontal"` | `Layout` | `Horizontal` |
| `layout="vertical"` | `Layout` | `Vertical` |
| `layout="inline"` | `Layout` | `Inline` |
| `validateStatus="error"` | `Status` | `Error` |
| `validateStatus="warning"` | `Status` | `Warning` |
| `validateStatus="success"` | `Status` | `Success` |
| `validateStatus="validating"` | `Status` | `Validating` |
| `required` | `Required` | `True` |
| `help="..."` | `Help` | `True` |

---

#### InputNumber — `<InputNumber />`
Documentazione: https://ant.design/components/input-number

**Figma:** `*InputNumber*`

---

#### Slider — `<Slider />`
Documentazione: https://ant.design/components/slider

**Figma:** `*Slider*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `range` | `Range` | `True` |
| `vertical` | `Direction` | `Vertical` |
| default | `Direction` | `Horizontal` |
| `disabled` | `State` | `Disabled` |
| `tooltipVisible` | `Tooltip` | `True` |

---

#### Upload — `<Upload />`
Documentazione: https://ant.design/components/upload

**Figma:** `*Upload*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `listType="text"` | `Type` | `Text` |
| `listType="picture"` | `Type` | `Picture` |
| `listType="picture-card"` | `Type` | `PictureCard` |
| `listType="picture-circle"` | `Type` | `PictureCircle` |
| Dragger | `Type` | `Dragger` |

---

### DATA DISPLAY

#### Avatar — `<Avatar />`
Documentazione: https://ant.design/components/avatar

**Figma:** `*Avatar*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="large"` | `Size` | `Large` |
| `size="default"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| `shape="circle"` | `Shape` | `Circle` |
| `shape="square"` | `Shape` | `Square` |
| immagine | `Type` | `Image` |
| icona | `Type` | `Icon` |
| testo | `Type` | `Text` |

---

#### Badge — `<Badge />`
Documentazione: https://ant.design/components/badge

**Figma:** `*Badge*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| numero | `Type` | `Count` |
| `dot` | `Type` | `Dot` |
| `status="success"` | `Status` | `Success` |
| `status="processing"` | `Status` | `Processing` |
| `status="default"` | `Status` | `Default` |
| `status="error"` | `Status` | `Error` |
| `status="warning"` | `Status` | `Warning` |

---

#### Card — `<Card />`
Documentazione: https://ant.design/components/card

**Figma:** `*Card*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| default | `Type` | `Default` |
| `hoverable` | `Hoverable` | `True` |
| con `cover` | `Cover` | `True` |
| con `actions` | `Actions` | `True` |
| `size="small"` | `Size` | `Small` |
| `bordered={false}` | `Bordered` | `False` |

---

#### Table — `<Table />`
Documentazione: https://ant.design/components/table

**Figma:** `*Table*`, `*Table Header Cell*`, `*Table Body Cell*`, `*Table Row*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="large"` | `Size` | `Large` |
| `size="middle"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |
| `bordered` | `Bordered` | `True` |
| row selezionata | `State` (su Row) | `Selected` |
| row hover | `State` (su Row) | `Hover` |
| colonna ordinabile | `Sorter` | `True` |
| colonna con filtro | `Filter` | `True` |

---

#### Tag — `<Tag />`
Documentazione: https://ant.design/components/tag

**Figma:** `*Tag*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `color="success"` | `Color` | `Success` |
| `color="processing"` | `Color` | `Processing` |
| `color="error"` | `Color` | `Error` |
| `color="warning"` | `Color` | `Warning` |
| `color="default"` | `Color` | `Default` |
| `closable` | `Closable` | `True` |
| `icon={...}` | `Icon` | `True` |

---

#### Tabs — `<Tabs />`
Documentazione: https://ant.design/components/tabs

**Figma:** `*Tabs*`, `*Tab Item*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `type="line"` | `Type` | `Line` |
| `type="card"` | `Type` | `Card` |
| `tabPosition="top"` | `Position` | `Top` |
| `tabPosition="left"` | `Position` | `Left` |
| `tabPosition="right"` | `Position` | `Right` |
| `tabPosition="bottom"` | `Position` | `Bottom` |
| `size="large"` | `Size` | `Large` |
| `size="small"` | `Size` | `Small` |

---

#### Tooltip — `<Tooltip />`
Documentazione: https://ant.design/components/tooltip

**Figma:** `*Tooltip*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `placement="top"` | `Placement` | `Top` |
| `placement="bottom"` | `Placement` | `Bottom` |
| `placement="left"` | `Placement` | `Left` |
| `placement="right"` | `Placement` | `Right` |
| (e tutte le diagonali) | `Placement` | `TopLeft`, `TopRight`, ecc. |

---

#### Popover — `<Popover />`
Documentazione: https://ant.design/components/popover

**Figma:** `*Popover*`

Stesse placement di Tooltip, in più:
- con titolo: `Title` = `True`
- con contenuto: `Content` = `True`

---

#### Collapse — `<Collapse />`
Documentazione: https://ant.design/components/collapse

**Figma:** `*Collapse*`, `*Collapse Panel*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| panel aperto | `State` (Panel) | `Expanded` |
| panel chiuso | `State` (Panel) | `Collapsed` |
| `ghost` | `Ghost` | `True` |
| `bordered={false}` | `Bordered` | `False` |

---

#### Segmented — `<Segmented />`
Documentazione: https://ant.design/components/segmented

**Figma:** `*Segmented*`

---

#### Statistic — `<Statistic />`
Documentazione: https://ant.design/components/statistic

**Figma:** `*Statistic*`

---

#### Timeline — `<Timeline />`
Documentazione: https://ant.design/components/timeline

**Figma:** `*Timeline*`, `*Timeline Item*`

---

#### Tree — `<Tree />`
Documentazione: https://ant.design/components/tree

**Figma:** `*Tree*`, `*Tree Node*`

---

#### List — `<List />`
Documentazione: https://ant.design/components/list

**Figma:** `*List*`, `*List Item*`

---

#### Descriptions — `<Descriptions />`
Documentazione: https://ant.design/components/descriptions

**Figma:** `*Descriptions*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `layout="horizontal"` | `Layout` | `Horizontal` |
| `layout="vertical"` | `Layout` | `Vertical` |
| `bordered` | `Bordered` | `True` |
| `size="small"` | `Size` | `Small` |
| `size="middle"` | `Size` | `Default` |

---

#### Empty — `<Empty />`
Documentazione: https://ant.design/components/empty

**Figma:** `*Empty*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `image={Empty.PRESENTED_IMAGE_SIMPLE}` | `Type` | `Simple` |
| default | `Type` | `Default` |

---

### FEEDBACK

#### Modal — `<Modal />`
Documentazione: https://ant.design/components/modal

**Figma:** `*Modal*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| default | `Type` | `Default` |
| `Modal.confirm()` | `Type` | `Confirm` |
| `Modal.info()` | `Type` | `Info` |
| `Modal.success()` | `Type` | `Success` |
| `Modal.error()` | `Type` | `Error` |
| `Modal.warning()` | `Type` | `Warning` |
| `centered` | `Centered` | `True` |
| con footer custom | `Footer` | `Custom` |
| `footer={null}` | `Footer` | `None` |

---

#### Drawer — `<Drawer />`
Documentazione: https://ant.design/components/drawer

**Figma:** `*Drawer*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `placement="right"` | `Placement` | `Right` |
| `placement="left"` | `Placement` | `Left` |
| `placement="top"` | `Placement` | `Top` |
| `placement="bottom"` | `Placement` | `Bottom` |
| `size="large"` | `Size` | `Large` |
| default | `Size` | `Default` |

---

#### Alert — `<Alert />`
Documentazione: https://ant.design/components/alert

**Figma:** `*Alert*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `type="success"` | `Type` | `Success` |
| `type="info"` | `Type` | `Info` |
| `type="warning"` | `Type` | `Warning` |
| `type="error"` | `Type` | `Error` |
| `showIcon` | `ShowIcon` | `True` |
| `closable` | `Closable` | `True` |
| `description="..."` | `Description` | `True` |
| `banner` | `Banner` | `True` |

---

#### Message — `message.success()` ecc.
Documentazione: https://ant.design/components/message

**Figma:** `*Message*`

| Tipo React | Prop Figma | Valori |
|-----------|-----------|--------|
| `message.success()` | `Type` | `Success` |
| `message.error()` | `Type` | `Error` |
| `message.warning()` | `Type` | `Warning` |
| `message.info()` | `Type` | `Info` |
| `message.loading()` | `Type` | `Loading` |

---

#### Notification — `notification.open()` ecc.
Documentazione: https://ant.design/components/notification

**Figma:** `*Notification*`

| Tipo React | Prop Figma | Valori |
|-----------|-----------|--------|
| `notification.success()` | `Type` | `Success` |
| `notification.error()` | `Type` | `Error` |
| `notification.warning()` | `Type` | `Warning` |
| `notification.info()` | `Type` | `Info` |
| con `placement` | `Placement` | `TopRight`, `TopLeft`, `BottomRight`, `BottomLeft` |

---

#### Progress — `<Progress />`
Documentazione: https://ant.design/components/progress

**Figma:** `*Progress*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `type="line"` | `Type` | `Line` |
| `type="circle"` | `Type` | `Circle` |
| `type="dashboard"` | `Type` | `Dashboard` |
| `size="small"` | `Size` | `Small` |
| `status="success"` | `Status` | `Success` |
| `status="exception"` | `Status` | `Exception` |
| `status="active"` | `Status` | `Active` |
| `status="normal"` | `Status` | `Normal` |
| `showInfo={false}` | `ShowInfo` | `False` |
| `strokeLinecap="butt"` | `StrokeLinecap` | `Butt` |

---

#### Spin — `<Spin />`
Documentazione: https://ant.design/components/spin

**Figma:** `*Spin*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `size="large"` | `Size` | `Large` |
| `size="default"` | `Size` | `Default` |
| `size="small"` | `Size` | `Small` |

---

#### Skeleton — `<Skeleton />`
Documentazione: https://ant.design/components/skeleton

**Figma:** `*Skeleton*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `avatar` | `Avatar` | `True` |
| `round` | `Round` | `True` |
| `active` | `Active` | `True` |
| `<Skeleton.Button />` | `Type` | `Button` |
| `<Skeleton.Avatar />` | `Type` | `Avatar` |
| `<Skeleton.Input />` | `Type` | `Input` |
| `<Skeleton.Image />` | `Type` | `Image` |

---

#### Result — `<Result />`
Documentazione: https://ant.design/components/result

**Figma:** `*Result*`

| Prop React | Prop Figma | Valori |
|-----------|-----------|--------|
| `status="success"` | `Status` | `Success` |
| `status="error"` | `Status` | `Error` |
| `status="info"` | `Status` | `Info` |
| `status="warning"` | `Status` | `Warning` |
| `status="404"` | `Status` | `404` |
| `status="403"` | `Status` | `403` |
| `status="500"` | `Status` | `500` |

---

#### Popconfirm — `<Popconfirm />`
Documentazione: https://ant.design/components/popconfirm

**Figma:** `*Popconfirm*`

Stesse placement di Tooltip.

---

### ALTRI COMPONENTI RILEVANTI PER GRAVITY

#### Table — priorità alta
Usato per: inventario spazi, lista campagne, ordini, contratti.
Figma: `*Table*` + `*Table Header Cell*` + `*Table Body Cell*`

#### Steps — priorità alta
Usato per: flusso creazione campagna, onboarding.
Figma: `*Steps*`

#### Tabs — priorità alta
Usato per: moduli con sezioni (Campagne, Inventario, Reporting).
Figma: `*Tabs*`

---

## Note importanti

- **Custom components Gravity:** la libreria Figma contiene anche componenti custom disegnati da Gloria. Per ora **ignorarli** — usare solo i componenti Ant Design standard.
- **Font in Figma:** la libreria usa SF Pro Text. Nei prototipi HTML usiamo Inter (sostituto valido per web).
- **Prototipi light mode** di default a meno che il brief non specifichi dark.
- **Prima di costruire su Figma**, controlla sempre il prototipo HTML nel browser per validare l'interazione.
