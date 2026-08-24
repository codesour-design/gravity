# Schema Dati → KPI Campagna — Gravity Platform

| Campo | Valore |
|-------|--------|
| Versione | 1.0 |
| Data | 2026-07-30 |
| Tipo | Product spec — dati minimi per KPI di campagna |
| Dipende da | `docs/research/framework-obiettivi-kpi-campagne-2026-07-30.md` |

> **Ruolo di questo documento.** Per ogni KPI di campagna specifica quali campi grezzi sono necessari, come si combinano nella formula, e da dove provengono quei dati. I tre livelli di provenienza determinano cosa è visibile nativamente nella dashboard, cosa richiede hardware collegato e cosa richiede un modulo aggiuntivo (potenziale paywall/upsell).

---

## I tre livelli di provenienza dei dati

### Tier 1 — Dati nativi della piattaforma

Dati che esistono già in Gravity per il normale funzionamento di inventario e trattative. Sempre disponibili senza integrazioni aggiuntive. Il commerciale li inserisce al momento della creazione dell'impianto o della campagna.

**Campi di inventario — ogni impianto/schermo:**

| Campo | Descrizione |
|-------|-------------|
| `screen.id` | Identificativo univoco dell'impianto |
| `screen.channel` | Tipo di canale: `OOH` / `DOOH` / `WEB` / `ADVERTORIAL` |
| `screen.location` | Indirizzo, lat/lon, comune, zona, circuito di appartenenza |
| `screen.format` | Billboard, mupi, bus shelter, digital screen, banner web, ecc. |
| `screen.size_cm` | Larghezza × altezza in cm |
| `screen.daily_traffic` | Passaggi giornalieri stimati (inseriti dall'operatore al momento della creazione, es. da dati comunali, ISTAT o da sopralluogo) |
| `screen.visibility_factor` | % stimata di passanti che effettivamente vedono l'annuncio (configurato in inventario, es. 0.60 per billboard stradale) |
| `screen.audience_per_play` | Solo DOOH: numero medio di persone presenti davanti allo schermo durante ogni singola riproduzione (stima inserita in inventario) |
| `screen.plays_per_hour` | Solo DOOH: quante volte l'annuncio va in onda ogni ora (es. 6 = 1 ogni 10 min) |
| `screen.operating_hours_start` | Orario di accensione giornaliero (es. 07:00) |
| `screen.operating_hours_end` | Orario di spegnimento giornaliero (es. 23:00) |

**Campi di campagna/trattativa:**

| Campo | Descrizione |
|-------|-------------|
| `campaign.id` | Identificativo univoco della campagna |
| `campaign.objectives[]` | Obiettivi selezionati nel wizard (es. `["brand_awareness", "drive_to_store"]`) |
| `campaign.start_date` | Data di inizio |
| `campaign.end_date` | Data di fine |
| `campaign.screens[]` | Lista degli `screen.id` prenotati per questa campagna |
| `campaign.budget_total` | Budget totale in € |
| `campaign.creative_id` | Materiale creativo caricato |
| `campaign.qr_url` | URL univoco generato dalla piattaforma per il QR code della campagna (se la piattaforma genera QR con click tracking) |
| `campaign.qr_clicks` | Click registrati sull'URL del QR code (se la piattaforma ha un URL shortener/tracker interno) |

**Campi proof-of-play — solo DOOH** (generati dal CMS dello schermo e importati/sincronizzati con Gravity):

| Campo | Descrizione |
|-------|-------------|
| `pof.screen_id` | Quale schermo ha riprodotto l'annuncio |
| `pof.campaign_id` | A quale campagna appartiene la riproduzione |
| `pof.timestamp` | Quando è avvenuta la riproduzione |
| `pof.duration_seconds` | Durata della singola riproduzione in secondi |
| `pof.plays_count` | Numero di riproduzioni aggregate in questo log event |

**Campi Web/Advertorial** (se Gravity gestisce l'ad serving direttamente o importa da ad server):

| Campo | Descrizione |
|-------|-------------|
| `web.impressions_served` | Impressioni effettivamente servite dall'ad server |
| `web.clicks` | Click registrati sull'annuncio |

---

### Tier 2 — Integrazione hardware / sensore

Dati che provengono da dispositivi fisici connessi agli impianti (telecamere, sensori IoT). Rimangono nell'ecosistema dell'operatore ma richiedono hardware installato e integrazione tecnica specifica.

| Campo | Descrizione | Dispositivo |
|-------|-------------|-------------|
| `cam.headcount[]` | Conteggio persone davanti allo schermo ogni N secondi | Telecamera con vision AI |
| `cam.dwell_time_seconds[]` | Durata di permanenza di ogni individuo rilevato | Telecamera |
| `cam.attention_seconds[]` | Secondi in cui lo sguardo è rivolto verso lo schermo (face detection) | Telecamera con eye-tracking base |
| `cam.age_group[]` | Fascia d'età stimata per ogni rilevamento (anonimo, GDPR-compliant) | Telecamera con AI demografica |
| `cam.gender[]` | Genere stimato per ogni rilevamento (anonimo, GDPR-compliant) | Telecamera con AI demografica |
| `sensor.screen_uptime_seconds` | Secondi di operatività effettiva dello schermo nel periodo | Sensore IoT / heartbeat CMS |
| `mobile.unique_devices` | Dispositivi unici rilevati nei pressi dell'impianto nel periodo (da partner audience measurement aggregato) | Integrazione API con mobile panel provider |

---

### Tier 3 — Sistema esterno collegato (modulo aggiuntivo / paywall)

Dati che vivono nei sistemi del cliente o in piattaforme terze specializzate. La visualizzazione di questi KPI nella dashboard può essere "bloccata" con CTA per acquistare il modulo o configurare la connessione.

| Campo | Fonte | Cosa serve per sbloccare |
|-------|-------|--------------------------|
| `ga4.sessions_from_campaign` | Google Analytics 4 del cliente | Connessione OAuth GA4 (modulo Analytics) |
| `ga4.conversions_from_campaign` | GA4 | Connessione GA4 + configurazione goal |
| `ga4.revenue_from_campaign` | GA4 e-commerce | Connessione GA4 + e-commerce tracking |
| `ga4.bounce_rate` | GA4 | Connessione GA4 |
| `crm.leads_in_period[]` | CRM del cliente (HubSpot, Salesforce, ecc.) | Connessione CRM (modulo CRM Integration) |
| `crm.deals_value` | CRM del cliente | Connessione CRM |
| `crm.revenue_closed` | CRM / POS del cliente | Connessione CRM o POS |
| `survey.exposed.positive_rate` | Tool di survey (Happydemics, Dynata) | Acquisto Brand Lift Study (modulo Brand Measurement) |
| `survey.control.positive_rate` | Tool di survey | Acquisto Brand Lift Study |
| `location.store_visits_exposed` | Location data provider (Placer.ai, Foursquare) | Modulo Store Visit Attribution |
| `location.store_visits_control` | Location data provider | Modulo Store Visit Attribution |
| `location.unique_devices_exposed` | Location data provider | Modulo Audience Reach Accurato |

---

## Schema KPI per macro-obiettivo

Per ogni KPI: dati minimi necessari (campi specifici), formula esatta, tier e nota su visibilità/paywall.

---

### MACRO 1 — Visibilità: quante volte il messaggio è stato esposto

---

#### Impressions (OOH statico — stimate)

**Dati necessari:**
- `screen.daily_traffic` — quante persone passano davanti all'impianto ogni giorno
- `screen.visibility_factor` — di queste, quale % effettivamente vede l'annuncio (es. 0.60)
- `campaign.screens[]` — quali impianti sono inclusi nella campagna
- `campaign.start_date`, `campaign.end_date` — per calcolare i giorni attivi

**Come si combinano:**
```
days_active = campaign.end_date − campaign.start_date + 1

Impressions per schermo = screen.daily_traffic × screen.visibility_factor × days_active

Impressions totali = Σ (Impressions per ogni schermo nella campaign.screens[])
```

**Esempio:** 3 impianti, 14 giorni di campagna.
- Schermo A: 10.000 passaggi/giorno × 0.60 × 14 = 84.000
- Schermo B: 8.000 × 0.55 × 14 = 61.600
- Schermo C: 15.000 × 0.65 × 14 = 136.500
- **Totale: 282.100 impressions**

**Tier:**
- `campaign.screens[]`, `campaign.start_date/end_date` → Tier 1 (booking nativo)
- `screen.daily_traffic` → Tier 1 SE l'operatore ha caricato il dato in inventario; il valore può provenire da una stima manuale, da dati comunali o da un provider certificato (es. MOBI, ISFORT) pre-caricato
- `screen.visibility_factor` → Tier 1 (configurabile per ogni impianto nel management inventario)

**Nota:** Questa è una stima basata su dati inseriti manualmente in inventario. Più il dato `daily_traffic` è accurato e aggiornato, più la stima è affidabile. Per dati in tempo reale usare Tier 2.

---

#### Impressions (DOOH — reali da proof-of-play)

**Dati necessari:**
- `pof.plays_count` — quante volte l'annuncio è stato effettivamente riprodotto su ogni schermo
- `screen.audience_per_play` — quante persone erano mediamente presenti davanti allo schermo durante ogni singola riproduzione

**Come si combinano:**
```
Impressions per schermo = pof.plays_count × screen.audience_per_play

Impressions totali = Σ (per ogni schermo nella campagna)
```

**Esempio:** Uno schermo ha 288 riproduzioni in un giorno (1 ogni 5 min, 24h). Il valore `audience_per_play` è stimato a 12 persone. Quel giorno produce 288 × 12 = 3.456 impressions.

**Tier:**
- `pof.plays_count` → Tier 1 (proof-of-play log importato o generato dal CMS dello schermo)
- `screen.audience_per_play` → Tier 1 SE valore fisso di stima inserito in inventario; Tier 2 SE misurato in tempo reale da telecamera

**Nota:** Il valore `audience_per_play` è la principale fonte di incertezza. Usare Tier 2 (telecamera) permette di sostituire la stima con un dato reale, aumentando l'affidabilità del dato e il valore percepito del reporting.

---

#### Impressions (Web / Advertorial)

**Dati necessari:**
- `web.impressions_served` — impressioni servite dall'ad server

**Come si combinano:**
```
Impressions = web.impressions_served
```

Nessun calcolo aggiuntivo. Il dato è diretto dall'ad server.

**Tier:**
- Tier 1 SE Gravity gestisce l'ad serving direttamente
- Tier 3 SE l'ad serving è gestito da un publisher terzo e i dati devono essere importati tramite API o CSV

---

#### CPM — Cost per Mille

**Dati necessari:**
- `campaign.budget_total` — spesa totale della campagna (€)
- `impressions_total` — impressions totali (calcolate come sopra)

**Come si combinano:**
```
CPM = (campaign.budget_total ÷ impressions_total) × 1.000
```

**Esempio:** Budget €5.000, 282.100 impressions → CPM = (5.000 ÷ 282.100) × 1.000 = **€17.72**

**Tier:** Tier 1 — entrambi i dati sono nativi. Il CPM viene calcolato automaticamente appena il booking è completato.

---

#### Net Reach % (copertura individui unici)

**Dati necessari:**
- `screen.daily_traffic` — per ogni schermo (stessa fonte delle Impressions OOH)
- `screen.location.lat_lon` — coordinate geografiche di ogni impianto, per stimare l'overlap tra schermi vicini
- `campaign.screens[]` + `campaign.start_date/end_date`
- `target_universe` — numero di individui nel pubblico target nella zona geografica coperta dalla campagna (dato demografico: es. residenti adulti 18–64 nel comune, da ISTAT)

**Come si combinano:**
```
# Stima semplificata (Tier 1 con modello approssimativo):
# Si applica un coefficiente di deduplicazione basato sulla distanza tra schermi
# Due schermi a <200m hanno overlap stimato ~70%; a >2km overlap ~10%

reach_unique_individuals = Σ traffico_per_schermo × (1 − overlap_coefficient)

Net Reach % = reach_unique_individuals ÷ target_universe × 100
```

**Esempio:** 3 schermi nello stesso quadrante, traffico totale grezzo 33.000 persone/giorno. Con deduplicazione stimata 40% → 19.800 individui unici. Target universe 200.000 adulti nella città → **Reach = 9.9%**

**Tier:**
- `screen.daily_traffic`, `screen.location`, `campaign.*` → Tier 1
- `target_universe` → Tier 1 SE la piattaforma mantiene dati demografici per comune/zona (caricabili da ISTAT)
- Versione accurata (deduplicazione su dati mobile reali) → Tier 2 (`mobile.unique_devices`) o Tier 3 (location data provider)

**Nota paywall:** La versione semplificata (Tier 1) può essere mostrata sempre, con un disclaimer "stima modellata". La versione accurata con deduplicazione da mobile panel può essere un modulo premium.

---

#### Frequency (frequenza media di esposizione)

**Dati necessari:**
- `impressions_total` — impressions totali della campagna
- `reach_unique_individuals` — individui unici raggiunti (calcolato come sopra)

**Come si combinano:**
```
Frequency = impressions_total ÷ reach_unique_individuals
```

**Esempio:** 282.100 impressions, 19.800 individui unici → Frequency = **14.2** (ogni individuo ha visto l'annuncio in media 14 volte nel periodo della campagna)

**Tier:** Dipende da `reach_unique_individuals` — stessa logica del Reach.

---

#### GRP — Gross Rating Point

**Dati necessari:**
- `net_reach_percent` — Reach % calcolato
- `frequency` — Frequency calcolata

**Come si combinano:**
```
GRP = net_reach_percent × frequency
```

**Esempio:** 9.9% reach × 14.2 frequency = **140.6 GRP**

**Tier:** Derivato da Reach e Frequency — stesso tier.

---

### MACRO 2 — Attenzione e interazione

---

#### CTR — Click-Through Rate (Web / Advertorial)

**Dati necessari:**
- `web.clicks` — click registrati sull'annuncio
- `web.impressions_served` — impressioni servite

**Come si combinano:**
```
CTR = (web.clicks ÷ web.impressions_served) × 100
```

**Esempio:** 450 click su 120.000 impressions → CTR = **0.375%**

**Tier:**
- Tier 1 SE Gravity gestisce l'ad serving con click tracking
- Tier 3 SE i dati vengono da un publisher terzo

---

#### Scan Rate (QR code su OOH/DOOH)

**Dati necessari:**
- `campaign.qr_clicks` — click sull'URL univoco del QR code (richiede che la piattaforma generi URL tracciati per ogni campagna)
- `impressions_total` — impressions totali OOH/DOOH della campagna

**Come si combinano:**
```
Scan Rate = (campaign.qr_clicks ÷ impressions_total) × 100
```

**Esempio:** 312 scan su 282.100 impressions → Scan Rate = **0.11%**

**Tier:**
- `campaign.qr_clicks` → Tier 1 SE la piattaforma genera QR code con URL shortener tracciato (es. `gravity.io/q/abc123`)
- `impressions_total` → Tier 1 (già calcolato)

**Nota di prodotto:** Questa metrica richiede che la piattaforma abbia una funzionalità di generazione QR code con click tracking integrato. Se c'è, si ottiene un dato di engagement diretto sull'OOH senza hardware aggiuntivo.

---

#### Dwell Time — Tempo medio di permanenza (DOOH)

**Dati necessari:**
- `cam.dwell_time_seconds[]` — lista delle durate di permanenza misurate dalla telecamera nel periodo di campagna per quello schermo
- `campaign.screens[]` + `campaign.start_date/end_date` — per filtrare solo i rilevamenti durante la campagna

**Come si combinano:**
```
Dwell Time medio = Σ(cam.dwell_time_seconds) ÷ COUNT(rilevamenti nel periodo)
```

**Esempio:** 4.200 rilevamenti durante la campagna, con una somma di durate di 420.000 secondi → Dwell Time medio = **100 secondi (1 minuto e 40 secondi)**

**Tier:** Tier 2 — richiede telecamera con audience counting installata sull'impianto.

**Nota paywall:** Visibile solo se l'impianto ha la telecamera collegata e il dato è disponibile. Negli altri casi: slot bloccato con messaggio "Aggiungi tracciamento audience a questo impianto per sbloccare questa metrica."

---

#### Audience reale per play (DOOH con telecamera)

**Dati necessari:**
- `cam.headcount[]` — conteggio persone per ogni intervallo di tempo (es. ogni 10 secondi)
- `pof.timestamp` — momento di ogni riproduzione dell'annuncio
- `pof.duration_seconds` — durata della riproduzione

**Come si combinano:**
```
# Per ogni riproduzione: trova i rilevamenti cam.headcount[] 
# nell'intervallo [pof.timestamp, pof.timestamp + pof.duration_seconds]
# e calcola la media

audience_per_play_reale = media(cam.headcount nel window di ogni riproduzione)

# Usato poi per ricalcolare le Impressions con dato reale invece della stima:
Impressions DOOH reali = pof.plays_count × audience_per_play_reale
```

**Tier:** Tier 2 — sostituzione del valore stimato `screen.audience_per_play` con il dato reale dalla telecamera.

**Nota di prodotto:** Questo è il miglioramento principale che la telecamera porta alle Impressions DOOH: trasforma una stima in un dato misurato. Forte argomento di upsell per il modulo hardware.

---

#### Breakdown demografico (DOOH con telecamera AI)

**Dati necessari:**
- `cam.age_group[]` — fascia d'età stimata per ogni rilevamento (`18-24`, `25-34`, `35-44`, `45-54`, `55+`)
- `cam.gender[]` — genere stimato (`M`, `F`, `undetected`)
- `campaign.start_date/end_date` + `campaign.screens[]`

**Come si combinano:**
```
# Filtra i rilevamenti nel periodo della campagna, per gli schermi della campagna
rilevamenti_campagna = cam.detections WHERE screen_id IN campaign.screens[] 
                       AND timestamp BETWEEN start_date AND end_date

# Calcola la distribuzione
% fascia 25-34 = COUNT(rilevamenti dove age_group = "25-34") ÷ COUNT(totale) × 100
```

**Tier:** Tier 2 — richiede telecamera con AI di classificazione demografica anonimizzata (GDPR-compliant: nessuna memorizzazione di immagini, solo aggregati statistici).

---

### MACRO 3 — Notorietà e brand (metriche qualitative)

Tutte le metriche di questa sezione richiedono survey su campioni rappresentativi. Senza dati di survey, non è possibile calcolarle.

---

#### Brand Awareness Lift

**Dati necessari:**
- `survey.exposed.awareness_positive_rate` — % di persone nel gruppo esposto (hanno visto la campagna) che rispondono positivamente alla domanda di awareness: "Conosci il brand X?"
- `survey.control.awareness_positive_rate` — stessa % nel gruppo controllo (non esposto)
- `survey.exposed.sample_size` — dimensione del campione esposto
- `survey.control.sample_size` — dimensione del campione controllo

**Come si combinano:**
```
Awareness Lift = survey.exposed.awareness_positive_rate − survey.control.awareness_positive_rate
```

**Esempio:** Esposti: 48% rispondono "Sì, conosco il brand". Controllo: 31% → **Awareness Lift = +17 punti percentuali**

**Tier:** Tier 3 — richiede un tool di survey integrato (es. Happydemics, Dynata) e un meccanismo per identificare chi è stato esposto alla campagna (geofencing attorno agli impianti, mobile panel).

**Nota paywall:** Metrica non mostrata per default. Slot con messaggio: "Aggiungi il modulo Brand Measurement per misurare il lift di notorietà tramite survey."

---

#### Ad Recall Lift

Stessa struttura di Brand Awareness Lift. Cambia solo la domanda della survey: "Ricordi di aver visto una pubblicità del brand X negli ultimi [X] giorni?"

```
Ad Recall Lift = survey.exposed.recall_positive_rate − survey.control.recall_positive_rate
```

**Tier:** Tier 3 — stesso modulo Brand Measurement.

---

#### Consideration Lift

Stessa struttura. Domanda: "Prenderesti in considerazione il brand X per il tuo prossimo acquisto di [categoria]?"

```
Consideration Lift = survey.exposed.consideration_rate − survey.control.consideration_rate
```

**Tier:** Tier 3 — stesso modulo Brand Measurement.

---

#### Purchase Intent Lift

Stessa struttura. Domanda: "Hai intenzione di acquistare un prodotto/servizio del brand X nei prossimi [X] mesi?"

```
Purchase Intent Lift = survey.exposed.intent_rate − survey.control.intent_rate
```

**Tier:** Tier 3 — stesso modulo Brand Measurement.

---

### MACRO 4 — Traffico e azione fisica o digitale

---

#### Foot Traffic Lift — Drive-to-Store

**Dati necessari:**
- `location.store_visits_exposed` — numero di visite al punto vendita del cliente da parte di individui del gruppo esposto alla campagna, nel periodo di campagna + finestra post-campagna
- `location.store_visits_control` — stessa metrica per il gruppo controllo (individui non esposti, ma con profilo demografico simile e nella stessa area geografica)
- `campaign.screens[]` — per definire la zona geografica del "gruppo esposto" (chi era nei pressi degli impianti)
- `client.store_location` — coordinate del punto vendita del cliente (inserite nella trattativa)

**Come si combinano:**
```
visit_rate_exposed = location.store_visits_exposed ÷ sample_size_exposed
visit_rate_control = location.store_visits_control ÷ sample_size_control

Foot Traffic Lift % = (visit_rate_exposed − visit_rate_control) ÷ visit_rate_control × 100
```

**Esempio:** 
- Gruppo esposto: 1.200 visite su 50.000 individui esposti → visit rate 2.4%
- Gruppo controllo: 800 visite su 50.000 → visit rate 1.6%
- **Foot Traffic Lift = (2.4% − 1.6%) ÷ 1.6% × 100 = +50%**

**Tier:** Tier 3 — richiede un location data provider (Placer.ai, Foursquare, Unacast) e geofencing attorno agli impianti della campagna. È uno dei moduli a più alto valore percepito per il cliente advertiser.

**Nota paywall:** "Sblocca l'attribuzione Drive-to-Store per misurare quante visite in negozio ha generato questa campagna."

---

#### Drive-to-Web — Traffico web generato dalla campagna OOH

**Dati necessari:**
- `campaign.utm_source`, `campaign.utm_medium`, `campaign.utm_campaign` — parametri UTM generati dalla piattaforma per ogni campagna (da includere nel QR code e nelle landing page dedicate)
- `ga4.sessions_from_utm` — sessioni web provenienti dall'UTM della campagna, filtrate per il periodo della campagna
- `ga4.bounce_rate_from_utm` — bounce rate di queste sessioni
- `ga4.avg_session_duration_from_utm` — durata media della sessione
- `impressions_total` — per calcolare il Drive-to-Web Rate

**Come si combinano:**
```
Drive-to-Web sessions = ga4.sessions_from_utm (filtrate per campaign.utm_campaign nel periodo)

Drive-to-Web Rate = ga4.sessions_from_utm ÷ impressions_total × 100
```

**Esempio:** 1.850 sessioni GA4 con utm_campaign=campagna-2026-luglio su 282.100 impressions → **Drive-to-Web Rate = 0.66%**

**Tier:**
- UTM generation → Tier 1 SE la piattaforma genera automaticamente parametri UTM tracciabili per ogni campagna
- `ga4.sessions_from_utm` → Tier 3 — richiede connessione OAuth a GA4 del cliente (modulo Analytics)

**Nota:** Perché questa metrica funzioni, la piattaforma deve generare URL univoci per campagna (con UTM). Questi possono essere usati su landing page dedicate, QR code o URL brevi mostrati nel materiale OOH. L'URL breve con click tracking (Tier 1) misura i click; la connessione GA4 (Tier 3) misura il comportamento successivo.

---

#### Lead da QR code / NFC (senza CRM)

**Dati necessari:**
- `campaign.qr_clicks` — click sull'URL tracciato del QR code (Tier 1, già descritto)
- `landing_page.form_completions` — compilazioni del form sulla landing page (Tier 1 SE la landing page è ospitata nella piattaforma o usa un form Gravity; Tier 3 SE la landing page è del cliente)

**Come si combinano:**
```
CPL base = campaign.budget_total ÷ landing_page.form_completions

Lead-to-Click Rate = landing_page.form_completions ÷ campaign.qr_clicks × 100
```

**Tier:**
- `campaign.qr_clicks` → Tier 1 (URL tracker nativo)
- `landing_page.form_completions` → Tier 1 SE il form è in Gravity; Tier 3 SE è nel CRM del cliente

---

### MACRO 5 — Performance e conversione (richiede sistemi del cliente)

Tutte le metriche di questa sezione richiedono dati dal cliente. Sono le metriche a più alto valore business ma meno accessibili senza integrazione.

---

#### Lead Volume e CPL (da CRM cliente)

**Dati necessari:**
- `crm.leads_in_period[]` — lead ricevuti nel periodo della campagna con sorgente di attribuzione (es. `source = "campagna_OOH_luglio_2026"`)
- `campaign.budget_total`
- `campaign.start_date/end_date` — per filtrare i lead nel periodo corretto

**Come si combinano:**
```
Lead da campagna = COUNT(crm.leads_in_period WHERE source = campaign attribution tag)

CPL = campaign.budget_total ÷ Lead da campagna
```

**Esempio:** 38 lead con attribuzione alla campagna, budget €5.000 → **CPL = €131.58**

**Tier:** Tier 3 — richiede connessione al CRM del cliente (HubSpot, Salesforce, Pipedrive, ecc.).

**Nota sull'attribuzione:** L'attribuzione OOH → CRM è il nodo critico. Le opzioni sono: (a) il cliente usa il promo code univoco della campagna quando contatta il brand, (b) il cliente arriva tramite QR → form con UTM → CRM, (c) il commerciale attribuisce manualmente. Nessuna delle tre è automatica senza accordo preventivo.

---

#### Conversioni e CPA

**Dati necessari:**
- `crm.deals_closed_in_period` — contratti/acquisti chiusi nel periodo attribuibili alla campagna
- `campaign.budget_total`

**Come si combinano:**
```
CPA = campaign.budget_total ÷ crm.deals_closed_in_period
```

**Tier:** Tier 3 — CRM del cliente.

---

#### Revenue e ROAS

**Dati necessari:**
- `crm.revenue_closed` — fatturato generato dalle conversioni attribuite alla campagna (€)
- `campaign.budget_total`

**Come si combinano:**
```
ROAS = crm.revenue_closed ÷ campaign.budget_total
```

**Esempio:** €22.000 di revenue attribuita, budget €5.000 → **ROAS = 4.4x**

**Tier:** Tier 3 — CRM o POS del cliente.

---

#### Web Conversions (da GA4)

**Dati necessari:**
- `ga4.conversions_from_campaign` — conversioni (goal completions: acquisti, form, ecc.) su GA4 provenienti dalla campagna (filtrate per UTM)
- `campaign.budget_total`

**Come si combinano:**
```
CVR web = ga4.conversions_from_campaign ÷ ga4.sessions_from_utm × 100

CPA web = campaign.budget_total ÷ ga4.conversions_from_campaign
```

**Tier:** Tier 3 — GA4 del cliente.

---

### MACRO 6 — Metriche di efficienza campagna (sempre native)

---

#### Budget Pacing

**Dati necessari:**
- `campaign.budget_total` — budget totale
- `campaign.start_date`, `campaign.end_date` — durata totale
- `campaign.current_date` — data odierna (sistema)
- `campaign.budget_spent` — spesa registrata fino a oggi (dal sistema di billing/booking)

**Come si combinano:**
```
giorni_totali = end_date − start_date
giorni_trascorsi = current_date − start_date
pacing_atteso = campaign.budget_total × (giorni_trascorsi ÷ giorni_totali)

Pacing delta = campaign.budget_spent − pacing_atteso
# Positivo = si sta spendendo più del previsto per questo punto della campagna
# Negativo = si sta spendendo meno (campagna in ritardo sul delivery)
```

**Tier:** Tier 1 — tutti i dati sono nativi della piattaforma.

---

#### Plays effettuati vs. plays pianificati (DOOH)

**Dati necessari:**
- `screen.plays_per_hour` — riproduzioni programmate per ora
- `screen.operating_hours_start`, `screen.operating_hours_end` — ore operative
- `campaign.start_date/end_date`
- `pof.plays_count` — riproduzioni effettive da proof-of-play

**Come si combinano:**
```
plays_pianificati = screen.plays_per_hour × ore_operative_giornaliere × campaign_days

plays_delivery_rate = pof.plays_count ÷ plays_pianificati × 100
# Es. 97.3% = delivery quasi perfetta; <90% = problema di operatività dello schermo
```

**Tier:** Tier 1 — tutti i dati sono nativi.

---

#### Screen Uptime % (DOOH)

**Dati necessari:**
- `sensor.screen_uptime_seconds` — secondi di operatività effettiva dello schermo nel periodo
- `campaign.start_date/end_date` + `screen.operating_hours` — per calcolare i secondi totali attesi di operatività

**Come si combinano:**
```
secondi_attesi = ore_operative_al_giorno × 3600 × campaign_days

Uptime % = sensor.screen_uptime_seconds ÷ secondi_attesi × 100
```

**Tier:**
- `sensor.screen_uptime_seconds` → Tier 2 (sensore IoT / heartbeat dal CMS)
- Se non disponibile: uptime viene assunto al 100% o stimato dal rapporto plays_effettuati/plays_pianificati → Tier 1 (approssimato)

---

## Riepilogo: cosa è visibile senza nessuna integrazione

Questi KPI sono calcolabili con i soli dati nativi della piattaforma (Tier 1), assumendo che l'inventario sia compilato correttamente:

| KPI | Condizione |
|-----|-----------|
| Impressions OOH stimate | `screen.daily_traffic` e `screen.visibility_factor` devono essere inseriti in inventario |
| Impressions DOOH reali | Proof-of-play log disponibili + `screen.audience_per_play` in inventario |
| Impressions Web/Advertorial | Gravity gestisce l'ad serving |
| CPM | Sempre (deriva da budget e impressions) |
| Reach % (stima) | Con modello di deduplicazione semplificato |
| Frequency (stima) | Deriva da Reach |
| GRP (stima) | Derive da Reach e Frequency |
| CTR Web | Gravity gestisce il click tracking |
| Scan Rate QR | Gravity genera QR con URL tracker nativo |
| Budget Pacing | Sempre |
| Plays effettuati vs. pianificati | Proof-of-play disponibili |

---

## Riepilogo: KPI da sbloccare con moduli o connessioni

| KPI | Modulo / Connessione | Valore per il cliente |
|-----|---------------------|----------------------|
| Audience reale per play (DOOH) | Hardware: telecamera schermo | Impressions più precise → credibilità del reporting |
| Dwell Time | Hardware: telecamera schermo | Misura dell'attenzione, non solo dell'esposizione |
| Breakdown demografico | Hardware: telecamera AI | Verifica che il target sia effettivamente raggiunto |
| Reach accurato | Integrazione: mobile panel provider | Deduplicazione reale tra impianti |
| Brand Awareness/Recall/Consideration Lift | Modulo: Brand Measurement (survey) | Misura l'effetto sulla mente del consumatore |
| Foot Traffic Lift | Modulo: Store Visit Attribution | Prova diretta dell'efficacia drive-to-store |
| Drive-to-Web | Connessione: GA4 del cliente | Chiude il loop OOH → digital |
| Lead Volume / CPL | Connessione: CRM del cliente | Valore business diretto |
| Revenue / ROAS | Connessione: CRM o POS del cliente | ROI della campagna |

---

*Documento preparato da Gravity Platform — Versione 1.0 — 2026-07-30. Da aggiornare al rilascio di nuovi moduli di integrazione.*
