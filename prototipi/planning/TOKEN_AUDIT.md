# Token Audit — Planning Redesign

Analisi dell'utilizzo dei token e delle CSS variables del design system Gravity
nel prototipo `planning-redesign/index.html`.

Fonte di verità: `prototipi/tokens.js` (GRAVITY_THEME + GRAVITY_CSS_VARS).

---

## 1. CSS variables — stato di utilizzo

### Usate correttamente

Queste variabili sono definite in `tokens.js` e richiamate come `var(--gravity-*)` nel CSS del prototipo.

| Variabile | Valore | Dove |
|---|---|---|
| `--gravity-font-body` | SF Pro Text stack | `body`, `.ss-bar-trigger`, `.ss-tag-real-input` |
| `--gravity-bg` | `#F5F5F5` | `body`, `.app-main`, `.ss-content-nr`, `.ooh-workspace` |
| `--gravity-bg-container` — | — | Non usata come var (vedi sotto) |
| `--gravity-text` | `rgba(0,0,0,0.88)` | `body`, label, valori principali |
| `--gravity-text-secondary` | `rgba(0,0,0,0.65)` | icone, label secondarie, testo filtri |
| `--gravity-text-tertiary` | `rgba(0,0,0,0.45)` | label disabilitati, metadati |
| `--gravity-text-disabled` | `rgba(0,0,0,0.25)` | expand toggle, elementi non attivi |
| `--gravity-primary` | `#3E00FB` | link, accenti, bordi focus, bottoni primary |
| `--gravity-split` | `rgba(0,0,0,0.06)` | `.top-nav`, `.ss-brief-bar`, infobox |
| `--gravity-border` | `#D9D9D9` | `.filter-chip`, `.ss-search-pill`, tag input |
| `--gravity-border-secondary` | `#F0F0F0` | `.data-card`, `.system-card`, card generiche |

### Definite ma non usate come `var()` nel prototipo

Queste variabili esistono in `tokens.js` ma vengono ignorate: i valori equivalenti sono scritti hard-coded nel CSS.

| Variabile | Valore | Come appare nel prototipo |
|---|---|---|
| `--gravity-bg-container` | `#ffffff` | `#fff` / `#ffffff` hardcoded ovunque |
| `--gravity-primary-hover` | `#6B3FFF` | sostituito da `#3300d0` hardcoded (valore diverso) |
| `--gravity-primary-active` | `#2B00CC` | non usato |
| `--gravity-secondary` | `#FF4A1C` | non usato |
| `--gravity-shadow` | box-shadow leggera | non usata come var |
| `--gravity-shadow-md` | box-shadow media | non usata come var |
| `--gravity-radius` | `6px` | `border-radius: 6px` hardcoded |
| `--gravity-radius-lg` | `8px` | `border-radius: 8px` hardcoded |
| `--gravity-radius-sm` | `4px` | `border-radius: 4px` hardcoded |
| `--gravity-font-code` | JetBrains Mono stack | `'SF Mono','Fira Code',monospace` hardcoded — font diverso |
| `--gravity-fs-*`, `--gravity-space-*` | scale tipografica e spaziale | valori numerici hardcoded |

---

## 2. Valori hardcoded — inventario completo

### 2a. Colori

#### Colori Gravity usati ma non tokenizzati

| Valore | Contesto | Token più vicino | Gap |
|---|---|---|---|
| `#fff` / `#ffffff` | sfondi bianchi ovunque | `--gravity-bg-container` | usare la var |
| `rgba(62,0,251,0.04)` | hover riga tabella | nessuno | manca `--gravity-primary-bg` |
| `rgba(62,0,251,0.05)` | `.ss-face-row` selected | nessuno | manca `--gravity-primary-bg` |
| `rgba(62,0,251,0.06)` | `.ss-expand-btn:hover`, `.ss-label-btn:hover` | nessuno | manca `--gravity-primary-bg-hover` |
| `rgba(62,0,251,0.08)` | focus ring `.ss-search-pill`, `.ss-unified-bar` | nessuno | manca `--gravity-primary-focus-ring` |
| `rgba(62,0,251,0.15)` | bordo `.ss-focus-card` | nessuno | manca `--gravity-primary-border-soft` |
| `rgba(62,0,251,0.18)` | ombra `.ss-focus-card` | nessuno | manca ombra colorata |
| `#3300d0` | hover `.ss-bar-cerca` | `--gravity-primary-hover` (#6B3FFF) | **valore sbagliato** — non corrisponde al token |

#### Colori di sfondo tintati primary — tre varianti per lo stesso concetto

Tre sfumature di sfondo tintato primary, usate per stati selected/active/hover.
Non sono token — sono valori hard-coded inconsistenti tra loro.

| Valore | Usato in |
|---|---|
| `#F0EAFF` | `.ss-panel-tab.active`, `.filter-chip.selected`, `.ss-row-selected`, `.ss-radius-opt.active`, `.ss-poi-active-chip`, `.poi-cat-btn.active/.hover`, `.poi-single-chip.active/.hover`, `.ss-fullscreen-btn:hover` |
| `#F7F5FF` | `.ss-system-item.ss-item-selected`, `.ss-sys-head.ss-sys-selected`, `.ss-panel-toolbar`, `.sugg-item:hover` |
| `#F9F7FF` | `.ss-infobox-toggle:hover`, `.ss-poi-pending` |

→ Andrebbero uniformati in **un solo token** (`--gravity-primary-bg`, es. #F0EAFF).

#### Colori di sfondo neutri non tokenizzati

| Valore | Usato in | Nota |
|---|---|---|
| `#FAFAFA` | `.system-card-expanded`, `.ss-system-item:hover`, `.ss-panel-header`, `.ss-faces-body`, `.poi-cat-btn`, `.ss-sys-head:hover` | tra `--gravity-bg` (#F5F5F5) e white — nessun token |
| `#F2F2F2` | `.ss-system-item.ss-item-hovered` | vicino a `#FAFAFA` ma diverso |
| `#F3F3F3` | `.ss-sys-head.ss-sys-hovered` | altra variante dello stesso concetto |

→ Tre varianti quasi identiche per lo stesso stato hover neutro — da uniformare.

#### Colori di bordo non tokenizzati

| Valore | Usato in | Token più vicino |
|---|---|---|
| `#E8E8E8` | dropdown suggestions, `.ss-panel-toggle`, `.ss-pill-sep` | `--gravity-border` (#D9D9D9) — diverso |
| `#EBEBEB` | `.ss-bar-sep` | tra border e borderSecondary |
| `#E0E0E0` | `.ss-fullscreen-btn`, `.ss-unified-bar` | tra border e borderSecondary |
| `#b0b0b0` | `.filter-chip:hover:not(.selected)` | nessuno — grigio medio |
| `#C5B4FF` | `.poi-cat-btn:hover`, `.poi-single-chip:hover` | primary chiarito, nessun token |
| `#D3ADF7` | `.ss-poi-pending` | primary chiarito, nessun token |
| `#E4DCFF` | `.ss-panel-toolbar` | primary chiarito, nessun token |

#### Colori semantici custom — non nella palette Gravity

Usati per stati speciali del dominio OOH, non coperti da colorSuccess/Warning/Error.

| Valore | Contesto | Problema |
|---|---|---|
| `#c6a3ff` | `.mini-cal-cell.in-range` (sfondo cella calendario) | primary chiarito, nessun token |
| `#FA8C16` | partial selection badge, elemento illuminato | colorWarning è `#FAAD14` — valore diverso, usare il token |
| `#7C3AED` | Long Term badge (testo) | colore viola custom — nessun token Gravity |
| `#EDE9FE` | Long Term badge (sfondo) | colore viola custom — nessun token Gravity |
| `#059669` | prezzo con sconto (`.lt-discount`) | verde sconto — completamente diverso da colorSuccess `#52C41A` |
| `#DC2626` | over-budget (`.over-budget`) | rosso budget — diverso da colorError `#FF4A1C` |
| `#B45309` | LT incompatibile (testo) | amber — nessun token Gravity |
| `#FEF3C7` | LT incompatibile (sfondo) | amber chiaro — nessun token Gravity |

---

### 2b. Tipografia

#### Font size

I token definiscono: 12 (SM), 14 (base), 16 (LG), 20 (XL), 24 (H3), 30 (H2), 38 (H1).

| Valore nel prototipo | Frequenza | Token disponibile | Gap |
|---|---|---|---|
| `10px` | altissima — label uppercase, codici, micro-testo | nessuno | manca `--gravity-fs-xxs` |
| `11px` | altissima — metadati, label impianti, footer | nessuno | manca un token tra XS e SM |
| `12px` | alta | `--gravity-fs-xs` = 12px ✓ | usato correttamente come valore |
| `13px` | altissima — testo standard del prototipo | nessuno | **gap principale** — tra SM(12) e base(14) |
| `14px` | media | `--gravity-fs-sm` = 14px ✓ | ok |
| `15px` | bassa — valore DataCard in sidebar | nessuno | tra base(14) e LG(16) |
| `16px` | bassa | `--gravity-fs-md` = 16px ✓ | ok |
| `20px` | bassa — valore DataCard principale | `--gravity-fs-lg` = 20px ✓ | ok, ma non usa la var CSS |
| `30px` | una volta — contatore infobox | `--gravity-fs-h2` = 30px | ok come valore, non semanticamente (è un numero, non un heading) |

> **Nota critica:** 13px è la dimensione di testo più usata nel prototipo (testi di riga, indirizzi, suggerimenti, descrizioni). Non esiste un token per questa dimensione. Va deciso se aggiungere `--gravity-fs-body-sm: 13px` o se uniformare a 12px / 14px.

#### Font family

| Come appare nel prototipo | Corretto | Problema |
|---|---|---|
| `var(--gravity-font-body)` | ✓ | — |
| `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif` inline | ✗ | hardcoded in `.ss-bar-trigger`, `.ss-bar-cerca`, `.ss-tag-real-input`, `.poi-cat-btn` — usare `var(--gravity-font-body)` |
| `'SF Mono', 'Fira Code', monospace` | ✗ | font diverso da `--gravity-font-code` (`'JetBrains Mono', 'Courier New', monospace`) — il prototipo usa un font code non definito nel DS |

---

### 2c. Border radius

| Valore | Frequenza | Token disponibile | Stato |
|---|---|---|---|
| `4px` | alta | `--gravity-radius-sm` ✓ | valore corretto, non usa la var |
| `6px` | alta | `--gravity-radius` ✓ | valore corretto, non usa la var |
| `8px` | altissima | `--gravity-radius-lg` ✓ | valore corretto, non usa la var |
| `10px` | media — card floating, map controls, suggestions | nessuno | manca `--gravity-radius-xl` |
| `3px` | bassa — `.ss-label-chip` | nessuno | tra XS(2) e SM(4) |
| `2px` | bassa — accent bar | `borderRadiusXS` = 2 ✓ | ok |
| `20px` | bassa — `.poi-single-chip`, pill shapes | nessuno | stile pill, nessun token |
| `50%` | per dots e avatar | — | convenzionale per cerchi |

---

### 2d. Box shadow

I token definiscono tre ombre (`boxShadow`, `boxShadowSecondary`, `boxShadowTertiary`) e le rispettive CSS vars (`--gravity-shadow`, `--gravity-shadow-md`).

Nel prototipo **nessuna delle ombre è presa dai token**. Tutte sono valori custom:

| Valore | Usato in | Token più vicino |
|---|---|---|
| `0 4px 20px rgba(0,0,0,0.12)` | dropdown suggestions | `--gravity-shadow-md` (simile) |
| `0 6px 20px rgba(0,0,0,0.12)` | `.sugg-dropdown` | `--gravity-shadow-md` (simile) |
| `0 2px 10px rgba(0,0,0,0.12)` | `.ss-map-legend` | `--gravity-shadow` (simile) |
| `-2px 0 20px rgba(0,0,0,0.13)` | `.ss-panel` laterale | nessuno — ombra laterale |
| `-3px 0 8px rgba(0,0,0,0.08)` | `.ss-panel-toggle` | nessuno — ombra laterale |
| `0 8px 32px rgba(62,0,251,0.18), 0 2px 8px rgba(0,0,0,0.10)` | `.ss-focus-card` | nessuno — ombra colorata |
| `0 4px 16px rgba(0,0,0,0.13), 0 1px 4px var(--gravity-split)` | `.ss-radius-map-ctrl`, infobox | `--gravity-shadow-md` (parzialmente) |
| `0 1px 4px rgba(0,0,0,0.12), 0 0 0 0.5px var(--gravity-split)` | `.ss-pill-tab.active` | nessuno |

---

### 2e. Spaziatura

I token definiscono: 4 (XXS), 8 (XS), 12 (SM), 16 (MD), 20 (MD), 24 (LG), 32 (XL), 48 (XXL).

Tutti i valori di padding e gap nel prototipo sono hardcoded come numeri. I valori 8, 12, 16, 24 corrispondono ai token ma non usano le CSS vars (`--gravity-space-xs`, ecc.).

Valori non coperti dai token:
- `5px`, `6px`, `7px`, `9px`, `10px`, `14px` — usati nei padding interni di elementi custom

---

## 3. Gap nel sistema di token

Questa sezione documenta i token mancanti che il prototipo richiede sistematicamente.

### Da aggiungere ai token

| Nome proposto | Valore | Motivazione |
|---|---|---|
| `--gravity-primary-bg` | `#F0EAFF` | sfondo per stati selected/active con tinta primary — usato 15+ volte |
| `--gravity-primary-bg-hover` | `rgba(62,0,251,0.06)` | hover su elementi con tinta primary — usato 5+ volte |
| `--gravity-primary-focus-ring` | `rgba(62,0,251,0.08)` | focus ring per input/barre di ricerca — usato 3 volte |
| `--gravity-bg-subtle` | `#FAFAFA` | sfondo leggermente staccato da bianco (aree espanse, hover neutro) — usato 8+ volte |
| `--gravity-radius-xl` | `10px` | border-radius per card floating, map controls, overlay — usato 5 volte |
| `--gravity-fs-micro` | `10px` | label uppercase, codici impianto, metadati mappa |
| `--gravity-fs-caption` | `11px` | label impianti, metadati, footer calendari |
| `--gravity-fs-body-sm` | `13px` | testo di riga standard (il più usato nel prototipo) |
| `--gravity-fs-body-lg` | `15px` | valore DataCard nella sidebar |
| `--gravity-shadow-lateral` | `-2px 0 20px rgba(0,0,0,0.13)` | pannelli laterali sovrapposti alla mappa |

### Colori semantici del dominio da valutare

Non sono necessariamente token del design system, ma se devono apparire in Figma servono variabili.

| Concetto | Valore attuale | Decisione da prendere |
|---|---|---|
| Long Term badge | `#7C3AED` / `#EDE9FE` | Aggiungere colore purple? Usare `colorInfo`? |
| Prezzo con sconto | `#059669` | Sostituire con `colorSuccess` (#52C41A)? O token separato? |
| Over-budget | `#DC2626` | Sostituire con `colorError` (#FF4A1C)? O token separato? |
| Partial selection | `#FA8C16` | Sostituire con `colorWarning` (#FAAD14)? Sono vicini |
| POI pending / active | `#D3ADF7` / `#C5B4FF` | Derivati del primary — vanno come varianti di `--gravity-primary` |

---

## 4. Riepilogo

### Stato generale

| Categoria | Corretto | Hardcoded (valore giusto) | Hardcoded (problema) |
|---|---|---|---|
| CSS vars testo/bg | ✓ ben usate | — | `--gravity-bg-container` ignorata |
| CSS vars border | ✓ parzialmente | — | `--gravity-border` e split misti |
| Border radius | — | 4/6/8px ovunque | 10px, 3px non coperti |
| Font size | — | 12/14/16px | 10/11/13/15px non coperti |
| Font family | var usata in body | — | hardcoded in 4 elementi; font monospace diverso |
| Box shadow | — | — | tutte custom, nessuna usa i token |
| Colori primary alpha | — | — | 3 valori diversi per stesso concetto |
| Colori semantici custom | — | — | LT/sconto/over-budget non in palette |
| Spaziatura | — | 8/12/16/24px corretti | non usano le CSS vars `--gravity-space-*` |

### Priorità di intervento

**✅ Risolto** — inconsistenze corrette:
- Unificati i tre sfondi tintati primary (`#F0EAFF`, `#F7F5FF`, `#F9F7FF`) → `var(--gravity-primary-bg)` (21 occorrenze)
- Unificati i grigi hover neutri (`#FAFAFA`, `#F2F2F2`, `#F3F3F3`) → `var(--gravity-bg-subtle)` (12 occorrenze)
- Corretto il hover color di `.ss-bar-cerca` (`#3300d0` → `var(--gravity-primary-hover)`)
- Uniformato il font monospace a `var(--gravity-font-code)` (5 occorrenze; era `SF Mono / Fira Code`)
- Uniformato il body font a `var(--gravity-font-body)` anche nelle 5 occorrenze hardcoded nel CSS e JS
- Aggiunti `--gravity-primary-bg` e `--gravity-bg-subtle` a `tokens.js`

**✅ Risolto (media)** — gap di copertura risolti:
- Aggiunti token font size mancanti: `--gravity-fs-micro` (10px), `--gravity-fs-caption` (11px), `--gravity-fs-body-sm` (13px), `--gravity-fs-body-lg` (15px)
- Aggiunto `--gravity-radius-xl: 10px` — usato in 4 punti (card floating, map controls)
- Aggiunti colori semantici dominio OOH: `--gravity-domain-lt/lt-bg/lt-incomp/lt-incomp-bg`, `--gravity-domain-discount`, `--gravity-domain-overbudget`, `--gravity-domain-partial`
- Aggiunte `--gravity-primary-border: #C5B4FF` — unifica `#E4DCFF`, `#C5B4FF`, `#D3ADF7` (5 occorrenze)
- Sostituiti `border-radius: 4/6/8/10px` con i token CSS vars corrispondenti (30 occorrenze)

**✅ Risolto (bassa)** — pulizia completata:
- `background: #fff`/`#ffffff` → `var(--gravity-bg-container)` in 26 punti (CSS + inline React styles + ternaria toggle)
- Rimangono `#fff` solo dove corretto: `color:`, `fg:` dati avatar, `stroke:`/`fill:` SVG, knob toggle su sfondo primary, Google Maps styler

**✅ Risolto (spacing)** — tokenizzazione completata:
- `gap: 4px` → `var(--gravity-space-xxs)` (11 occorrenze)
- `gap: 8px` → `var(--gravity-space-xs)` (12 occorrenze)
- `gap: 12px` → `var(--gravity-space-sm)` (3 occorrenze)
- `gap: 24px` → `var(--gravity-space-lg)` (1 occorrenza)
- `padding: 4px;` → `var(--gravity-space-xxs)`
- `padding: 16px;` → `var(--gravity-space-md)`
- `padding: 24px;` → `var(--gravity-space-lg)`
- `padding: 32px 0` → `var(--gravity-space-xl) 0`
- `padding: 8px 12px` → `var(--gravity-space-xs) var(--gravity-space-sm)` (4 occorrenze)
- `padding: 8px 16px` → `var(--gravity-space-xs) var(--gravity-space-md)` (2 occorrenze)
- `padding: 12px 16px` → `var(--gravity-space-sm) var(--gravity-space-md)` (2 occorrenze)
- `padding: 8px 8px` → `var(--gravity-space-xs)` semplificato

**Invariati (fuori scala o compound non uniforme):**
- Valori 2, 3, 5, 6, 7, 9, 10, 14, 20px — usati in elementi grafici custom, non mappabili ai token
- Compound padding con almeno un valore fuori scala (es. `padding: 6px 12px`) — lasciati invariati
