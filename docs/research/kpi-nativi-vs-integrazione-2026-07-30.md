# KPI nativi vs. da integrare — Gravity (dati attuali)

| Campo | Valore |
|-------|--------|
| Versione | 1.0 |
| Data | 2026-07-30 |
| Tipo | Analisi gap modello dati → KPI campagna |
| Dipende da | `docs/research/schema-dati-kpi-campagna-2026-07-30.md` |

> **Premessa.** Questo documento parte dai dati effettivamente raccolti dalla piattaforma oggi (inventario impianti, form trattativa/strategia/campagna) e risponde a una domanda concreta: quali KPI di campagna si possono calcolare adesso, senza modificare nulla? Quali invece richiedono campi aggiuntivi nel modello dati? E quali richiedono integrazioni esterne?

---

## 1. Dati che la piattaforma raccoglie oggi

### Per ogni impianto (da form inventario)

| Dato | Campo | Fonte |
|------|-------|-------|
| Canale | `canale` — OOH / DOOH / Web / Advertorial | Operatore |
| Tipologia | `tipo` — Pensilina, Cartello, Palina, ecc. | Operatore |
| Formato | `formato` — dimensioni WxH in cm per faccia | Operatore |
| Numero di facce | `faces` — 1, 2, 3, 4 | Operatore |
| Localizzazione | `indirizzo`, `zona`, `lat/lon` | Operatore |
| Stato | `stato_amm` — Attivo / In Manutenzione / Rimosso / Inizializzato | Operatore |
| Illuminazione per faccia | Spento / Illuminato / Luminoso + mezzo + potenza W | Operatore |
| Orientamento faccia | 0–360° (gradi) | Operatore |
| Cono di visibilità | Raggio in cm (angolo fisico della faccia) | Operatore |
| Circuiti | Raggruppamenti commerciali | Operatore |
| Prezzo per faccia | Prezzo al pubblico / netto / lordo | Operatore |
| Tipo di vendita | Flat / CPM / Revenue share / Forfait | Operatore |
| Qualità impianto | 1–5 stelle | Operatore |

**Cosa NON è nel form oggi:**

| Dato mancante | Perché serve | Impatto |
|---------------|-------------|---------|
| `daily_traffic` — passaggi giornalieri stimati | Base di calcolo delle Impressions OOH | Senza questo campo le Impressions OOH non si calcolano |
| `visibility_factor` — % passanti che vedono l'annuncio | Correttore di qualità dell'esposizione | Senza questo le Impressions sono gonfiate |
| `plays_per_hour` — riproduzioni per ora (DOOH) | Base di calcolo Impressions DOOH | Non calcolabili senza questo |
| `operating_hours` — orario di accensione/spegnimento (DOOH) | Determina le ore effettive di esposizione | Non calcolabili senza questo |
| `audience_per_play` — persone medie davanti allo schermo per riproduzione (DOOH) | Moltiplica i plays in Impressions reali | Senza questo si ha solo il conteggio plays, non le impressions |

---

### Per ogni campagna (da wizard strategia + form campagna)

| Dato | Campo | Fonte |
|------|-------|-------|
| Obiettivo | `objective` — Brand Awareness / Fidelizzazione / Traffico / Lead Generation / Coinvolgimento / Conversione | Commerciale (wizard) |
| Canali selezionati | `channels[]` — OOH, DOOH, Web, Dinamica, Aeroporto, Advertorial | Commerciale (wizard) |
| Budget totale | `budget_total` in € | Commerciale (wizard) |
| Split budget OOH / DOOH | `budgetOOH`, `budgetDOOH` | Commerciale (wizard) |
| Nome campagna | `nome_campagna` | Commerciale |
| Date | `start_date`, `end_date` | Commerciale |
| Durata | Standard (14 gg) / Long Term (30+ gg) | Commerciale |
| Impianti prenotati | `screens[]` — lista impianti con prezzi e sconti applicati | Quote editor |
| Prezzo per impianto | Prezzo faccia × sconto applicato | Quote editor |
| Versioni preventivo | Storia versionata delle quote | Sistema |

---

## 2. KPI calcolabili oggi (senza modifiche)

Questi KPI si possono calcolare con i soli dati attuali. Per molti si tratta di metriche di **struttura e pianificazione**, non ancora di performance.

---

### Budget investito per canale

**Dati usati:** `campaign.budgetOOH`, `campaign.budgetDOOH`, `campaign.budget_total`, `channels[]`

**Formula:**
```
Budget OOH %  = campaign.budgetOOH ÷ campaign.budget_total × 100
Budget DOOH % = campaign.budgetDOOH ÷ campaign.budget_total × 100
```

**Cosa mostra:** quanto del budget è allocato su ogni canale. Utile per il dashboard strategia.

---

### Numero di impianti e facce prenotate

**Dati usati:** `campaign.screens[]` → COUNT degli `screen.id` + somma dei `faces` degli impianti selezionati

**Formula:**
```
N° impianti = COUNT(campaign.screens[])
N° facce    = Σ screen.faces per ogni impianto in campaign.screens[]
```

**Cosa mostra:** dimensione della campagna in termini di superficie pubblicitaria prenotata.

---

### Prezzo totale campagna e per canale

**Dati usati:** prezzi per faccia dalle quote + sconti applicati + `start_date/end_date`

**Formula:**
```
Totale campagna OOH  = Σ (prezzo_faccia × sconto) per ogni impianto OOH
Totale campagna DOOH = Σ (prezzo_faccia × sconto) per ogni impianto DOOH
Totale campagna      = somma di tutti i canali
```

**Cosa mostra:** valore economico della campagna.

---

### CPM (solo per impianti con tipo vendita = CPM)

**Dati usati:** `screen.tipo_vendita = "CPM"` → il CPM è già impostato come prezzo unitario nel form commerciale

**Formula:**
```
CPM impianto = valore già inserito nel campo "Prezzo CPM" dell'impianto
Spesa CPM    = CPM × (Impressions ÷ 1000)     ← ma le Impressions qui non ci sono ancora
```

**Limite:** per gli impianti con tipo vendita Flat o Forfait non c'è un CPM calcolato, perché mancano le Impressions.

---

### Copertura geografica qualitativa

**Dati usati:** `screen.zona`, `screen.indirizzo`, `screen.lat/lon` per ogni impianto in `campaign.screens[]`

**Formula:**
```
Zone coperte = lista distinta di screen.zona per gli impianti della campagna
Comuni coperti = lista distinta di screen.città
Distribuzione = COUNT impianti per zona
```

**Cosa mostra:** mappa della distribuzione geografica degli impianti prenotati. Qualitativa: "la campagna copre Centro Storico, Politeama e Via Libertà con 4+3+2 impianti". Nessun dato quantitativo di audience.

---

### Mix di formati e tipologie

**Dati usati:** `screen.formato`, `screen.tipo` per ogni impianto in `campaign.screens[]`

**Formula:**
```
Distribuzione formati = GROUP BY screen.formato → COUNT
Distribuzione tipi    = GROUP BY screen.tipo → COUNT
```

**Cosa mostra:** quante pensiline, quanti billboard, quali formati dominano la campagna.

---

### Durata e timeline campagna

**Dati usati:** `campaign.start_date`, `campaign.end_date`

**Formula:**
```
Durata giorni = end_date − start_date + 1
Settimane     = Durata giorni ÷ 7
```

---

### Budget pacing

**Dati usati:** `campaign.budget_total`, `campaign.start_date`, `campaign.end_date`, data odierna, `campaign.budget_spent` (se il sistema traccia la spesa progressiva)

**Formula:**
```
giorni_totali    = end_date − start_date
giorni_trascorsi = oggi − start_date
pacing_atteso    = budget_total × (giorni_trascorsi ÷ giorni_totali)
delta_pacing     = budget_spent − pacing_atteso
```

**Nota:** funziona solo se il sistema registra il `budget_spent` progressivo. Per campagne Flat pre-pagate, il budget è interamente "speso" al momento della firma — il pacing ha senso principalmente per campagne a CPM con delivery progressiva.

---

### Tabella riepilogativa — KPI nativi oggi

| KPI | Calcolabile oggi | Dati usati (tutti presenti) |
|-----|------------------|-----------------------------|
| Budget per canale | ✅ Sì | `budgetOOH`, `budgetDOOH`, `budget_total` |
| N° impianti prenotati | ✅ Sì | `campaign.screens[]` |
| N° facce totali | ✅ Sì | `screen.faces` |
| Prezzo totale campagna | ✅ Sì | Prezzi + sconti dal quote editor |
| CPM (solo impianti tipo_vendita=CPM) | ✅ Parziale | Campo prezzo CPM |
| Zone/comuni coperti | ✅ Sì (qualitativo) | `screen.zona`, `screen.città` |
| Mix formati | ✅ Sì | `screen.formato` |
| Mix tipologie | ✅ Sì | `screen.tipo` |
| Durata campagna | ✅ Sì | `start_date`, `end_date` |
| Budget pacing | ✅ Sì (se spend tracciato) | Budget + date |
| **Impressions OOH** | ❌ No | Manca `daily_traffic` + `visibility_factor` |
| **Impressions DOOH** | ❌ No | Manca `plays_per_hour` + `audience_per_play` + proof-of-play |
| **CPM calcolato** (tipo vendita ≠ CPM) | ❌ No | Dipende da Impressions |
| **Reach %** | ❌ No | Dipende da Impressions |
| **Frequency** | ❌ No | Dipende da Reach |
| **GRP** | ❌ No | Dipende da Reach + Frequency |
| Traffico web (Drive-to-Web) | ❌ No | Richiede GA4 cliente |
| Lead / CPL | ❌ No | Richiede CRM cliente |
| Conversioni / CPA / ROAS | ❌ No | Richiede CRM / POS cliente |
| Brand Lift (Awareness, Recall, Consideration) | ❌ No | Richiede survey tool esterno |
| Foot Traffic / Drive-to-Store | ❌ No | Richiede location data provider |

---

## 3. Cosa aggiungere al modello dati degli impianti

Questi sono i campi minimi da aggiungere al form di inventario per sbloccare i KPI fondamentali senza nessuna integrazione esterna.

### Campi da aggiungere — OOH (validi per tutte le tipologie)

Posizione suggerita: sezione **Dati Commerciali** del form impianto, o nuova sezione **Audience e Traffico**.

---

**`daily_traffic` — Passaggi giornalieri stimati**

*Il numero di persone che transitano davanti all'impianto in una giornata media.*

- Tipo input: `InputNumber` (intero positivo)
- Unità: persone/giorno
- Obbligatorio: No (ma necessario per il calcolo delle Impressions)
- Fonte suggerita: inserito dall'operatore al momento della creazione dell'impianto (da sopralluogo, dati comunali, ISTAT, provider certificati)
- Esempio: `12.500`

Sblocca: **Impressions OOH, CPM calcolato, base per Reach e GRP**.

---

**`visibility_factor` — Fattore di visibilità**

*La percentuale dei passanti che effettivamente vede l'annuncio su questa faccia (angolo, velocità del traffico, ostacoli).*

- Tipo input: `Slider` 0.1–1.0 (o `Select` con valori predefiniti per tipologia)
- Unità: decimale (es. 0.60 = 60%)
- Obbligatorio: No (default suggerito per tipologia se non inserito: es. Billboard stradale = 0.60, Pensilina = 0.75, Mupi = 0.65)
- Esempio: `0.65`

Sblocca: **Impressions OOH più accurate**.

**Alternativa semplificata:** definire un `visibility_factor` di default per ogni `tipo` di impianto (configurabile a livello di sistema dall'admin), così l'operatore non deve inserirlo per ogni impianto.

---

### Campi da aggiungere — DOOH

Posizione suggerita: sezione **Dati Tecnici** del form impianto, visibile solo se `canale = DOOH`.

---

**`plays_per_hour` — Riproduzioni per ora**

*Quante volte l'annuncio del cliente viene riprodotto ogni ora (es. se il loop è di 10 spot da 10" ciascuno, ogni spot va in onda 6 volte/ora).*

- Tipo input: `InputNumber` (intero positivo)
- Unità: riproduzioni/ora
- Obbligatorio per DOOH: Sì (condizionale su `canale`)
- Esempio: `6` (1 riproduzione ogni 10 minuti)

Sblocca: **conteggio plays pianificati**, poi combinato con `audience_per_play` → **Impressions DOOH stimate**.

---

**`operating_hours_start` / `operating_hours_end` — Orari operativi**

*A che ora si accende e a che ora si spegne lo schermo ogni giorno.*

- Tipo input: `TimePicker` (HH:MM)
- Default: 07:00 / 23:00
- Obbligatorio per DOOH: Sì (condizionale)
- Esempio: `07:00` / `23:00` → 16 ore operative/giorno

Sblocca: **plays totali giornalieri** = `plays_per_hour × ore_operative`.

---

**`audience_per_play` — Audience media per riproduzione**

*Stima del numero di persone mediamente presenti davanti allo schermo durante ogni singola riproduzione (es. schermo in una galleria commerciale nelle ore di punta).*

- Tipo input: `InputNumber` (intero positivo)
- Unità: persone per riproduzione
- Obbligatorio per DOOH: No (default suggerito: 5–10 se non inserito)
- Esempio: `8`

Sblocca: **Impressions DOOH** = plays_totali × audience_per_play.

---

### Integrazione proof-of-play (DOOH — sistema, non form)

Non è un campo del form ma una funzionalità di sistema: il CMS degli schermi DOOH deve poter inviare a Gravity un log per ogni riproduzione effettiva (screen_id, timestamp, campaign_id, duration_sec, plays_count). Senza questo, le Impressions DOOH restano stime pianificate, non dati reali.

Sblocca: **Impressions DOOH reali vs. pianificate**, **delivery rate**, **screen uptime**.

---

### Con questi campi aggiunti: cosa si sblocca

| KPI | Formula | Dati richiesti (tutti nel nuovo modello) |
|-----|---------|------------------------------------------|
| **Impressions OOH** | Σ (daily_traffic × visibility_factor × campaign_days) per ogni impianto | `daily_traffic`, `visibility_factor`, `start_date/end_date`, `screens[]` |
| **Impressions DOOH stimate** | plays_per_hour × ore_operative × campaign_days × audience_per_play | `plays_per_hour`, `operating_hours`, `audience_per_play`, `start_date/end_date` |
| **Impressions DOOH reali** | Σ (pof.plays_count × audience_per_play) | Proof-of-play log + `audience_per_play` |
| **CPM calcolato** | (budget × 1.000) ÷ Impressions | Budget dalla campagna + Impressions |
| **Reach % (stima)** | Traffico unico deduplificato ÷ target_universe | Impressions + modello dedup basato su distanza geografica tra schermi + dato demografico zona (ISTAT) |
| **Frequency (stima)** | Impressions ÷ Reach_individui_unici | Impressions + Reach |
| **GRP** | Reach% × Frequency | Reach + Frequency |
| **Plays pianificati vs. effettuati** | pof.plays_count ÷ plays_pianificati × 100 | Proof-of-play + `plays_per_hour` + `operating_hours` |

---

## 4. Cosa rimane da integrare esternamente

Anche dopo l'aggiunta dei campi sopra, i seguenti KPI richiedono dati che non possono provenire dall'inventario dell'operatore.

### Modulo Analytics (connessione GA4 cliente)
Obiettivi: **Traffico web** (Drive-to-Web)

Cosa serve: connessione OAuth a GA4 del cliente + generazione automatica di parametri UTM per ogni campagna Gravity (così le sessioni web possono essere filtrate per campagna).

KPI sbloccati: sessioni da campagna, bounce rate, conversioni web, Drive-to-Web Rate, CPA web.

---

### Modulo CRM Integration (connessione CRM cliente)
Obiettivi: **Lead Generation, Conversione, Fidelizzazione**

Cosa serve: connessione al CRM del cliente (HubSpot, Salesforce, Pipedrive, ecc.) con mapping del campo "sorgente lead" all'identificativo campagna Gravity.

KPI sbloccati: Lead Volume, CPL, Deal Value, Revenue attributa, CPA, ROAS.

---

### Modulo Brand Measurement (survey tool)
Obiettivi: **Brand Awareness, Coinvolgimento** (metriche qualitative)

Cosa serve: integrazione con tool di survey (Happydemics, Dynata) + meccanismo per identificare il gruppo esposto (geofencing attorno agli impianti).

KPI sbloccati: Brand Awareness Lift, Ad Recall Lift, Consideration Lift, Purchase Intent Lift (tutti in punti percentuali, misurati tramite RCT esposti/controllo).

---

### Modulo Store Visit Attribution (location data provider)
Obiettivi: **Traffico verso PDV** (Drive-to-Store)

Cosa serve: integrazione con location data provider (Placer.ai, Foursquare) + inserimento nella campagna delle coordinate del punto vendita del cliente.

KPI sbloccati: Foot Traffic Lift %, Store Visit Rate, Cost per Store Visit.

---

### Integrazione hardware (telecamera/sensore sullo schermo)
Obiettivi: miglioramento qualità dati per **tutti gli obiettivi DOOH**

Cosa serve: telecamera con vision AI installata sull'impianto, connessa alla piattaforma.

KPI sbloccati: Audience reale per play (sostituisce la stima `audience_per_play`), Dwell Time, Breakdown demografico (fascia d'età, genere — anonimo GDPR), Attention Rate.

---

## 5. Mappa obiettivo → KPI per stato attuale vs. futuro

| Obiettivo (wizard Gravity) | KPI mostrabili oggi | KPI dopo aggiunta campi | KPI con moduli esterni |
|----------------------------|---------------------|------------------------|------------------------|
| **Brand Awareness** | Budget, N° impianti, Zone coperte, Mix formati, Durata | + Impressions, CPM, Reach%, Frequency, GRP | + Brand Awareness Lift, Ad Recall Lift (survey) |
| **Fidelizzazione clienti** | Budget, N° impianti, Zone coperte | + Impressions, CPM | + Retention Rate, NPS, Repeat Purchase (CRM) |
| **Traffico** (visitatori web) | Budget, N° impianti, Zone coperte | + Impressions, CPM, QR Scan Rate (se QR nativo) | + Sessioni GA4, CVR web, Drive-to-Web Rate (GA4) |
| **Lead Generation** | Budget, N° impianti | + Impressions, CPM, QR Scan Rate | + Lead Volume, CPL, Lead Quality (CRM) |
| **Coinvolgimento** | Budget, N° impianti, Zone coperte | + Impressions, QR Scan Rate | + Engagement Rate social, Consideration Lift (survey) |
| **Conversione** | Budget, N° impianti | + Impressions, CPM | + Conversioni, CPA, ROAS (CRM/GA4) |

---

## 6. Priorità di intervento

**Impatto alto, sforzo basso** — aggiungere al form impianto (Tier 1):
1. `daily_traffic` — campo numerico in sezione Commerciale dell'impianto
2. `visibility_factor` — slider o default per tipologia (configurazione di sistema)
3. `plays_per_hour` + `operating_hours` — sezione DOOH del form (già condizionale per canale)
4. `audience_per_play` — campo numerico con default configurabile per tipologia DOOH

Con questi 4–5 campi la piattaforma passa da "zero KPI di audience" a "Impressions, CPM, Reach, Frequency, GRP" per tutte le campagne.

**Impatto alto, sforzo medio** — sviluppo sistema proof-of-play (Tier 1 per DOOH):
5. Endpoint di ingestion proof-of-play dal CMS degli schermi → sblocca Impressions DOOH reali e delivery rate

**Impatto alto, sforzo medio-alto** — moduli a pagamento (Tier 3):
6. Generazione UTM automatica per campagna + connessione GA4 → Drive-to-Web
7. Connessione CRM cliente → Lead Generation, Conversione, ROAS

**Impatto alto su clienti premium, sforzo alto** — Tier 3 specialistico:
8. Modulo Brand Measurement (survey) → Brand Awareness/Recall/Consideration Lift
9. Modulo Store Visit Attribution → Drive-to-Store

---

*Documento preparato da Gravity Platform — Versione 1.0 — 2026-07-30.*
