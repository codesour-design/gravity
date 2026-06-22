# Mappa — Stati e interazioni (riferimento)

> Documento di riferimento per il lavoro `map-interactions`.
> Definisce gli stati visivi di marker e cluster e le interazioni, condivisi tra
> **inventory-systems** e **planning**. Guida l'API del modulo `prototipi/map-interactions.js`.

## Due livelli

- **Livello DATO** (resta per-app, non si unifica): la forma/icona del marker =
  `tipo` (OOH/DOOH → cartella asset) × `stato`.
  - Inventory: stato **amministrativo** — Attivo / In Manutenzione / Rimosso / Inizializzato (`STATO_AMM_CONFIG`)
  - Planning: stato **commerciale** — Available / In Option / Reserved (`AVAIL_COLOR`)
- **Livello INTERAZIONE** (condiviso, unificato nel modulo): come il marker/cluster
  reagisce a hover, click e selezione.

## Decisioni Fase 0

1. **Motore di clustering**: griglia manuale custom (quello del planning) per **entrambi** i prototipi. Inventory abbandona MarkerClusterer.
2. **Selezione in inventory**: nessuno stato visivo. La selezione multipla con stato visibile è **esclusiva del planning**. In inventory il click apre il dettaglio/card.
3. **Dimensione marker**: scala con lo zoom in **entrambi** (comportamento del planning esteso a inventory). Inventory abbandona la scala fissa 0.46.

## Marker — stati di interazione

| Stato | Quando | Trattamento target | Inventory | Planning |
|---|---|---|---|---|
| **default** | nessuna interazione | icona base, scala da zoom | ✓ | ✓ |
| **hover** | mouse sopra | ×1.12 + card preview | ✓ | ✓ |
| **focused** | click (apre dettaglio) | ×1.4 + drop-shadow viola + outline | ✓ | ✓ |
| **selected** | checkbox attivo | anello viola al centro | — (solo planning) | ✓ |
| **selected + hover** | sel + mouse sopra | anello + ×1.12 | — | ✓ |
| **dimmed** | esiste un focus altrove | opacity 0.2 | ✓ | ✓ |

Colore accento stati: Gravity primary `#3E00FB`.

## Cluster — stati

| Stato | Quando | Trattamento target | Inventory | Planning |
|---|---|---|---|---|
| **default** | — | bolla colorata per cardinalità + alone (`clusterColor`/`makeClusterSvg`) | ✓ | ✓ |
| **hover** | mouse sopra | ×1.1 / alone più marcato + tooltip conteggio | ✓ | ✓ |
| **con selezionati** | N marker selezionati dentro | counter "N selez." / anello viola | — (solo planning) | ✓ |

## Logica zoom / clustering (target unificato)

- **Engine**: griglia manuale. Sotto la soglia di zoom i marker si raggruppano in celle; sopra la soglia si mostrano tutti individuali.
- **Size marker**: funzione `getMarkerSize(zoom)` condivisa.
- **Click cluster**: zoom-to-bounds preciso sui marker contenuti (non +3 fisso, non auto).
- **Click marker**: focus + apertura dettaglio/card.

## API prevista del modulo `map-interactions.js`

- Costanti: palette cluster, mappa tipo→cartella, stati disponibilità/amministrativi.
- `getMarkerSize(zoom)` → `[w, h]`
- `makeMarkerIcon(sys, stato, flags)` dove `flags = { isHovered, isFocused, isSelected, hasFocus }`
- `makeClusterSvg(count, selectedCount?)` — `selectedCount` opzionale (solo planning).
- Helper zoom: `fitBoundsToMarkers(map, markers)`, soglia decluster condivisa.
