# Handoff — Interazioni Mappa & Icone Tipologia

> **Data:** 22 giugno 2026 · **Branch:** `gloria/map-interactions` · **Autrice:** Gloria
> **Scopo:** documento di sintesi del lavoro e delle decisioni di oggi, pensato come
> base per una presentazione Google Slides (ogni sezione `##` ≈ una slide).
> **Moduli toccati:** Planning, Inventory (inventory-systems), Drawer Filtri condiviso.

---

## In sintesi (slide di apertura)

Oggi abbiamo fatto tre cose, tutte sul tema "rappresentazione degli impianti sulla mappa e nelle liste":

1. **Unificato le interazioni della mappa** tra Planning e Inventory in un unico modulo condiviso (`GravityMap`).
2. **Introdotto le icone-tipologia custom** (disegnate dal design) al posto dei segnaposto, ovunque servano: tabella, card, filtri.
3. **Rinominato il tipo "Poster" in "Cartello"** in tutto il prodotto.

Risultato tecnico: **−206 righe nette** di codice (più rimosso che aggiunto), una sola fonte di verità, nessuna dipendenza da URL remoti.

---

## 1. Interazioni mappa unificate

**Problema di partenza:** Planning e Inventory disegnavano marker e cluster con codice diverso e duplicato, con comportamenti incoerenti (clustering, dimensioni, click).

**Decisione:** un solo modulo condiviso `prototipi/map-interactions.js` (`window.GravityMap`) usato da entrambi.

**Due livelli, tenuti separati di proposito:**
- **Livello DATO** (resta per-app): forma/icona del marker = tipo × stato.
  - Inventory → stato *amministrativo* (Attivo / In Manutenzione / Rimosso / Inizializzato)
  - Planning → stato *commerciale* (Disponibile / In Opzione / Riservato)
- **Livello INTERAZIONE** (condiviso): come marker e cluster reagiscono a hover, click, selezione.

---

## 2. Stati del marker (come reagisce)

| Stato | Quando | Trattamento | Inventory | Planning |
|---|---|---|---|---|
| **default** | nessuna interazione | icona base, scala con lo zoom | ✓ | ✓ |
| **hover** | mouse sopra | ×1.12 + card preview | ✓ | ✓ |
| **focused** | click (apre dettaglio) | ×1.4 + ombra viola | ✓ | ✓ |
| **selected** | checkbox attivo | **badge ✓ viola** in basso a destra | — | ✓ (solo planning) |
| **dimmed** | c'è un focus altrove | opacità 0.2 | ✓ | ✓ |

Colore accento: **Gravity Primary `#3E00FB`**.
Decisione chiave: la selezione si mostra con un **badge di spunta** (CheckCircleFilled), non più con un anello.

---

## 3. Stati del cluster (come reagisce)

| Stato | Trattamento |
|---|---|
| **default** | bolla colorata per cardinalità + alone |
| **hover** | leggero ingrandimento + tooltip conteggio |
| **con selezionati** (solo planning) | anello viola + label **"selezionati/totale"** (es. `2/5`) |

**Click sul cluster:** ora fa **zoom-to-bounds preciso** sugli impianti contenuti (prima era uno zoom fisso +3). Engine di clustering: **griglia manuale** condivisa, soglia di "decluster" a zoom > 15.

---

## 4. Marker assets — audit di completezza

Abbiamo verificato che ogni tipo abbia il marker per ogni stato.

- ✅ **Tutte le 19 cartelle marker sono complete (7/7 stati).** Inclusi i DOOH (`alux`, `billboard`, `totem`) e il nuovo **`DOOH/speciale`**, aggiornati dal design.
- ✅ Sistemato un marker rotto: `palina_butterfly` mancava *In Manutenzione* e *Rimosso* (poi sostituiti dagli asset definitivi del design).

Colori di stato del marker (gradiente): Attivo `#4096FF→#0958D9` · Disponibile `#52C41A→#389E0D` · In Opzione `#F759AB→#EB2F96` · In Manutenzione `#FFA940→#D46B08` · Rimosso `#BFBFBF→#8C8C8C` · Riservato `#9254DE→#722ED1` · Inizializzato `#FFD666→#D48806`.

---

## 5. Icone tipologia custom

**Problema:** i tipi di impianto erano rappresentati da segnaposto (icone Ant Design generiche) e, in Inventory, da **URL remoti Figma**.

**Decisione:** icone custom locali in `prototipi/assets/systemstype-icons/{OOH,DOOH}/`, glifo 16×16, colore secondario `rgba(0,0,0,0.45)`.

**Applicate in 4 punti dell'interfaccia:**
- Colonna **Tipologia** della tabella impianti (14px)
- **Card dettaglio** impianto (12px)
- **Chip** della sezione "Tipologia" nel drawer filtri (12px)
- **Tag dei filtri attivi** sotto la searchbar (12px)

**Tutti i 18 tipi sono coperti**, incluse Cartello e Insegna (prima mancanti).

---

## 6. Logica del canale (OOH / DOOH)

Quasi tutto dipende solo dal **tipo**. L'unica eccezione è **"Speciale"**, che è
**diverso tra OOH e DOOH** — sia come icona sia come marker mappa:
- Icona: OOH → `Special.svg` · DOOH → `SpecialDOOH.svg`
- Marker: OOH → `OOH/speciale` · DOOH → `DOOH/speciale`

Il canale viene determinato così:
- **Inventory:** campo `canale` dell'impianto (`illuminato` → DOOH) — usato sia per l'icona sia per il marker.
- **Drawer filtri:** macro-gruppo (OOH/DOOH) della sezione.
- **Planning:** "Speciale" è sempre OOH nei dati → default OOH.

---

## 7. Aggiornamento export icone (ultima revisione)

Recepito l'ultimo export del design:
- **FermataBus → Autobus** (file rinominato)
- **SpecialOOH → Special** (file rinominato; il DOOH resta `SpecialDOOH`)
- **Aggiunte:** `Insegna.svg` e `Cartello.svg` (ultimi tipi senza icona, ora coperti)
- **Aggiornata:** `Plancia.svg` (contenuto)

Vecchi file duplicati rimossi. Riconciliazione finale: **0 icone orfane, 0 riferimenti rotti.**

---

## 8. Rename di dominio: Poster → Cartello

**Decisione:** il tipo "Poster" cambia nome ed è ora **"Cartello"**.

Aggiornato ovunque:
- **Dati:** record impianti, liste tipi, mappe formati/colori, modelli di vendita (Inventory 17 occorrenze; Planning `requestedTypes` del brief).
- **Icona:** `Poster.svg` → `Cartello.svg`.
- **Marker:** "Poster" usava in prestito la cartella `plancia`; ora "Cartello" usa la **sua** cartella marker `cartello` (già esistente, 7 stati completi).
- Non toccati i termini incidentali (Posterscope, Publiposter, "Posteriore", nomi file foto).

---

## 9. Architettura — il modulo `GravityMap`

Unica fonte di verità condivisa (`prototipi/map-interactions.js`), caricata dopo Google Maps:

| Funzione | Cosa fa |
|---|---|
| `getMarkerSize(zoom)` | dimensione marker in base allo zoom |
| `markerSrc(type, stateFile)` | path SVG del marker mappa |
| `makeMarkerIcon({src, zoom, flags})` | icona marker con stati (hover/focus/selected/dimmed) |
| `makeClusterSvg(count, {selectedCount, hovered})` | bolla cluster |
| `computeGridClusters(map, items)` | clustering a griglia condiviso |
| `fitBoundsToMembers(map, members)` | zoom-to-bounds sul click cluster |
| `systypeIconSrc(type, channel)` | **path icona tipologia** (glifo UI) |

Le mappe di dominio (tipo→cartella, stato→file) restano dentro `GravityMap` come fonte unica.

---

## 10. Verifica & stato

- ✅ Syntax check su tutti i file (5) superato.
- ✅ Nessun riferimento orfano dopo la pulizia del codice morto.
- ✅ Tutti i path icona/marker rispondono 200; vecchi nomi → 404.
- ✅ Riconciliazione icone↔resolver completa.
- ✅ **Commit effettuato** sul branch `gloria/map-interactions` (27 file, +393 / −599).

---

## 11. Decisioni — stato (slide finale)

- ✅ **Marker DOOH completi:** tutte le cartelle hanno i 7 stati; aggiunto `DOOH/speciale` (lo Speciale DOOH è un marker diverso dall'OOH) e reso il marker channel-aware.
- ✅ **Tipo "Fermata bus":** resta il nome reale del tipo; cambia solo il file icona (`Autobus.svg`).
- ⏳ **Push & PR:** il lavoro è committato in locale sul branch `gloria/map-interactions`; resta da decidere quando aprire la Pull Request verso `main`.
