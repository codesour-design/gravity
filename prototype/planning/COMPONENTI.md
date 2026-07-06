# Mappa componenti — Planning (prototipo approvato)

Analisi di tutti i componenti usati in `index.html`, organizzata per **granularità atomica**
(dal micro al macro: fondamenta → atomi → molecole → organismi → template/pagine).

Ogni componente è mappato sulla libreria **Ant Design System for Gravity** con le varianti
Figma corrispondenti (naming `*Componente*`, props PascalCase — vedi CLAUDE.md).
I componenti **CUSTOM** sono marcati come tali, con il template di composizione.

> Aggiornato a giugno 2026 — include: drawer crea/modifica, modale duplica, menu azioni
> (lista + dettaglio), gestione colonne, regole PLN/trattativa.

---

## 0 · Fondamenta

| Elemento | Fonte | Figma |
|---|---|---|
| Token tema (colori, spacing, radius, font) | `prototype/_shared/tokens.js` → `window.GRAVITY_THEME` | Variabili del file "Ant Design System for Gravity" |
| Tipografia UI | SF Pro Text via tema AntD (`Typography.*`) | `*Title*` / `*Text*` / `*Paragraph*` |
| Logo | `brand/Gravity_type.svg` (navbar) | Componente Logo Gravity (pagina Icon del DS) |
| Mappa | Google Maps JS API + marker clusterer | Frame statica con pin (nessun componente AntD) |

**Icone usate** (`@ant-design/icons` → Figma `Icon / NomeIcona`):
AimOutlined, ArrowLeftOutlined, BarChartOutlined, BellOutlined, BulbOutlined, CalendarOutlined,
CheckOutlined, CloseOutlined, CopyOutlined, DeleteOutlined, DownOutlined, EditOutlined,
EnvironmentOutlined, EuroOutlined, ExclamationCircleOutlined, ExportOutlined, EyeOutlined,
FullscreenOutlined/FullscreenExitOutlined, InboxOutlined, InfoCircleOutlined, LeftOutlined/RightOutlined,
LinkOutlined, MoreOutlined, PlusOutlined, PushpinOutlined, SaveOutlined, SearchOutlined, SendOutlined,
SettingOutlined, ShareAltOutlined, SlidersOutlined, SyncOutlined, TeamOutlined, UserAddOutlined,
UserOutlined (+ icone categoria POI: ShopOutlined, CoffeeOutlined, ReadOutlined, MedicineBoxOutlined, ecc.)

---

## 1 · Atomi — Ant Design standard

### Button — `*Button*`

| Variante Figma | Dove appare |
|---|---|
| Type=Primary, Content=Icon (PlusOutlined) | "Nuova Pianificazione" (header pagina lista) |
| Type=Primary, Content=Icon (SaveOutlined) | "Salva" (header drawer crea/modifica) |
| Type=Primary, Size=Small, Content=Icon (SendOutlined) | "Conferma consegna" (popover consegna, full-width) |
| Type=Primary, Size=Small | "Collega" (popover collega trattativa, lista e dettaglio), "Crea" (nuova etichetta) |
| Type=Primary | "Applica" (footer drawer filtri), "Riconsegna con le modifiche" (modale modifiche, con SendOutlined) |
| Type=Default, Size=Large | "Azioni" + DownOutlined (header dettaglio) |
| Type=Default, Size=Large, Content=Icon | Bottone consegna a stato dinamico (vedi nota ↓) |
| Type=Default, Size=Small | "Reset" (filtro colonna), "Annulla" (etichette, modale modifiche) |
| Type=Dashed, Size=Small, Content=Icon | "Prendi in carico" (UserAddOutlined), "Collega Trattativa" (LinkOutlined), "Collega" (PlusOutlined) — bordo/testo primary `#3E00FB` |
| Type=Text, Size=Small, Content=Icon Only | ShareAltOutlined (condividi riga, State=Disabled), MoreOutlined (tre pallini riga), SettingOutlined (gestione colonne), CloseOutlined (rimuovi POI) |
| Type=Text, Danger=True | "Azzera tutto" (drawer filtri), "Rimuovi tutti" (POI, Size=Small) |
| Type=Link, Size=Small, Content=Icon | "Audience" (TeamOutlined), "Vedi KPI" (BarChartOutlined), "Vai al profilo →" |

> **Nota — bottone consegna**: Size=Large con icona+testo e 4 stati visivi custom via style
> (Consegna primary outline / Consegnata verde / Aggiorna giallo / disabled grigio).
> In Figma: `*Button*` Type=Default Size=Large con override colore per variante di stato.

### Controlli di input

| Componente | Varianti usate | Figma |
|---|---|---|
| `Input` | Size=Large (nome pianificazione), Size=Default (nome copia), Size=Small (nuova etichetta), con `prefix` SearchOutlined (ricerca luogo nella pill custom), filtro colonna testuale | `*Input*` Size=Large/Default/Small, Prefix=True dove indicato |
| `InputNumber` | Size=Small (min facce, prezzo max con formatter €, raggio POI) | `*InputNumber*` Size=Small |
| `Select` | Default + ShowSearch + AllowClear (cascata trattativa/campagna nel drawer, optionRender a 2 righe), Size=Small (cascate nei popover lista/dettaglio, unità raggio POI) | `*Select*` Size=Default/Small, State=Default/Open/Disabled |
| `Checkbox` | State=Checked/Default (gestione colonne, selezione faccia), State=Indeterminate (selezione impianto), State=Disabled (faccia non disponibile) | `*Checkbox*` |
| `Radio.Group` | optionType default (pallini): Canale (label = ChannelChip), Tipo di vendita | `*Radio*` State=Checked/Default |
| `Switch` | Size=Small (filtri: min facce, prezzo max) | `*Switch*` Size=Small |
| `DatePicker.RangePicker` | format DD/MM/YYYY, disabledDate dinamico per tipo vendita, State=Disabled finché manca il tipo | `*DatePicker*` (range) State=Default/Disabled |
| `Slider` | raggio POI (overlay mappa) | `*Slider*` Direction=Horizontal |

### Display

| Componente | Varianti usate | Figma |
|---|---|---|
| `Tag` | Conteggio trattativa/campagna (bg `--gravity-primary-bg`, testo `#3E00FB`), tipologie richieste (piccolo grigio), settore inserzionista (viola), interessi audience (Color + round) | `*Tag*` Color=Default/custom primary |
| `Badge` | Status=Success/Processing/Warning + testo (stato nel meta header dettaglio) | `*Badge*` Status=… |
| `Avatar` | Shape=Circle, Type=Text (iniziali) — usato dentro AgentAvatar/AdvertiserAvatar | `*Avatar*` Shape=Circle Type=Text/Image |
| `Progress` | Type=Line, Size=Small, ShowInfo=False, strokeColor dinamico (budget brief, barre KPI) | `*Progress*` Type=Line ShowInfo=False |
| `Typography.Title` | Level=3 (titolo pagina), Level=4 (header dettaglio), Level=5 (modali) | `*Title*` Level=3/4/5 |
| `Typography.Text` | Type=Secondary e default, 12–13px (counter, meta, hint) | `*Text*` |
| `Typography.Paragraph` | Type=Secondary (testo guida modale duplica, descrizioni modali) | `*Paragraph*` Type=Secondary |
| `Divider` | Horizontal (sezioni drawer `24px 0`, POI drawer `12px 0`) | `*Divider Horizontal*` |
| `Empty` | Type=Simple (pannello risultati/selezionati vuoto) | `*Empty*` Type=Simple |

---

## 2 · Atomi — CUSTOM

| Componente | Composizione (template) | Figma |
|---|---|---|
| **`ChannelChip`** CUSTOM | `span` con dot colorato + label OOH/DOOH (chip bordato, bg tinta) | `*Tag*` — Color=Success (OOH) / Color=Magenta (DOOH). Usato anche come label dei Radio |
| **`CategoryTag`** CUSTOM | `Tag` AntD con palette fissa per canale | `*Tag*` Color=Success (OOH) / Color=Error (DOOH) |
| **`StateBadge`** CUSTOM | `span` con dot 7px + testo stato (Bozza/In trattativa/Completata) | `*Badge*` Type=Dot — Status=Warning / Processing / Success |
| **`AgentAvatar`** CUSTOM | `Avatar` AntD con iniziali e bg per agente | `*Avatar*` Shape=Circle Type=Text |
| **`AdvertiserAvatar`** CUSTOM | logo via favicon (img) con fallback `Avatar` a iniziali | `*Avatar*` Type=Image / Type=Text |
| ~~`AvailDot`~~ | **non più usato** (residuo della vecchia systems list) — candidato a rimozione | — |

---

## 3 · Molecole

### Molecole Ant Design

| Componente | Varianti usate | Figma |
|---|---|---|
| `Form` + `Form.Item` | Layout=Vertical, requiredMark=false. Label: Nome pianificazione, Trattativa e campagna, Canale, Tipo di vendita, Periodo, Nome della copia, Nuova trattativa e campagna. `extra` per descrizioni, `validateStatus=error`+`help` per errori date | `*Form Item*` Layout=Vertical, Help=True dove c'è extra/errore |
| `Dropdown` | menu con icone, divider e item Danger/Disabled — tre pallini riga + bottone Azioni dettaglio | `*Dropdown*` Placement=BottomRight |
| `Tooltip` | Placement=Left (spiegazioni item disabled), Top/Bottom (icone), "Presto disponibile" (condividi, walk/drive) | `*Tooltip*` |
| `Popover` | trigger=click: collega trattativa (lista+dettaglio), consegna, gestione colonne (Placement=TopLeft, arrow=false), etichette impianto. trigger=hover: campagna collegata, dettagli KPI | `*Popover*` |
| `Popconfirm` | "Prendere in carico la pianificazione?" con description (lista + dettaglio) | `*Popconfirm*` |
| `Alert` | Type=Info (non presa in carico / non assegnata), Type=Warning (assegnata ad altri · sola lettura), Type=Success+Closable (confermata) — banner del workspace | `*Alert*` ShowIcon=True Description=True |

### Molecole CUSTOM

| Componente | Composizione (template) | Figma |
|---|---|---|
| **`TrattativaCascade`** CUSTOM | 2× `Select` in cascata (trattativa → campagna), optionRender a 2 righe (nome + inserzionista / canale + periodo), allowClear, campagne usate disabled | 2× `*Select*` impilate — nessun componente nuovo |
| **`SaleTypeDates`** CUSTOM | `Form.Item`(Tipo di vendita → `Radio.Group`) + `Form.Item`(Periodo → `RangePicker` con vincoli) + hint/errore testuale | `*Form Item*` + `*Radio*` + `*DatePicker*` — nessun componente nuovo |
| **Box "Dati ereditati dalla campagna"** CUSTOM | frame grigio (bg subtle, bordo 6%, radius 8) con righe label→valore: AdvertiserAvatar, ChannelChip, periodo, tipo vendita | Frame Auto Layout con `*Avatar*` + `*Tag*` + `*Text*` |
| **`DataCard`** CUSTOM | div card con icona, label, valore, azione link (Audience / Vedi KPI), body opzionale | **System Card** del DS Gravity (componente già in libreria — 5 varianti) |
| **`MiniCalendar`** CUSTOM | griglia calendario 7 colonne reimplementata: header navigazione mese, celle con range evidenziato primary, footer date | **Componente Figma nuovo** `*Mini Calendar*` (stati: default, in-range, today, outside-month). Vive dentro una System Card del brief |
| **Pill di ricerca luogo** CUSTOM (`ss-search-pill`) | contenitore pill bianco con `Input` borderless + prefix SearchOutlined + divider verticale + bottone Collezioni POI | Frame pill custom con `*Input*` interno |
| **Dropdown suggerimenti geo** CUSTOM (`sugg-dropdown`) | lista risultati raggruppati (Regione/Provincia/Città/POI) con icona, label, sottotesto | Frame lista custom (simile a `*Select*` Open ma con gruppi) |
| **Radius control POI** CUSTOM | overlay mappa: label + `Slider` + `InputNumber` + `Select` unità | Frame overlay con componenti standard |
| **Filtri attivi (chips)** CUSTOM (`filter-active-chip`) | chip rimovibili sotto la search del workspace | `*Tag*` Closable=True |
| **Tabs pannello risultati** CUSTOM (`ss-panel-tab`) | due tab testuali Risultati / Selezionati con stato attivo | `*Tabs*` Type=Line (oppure `*Segmented*`) — nel codice è custom |

---

## 4 · Organismi

### Pagina lista (PlanningsList)

| Organismo | Composizione | Figma |
|---|---|---|
| **Header pagina** CUSTOM | card bianca: `Title` L3 + area/province (chip custom) + canali (ChannelChip) + CTA `Button` Primary "Nuova Pianificazione" | Frame header con componenti standard |
| **KPI cards (×3)** CUSTOM | griglia 3 `DataCard` (Da prendere in carico / Le mie bozze / In trattativa) | 3× **System Card** |
| **Tabella pianificazioni** | `Table` AntD: 14 colonne, Size=Default, fixed left (Pianificazione) e right (Stato, Azioni), sorter su date, filtri (testuale custom con `Input`+`Button`, a selezione su Canale/Inserzionista/Pianificatore/Stato), righe cliccabili | `*Table*` + `*Table Header Cell*` (Sorter/Filter=True) + `*Table Body Cell*` |
| → colonna Pianificatore | AgentAvatar + nome + "(tu)" oppure `Popconfirm` + `Button` Dashed "Prendi in carico" | vedi atomi/molecole |
| → colonna Trattativa | link con ExportOutlined + `Popover` campagna, oppure `Button` Dashed "Collega Trattativa" + `Popover` con cascata | vedi molecole |
| → colonna Azioni | `Button` Text icon-only ShareAlt (disabled) + `Dropdown` menu (Visualizza/Modifica/Duplica/Elimina con stati disabled+Tooltip) | `*Dropdown*` + `*Button*` |
| **Riga paginazione** | `Pagination` della Table con `showTotal`: counter "N pianificazioni" + `Popover` gestione colonne (lista `Checkbox`) a sinistra, pagine a destra | `*Pagination*` + `*Popover*` con `*Checkbox*` |
| **`PlanningFormDrawer`** CUSTOM | `Drawer` right 560px, CTA Salva nell'header (`extra`), X per annullare. Body: `Form` vertical → Nome (`Input` Large, lock se `fromTrattativa`), `TrattativaCascade`, box dati ereditati **oppure** Canale (`Radio` con ChannelChip) + `SaleTypeDates`. Sezioni separate da `Divider` | `*Drawer*` Placement=Right + `*Form Item*` ecc. — nessun componente nuovo |
| **`DuplicateModal`** CUSTOM | `Modal` 480px (okText=Duplica disabled finché invalido): `Paragraph` Secondary intro, `Form.Item` nome copia, `TrattativaCascade` (combo originale esclusa), box dedotti, `SaleTypeDates` con date vincolate alla finestra campagna | `*Modal*` Type=Default + componenti standard |
| **Conferma eliminazione** | `Modal.confirm` statico, okButton Danger | `*Modal*` Type=Confirm |

### Pagina dettaglio (SelectSystems)

| Organismo | Composizione | Figma |
|---|---|---|
| **`PlanningHeaderNR`** CUSTOM | card header: back link, `Title` L4 + CategoryTag, `Button` "Azioni" + `Dropdown` (Condividi presto disponibile / Modifica / Duplica / Elimina con vincoli), bottone consegna a stati, meta row (date, pianificatore con Popconfirm, trattativa con Popover collega, campagna, `Badge` stato). Monta `PlanningFormDrawer` + `DuplicateModal` per le azioni | Frame header — componenti standard; stati bottone consegna come varianti |
| **Modale modifiche consegna** CUSTOM | `Modal` con titolo icona warning, sezioni aggiunte/rimosse/cambi stato raggruppate per impianto, footer Annulla + Riconsegna | `*Modal*` con body custom |
| **`BriefPanelNR`** CUSTOM | colonna di `DataCard`: Inserzionista (avatar+settore+Audience; placeholder se non collegata), Budget (`Progress` + spesa), Obiettivo (+Vedi KPI), Periodo (`MiniCalendar`) | 4× **System Card** |
| **`AudienceModal`** CUSTOM | `Modal` 580 footer=null: avatar, `Tag` settore, barre genere/età custom (div %), `Tag` round interessi | `*Modal*` con body custom — barre come frame Auto Layout |
| **`KpiModal`** CUSTOM | `Modal` 580 footer=null: `Tag` categoria, lista KPI con `Progress` Line + `Popover` descrizione | `*Modal*` + `*Progress*` |
| **`FilterPanel`** CUSTOM | pannello filtri: dot-checkbox stato custom, tipologie per categoria, `Switch`+`InputNumber` (min facce, prezzo), reset | Frame sidebar con componenti standard — dentro `Drawer` "Filtri avanzati" |
| **Pannello risultati/selezionati** CUSTOM | tabs custom + lista impianti: card sistema con `Checkbox` (indeterminate), facce con `Checkbox`, prezzi, etichette via `Popover` | Frame lista custom |
| **POI drawer** CUSTOM | `Drawer` con collezioni POI (card categoria con icona tonda colorata), `Divider`, info raggio | `*Drawer*` con body custom |
| **Area mappa** CUSTOM | Google Maps + marker cluster + pin stato + radius control + infobox (canale/periodo/stato/contatore) + fullscreen | Frame statica con pin — nessun equivalente AntD |
| **Navbar** | `window.GravityNavbar` (script condiviso `../_shared/navbar.js`) | Componente **Navbar Gravity** — vedi `components/navbar.md` |

---

## 5 · Template / Pagine

| Livello | Composizione |
|---|---|
| **App shell** (`AppRoot`) | `ConfigProvider` (GRAVITY_THEME) + `App` + Navbar + main. Stato condiviso: `planningsList`, view lista⇄dettaglio |
| **Pagina Lista** | Pattern **List** (LAYOUT.md): header pagina → 3 KPI cards → card tabella con paginazione. Overlay: drawer crea/modifica (pattern **List + Right Drawer**), modale duplica, confirm elimina |
| **Pagina Dettaglio** | Pattern **Detail**: PlanningHeaderNR → layout 3 colonne (brief sidebar / mappa / pannello risultati) + drawer filtri + drawer POI + modali |

---

## 6 · Riepilogo

| Categoria | Quanti | Lavoro Figma |
|---|---|---|
| Atomi AntD standard | ~20 tipi (≈120 istanze) | Già in libreria — usare varianti indicate |
| Atomi custom mappabili | 5 | Usare `*Tag*` / `*Badge*` / `*Avatar*` esistenti |
| Molecole custom (composizioni) | ~10 | Assemblare da libreria, nessun componente nuovo |
| Organismi custom | ~12 | Frame composte; DataCard → **System Card** già in DS |
| **Componenti Figma nuovi richiesti** | **2** | ↓ |

**Da disegnare ex novo in Figma:**
1. `*Mini Calendar*` — griglia calendario con range evidenziato (stati: default, in-range, today, outside-month)
2. **Mappa** — frame statica Google Maps con pin per stato, infobox e radius control (per le schermate, non componente riusabile)

**Note di igiene codice:**
- `AvailDot` è definito ma non più usato → rimuovere al prossimo cleanup
- Le tabs del pannello risultati sono custom: valutare se in Figma rappresentarle con `*Tabs*` Type=Line per coerenza col DS
