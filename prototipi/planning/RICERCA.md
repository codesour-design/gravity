# Regole di ricerca — Planning Redesign

Documento tecnico-funzionale che descrive il comportamento completo del sistema di ricerca, filtri e suggerimenti nel prototipo `planning-redesign`. Organizzato per user story.

---

## US-01 — Ricerca per zona geografica

Il planner inserisce una query nella barra di ricerca per circoscrivere l'area di interesse.

### Comportamento della barra di ricerca

- La barra è attiva nel modo `zona` (default).
- La ricerca accetta query libere (testo) o selezioni dai suggerimenti.
- Più zone possono essere aggiunte contemporaneamente: ogni chip aggiunto rappresenta una zona attiva.
- Le zone attive si combinano con **logica OR** tra di loro: un impianto è incluso se si trova dentro *almeno una* delle zone selezionate.

### Suggerimenti — stato vuoto (query < 2 caratteri)

Quando la barra è vuota o ha meno di 2 caratteri, viene mostrata una colonna unica con i suggerimenti derivati dal brief della pianificazione:

- Città (es. Palermo)
- Provincia (es. Provincia di Palermo)
- 1–2 strade/corsie rilevanti per il brief
- 1 via specifica

### Suggerimenti — stato ricerca (query ≥ 2 caratteri)

La query viene normalizzata (rimozione accenti, minuscolo, eliminazione stop-word) e confrontata con il database interno `GEO_SUGGESTIONS`. I risultati sono organizzati in gruppi:

| Gruppo | Tipo | Esempi |
|---|---|---|
| Città e Comuni | `city` | Palermo, Trapani, Agrigento |
| Province | `province` | Provincia di Palermo, Provincia di Trapani |
| Quartieri e Zone | `zona` | Palermo Centro, Borgo Vecchio, Ballarò |
| Strade e Aree | `via` / `viale` / `corso` / `piazza` / `area` | Via Notarbartolo, Corso Vittorio Emanuele, Piazza Politeama |

I gruppi vuoti non vengono mostrati. Ogni gruppo ha al massimo 4 voci. In parallelo, dopo 280 ms di debounce, viene chiamata l'API Google Places per integrare risultati dinamici (geocodificati su tutto il territorio italiano).

### Stop-word escluse dalla ricerca

`via`, `corso`, `piazza`, `viale`, `largo`, `vicolo`, `lungomare`, `di`, `della`, `delle`, `degli`, `del`, `dei`, `de`, `in`, `a`, `e`, `il`, `la`, `lo`, `le`, `i`, `gli`

### Geometrie delle zone

Una volta aggiunta una zona, il sistema tenta di caricare la geometria reale:

| Tipo zona | Fonte geometria | Fallback |
|---|---|---|
| Quartieri di Palermo (circoscrizioni) | GeoJSON locale `palermo-zones.geojson` | Raggio 1.200 m dal centro |
| Strade | Overpass API (OpenStreetMap `highway`) | Raggio 1.200 m dal centro |
| Città | Nominatim API (poligono OSM) | Raggio 8.000 m dal centro |
| Province | Nominatim API (poligono OSM) | Raggio 40.000 m dal centro |

Mentre la geometria si carica, il filtraggio avviene tramite distanza haversine dal centro della zona. Quando la geometria è disponibile, si passa al test point-in-polygon (ray-casting).

Per le strade, il test di appartenenza usa una soglia di **300 m** dalla polilinea.

---

## US-02 — Ricerca per Punto d'Interesse (POI)

Il planner aggiunge luoghi o categorie di interesse per filtrare gli spazi nelle vicinanze.

### Accesso

Pulsante "Punti d'interesse (POI)" nella barra di ricerca → apre il drawer POI.

### Stato vuoto del drawer (nessuna query)

Vengono mostrati automaticamente suggerimenti derivati dal brief:

- **2 luoghi singoli** dal brief (es. Teatro Politeama, Stazione Centrale)
- **4 collezioni tematiche** consigliate (es. Scuole Palermo, Supermercati Palermo, Trasporti Palermo, Centri Commerciali)

### Ricerca nel drawer (query ≥ 1 carattere)

La ricerca confronta la query con:

1. **Collezioni POI** — matching su `label` (case-insensitive)
2. **Luoghi fissi** (mock) — matching su `label` (solo se query ≥ 2 caratteri)
3. **Photon API** (geocodifica libera) — chiamata con debounce di 400 ms (solo se query ≥ 2 caratteri)

Limite massimo: **9 suggerimenti** mostrati.

### Tipologie di POI

| Tipo | Icona marker | Colore |
|---|---|---|
| Luogo singolo (es. teatro, aeroporto) | PushpinOutlined | Arancione `#FF4A1C` |
| Collezione (categoria tematica) | Icona della categoria | Colore della categoria |

### Collezioni disponibili

| Collezione | Icona | Colore |
|---|---|---|
| Scuole | ReadOutlined | `#1677FF` |
| Supermercati | ShoppingCartOutlined | `#F759AB` |
| Ospedali | MedicineBoxOutlined | `#FF4A1C` |
| Farmacie | HeartOutlined | `#EB2F96` |
| Trasporti | CarOutlined | `#722ED1` |
| Ristorazione | CoffeeOutlined | `#FA8C16` |
| Palestre | ThunderboltOutlined | `#13C2C2` |
| Centri Commerciali | ShopOutlined | `#531DAB` |
| Università | BankOutlined | `#0958D9` |
| Cinema | PlayCircleOutlined | `#C41D7F` |
| Parchi | EnvironmentOutlined | `#237804` |

Ogni collezione contiene **15 punti geografici** distribuiti su Palermo.

### Raggio POI

Il raggio determina l'area intorno a ciascun punto POI entro cui cercare spazi.

| Unità | Default | Minimo | Massimo | Conversione in metri |
|---|---|---|---|---|
| Metri | 500 m | 100 m | 2.000 m | 1:1 |
| A piedi *(presto disponibile)* | — | 1 min | 30 min | × 80 m/min |
| In auto *(presto disponibile)* | — | 1 min | 30 min | × 400 m/min |

---

## US-03 — Filtri avanzati

Il planner raffina i risultati tramite il drawer "Filtri Avanzati".

### Filtri disponibili

| Filtro | Tipo | Comportamento |
|---|---|---|
| Stato disponibilità | Multi-selezione | OR tra i valori selezionati |
| Tipologia (Billboard, Alux, Totem…) | Multi-selezione | OR tra i valori selezionati |
| Formato | Multi-selezione (dipende dalla tipologia) | OR tra i valori selezionati |
| Illuminazione | Multi-selezione | OR tra i valori selezionati |
| Numero minimo di facce | Toggle + valore | Esclude spazi con meno facce |
| Prezzo massimo | Toggle + valore | Esclude spazi sopra soglia |

Tutti i filtri avanzati si combinano con **logica AND** reciproca: un impianto deve soddisfare tutti i filtri attivi contemporaneamente.

---

## US-04 — Combinazione di più input di ricerca

Questo è lo scenario più complesso: il planner usa zona + POI + filtri avanzati in combinazione.

### Schema di filtraggio completo

```
Risultati finali =
  [tutti gli spazi del canale selezionato]
  AND [non long-term-only se pianificazione non è long-term]
  AND [stato in uno dei valori selezionati] (se filtro attivo)
  AND [tipologia in uno dei valori selezionati] (se filtro attivo)
  AND [formato in uno dei valori selezionati] (se filtro attivo)
  AND [illuminazione corrisponde] (se filtro attivo)
  AND [n. facce ≥ minimo] (se filtro attivo)
  AND [lo spazio è dentro ALMENO UNA zona attiva]  ← OR tra zone
  AND [lo spazio è a distanza ≤ raggio da ALMENO UN punto POI attivo]  ← OR tra POI
```

### Zona + POI combinati: pre-filtraggio dei punti POI

Quando sono attive sia le zone sia i POI, il sistema non filtra semplicemente gli spazi vicini ai POI: **prima restringe i punti della collezione alle zone attive**, poi calcola la distanza dagli spazi.

Esempio:
- Zona: Palermo Centro
- POI: Scuole Palermo (15 punti in tutta la città)
- → Solo le scuole *dentro* Palermo Centro vengono usate come centri di ricerca
- → Gli spazi inclusi sono quelli entro il raggio da quelle scuole specifiche

**Caso limite:** se nessun punto POI ricade nella zona (es. zona periferica e collezione concentrata altrove), vengono usati tutti i punti della collezione come fallback, per evitare che la ricerca restituisca zero risultati.

### Zona senza coordinate (solo testo)

Se l'utente aggiunge una zona che non ha coordinate associate (es. testo libero non geocodificato), questa zona è inclusa nella lista delle zone attive ma non produce filtraggio geografico.

### Geometria ancora in caricamento

Mentre la geometria reale di una zona è in caricamento, il filtraggio avviene tramite distanza haversine dal centro della zona con i seguenti raggi di fallback:

| Tipo | Raggio fallback |
|---|---|
| Provincia | 40.000 m |
| Città | 8.000 m |
| Quartiere / Strada | 1.200 m |

---

## US-05 — Selezione spazi e counter

### Counter nella tab "Spazi selezionati"

| Situazione | Aspetto |
|---|---|
| 0 spazi selezionati | Nessun badge |
| Spazi selezionati < target del brief | Badge arancione con `n / target` |
| Spazi selezionati ≥ target del brief | Badge viola primario con `n ✓` |
| Nessun target definito | Badge viola primario con `n` |

### Counter nella card su mappa

- Mostra **"n spazi pertinenti al brief"** in modalità risultati
- Mostra **"n spazi selezionati"** in modalità visualizzazione selezione

---

## Note tecniche

- **Canale:** gli spazi sono sempre filtrati per canale (OOH o DOOH) prima di qualsiasi altro filtro.
- **Pianificazione long-term:** se la durata è sotto la soglia `LONG_TERM_THRESHOLD`, gli spazi con `saleModel: 'long_term_only'` vengono esclusi automaticamente.
- **Geometrie:** le circoscrizioni di Palermo sono disponibili offline (nessun caricamento); per strade e città il caricamento richiede connessione a Overpass/Nominatim.
