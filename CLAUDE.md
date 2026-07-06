# Gravity Platform — Guida Prototipi

Repo di **prototipi UI** per Gravity (SaaS OOH/DOOH): HTML5 + React 18 + Ant Design 5 via CDN,
nessun build tool. Due designer (Gloria, Elena); i prototipi validati si traspongono su Figma.
Globals esposti nei prototipi: `antd`, `React`, `ReactDOM`, `icons`.

## Regole non negoziabili

- **Mai lavorare su `main`.** Branch `nome/prototipo` (es. `gloria/planning`), merge solo via PR
  con review dell'altra designer → comandi completi in `docs/git-workflow.md`.
- **Nuovo prototipo: parti SEMPRE da `prototype/_shared/_template.html`** — contiene già CDN
  (React, antd, dayjs, icons), `tokens.js` e reset CSS. Non ricopiare mai il blocco CDN a mano.
- **Tema solo da `prototype/_shared/tokens.js`** (`window.applyGravityTokens()` + `window.GRAVITY_THEME`
  nel ConfigProvider, CSS variables `--gravity-*`). Mai valori hardcoded, mai ridefinire il tema
  inline, mai sovrascrivere `fontFamily`.
- **Tipografia UI: esclusivamente quella di Ant Design (SF Pro Text).** Oswald e Inter sono font
  del brand/comunicazione — mai nell'interfaccia. In React usare `Typography.Title`/`Text`.
- **Prima di costruire un elemento UI**: consulta il suo file in `components/` e riusa i
  componenti JS condivisi in `prototype/_shared/` (`navbar.js`, `registry.js`, `filter-drawer.js`,
  `map-popover.js`, `map-interactions.js`, `handoff.js`) — non ricostruirli per-prototipo.
- **Un prototipo = una cartella sotto `prototype/`, per sempre.** Lo stato
  (approved / in-progress) è un metadato in **`prototype/_shared/registry.js`**, mostrato dal chip in
  navbar: si cambia lì, **mai spostando la cartella** — gli URL dei prototipi non devono cambiare.
  Ogni nuovo prototipo va registrato in `registry.js`.
- **Naming cartelle prototipi**: kebab-case, inglese, senza numeri progressivi né spazi; variante
  con doppio trattino (`planning--mobile`). Un prototipo = una cartella = un `index.html`.
- **Contenuto ammesso in una cartella prototipo** (tutto il resto non ci va):
  `index.html` (unica pagina servita) · `index--handoff.html` + `handoff-steps.js` (handoff) ·
  `assets/` (asset SOLO di quel prototipo) · note di lavoro `MAIUSCOLO.md`. Mai screenshot/PDF di
  riferimento sciolti, mai `src/`, mai config di build (residui import Figma Make inclusi).
- **Light mode** di default, salvo brief diverso.
- **Componenti Figma custom** di Gloria nella libreria: ignorarli nei prototipi HTML (solo Ant
  Design standard); si usano solo in fase di trasposizione Figma.

## Brand essenziale

| Token | Valore |
|-------|--------|
| Primary | `#3E00FB` |
| Secondary / accento | `#FF4A1C` |
| BG light / dark | `#F5F5F5` / `#0A0A0A` |
| Testo primario / secondario | `rgba(0,0,0,0.88)` / `rgba(0,0,0,0.45)` |
| Font UI | SF Pro Text (`-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`, nessun import) |
| Logo in navbar | solo `brand/Gravity_type.svg` (mai il mark da solo o entrambi) — dai prototipi: `../../brand/Gravity_type.svg` |

## Struttura repo

```
prototype/
  _shared/                           tutto ciò che NON è un prototipo:
    _template.html · tokens.js        punto di partenza + tema
    registry.js                       stato e link di ogni prototipo (fonte di verità)
    navbar.js · filter-drawer.js ·    componenti JS condivisi
    map-popover.js · map-interactions.js · handoff.js
    assets/                           marker, icone tipologie, foto, geojson
  <nome-prototipo>/                  una cartella piatta per prototipo (planning, negotiations, …)
components/          specifiche .md dei componenti (fonte di verità HTML + Figma)
docs/                guide di processo, standard, spec di modulo, materiale di prodotto/ricerca
website/             sito vetrina Gravity (fuori dal sistema prototipi: copy in contenuti.md)
LAYOUT.md            pattern di layout globali e struttura file Figma
brand/               SVG logo (mark + type) + manuale/concept (Gravity_Brand_Concept.md)
```

## Agganci @ — zone di navigazione libera

Punti d'aggancio dalla root verso cartelle/file utili: servono quando Claude viene lanciato **in
profondità dentro un singolo prototipo** e questo CLAUDE.md padre fa da hub. Non sono import inline
(le cartelle non si espandono in contesto): marcano le zone in cui l'agente **può esplorare da solo**
(grep/read, senza chiedere) e il caso che lo autorizza. Fuori da questi casi, chiedi prima.

| Aggancio | L'agente è libero di navigare quando… |
|----------|----------------------------------------|
| @prototype/ | serve capire come un altro prototipo ha già risolto lo stesso pattern (riuso, coerenza cross-prototipo) prima di inventarne uno nuovo |
| @prototype/<nome-prototipo>/ | è la cartella su cui si sta intervenendo: libertà piena su `index.html`, note `*.md`, `handoff-steps.js` di **quel** prototipo |
| @prototype/_shared/ (navbar.js · filter-drawer.js · map-popover.js · map-interactions.js · handoff.js · registry.js · tokens.js) | si costruisce/modifica un elemento UI condiviso: leggi il sorgente JS per usarne l'API reale invece di ricostruirlo (accoppia sempre col relativo `components/*.md`) |
| @prototype/_shared/assets/ | un prototipo deve puntare a marker, `systemstype-icons`, `system-photos` o geojson (`palermo-zones.geojson`): sfoglia per trovare il file esatto e il path |
| @components/ | prima di costruire **qualsiasi** elemento UI o in fase di trasposizione Figma: leggi la spec del componente (fonte di verità HTML+Figma) e la mappa props→varianti |
| @docs/ | serve contesto di processo, standard UI/UX, spec di modulo, o materiale di prodotto/ricerca — naviga la sottocartella pertinente (`modules/`, `product/`, `research/`) |
| @LAYOUT.md | prima di impostare struttura schermata, app shell, grid/spacing o naming file Figma |
| @brand/ | serve il logo (`Gravity_type.svg`) o una regola di brand — mai hardcodare valori: verifica qui |

## Mappa dei documenti — cosa leggere e quando

| Serve per | File | Quando leggerlo |
|-----------|------|-----------------|
| Layout schermate, struttura file Figma, naming, app shell, pattern List/Drawer/Detail | `LAYOUT.md` | prima di disegnare/trasporre una nuova schermata |
| Spec del modulo Commercial (Negotiations, Wizard, Quote…) | `docs/modules/commercial.md` | lavorando su quel modulo |
| Mappatura props React → varianti Figma (tutti i componenti AntD) | `components/react-figma-map.md` | in fase di trasposizione su Figma |
| Form in Modal/Drawer (spacing, facoltativi, dati ereditati, Alert…) | `components/form-patterns.md` | ogni nuovo form in Modal o Drawer |
| Navbar condivisa (`GravityNavbar`, sezioni × ruolo) | `components/navbar.md` | ogni prototipo con navbar |
| Drawer filtri avanzati (`GravityFilterDrawer`) | `components/filter-drawer.md` | moduli con filtri |
| Popover su marker mappa (`GravityMapPopover`) | `components/map-popover.md` | prototipi con mappa |
| Componente mappa condiviso: stati marker/cluster, cluster logic, icone tipologia (`GravityMap`) | `components/map-interactions.md` | prototipi con mappa |
| Motore handoff interattivo (dev bar, tour, note, versioni) | `components/handoff-engine.md` | preparando un handoff |
| Standard UI/UX trasversali (spacing, stati, colore-stato, accessibilità, icone) | `LAYOUT.md` §6 | dubbi di stile non coperti da un componente |
| Git workflow completo (comandi, PR, rebase) | `docs/git-workflow.md` | operazioni git non quotidiane |
| PRD | `docs/product/PRD_Gravity_Platform_CodeSour.md` | domande di prodotto/requisiti |
| Matrice ruoli/permessi per modulo (Inventory, Commercial/Campaign/Planning, Users/Tenant) | `docs/product/role-matrix.md` | progettando permessi o ruoli di un modulo |
| Ricerca utente (interviste) | `docs/research/` | domande sui bisogni utente |

## Workflow HTML → Figma

1. Costruisci il prototipo con i componenti React reali di Ant Design; 2. verifica nel browser;
3. trasponi con la libreria **Ant Design System for Gravity**
   (`https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity`)
   usando `components/react-figma-map.md` per le varianti e la skill `/gravity-tokens` per i token.

## Documentazione viva

Se durante una sessione emerge un pattern, una decisione o una **divergenza doc↔codice** non
coperta dalla documentazione:

1. Segnalalo esplicitamente ("Pattern non documentato: X — lo aggiungo a `<file>`?") invece di
   replicarlo in silenzio.
2. Aggiorna solo dopo conferma, nel file on-demand pertinente (usa la Mappa dei documenti) — mai
   in questo file, salvo nuova regola non negoziabile approvata.
3. Chi modifica un componente JS condiviso in `prototype/` aggiorna il suo `components/*.md`
   nello stesso commit.
4. `AGENTS.md` è un symlink a questo file (stesso contenuto per ogni tool): non ricrearlo come
   file separato, non aggiungergli contenuto proprio.
