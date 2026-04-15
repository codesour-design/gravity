# Planning — Seleziona Impianti: note di design

Questo documento elenca tutte le feature e le scelte di design introdotte nel prototipo `search-systems.html` rispetto allo stato di partenza (`select-systems.html`, derivato dalla base Figma). Serve come punto di partenza per la discussione in riunione.

La sezione **21 — Evoluzione e decisioni scartate** raccoglie tutto ciò che è stato provato e poi cambiato o rimosso: è la parte più utile per capire le ragioni dietro le scelte finali.

### Legenda etichette

- **`[UX]`** — cambiamento concettuale: impatta flusso, azioni disponibili, modello mentale dell'utente
- **`[Stile]`** — cambiamento visivo/CSS: colori, dimensioni, spaziatura, senza impatto sulle azioni
- **`[UX+Stile]`** — la scelta visiva porta un significato UX (la forma comunica la funzione)

---

## 1. Navbar

**`[Stile]` Logotipo**
- Prima: `Gravity_mark.svg` (solo l'icona/monogramma)
- Dopo: `Gravity_type.svg` (logotipo esteso con testo), altezza 28px

**`[Stile]` Altezza**
- Prima: 56px, HTML custom con div `.g-nav-item`
- Dopo: 73px, componente Ant Design `<Menu mode="horizontal">`

**`[UX]` Voci menu**
- Prima: Overview · Inventory · Delivery (testo semplice, link flat)
- Dopo: Panoramica · Inventario · Distribuzione — "Distribuzione" ha un sottomenu con Campagne e Pianificazioni (dropdown)

**`[Stile]` Avatar utente**
- Prima: `<Avatar icon={UserOutlined}>` con background primary
- Dopo: immagine reale (da Figma API asset), con fallback: sfondo primary + iniziale "P"

---

## 2. Lingua interfaccia `[UX]`

- Prima: inglese (Select Systems, Available, Reserved, In Option, Filters, Search, Save and exit, Planning List…)
- Dopo: italiano (Seleziona impianti, Disponibile, Riservato, In Opzione, Filtri, Cerca, Salva, Lista pianificazione…)

---

## 3. Modello dati impianti

**`[UX]` Struttura flat → struttura con facce**
- Prima: ogni impianto ha solo `{ id, type, address, city, status, lat, lng }`
- Dopo: ogni impianto ha `{ id, category, type, size, address, city, status, lat, lng, cimasa, account, faces[] }`

  Facce OOH: `{ faceType, coords, orientation, cone, postingFormat, illumination, salesModel, status/slots }`
  Facce DOOH: `{ faceType, coords, orientation, cone, resolution, screenResolution, hours, slots[] }`

**`[UX]` Categoria impianto (OOH / DOOH)**
- Prima: non presente; tutti trattati indistintamente
- Dopo: `category: 'OOH' | 'DOOH'`, determina quali colonne mostrare nella tabella facce e quali dati sono disponibili

**`[UX]` Tipologie disponibili**
- Prima: 4 tipi (Palina, Poster, Palina Butterfly, Rotor) — "Poster" era il nome usato
- Dopo: 18 tipi (Palina, Plancia [ex Poster], Palina Butterfly, Rotor, Billboard, Totem, Alux, Cartello, Cassonetto, Fermata Bus, Fioriera, Insegna, Palo Luce, Parapedonale, Pensilina, Speciale, Stendardo, Telo)

**`[UX]` Slot di disponibilità per faccia**
- Prima: `status` è una stringa singola per impianto (tutto o niente)
- Dopo: le facce hanno `slots[]` (array di stati) — rappresenta impianti con disponibilità parziale (es. Rotor con 3 facce di cui 2 disponibili e 1 riservata). Lo stato complessivo dell'impianto è derivato dagli slot.

**`[UX]` Terminologia campi**
- `Cimasa Code` → `Cimasa` (suffisso "Code" ridondante)
- `Account N°` → `Utenza` (termine di dominio corretto per il settore OOH italiano)

---

## 4. Colori di stato `[UX+Stile]`

- Prima: `reserved` #7B61FF viola chiaro, `option` #FF4A1C arancione (colore secondary Gravity — causava confusione con i colori brand)
- Dopo: `reserved` #722ED1 viola più scuro (palette AntD standard), `option` #EB2F96 rosa/magenta

Il cambio di `option` da arancione a rosa è anche UX: l'arancione coincideva con il colore secondary del brand Gravity, rendendo ambiguo se il colore significasse "brand" o "stato in opzione".

---

## 5. Barra di ricerca

**`[UX+Stile]` Struttura: da elementi separati a search group unificato**
- Prima: Select scope + Input + Button Filters + Button Search — quattro elementi visivamente distinti
- Dopo: un unico contenitore visivo con border condiviso (border-radius 8px, box-shadow), internamente diviso in scope select | autocomplete | button "Cerca"

Il contenitore unico comunica che questi elementi sono un'unica azione di ricerca, non quattro azioni indipendenti.

**`[Stile]` Altezza**
- Prima: 40px (default AntD)
- Dopo: 36px — riduzione deliberata per cedere spazio verticale alla mappa

**`[Stile]` Focus ring**
- Prima: focus default AntD
- Dopo: `border-color: #3E00FB` + `box-shadow: 0 0 0 3px rgba(62,0,251,0.08)` su `focus-within` del contenitore — il ring si attiva sull'intero gruppo, non sul singolo input

**`[UX+Stile]` Placeholder animato (typewriter)**
- Prima: placeholder statico
- Dopo: animazione typewriter che cicla su 6 frasi diverse (typing → pausa 1.8s → deleting → pausa 0.45s → prossima), con cursore blinking `|` via CSS `::after`

È anche UX perché le frasi comunicano esempi concreti di come usare la ricerca ("Cerca per indirizzo o per punto di interesse", "Trova impianti vicino a una fermata…").

**`[Stile]` Scope selector integrato**
- Prima: Select AntD standalone (width 130px), separato visivamente
- Dopo: integrato nel search group, font ridotto (13px), bordo-right interno tratteggiato, padding ridotto

---

## 6. Autocomplete con suggerimenti geografici `[UX]`

- Prima: Input.Search semplice, nessun dropdown di suggestion
- Dopo: `<AutoComplete>` con suggerimenti raggruppati:
  - Categorie: **Città e Comuni · Province e Regioni · Quartieri e Zone · Indirizzi**
  - Max 4 risultati per categoria, attivazione al secondo carattere
  - Highlight del match: la porzione corrispondente alla query diventa `<strong>` colore primary
  - Ogni voce: icona colorata per tipo (28px), testo + dettaglio geografico, badge tipo ("CITTÀ", "VIA", "ZONA") in uppercase 10px

---

## 7. Quick pills (scorciatoie tipo e formato) `[UX+Stile]`

- Prima: non presenti
- Dopo: riga di pill sotto la search bar

  - Pills tipo: calcolate dinamicamente dalla tipologia più frequente nell'inventario per la categoria campagna corrente
  - Pills formato: calcolate dal formato più frequente
  - Stato inattivo: border dashed — comunica "suggerimento opzionale"
  - Stato attivo: border solid, background #F0EEFF — comunica "filtro confermato"
  - Effetto immediato sui risultati al click

L'uso del dashed/solid è una scelta UX+Stile: la forma del bordo porta il significato (opzionale vs attivo).

---

## 8. Hero animation (stato zero vs post-ricerca) `[UX+Stile]`

- Prima: non presente; la pagina scrollava normalmente
- Dopo: spacer animato prima della search bar, `transition: flex-grow 0.45s cubic-bezier(0.4,0,0.2,1)` — quando la ricerca è attiva lo spacer si comprime e la search sale verso l'alto

È UX perché marca visivamente il passaggio dallo stato zero (nessun risultato) allo stato attivo (risultati presenti), aiutando l'utente a leggere il cambio di contesto.

---

## 9. Filtri avanzati (drawer)

**`[UX]` Sezioni del drawer**
- Prima: System Type (4 opzioni) · Sales Model (3 opzioni) · Status (3 opzioni)
- Dopo: Disponibilità · Tipologia impianto (18 opzioni) · Formato (5 opzioni) · Illuminazione · Modello di vendita · Numero minimo facce disponibili

**`[UX+Stile]` UI interna — toggle button per Illuminazione e Facce**
- Prima: solo CheckRow con checkbox per tutte le sezioni
- Dopo: Illuminazione (Sì/No) e Numero facce (≥1/≥2/≥3) usano bottoni affiancati invece di checkbox — pattern più adatto a scelte mutuamente esclusive binarie/ordinali

**`[Stile]` Larghezza drawer**: 320px → 340px

**`[UX]` Contatore filtri attivi**: mostrato nell'header del drawer (`${totalActive} attivi`)

**`[UX]` "Reimposta tutto"**: abilitato solo se `totalActive > 0` — evita l'azione inutile di resettare uno stato già vuoto

---

## 10. Sistema POI (Point of Interest) `[UX]`

Funzionalità completamente nuova, non presente nella base.

**POI Drawer**
- Tasto "POI" nella toolbar apre il drawer (width 340px)
- Griglia categorie 3×2: Supermercati · Centri commerciali · Trasporti · Ristoranti · Scuole · Lista custom
- Selezione categoria: toggle (click seleziona, click sullo stesso deseleziona)
- Lista POI per categoria: nome + indirizzo + slider raggio individuale (100m–2km, step 100m)
- Label raggio: auto-formattata (sotto 1km → "Xm", sopra → "X.Xkm")

**POI Panel overlay sulla mappa**
- Pannello sovrapposto alla mappa (right: 0, width 300px) — visibile solo quando POI è attivo
- Sincronizzazione bidirezionale: click nel pannello → evidenzia marker mappa; click marker → evidenzia nel pannello con auto-scroll

**Filtraggio impianti per prossimità**
- La lista mostra solo gli impianti entro il raggio di almeno un POI della categoria attiva, calcolato con formula haversine
- Chip nella riga filtri: "POI · {categoria}", rimovibile

**Visualizzazione mappa**
- Cerchi di copertura: `L.circle` dashed, raggio configurabile, opacità differenziata (attivo/inattivo)
- Marker POI: icona quadrata 28px, outline per stato active

---

## 11. Mappa — marker

**`[UX+Stile]` Forma e stile**
- Prima: pin a goccia SVG monocolore (colore = status, o primary se selezionato) — uguale per tutti i tipi
- Dopo: SVG per tipologia di impianto (`../assets/OOH/{tipo}/{status}.svg`) — il marker racconta già visivamente la tipologia

Il cambio è UX+Stile: l'informazione sulla tipologia è ora embedded nell'icona, senza leggere il testo.

**`[UX+Stile]` Dimensione responsiva allo zoom**
- Prima: dimensione fissa (30×38px)
- Dopo: funzione `getMarkerSize(zoom)` — da 16×25px (zoom≤11) a 52×80px (zoom>15), 6 livelli

A zoom alto i marker crescono per facilitare la selezione (touch target + leggibilità).

**`[Stile]` Popup**: struttura invariata

---

## 12. Mappa — clustering `[UX]`

- Prima: nessun clustering — a densità alta i marker si sovrappongono
- Dopo: `L.markerClusterGroup`, `maxClusterRadius: 60`, disabilitato al zoom ≥16
  - Cluster icon: cerchio 36px background primary con count

Il clustering è UX: risolve l'illeggibilità della mappa a zoom basso e permette di stimare la densità degli impianti per area.

---

## 13. Vista lista — struttura

**`[UX]` Da 4 modalità a 2**
- Prima: map · grid · list · table — 4 opzioni
- Dopo: mappa · lista — 2 opzioni (grid e table rimosse, la tabella facce è dentro la lista come livello espandibile)

**`[UX]` Collapse accordion per impianto**
- Prima: griglia di card piatte o AntD `<Table>` flat
- Dopo: `<Collapse>` con un item per impianto, espandibile → tabella facce

Questo porta la gerarchia impianto→facce nella struttura visiva stessa.

**`[UX+Stile]` Collapse header**
- `borderLeft` colorato con il colore status dell'impianto — la disponibilità è leggibile senza aprire il collapse
- SVG tipologia (24px) nel titolo — identità visiva coerente con il marker mappa

**`[UX]` Tabella facce OOH**
Colonne: Tipologia Faccia · Coordinate · Orientamento · Cono vis. · Formato · Illuminazione · Modello di Vendita · Slots · Stato · (checkbox)

**`[UX]` Tabella facce DOOH**
Colonne: Tipologia Faccia · Coordinate · Orientamento · Cono vis. · Risoluzione · Screen Res. · Orario · Slots · Stato · (checkbox)

**`[UX+Stile]` Colonna Slots**: quadratini 10×10px colorati per slot — comunica la disponibilità parziale a colpo d'occhio

**`[UX+Stile]` Tag tipologia faccia** (Frontale/Posteriore): tag colorato invece di testo plain — agevola la distinzione rapida in tabella

**`[Stile]` Colonna Illuminazione**: "2 Spotlights" → numero bold primary + "faretti"

**`[Stile]` Coordinate**: font monospace

---

## 14. Selezione impianti — architettura a due livelli `[UX]`

**Prima**: selezione piatta — click su card toglie/mette l'impianto; impianti riservati selezionabili; nessuna gestione delle facce

**Dopo**: selezione a due livelli:

**Livello 1 — impianto**
- Click sull'header del collapse: seleziona l'impianto e tutte le facce disponibili automaticamente
- De-selezione: rimuove anche tutte le facce associate
- Impianti fully reserved: card disabled (opacity 0.45, pointer-events none), non selezionabili

**Livello 2 — faccia**
- Checkbox per riga nella tabella facce (solo facce non riservate)
- Selezionare una faccia: l'impianto padre entra in selezione se non c'era
- Deselezionare l'ultima faccia: l'impianto padre esce dalla selezione
- Facce riservate: nessun checkbox, riga non cliccabile

---

## 15. Selezione in massa `[UX]`

- Prima: non presente
- Dopo: nella toolbar risultati:
  - Checkbox AntD con stato **indeterminate** (parzialmente selezionati)
  - Link testuale "Seleziona tutti {N}" / "Deseleziona tutti {N}"
  - **Seleziona tutti**: agisce solo sui risultati correnti (rispetta i filtri attivi)
  - **Deseleziona tutti**: rimuove solo quelli nei risultati correnti (non tocca selezioni fuori dai filtri)

---

## 16. Separazione impianti non disponibili `[UX]`

- Prima: impianti disponibili e non disponibili mescolati nella stessa lista
- Dopo:
  - Toolbar: "Trovati: N impianti · X selezionabili" quando alcuni sono fully reserved
  - Lista: sezione collassata **"Non disponibili (N)"** in fondo, opacity 0.7, chiusa di default

Rende immediatamente chiaro il perimetro di scelta reale.

---

## 17. Lista pianificazione (drawer) `[UX]`

- Prima: bottone "Planning List" con badge count; drawer non implementato
- Dopo: `PlanningListDrawer` completamente implementato (placement right, width 420px)
  - Lista: marker SVG tipologia + ID · tipo + indirizzo (truncato) + status dot + "X/Y facce · W×H m"
  - Empty state: "Nessun impianto selezionato"
  - Footer: "{N} impianti · {M} facce" + "Conferma e procedi" (primary, large, block)
  - Rimozione impianto: tasto ×, hover → colore secondary (#FF4A1C)

---

## 18. Card 1 — info pianificazione

**`[UX]` Metadati aggiuntivi**
- Prima: solo periodo di esposizione
- Dopo: + Campagna (link esterno con ExportOutlined) + Stato pianificazione (Badge "Bozza")

**`[UX]` Gerarchia CTA**
- Prima: "Save and exit" primary + "Planning List" default
- Dopo: entrambi default in Card 1 — il primary è spostato a "Conferma e procedi" nel drawer, che è il vero punto terminale del flusso

**`[Stile]` Titolo schermata**
- Prima: "Select Systems · Zanga Sushi Palermo" + badge OOH separato (background azzurro)
- Dopo: "Seleziona impianti" + separatore "|" + nome campagna in grassetto; badge OOH rimosso

---

## 19. Card 2 — toolbar ricerca e risultati

**`[UX]` Struttura a righe**
- Prima: riga unica: conteggio + switch + view toggle
- Dopo: search group (r.1) + quick pills (r.2) + chip filtri attivi (r.3, condizionale) + toolbar risultati (r.4)

**`[UX]` Chip filtri attivi: sorgenti unificate**
- Prima: chip solo dal FilterDrawer, label lunga "System Type: Palina"
- Dopo: chip da tutte le sorgenti (quick pills + drawer + POI), label corta "Tipologia · Palina", individualmente rimovibili

**`[UX]` View toggle ridotto**
- Prima: 4 opzioni (mappa, griglia, lista, tabella)
- Dopo: 2 opzioni (mappa, lista)

---

## 20. Layout e scorrimento pagina `[UX+Stile]`

- Prima: `height: 100vh, overflow: hidden` → la mappa scorreva fuori schermo
- Dopo: `height: 130vh` con flex container `min-height: 0` → la mappa rimane visibile senza scroll

Scelta tecnica con impatto UX diretto: la mappa deve essere sempre visibile in parallelo alla lista.

---

## 21. Evoluzione e decisioni scartate

Questa sezione documenta le iterazioni significative estratte dallo storico dei commit: cosa è stato provato, perché è cambiato, e qual è stata la direzione finale.

---

### 21.1 `[UX]` Hero animation — contenuto dell'area zero-state

**Primo tentativo**: la search bar era centrata verticalmente nella card. L'area sopra (hero spacer) conteneva:
- Titolo del planning e metadati campagna
- Riga **"Aree suggerite"**: pills geografiche precompilate (Palermo Centro, Via Libertà…) che al click pre-compilavano la searchbar

**Evoluzione**: la search bar è stata spostata in cima fissa. Le "Aree suggerite" sono state rimosse perché la loro rilevanza dipende da dati di contesto campagna non ancora strutturati.

**Nodo aperto**: il pattern "aree suggerite" è interessante come feature contestuale (suggerimenti da storico campagna o area geografica target). Vale la pena discuterne in riunione.

---

### 21.2 `[UX+Stile]` Quick pills — tre stili successivi

**Primo stile**: label "Type:" davanti + `CheckOutlined` sull'attiva, bordo solid sottile.

**Secondo stile**: `<Tag closable>` AntD standard con × per chiudere.

**Stile finale**: span custom con dashed (inattive) / solid (attive). Motivazione: _"border dashed comunica opzionalità/suggerimento; border solid comunica stato confermato."_ La Tag AntD closable veniva letta come "rimozione", semantica sbagliata per un filtro rapido toggle.

---

### 21.3 `[UX]` Gerarchia dei button — tre revisioni

**Iterazione 1**: "Save and exit" rimosso da primary. "Search" unico primary della schermata. "Filters" affiancato a Search.

**Iterazione 2** (gerarchia progressiva): "Save and exit" diventava primary solo al primo sistema selezionato. "Planning List" come `type="text"` che si intensificava con il badge. **Scartato**: il cambio dinamico del type creava instabilità visiva e gerarchia imprevedibile.

**Iterazione 3**: un solo primary fisso ("Save and exit"), tutti gli altri default. Search tornava default perché la searchbar garantisce già la sua prominenza.

**Stato finale**: "Conferma e procedi" nel drawer è il vero primary di fine flusso. In Card 1 nessun primary — il badge count di "Lista pianificazione" è il richiamo visivo.

---

### 21.4 `[Stile]` Altezza search bar — tre valori

- `46px` — prima versione del search group
- `40px` — versione intermedia con Space.Compact AntD
- `36px` — finale, per cedere spazio verticale alla mappa

---

### 21.5 `[UX]` POI — inline grid vs drawer dedicato

**Primo approccio**: griglia categorie POI inline nella Card 2, sempre visibile.

**Cambio a drawer**: la griglia inline occupava spazio permanente anche quando il POI non era in uso, complicando la lettura della search area. Il drawer è contestuale — appare solo quando l'utente vuole la ricerca per prossimità.

---

### 21.6 `[UX]` Due flow sperimentati (A e B)

Costruiti e affiancati due prototipi separati:

**Flow A — Selezione continua**: impianti aggiunti incrementalmente, con "strip di accumulazione" persistente in basso (stile carrello). Ricerca e selezione senza step intermedi.

**Flow B — Staged + Conferma esplicita**: gli impianti vanno in una "barra staged" e richiedono conferma esplicita prima di entrare nella lista pianificazione.

**Decisione**: Flow A adottato. La strip di accumulazione è stata poi sostituita con il Planning List Drawer (più contestuale, non occupa spazio fisso nella schermata principale).

---

### 21.7 `[UX]` Titolo schermata — iterazioni

1. "Select Systems" — inglese, base Figma
2. "Search Systems" — inglese, prima versione hero
3. "Parco impianti" — italiano, H3 prominente (breve fase)
4. "Seleziona impianti" — italiano, titolo corrente

"Parco impianti" descriveva il contenuto; "Seleziona impianti" descrive l'azione richiesta.

---

### 21.8 `[UX]` Ricerca per scope — nodo irrisolto

Il scope selector (Indirizzo / Comune / Provincia / Regione) è rimasto nella UI ma la logica di filtraggio differenziato non è implementata. Nodo aperto: serve davvero, o il db geografico con suggerimenti tipizzati (città/provincia/zona/via) lo rende superfluo?

---

### 21.9 `[Stile]` Card 2 padding — micro-ottimizzazione

Padding top/bottom Card 2 ridotto da 32px a 16px. Motivazione esplicita nel commit: _"guadagno ~32px in altezza per Card 3 risultati/mappa."_

---

## 22. Punti aperti / da completare

- **`[UX]` Scope selector**: non filtra ancora i risultati autocomplete — è solo UI
- **`[UX]` "Lista custom" POI**: array vuoto, nessun POI associato
- **`[UX+Stile]` Hero animation**: spacer presente ma `hasSearched` non controlla ancora il `flex-grow` nel rendering
- **`[UX]` "Conferma e procedi"**: CTA non collegata al passo successivo del flusso
- **`[UX]` "Salva"**: trigger solo `message.success`, nessuna persistenza
