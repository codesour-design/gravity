# Map Interactions — Gravity Platform

> Punto d'ingresso per stati e interazioni di marker/cluster mappa, condivisi tra
> `inventory-systems` e `planning`. Il dettaglio completo vive accanto al prototipo approvato:
>
> - **Stati e decisioni:** `docs/MAP_INTERACTIONS.md`
> - **Logica cluster per lo sviluppo** (palette WCAG, SVG, algoritmi, performance):
>   `docs/CLUSTER_LOGIC.md`
> - **Modulo condiviso:** `prototipi/map-interactions.js`

## Due livelli — non confonderli

- **DATO** (per-app, non si unifica): forma/icona del marker = `tipo` (OOH/DOOH → cartella
  asset) × `stato`. Inventory usa lo stato **amministrativo**, Planning quello **commerciale**.
- **INTERAZIONE** (condivisa in `map-interactions.js`): reazione a hover, click, selezione.

## Stati marker (sintesi)

| Stato | Trigger → trattamento | Inventory | Planning |
|-------|------------------------|-----------|----------|
| default | icona base, scala con lo zoom | ✓ | ✓ |
| hover | ×1.12 + card preview | ✓ | ✓ |
| focused | click → ×1.4 + drop-shadow viola, apre dettaglio/popover | ✓ | ✓ |
| selected | checkbox → badge check viola | — | ✓ |
| dimmed | focus altrove → opacity 0.2 | ✓ | ✓ |

La selezione multipla visibile è **esclusiva del Planning**; in Inventory il click apre sempre
il dettaglio. Colore accento stati: primary `#3E00FB`.

## Cluster (sintesi)

- Bolla per cardinalità: 6 scaglioni derivati dal primary, testo bianco, contrasti verificati
  WCAG + alone della stessa tinta in trasparenza (dettagli e codice in `CLUSTER_LOGIC.md`).
- Click cluster → **zoom-to-bounds preciso** sui marker contenuti (non zoom fisso).
- Motore: griglia manuale custom (quella del Planning) per entrambi i prototipi; per la
  produzione `CLUSTER_LOGIC.md` raccomanda la libreria `@googlemaps/markerclusterer`.
- Dimensione marker: scala con lo zoom in entrambi i prototipi.

## API del modulo `map-interactions.js`

- `getMarkerSize(zoom)` → `[w, h]`
- `makeMarkerIcon(sys, stato, flags)` con `flags = { isHovered, isFocused, isSelected, hasFocus }`
- `makeClusterSvg(count, selectedCount?)` — `selectedCount` solo planning
- `fitBoundsToMarkers(map, markers)`, soglia decluster condivisa
- Costanti: palette cluster, mappa tipo→cartella asset, stati disponibilità/amministrativi

## Quando aprire cosa

- Nuovo modulo con mappa, decidere i comportamenti → questa pagina + `MAP_INTERACTIONS.md`.
- Toccare `clusterColor`/`makeClusterSvg`/soglie/palette → `CLUSTER_LOGIC.md` (con checklist di produzione).
- Card al click sul marker → `components/map-popover.md`.
