# Framework Obiettivi Campagna → KPI — Gravity Platform

| Data | 30-07-2026 |

**Ruolo di questo documento.** Fonte di riferimento strategica per collegare ogni obiettivo di campagna pubblicitaria alle relative metriche di misurazione (KPI). Applicabile sia come guida interna per i moduli Gravity (Planning, Commercial) sia come base di conoscenza per progettare feature di reporting e obiettivi di campagna.
---

## Indice

1. [Classificazione degli obiettivi](#1-classificazione-degli-obiettivi)
2. [Metriche associate](#2-metriche-associate)
3. [Mappatura Obiettivo → KPI](#3-mappatura-obiettivo--kpi)
4. [KPI per piattaforma](#4-kpi-per-piattaforma)
5. [Metriche economiche](#5-metriche-economiche)
6. [Metriche di brand](#6-metriche-di-brand)
7. [Framework internazionali](#7-framework-internazionali)
8. [Costruzione di un sistema di misurazione](#8-costruzione-di-un-sistema-di-misurazione)
9. [Best practice](#9-best-practice)
10. [OOH/DOOH e Gravity](#10-oohDooh-e-gravity)
11. [Fonti](#11-fonti)
12. [Tabella finale riepilogativa](#12-tabella-finale-riepilogativa)

---

## 1. Classificazione degli obiettivi

Gli obiettivi di una campagna pubblicitaria si distribuiscono lungo il funnel di marketing: dalla costruzione di notorietà (Awareness) fino alla creazione di clienti fedeli e sostenitori attivi del brand (Advocacy). Il modello di riferimento più diffuso nella letteratura è il **Marketing Funnel a cinque fasi**: Awareness → Consideration → Conversion → Loyalty → Advocacy [6, 7].

### 1.1 Brand Awareness

**Definizione.** Grado di riconoscimento del brand da parte del pubblico target. Si distingue in *aided awareness* (riconoscimento con stimolo: "Conosci il brand X?") e *unaided/spontaneous awareness* (richiamo spontaneo: "Quali brand di categoria Y ti vengono in mente?") [4].

**Quando si usa.** Lancio di un nuovo brand o prodotto, ingresso in un nuovo mercato, riposizionamento, campagne istituzionali di lungo periodo.

**Fase funnel.** Awareness (top of funnel).

**Esempi pratici.** Campagna TV/YouTube per il lancio di un nuovo operatore telefonico; piano media OOH su circuito nazionale per un brand di bevande; display advertising su scala nazionale per una compagnia assicurativa.

---

### 1.2 Reach e Copertura

**Definizione.** Numero di individui unici esposti almeno una volta al messaggio pubblicitario in un determinato periodo. Si distingue dalla *frequency* (numero medio di esposizioni per individuo unico) [3].

**Quando si usa.** Campagne di lancio, comunicazioni di massa, situazioni in cui la copertura del target è prioritaria rispetto all'intensità di esposizione.

**Fase funnel.** Awareness.

**Esempi pratici.** Campagna OOH su circuito nazionale per raggiungere il 70% degli adulti 25–54; acquisto programmatico DOOH con obiettivo di copertura geografica massima.

---

### 1.3 Brand Recall

**Definizione.** Capacità del target di ricordare un brand o un messaggio pubblicitario specifico dopo l'esposizione. Si misura tramite survey (*prompted recall* con stimolo e *unprompted recall* spontaneo) [4].

**Quando si usa.** Dopo campagne ad alto investimento creativo; in categorie ad alta concorrenza dove il ricordo è un vantaggio competitivo.

**Fase funnel.** Awareness / inizio Consideration.

**Esempi pratici.** Brand Lift Study post-campagna YouTube; test di Ad Recall Nielsen dopo spot TV.

---

### 1.4 Considerazione

**Definizione.** Quota del target che include attivamente il brand nella propria lista di opzioni da valutare prima dell'acquisto (*consideration set*) [2, 4].

**Quando si usa.** Campagne di medio funnel per brand con alta awareness ma conversione debole; lancio di nuovi prodotti in categorie competitive.

**Fase funnel.** Consideration.

**Esempi pratici.** Campagna video mid-funnel per un'auto che spinge gli utenti a richiedere un test drive; retargeting display su utenti che hanno visitato la pagina prodotto ma non hanno acquistato.

---

### 1.5 Interesse

**Definizione.** Livello di coinvolgimento attivo del target verso il brand o il prodotto: ricerche sul sito, tempo di permanenza, visualizzazione di video completi [2].

**Quando si usa.** Campagne content-led; lancio di nuove categorie di prodotto; educazione del mercato.

**Fase funnel.** Consideration.

**Esempi pratici.** Video esplicativo di un software SaaS su LinkedIn; articolo sponsorizzato per generare traffico su una landing page informativa.

---

### 1.6 Engagement

**Definizione.** Interazione diretta del pubblico con i contenuti della campagna: like, commenti, condivisioni, salvataggi, click, tempo di visualizzazione [2].

**Quando si usa.** Campagne social; attivazioni di brand esperienziale; contenuti generati dagli utenti (UGC).

**Fase funnel.** Awareness / Consideration.

**Esempi pratici.** Campagna TikTok con sfida hashtag; post carosello Instagram per un lancio di prodotto; DOOH interattivo con QR code.

---

### 1.7 Traffico verso sito o punto vendita

**Definizione.** Numero di visite (fisiche o digitali) generate dalla campagna verso un punto di contatto specifico: sito web, landing page, negozio, showroom [3].

**Quando si usa.** Campagne retail, promozioni stagionali, drive-to-store, drive-to-web.

**Fase funnel.** Consideration / Conversion.

**Esempi pratici.** Campagna Google Search con obiettivo "Visits to location"; DOOH geotargetato verso negozi fisici con misurazione del foot traffic incrementale.

---

### 1.8 Lead Generation

**Definizione.** Raccolta di contatti qualificati (nome, email, numero, azienda) da utenti che hanno espresso interesse per il prodotto/servizio [3].

**Quando si usa.** B2B, servizi finanziari, immobiliare, automotive, SaaS; prodotti a lungo ciclo di vendita.

**Fase funnel.** Consideration / Conversion (parte alta).

**Esempi pratici.** LinkedIn Lead Gen Form per una piattaforma software; landing page con form + whitepaper; campagna Meta con obiettivo Lead.

---

### 1.9 Conversione

**Definizione.** Completamento di un'azione desiderata da parte dell'utente: acquisto, iscrizione, download, compilazione form, telefonata [3].

**Quando si usa.** Campagne performance-driven con obiettivi diretti di business; e-commerce; subscription.

**Fase funnel.** Conversion.

**Esempi pratici.** Campagna Google Shopping con target ROAS; retargeting Facebook su carrelli abbandonati; email di recupero post-abbandono.

---

### 1.10 Vendite

**Definizione.** Valore monetario o volume di prodotti/servizi venduti attribuiti (direttamente o indirettamente) alla campagna [3].

**Quando si usa.** Campagne retail, e-commerce, promozioni; qualsiasi obiettivo in cui il ritorno economico è misurabile direttamente.

**Fase funnel.** Conversion.

**Esempi pratici.** Black Friday campaign con tracking di revenue; DOOH + promo code per misurare l'incremento vendite in store.

---

### 1.11 Acquisizione clienti

**Definizione.** Trasformazione di prospect o lead in nuovi clienti paganti (prima transazione). Si distingue dalla semplice "conversione" perché enfatizza il *costo* di acquisizione (CAC) [3].

**Quando si usa.** Campagne di crescita; mercati nuovi; lanci; subscription box; SaaS free trial.

**Fase funnel.** Conversion.

**Esempi pratici.** Campagna Google UAC per acquisire nuovi utenti di un'app; campagna Meta con obiettivo "Purchase" per un e-commerce in espansione.

---

### 1.12 Retention

**Definizione.** Mantenimento dei clienti esistenti nel tempo; riduzione del tasso di abbandono (churn). Non si tratta di campagne di acquisizione ma di comunicazioni che mantengono vivo il rapporto [2].

**Quando si usa.** SaaS, subscription, utilities, banche; prodotti con ciclo ricorrente.

**Fase funnel.** Loyalty.

**Esempi pratici.** Email campaign per ridurre il churn a 30 giorni dall'attivazione; notifiche push personalizzate in-app; campagna display di reminder per rinnovo abbonamento.

---

### 1.13 Fidelizzazione

**Definizione.** Costruzione di un legame duraturo tra il cliente e il brand, che si traduce in acquisti ripetuti, preferenza stabile e resistenza alle offerte dei competitor [2].

**Quando si usa.** Brand maturi con base clienti consolidata; programmi fedeltà; retail; FMCG.

**Fase funnel.** Loyalty.

**Esempi pratici.** Campagna email di loyalty con offerte personalizzate; programma punti con comunicazioni mirate.

---

### 1.14 Customer Lifetime Value (CLV/LTV)

**Definizione.** Valore economico totale generato da un cliente nel corso dell'intera relazione con il brand. Obiettivo strategico: massimizzare il CLV, non solo il primo acquisto [3].

**Quando si usa.** Campagne di upselling/cross-selling; comunicazioni post-acquisto; retention avanzata.

**Fase funnel.** Loyalty / Advocacy.

**Esempi pratici.** Email automation per up-sell tier premium; campagne personalizzate basate sulla segmentazione RFM (Recency, Frequency, Monetary).

---

### 1.15 Riattivazione clienti (Win-back)

**Definizione.** Recupero di clienti che hanno smesso di acquistare o interagire con il brand dopo un certo periodo di inattività [3].

**Quando si usa.** Database clienti con alta percentuale di "dormienti"; post-churn; e-commerce stagionale.

**Fase funnel.** Loyalty / Conversion.

**Esempi pratici.** Email "Ci manchi" con sconto dedicato; retargeting su utenti inattivi da 90+ giorni; DOOH + promo code iperlocale per drive-to-store su ex-clienti.

---

### 1.16 Installazione di app

**Definizione.** Numero di installazioni di un'applicazione mobile generate dalla campagna, tracciato tramite MMP (Mobile Measurement Partner: AppsFlyer, Adjust, Branch) [3].

**Quando si usa.** Lancio di app; campagne di crescita mobile; gaming; fintech; retail con app.

**Fase funnel.** Conversion.

**Esempi pratici.** Campagna Google UAC o Meta App Install; TikTok App Install campaign.

---

### 1.17 Download

**Definizione.** Numero di download di contenuti digitali (whitepaper, guide, ebook, tool, software) generati dalla campagna. Usato spesso come proxy di lead qualification in B2B [3].

**Quando si usa.** Content marketing B2B; lead gen qualificata; campagne informative.

**Fase funnel.** Consideration / Conversion.

**Esempi pratici.** LinkedIn Sponsored Content con lead magnet; landing page con form gated.

---

### 1.18 Partecipazione a eventi

**Definizione.** Numero di registrazioni, presenze o interazioni generate dalla campagna per eventi fisici o digitali (webinar, fiere, conferenze, eventi live) [3].

**Quando si usa.** B2B event marketing; campagne di lancio con eventi fisici; conferenze di settore.

**Fase funnel.** Consideration / Conversion.

**Esempi pratici.** Campagna LinkedIn per la registrazione a un webinar SaaS; DOOH geotargetato nelle vicinanze del venue di un evento.

---

### 1.19 Educazione del mercato

**Definizione.** Obiettivo di aumentare la conoscenza del pubblico su una nuova categoria di prodotto, un problema di mercato o un approccio innovativo, prima ancora che il brand venga pienamente riconosciuto [2].

**Quando si usa.** Mercati nascenti o innovativi; prodotti disruptive; categorie non comprese dal pubblico.

**Fase funnel.** Awareness / Consideration.

**Esempi pratici.** Campagna content su YouTube che spiega "cos'è il programmatic DOOH"; serie editoriale sponsorizzata su un nuovo approccio nutrizionale.

---

### 1.20 Posizionamento del brand

**Definizione.** Costruzione e rinforzo della percezione del brand rispetto ai competitor su attributi chiave (qualità, innovazione, prezzo, affidabilità). Obiettivo di lungo periodo [2].

**Quando si usa.** Rebranding; ingresso in un segmento premium; riposizionamento competitivo.

**Fase funnel.** Awareness / Consideration.

**Esempi pratici.** Campagna istituzionale OOH con messaggio di leadership tecnologica; video series su brand journalism.

---

### 1.21 Reputazione

**Definizione.** Gestione e miglioramento della percezione complessiva del brand da parte degli stakeholder: clienti, media, investitori, comunità. Include crisis management e corporate communication [2].

**Quando si usa.** Post-crisi; lancio di programmi CSR; comunicazione istituzionale.

**Fase funnel.** Awareness (trasversale a tutti i livelli).

**Esempi pratici.** Campagna social di responsabilità ambientale; advertising istituzionale post-crisi di reputazione.

---

### 1.22 Preferenza di marca (Brand Preference)

**Definizione.** Quota di target che preferirebbe il brand rispetto ai competitor quando tutti sono noti e disponibili. Metrica di posizionamento relativo [2, 4].

**Quando si usa.** Mercati maturi ad alta concorrenza; FMCG; automotive.

**Fase funnel.** Consideration / Loyalty.

**Esempi pratici.** Campagna comparativa che evidenzia la superiorità del prodotto; endorsement di testimonial per aumentare la preferenza di marca.

---

### 1.23 Advocacy

**Definizione.** Trasformazione di clienti soddisfatti in promotori attivi del brand: raccomandazioni spontanee, UGC, referral, review positive [2].

**Quando si usa.** Brand maturi con NPS alto; programmi referral; community building; B2B con acquisti ad alto coinvolgimento.

**Fase funnel.** Advocacy (bottom + post-funnel).

**Esempi pratici.** Campagna referral con incentivo; programma ambassador; attivazione UGC su TikTok.

---

## 2. Metriche associate

Per ogni obiettivo vengono indicati i KPI primari e secondari, formula, unità, frequenza di monitoraggio, benchmark indicativi (con fonte dove disponibili) e limiti.

| Obiettivo | KPI Primari | KPI Secondari | Formula principale | Unità | Frequenza | Benchmark indicativo | Limiti | Errori comuni |
|-----------|-------------|---------------|--------------------|-------|-----------|----------------------|--------|---------------|
| Brand Awareness | Brand Awareness Lift, Aided/Unaided Awareness | Impressions, Reach, SOV | Awareness Lift = % esposti − % controllo | pp (punti percentuali) | Pre/post campagna (brand lift study) | +3–5 pp (YouTube Brand Lift, Google) [4] | Richiede panel o study; costoso; effetti latenti | Confondere impressions con awareness reale |
| Reach e Copertura | Net Reach %, Frequency | CPM, GRP, TRP | Reach = individui unici esposti ÷ target × 100 | %, individui | Settimanale/per volo | Dipende da piattaforma e target | Non misura qualità dell'esposizione | Sommare reach di piattaforme diverse senza correggere l'overlap |
| Brand Recall | Ad Recall Lift, Prompted/Unprompted Recall | Frequency, GRP, VTR | Recall Lift = % recall esposti − % recall controllo | pp | Pre/post campagna | Nativa in Google Brand Lift Study [4] | Decay rapido nel tempo; survey bias | Misurare recall a distanza eccessiva dall'esposizione |
| Considerazione | Consideration Lift | CTR, Time on site, Branded search | Consideration Lift = % considerazione esposti − % controllo | pp | Per volo | Nativa in Google Brand Lift Study [4] | Correlazione ≠ causalità | Ignorare il gap tra dichiarazione di intent e comportamento reale |
| Interesse | CTR, Video Completion Rate, Time on page | Scroll depth, Pages/session | CTR = Click ÷ Impressions × 100 | % | Giornaliera | Google Search CTR ~6.66% [1]; Display ~0.35% (indicativo) | CTR non misura qualità dell'interesse | Ottimizzare CTR su audience non qualificate |
| Engagement | Engagement Rate, Interactions | Like, Commenti, Condivisioni, Salvataggi | ER = Interazioni ÷ Reach × 100 | % | Giornaliera/settimanale | TikTok 4.07% [13]; Instagram 1–3% (indicativo) | Vanity metric se non correlato a business outcome | Usare ER su impressions invece di reach (gonfia il dato) |
| Traffico sito/PDV | Sessions, Unique Visitors, Store Visits | Bounce rate, Pages/session, Dwell time | Sessions da campagna (UTM + GA4) | numero, % | Giornaliera | Dipende da settore | Last-click attribution sovrastima il canale diretto | Attribuire tutto il traffico alla campagna ignorando l'effetto organico |
| Lead Generation | Lead Volume, CPL, Lead Quality Score | Form fill rate, CVR landing page | CPL = Spesa ÷ Lead acquisiti | € | Settimanale | LinkedIn Lead Gen Form CVR ~6.1% [12]; Meta variabile | Lead ≠ opportunità qualificata | Non qualificare i lead prima di passarli al sales |
| Conversione | CVR, CPA, Conversioni totali | Assisted conversions, Time to convert | CVR = Conv ÷ Click × 100; CPA = Spesa ÷ Conv | %, € | Giornaliera | Google Ads CVR ~4–5% (Search, indicativo); Meta ~1–2% (indicativo) | Finestra di attribuzione incide fortemente | Contare conversioni view-through come equivalenti al click |
| Vendite | Revenue, ROAS, AOV | Units sold, Conversion value | ROAS = Revenue attributa ÷ Spesa | x, € | Giornaliera/settimanale | ROAS medio e-commerce 2.87x (2025) [16]; target sano 4–6x | Non considera costi non pubblicitari (COGS) | Confrontare ROAS platform-reported senza validazione incrementale |
| Acquisizione clienti | CAC, New Customers | CPA, LTV:CAC ratio | CAC = Spesa totale mktg ÷ Nuovi clienti acquisiti | € | Mensile | LTV:CAC target ≥ 3:1 [16] | Richiede separazione costi brand vs. acquisition | Confondere CAC con CPA di una singola campagna |
| Retention | Retention Rate, Churn Rate | MAU/DAU, Feature adoption | Churn = (Clienti inizio − fine) ÷ Clienti inizio × 100 | % | Mensile/trimestrale | SaaS churn sano <5%/anno (indicativo) | Difficile attribuire il churn a una singola campagna | Misurare retention solo su cohort recenti |
| Fidelizzazione | Repeat Purchase Rate, Purchase Frequency, NPS | Program enrollment, CLV | RPR = Clienti con ≥2 acquisti ÷ Clienti totali × 100 | % | Mensile | Dipende da settore | Confonde fidelizzazione comportamentale con attitudinale | Non distinguere fedeltà da abitudine di acquisto |
| CLV/LTV | Customer Lifetime Value | AOV, Purchase Frequency, Churn Rate | CLV = AOV × Frequenza × (1 ÷ Churn Rate) | € | Trimestrale/annuale | Target LTV:CAC ≥ 3:1 [16] | Previsionale; molto sensibile all'assunzione di churn | Calcolare CLV su cohort troppo giovani |
| Riattivazione | Reactivation Rate, Revenue da win-back | Email open rate, CPA riattivazione | Reactivation Rate = Clienti riattivati ÷ Dormienti contattati × 100 | % | Per campagna | 5–10% per email win-back (indicativo) | Rischio di aumentare le disiscrizioni | Contattare troppo frequentemente i clienti dormienti |
| App Install | Installs, CPI, Day-7 Retention | CTR, CVR, IPM | CPI = Spesa ÷ Installs | €, numero | Giornaliera | CPI globale $1–4 (Android) / $2–6 (iOS) (indicativo) [16] | iOS SKAdNetwork limita il tracking post-iOS 14 | Ottimizzare su installs senza considerare la retention post-install |
| Download | Download Volume, CPD | Landing page CVR, Time on page | CPD = Spesa ÷ Download | € | Per campagna | Dipende da tipo di contenuto e settore | Download ≠ contenuto letto/utilizzato | Non qualificare il contenuto scaricato per attribuire il lead |
| Partecipazione eventi | Registrazioni, CPR, Attendees | Show-up rate, Engagement post-evento | CPR = Spesa ÷ Registrazioni | € | Per campagna | Show-up rate ~50–70% per webinar (indicativo) | Registrazione ≠ partecipazione reale | Misurare solo le registrazioni e non i partecipanti effettivi |
| Educazione mercato | Content Completion Rate, Knowledge Lift | Time on content, Share rate, Branded search | Completion Rate = Completamenti ÷ Avvii × 100 | % | Per campagna | VTR YouTube ~31.8% [14] | Difficile misurare la comprensione reale | Usare proxy (click, time) come misura diretta di apprendimento |
| Posizionamento | Brand Association Lift, Attribute Perception | SOV, Share of Search | Brand Assoc. Lift = % associazione esposti − % controllo | pp | Pre/post semestrale | Via Brand Lift Study [4, 5] | Effetti di lungo periodo; costoso da misurare | Misurare il posizionamento subito dopo la campagna (effetti latenti) |
| Reputazione | Sentiment Score, NPS | Media mentions, Review score | Sentiment = (Menzioni positive − negative) ÷ totale × 100 | % | Settimanale/mensile | NPS medio settori tech 40–60 (indicativo) | I tool NLP non colgono ironia e contesto | Confondere volume di menzioni con qualità del sentiment |
| Preferenza di marca | Brand Preference Index, Purchase Intent | Consideration, SOV | Preference Lift = % preferenza esposti − % controllo | pp | Pre/post campagna | Via brand tracking survey (Kantar BrandDynamics) | Dichiarazione di preferenza non predice l'acquisto | Non separare la preferenza dall'abitudine di acquisto |
| Advocacy | NPS, Referral Rate, UGC Volume | Review score, Ambassador engagement, Share rate | NPS = % Promotori − % Detrattori | score −100/+100 | Trimestrale | NPS tech ~40–60 (indicativo) [22] | Bassa response rate alle survey NPS; response bias | Usare NPS come unica metrica di advocacy |

---

## 3. Mappatura Obiettivo → KPI

| Obiettivo di business | Obiettivo pubblicitario | KPI principali | KPI secondari | Metriche economiche |
|-----------------------|------------------------|----------------|---------------|---------------------|
| Crescita notorietà brand | Brand Awareness | Brand Awareness Lift, Reach, SOV | Impressions, Frequency, GRP | CPM |
| Copertura massima target | Reach e Copertura | Net Reach %, Frequency | CPM, GRP, TRP | CPM |
| Ricordo del messaggio | Brand Recall | Ad Recall Lift, Recall Score | Frequency, VTR | CPM, Cost per Lifted User |
| Entrare nel consideration set | Considerazione | Consideration Lift, Branded Search | CTR, Time on site | CPM, CPC |
| Generare curiosità attiva | Interesse | CTR, Video Completion Rate, Dwell Time | Pages/session, Scroll depth | CPC, CPV |
| Stimolare interazione social | Engagement | Engagement Rate, Interactions | Commenti, Condivisioni, Saves | CPE (Cost per Engagement) |
| Aumentare traffico | Traffico sito/PDV | Sessions, Store Visits, Unique Visitors | Bounce Rate, Time on site | CPC, Cost per Visit |
| Generare contatti qualificati | Lead Generation | Lead Volume, CPL, Lead Quality | Form fill rate, CVR LP | CPL |
| Generare azioni utente | Conversione | CVR, CPA, Conversioni totali | Assisted Conversions, Micro-conversioni | CPA |
| Aumentare fatturato | Vendite | Revenue, ROAS, AOV | Units sold, Basket value | ROAS, ROI |
| Crescita base clienti | Acquisizione clienti | New Customers, CAC | CPA, LTV:CAC | CAC, CPA |
| Ridurre abbandono | Retention | Retention Rate, Churn Rate | MAU, Feature adoption | Revenue retained |
| Clienti abituali | Fidelizzazione | Repeat Purchase Rate, NPS | Program enrollment, CLV | LTV, MER |
| Massimizzare valore cliente | CLV | CLV, Purchase Frequency | AOV, Churn Rate | LTV:CAC |
| Recuperare clienti persi | Riattivazione | Reactivation Rate, Revenue win-back | Email open rate, CTR | CPA riattivazione |
| Crescita utenti app | App Install | Installs, Day-7 Retention | CPI, IPM | CPI, ROAS in-app |
| Distribuzione contenuti | Download | Download Volume, Lead Quality | CPD, Time on page | CPD |
| Partecipanti a eventi | Partecipazione eventi | Registrazioni, Attendees | Show-up rate, CPR | CPR |
| Formare il mercato | Educazione del mercato | Content Completion, Knowledge Lift | Time on content, Share | CPM, CPC |
| Definire identità brand | Posizionamento | Brand Association Lift, Attribute Perception | SOV, Share of Search | CPM (brand) |
| Costruire fiducia | Reputazione | Sentiment Score, NPS | Media coverage, Review score | PR Value (indicativo) |
| Differenziarsi dai competitor | Preferenza di marca | Brand Preference Index, Purchase Intent | SOV, Consideration | CPM (brand) |
| Generare passaparola | Advocacy | NPS, Referral Rate, UGC Volume | Ambassador activity, Share rate | Revenue da referral |

---

## 4. KPI per piattaforma

### 4.1 Google Ads

**Metriche disponibili.** Impressions, Click, CTR, CPC, Quality Score, Conversioni, CVR, CPA, ROAS, Impression Share, Search Impression Share, Reach e Frequency (Display), View Rate (YouTube), VTR, CPV, Brand Lift (YouTube: Ad Recall, Awareness, Consideration, Purchase Intent, Brand Association) [4].

**KPI nativi per obiettivo:**

| Obiettivo | KPI nativo Google |
|-----------|------------------|
| Search / Traffico / Conversione | CTR, CVR, CPA, ROAS |
| Display Awareness | Reach, Frequency, Impressions, CPM |
| YouTube Brand | VTR, Brand Lift Study (Ad Recall, Awareness, Consideration) [4] |
| Shopping / Vendite | ROAS, Revenue, Conversion Value |
| App Install | CPI, Installs, In-app events (Google UAC) |

**Benchmark 2025–2026 [1]:**

| KPI | Valore medio (cross-industry) |
|-----|-------------------------------|
| Search CTR | ~6.66% |
| Search CPC | ~$5.26 |
| Display CTR | ~0.35% (indicativo) |

**Limiti.** Finestra di attribuzione default 30 giorni (modificabile); Brand Lift Study richiede soglia minima di spesa e durata ≥10 giorni [4]; Impression Share non disponibile su YouTube; iOS 14+ riduce la granularità del tracciamento su app.

---

### 4.2 Meta Ads (Facebook + Instagram)

**Metriche disponibili.** Impressions, Reach, Frequency, CTR (Link e All), CPC, CPM, CPL, CPA, ROAS (Purchase), Conversion Value, ThruPlay, Video View Rate, 3-sec Video Views, Post Engagement, Reactions/Comments/Shares, Lead Form CVR, Estimated Ad Recall Lift, Brand Lift Study.

**KPI nativi per obiettivo:**

| Obiettivo | KPI nativo Meta |
|-----------|----------------|
| Awareness | Reach, CPM, Estimated Ad Recall Lift |
| Engagement | Post Engagement, Reactions, Shares, CPE |
| Traffico | Link Clicks, CTR, CPC |
| Lead Gen | Lead Volume, CPL, Form CVR |
| Conversione / Vendite | Purchase Conversions, CPA, ROAS |
| Video | ThruPlay, 3-sec Views, VCR |

**Benchmark 2025–2026 [2, 3]:**

| KPI | Valore medio |
|-----|-------------|
| CTR Feed | 1.4%–2.2% |
| CPC | ~$1.72 (2026) |
| CPM | ~$13.48 (mediana 2026) |
| ROAS mediano | 1.93x |

**Limiti.** iOS 14+ (ATT) ha ridotto il tracciamento granulare su iOS; Meta usa *modeled conversions* per stimare le conversioni non direttamente tracciabili; Estimated Ad Recall Lift è una proiezione algoritmica, non un Brand Lift Study vero; il ROAS platform può sovrastimare fino a 2.3x rispetto all'incrementale reale [16].

---

### 4.3 LinkedIn Ads

**Metriche disponibili.** Impressions, Clicks, CTR, CPC, CPM, CPL, Lead Form CVR, Conversion Rate, CPA, Engagement Rate (Sponsored Content), Video Views, VTR, Follower Gain, Company/Job targeting analytics.

**KPI nativi per obiettivo:**

| Obiettivo | KPI nativo LinkedIn |
|-----------|---------------------|
| Brand Awareness B2B | Reach, Impressions, CPM |
| Lead Gen B2B | Leads (Lead Gen Form), CPL, CVR |
| Consideration | CTR, Clicks, Video Views |
| Conversione | Website Conversions, CPA |

**Benchmark 2026 [12]:**

| KPI | Valore medio |
|-----|-------------|
| CTR Sponsored Content | 0.44%–0.65% |
| CPC | $5.50–$8.50 (cross-industry) |
| CPM | $30–$50 |
| CVR Lead Gen Form | ~6.1% (vs ~1.2% landing page esterna) |

**Limiti.** Piattaforma costosa per impression rispetto ad altri canali; efficace principalmente per B2B; il conversion tracking richiede il LinkedIn Insight Tag installato sul sito; il Brand Lift Study non è nativo (si usa survey esterna o terze parti).

---

### 4.4 TikTok Ads

**Metriche disponibili.** Impressions, Reach, Frequency, Click, CTR, CPC, CPM, Video Views (2s, 6s, completi), VCR, Engagement Rate (Like, Comment, Share, Save), CPE, Conversions, CVR, CPA, ROAS, Cost per Install.

**KPI nativi per obiettivo:**

| Obiettivo | KPI nativo TikTok |
|-----------|------------------|
| Awareness | Reach, CPM, 6-sec Video Views |
| Engagement | Engagement Rate, Like/Comment/Share, CPE |
| Traffico | Click, CTR, CPC |
| Conversione | Conversions, CPA, ROAS |
| App Install | Installs, CPI |

**Benchmark 2026 [13]:**

| KPI | Valore medio |
|-----|-------------|
| CTR (standard in-feed) | 0.84% |
| CPM | $4.80–$13.26 |
| Engagement Rate | 4.07% |
| CVR | ~1.92%–2.01% |
| Spark Ads CTR | ~2.4% |
| TopView CTR | 12%–16% |

**Limiti.** Audience primaria giovane (Gen Z/Millennial); pixel di tracciamento meno maturo di Meta; ROAS tende a essere inferiore rispetto a canali più bottom-funnel; SKAdNetwork su iOS limita il tracciamento granulare post-iOS 14.

---

### 4.5 YouTube Ads

**Metriche disponibili.** Impressions, Views, View Rate (VTR), CPV, CTR, Reach, Frequency, Skip Rate, Average View Duration, Completion Rate (25%/50%/75%/100%), Brand Lift Study (Ad Recall, Awareness, Consideration, Purchase Intent, Brand Association, Favorability) [4].

**KPI nativi per obiettivo:**

| Obiettivo | KPI nativo YouTube |
|-----------|-------------------|
| Brand Awareness | Reach, Impressions, CPM, Brand Lift Awareness |
| Brand Recall | Ad Recall Lift (Brand Lift Study) [4] |
| Consideration | View Rate, Completion Rate, Brand Lift Consideration |
| Conversione | CVR, CPA (campagne direct response) |
| App Install | Installs, CPI (Google UAC) |

**Benchmark 2026 [14]:**

| KPI | Valore medio |
|-----|-------------|
| CTR | 0.514%–0.65% |
| VTR (skippable in-stream) | ~31.8% (cross-industry) |
| CPV | $0.022–$0.038 |
| Skip Rate | ~65% |

**Brand Lift — metodologia [4].** Randomized Control Trial (RCT): due gruppi (esposto / controllo) + survey one-question post-esposizione. Metriche prodotte: Absolute Lift (pp), Relative Lift (%), Headroom Lift, Lifted Users, Cost per Lifted User. Durata minima: 10 giorni con soglia di spesa da raggiungere.

**Limiti.** Brand Lift Study richiede budget minimo significativo; YouTube non traccia conversioni offline; lo skip rate elevato riduce l'esposizione effettiva nei formati skippable.

---

### 4.6 Programmatic Advertising (Display / Video / DOOH)

**Metriche disponibili (digitale).** Impressions, Reach, Frequency, CTR, Viewability Rate (standard IAB/MRC: ≥50% pixel visibili per ≥1 secondo), CPM, CPC, CPA, Completion Rate (video: 25/50/75/100%), IVT Rate (Invalid Traffic), Brand Safety Score, Contextual Relevance Score.

**KPI per obiettivo:**

| Obiettivo | KPI programmatic |
|-----------|-----------------|
| Awareness / Reach | CPM, Viewability, Reach, Frequency |
| Brand Safety | % Brand Safe Impressions, IVT Rate |
| Performance | CPA, CTR, ROAS |
| Video | Completion Rate per quartile |

**Benchmark indicativi.** Viewability display: >70% (benchmark IAB, indicativo); IVT rate: soglia di allerta >10%.

**Limiti.** Fraud (IVT) rilevante; viewability ≠ attenzione reale; deprecation dei cookie di terza parte impatta l'audience targeting; Brand Safety richiede partnership con verification provider (IAS, DoubleVerify).

---

### 4.7 Email Marketing

**Metriche disponibili.** Open Rate, Click Rate (CTR), Click-to-Open Rate (CTOR), Bounce Rate (hard/soft), Unsubscribe Rate, Spam Complaint Rate, Conversion Rate, Revenue per Email, List Growth Rate, Deliverability Rate.

**KPI per obiettivo:**

| Obiettivo | KPI Email |
|-----------|----------|
| Retention / Engagement | Open Rate, CTR, CTOR |
| Conversione / Vendite | CVR, Revenue per Email, CPA |
| Lead Nurturing | Open Rate, CTR su contenuto middle-funnel |
| Riattivazione | Reactivation Rate, CTR win-back email |

**Benchmark 2025–2026 [15]:**

| KPI | Valore medio |
|-----|-------------|
| Open Rate (cross-industry) | 19.21%–43.46% (varia per metodologia) |
| CTR | 2.44% |
| CTOR | 6.81% |
| Unsubscribe Rate | <0.5% (sano) |
| Open Rate — Non-profit | 52.38% |
| Open Rate — E-commerce | 32.67% |

**Limiti.** Apple Mail Privacy Protection (MPP, iOS 15+) gonfia gli open rate con aperture fittizie; CTOR è metrica più affidabile dell'open rate; spam filter riducono la deliverability; i benchmark variano significativamente per settore e metodologia di calcolo.

---

### 4.8 SEO (Search Engine Optimization)

**Metriche disponibili.** Organic Sessions, Organic CTR, Average Position (Google Search Console), Domain Authority/Rating, Backlinks, Keyword Rankings, Branded vs. Non-Branded Traffic, Impressions (Search), Bounce Rate, Time on Page, Organic Conversion Rate.

**KPI per obiettivo:**

| Obiettivo | KPI SEO |
|-----------|---------|
| Awareness / Traffico | Organic Sessions, Impressions (GSC) |
| Posizionamento brand | Branded Search Volume, Share of Search |
| Considerazione | Organic CTR, Top-3 Rankings per keyword target |
| Conversione | Organic CVR, Organic Revenue |

**Limiti.** Effetti di lungo periodo (3–12 mesi prima dei risultati significativi); algoritmi Google non completamente trasparenti; difficile isolare il contributo SEO dall'effetto brand; non misurabile con precision attribution come il paid.

---

### 4.9 Campagne offline — TV, Radio, Stampa, OOH/DOOH

**TV:**

| Metrica | Definizione |
|---------|-------------|
| GRP (Gross Rating Point) | Reach% × Frequency — misura la pressione pubblicitaria totale |
| TRP (Target Rating Point) | GRP calcolato sul solo target di riferimento |
| Reach % | % del target esposto almeno una volta |
| Frequency | Numero medio di esposizioni per individuo esposto |
| OTS (Opportunity to See) | Occasioni di contatto con il messaggio |
| CPG (Cost per GRP) | Costo per ogni punto di GRP |
| ATS (Average Time Spent) | Tempo medio di visione |

Limiti: non misura l'azione diretta; delay tra esposizione e effetto; i dati HbbTV/set-top-box migliorano la granularità ma non coprono tutte le TV.

**Radio:**
- Metriche: GRP radio, Reach, Frequency, CPM, AQH (Average Quarter Hour)
- Limiti: misura panelistica (Audiradio in Italia); difficile correlazione con azioni digitali

**Stampa:**
- Metriche: Diffusione certificata (copie), Readership, OTS, CPT (Cost per Thousand readers)
- Limiti: in forte calo strutturale; misura la diffusione, non l'attenzione

**OOH/DOOH — metriche specifiche [9, 10, 11]:**

| Metrica | Definizione | Metodologia |
|---------|-------------|-------------|
| Impressions OOH | Esposizioni totali stimate (visite × moltiplicatore audience) | Mobile location data + traffic counts (Geopath, Nielsen) |
| CPM OOH | Costo per 1.000 impressions | Spesa ÷ Impressions × 1.000 |
| Share of Audience | % del traffico esposta al formato specifico | Panel / mobile data aggregati |
| Foot Traffic Lift | Incremento visite al negozio post-campagna | Location data (Foursquare, Placer.ai) |
| Brand Lift DOOH | Lift su awareness/recall post-campagna | Survey geofenced (Happydemics, Dynata) [23] |
| Viewability DOOH | % schermi attivi durante l'esposizione stimata | Proof-of-play log + sensori |
| Drive-to-Web | Incremento traffico web/app post-esposizione OOH | UTM + modelli econometrici + branded search |
| Reach & Frequency OOH | Individui unici × frequenza media esposizione | Mobile panel + modelli probabilistici |

Limiti: misura audience modellata, non individuale; attribuzione a singolo pannello difficile; GDPR (EU) limita l'uso di Mobile ID per il tracciamento della location.

---

## 5. Metriche economiche

### 5.1 CPA — Cost per Acquisition

**Definizione.** Costo sostenuto per ottenere una singola conversione/azione desiderata.

**Formula.** `CPA = Spesa totale ÷ Conversioni`

**Quando usare.** Performance campaign con obiettivo azione specifica; utile per ottimizzazione automatica (target CPA Google/Meta).

**Obiettivi collegati.** Conversione, Lead Generation, App Install, Vendite, Riattivazione.

**Limite.** CPA varia in base al valore dell'azione: un CPA alto su un'azione ad alto valore (es. contratto enterprise) può essere ottimo. Confrontare CPA tra campagne con obiettivi diversi è fuorviante.

---

### 5.2 CPL — Cost per Lead

**Definizione.** Variante del CPA specifica per la lead generation.

**Formula.** `CPL = Spesa ÷ Lead acquisiti`

**Benchmark indicativi 2026 [12].** LinkedIn Lead Gen Form: $60–$200 (B2B enterprise); Meta Lead Ads: $20–$60 (consumer).

**Limite.** Non misura la qualità del lead. Un CPL basso con lead non qualificati genera spreco di risorse sales; la metrica va sempre integrata con Lead Quality Score e tasso di conversione MQL → SQL.

---

### 5.3 CPC — Cost per Click

**Definizione.** Costo per ogni click sull'annuncio.

**Formula.** `CPC = Spesa ÷ Click`

**Benchmark indicativi 2026 [1, 2, 12, 13].** Google Search ~$5.26; Meta ~$1.72; LinkedIn ~$5.74; TikTok ~$0.50.

**Limite.** Click di bassa qualità (bounce immediato) non aggiungono valore. CPC basso ≠ efficienza se il CVR è basso. Su mobile, gli accidental click gonfiano il CTR.

---

### 5.4 CPM — Cost per Mille

**Definizione.** Costo per 1.000 impressions. Standard di acquisto per campagne di awareness.

**Formula.** `CPM = (Spesa ÷ Impressions) × 1.000`

**Benchmark indicativi 2026 [2, 3, 12, 13, 14].** Meta mediana ~$13.48; LinkedIn $30–$50; TikTok $4.80–$13.26; YouTube variabile per formato.

**Limite.** Non misura attenzione o ricordo; esistono impressions non viewable; non è comparabile tra piattaforme senza normalizzazione per formato e viewability.

---

### 5.5 CTR — Click-Through Rate

**Definizione.** Percentuale di impressions che generano un click.

**Formula.** `CTR = (Click ÷ Impressions) × 100`

**Benchmark indicativi 2026 [1, 2, 12, 13, 14].** Google Search 6.66%; Meta Feed 1.4%–2.2%; LinkedIn 0.44%–0.65%; TikTok 0.84%; YouTube 0.514%.

**Limite.** CTR alto ≠ campagna efficace se il CVR è basso. Può essere gonfiato da accidental click su mobile. Non è confrontabile tra piattaforme diverse senza contesto.

---

### 5.6 ROAS — Return on Ad Spend

**Definizione.** Ricavo generato per ogni euro di spesa pubblicitaria.

**Formula.** `ROAS = Revenue attributa alla campagna ÷ Spesa pubblicitaria`

**Benchmark indicativi 2025–2026 [16].** Medio e-commerce 2.87x (2025); target sano 4–6x; Google Ads 3.52x; Meta 1.86x; TikTok 1.41x.

**Limite.** Il ROAS platform-reported sovrastima in media di 2.3x rispetto all'incrementale reale [16]. Non considera i margini (COGS). Dipende fortemente dalla finestra di attribuzione. Non applicabile a campagne brand. È una metrica di efficienza dei media, non di profittabilità del business.

---

### 5.7 ROI — Return on Investment

**Definizione.** Ritorno sull'investimento complessivo di marketing, inclusi i costi non media.

**Formula.** `ROI = (Profitto netto da campagna − Investimento totale) ÷ Investimento totale × 100`

**Quando usare.** Valutazione strategica di medio-lungo periodo; budget review annuale; confronto tra canali.

**Limite.** Richiede attribuzione affidabile e dati di margine completi. Difficile calcolare su campagne brand pure. Confuso frequentemente con ROAS (che usa revenue lordi, non profitto netto).

---

### 5.8 MER — Marketing Efficiency Ratio

**Definizione.** Revenue totale dell'azienda divisa per la spesa totale di marketing. Metrica portfolio-level che supera i limiti del ROAS per-canale, includendo anche i canali non tracciabili a livello di singola conversione.

**Formula.** `MER = Revenue totale ÷ Spesa totale marketing`

**Quando usare.** Brand con campagne su più canali (brand + performance); utile come health metric mensile; particolarmente rilevante per DTC e-commerce [16].

**Limite.** Non granulare per canale; non distingue tra effetti brand e performance; utile come guardrail di sistema, non come segnale di ottimizzazione singola campagna.

---

### 5.9 CAC — Customer Acquisition Cost

**Definizione.** Costo totale (marketing + sales + overhead allocato) per acquisire un nuovo cliente pagante.

**Formula.** `CAC = (Spesa Marketing + Spesa Sales) ÷ Nuovi Clienti nel periodo`

**Benchmark.** Target LTV:CAC ≥ 3:1; Payback Period ≤ 12 mesi (SaaS B2B) [16].

**Limite.** Distorto dal mix di canali; difficile separare brand awareness da direct acquisition nel calcolo; non confrontabile tra business model diversi (es. SaaS vs. e-commerce).

---

### 5.10 LTV — Lifetime Value (Customer Lifetime Value)

**Definizione.** Valore economico complessivo generato da un cliente nell'intera relazione con il brand.

**Formula semplificata.** `LTV = AOV × Frequenza d'acquisto annua × Anni di relazione media`

**Formula avanzata.** `LTV = (Revenue media per cliente × Gross Margin) ÷ Churn Rate`

**Quando usare.** Pianificazione budget CAC; valutazione sostenibilità dell'acquisition; segmentazione clienti per valore.

**Limite.** È una metrica previsionale; molto sensibile all'assunzione di churn; cohort recenti tendono a sovrastimare il LTV.

---

### 5.11 Payback Period

**Definizione.** Tempo necessario a recuperare il CAC attraverso i margini generati dal cliente.

**Formula.** `Payback Period (mesi) = CAC ÷ (Revenue mensile per cliente × Gross Margin)`

**Benchmark.** Payback ≤ 12 mesi considerato sano per SaaS B2B [16].

**Limite.** Non considera il valore temporale del denaro; dipende dalla stabilità del churn nel tempo.

---

### 5.12 Incremental Lift

**Definizione.** Incremento reale in una metrica (vendite, visite, conversioni) attribuibile causalmente alla campagna, al netto di ciò che sarebbe accaduto comunque (baseline organica).

**Formula.** `Incremental Lift = (Metrica esposti − Metrica controllo) ÷ Metrica controllo × 100`

**Quando usare.** Validazione del valore reale di una campagna tramite geo-lift test, holdout test, Brand Lift Study.

**Limite.** Richiede test controllati (A/B su geo o audience); non accessibile a tutti i budget; difficile applicare su canali OOH senza setup sperimentale dedicato.

---

### 5.13 Cost per Incremental Conversion (CPIC)

**Definizione.** Costo per ottenere una conversione incrementale reale, al netto del baseline organico. È la versione aggiustata del CPA platform-reported.

**Formula.** `CPIC = Spesa ÷ Conversioni incrementali`

**Quando usare.** Post holdout/geo test; valutazione vera efficienza di una campagna.

**Limite.** Richiede un test controllato; non disponibile in real-time; richiede volumi sufficienti per la significatività statistica.

---

## 6. Metriche di brand

Le metriche di brand misurano effetti che le metriche di performance non colgono: la costruzione di valore nella mente del consumatore. Secondo Binet & Field (IPA), queste metriche predicono la crescita di lungo periodo meglio delle metriche di performance a breve termine [6, 7].

### 6.1 Brand Awareness

**Definizione.** Percentuale del target che conosce o riconosce il brand.

**Metodologia.** Survey *aided* e *unaided* su panel rappresentativi. Standard Nielsen, Kantar BrandZ, GfK [17]. Per il digitale: Brand Lift Study Google (YouTube) o Meta.

---

### 6.2 Brand Recall / Ad Recall

**Brand Recall.** Capacità di ricordare spontaneamente un brand in una categoria senza stimolo.
**Ad Recall.** Capacità di ricordare uno specifico annuncio pubblicitario dopo l'esposizione.

**Metodologia.** Brand Lift Study (Google, Meta) tramite RCT + survey one-question [4]; panel tradizionali (Kantar Link, Millward Brown); tracking continuativo brandZ.

---

### 6.3 Share of Voice (SOV)

**Definizione.** Quota delle esposizioni pubblicitarie del brand sul totale della categoria.

**Formula.** `SOV = Spesa/GRP brand ÷ Spesa/GRP totale categoria × 100`

**Correlazione con la crescita.** Binet & Field (IPA) e Nielsen mostrano che un brand con SOV superiore alla propria market share tende a crescere nel tempo — il concetto di *Excess Share of Voice* (ESOV) [6, 7, 17].

**Strumenti.** Nielsen Ad Intel, Kantar Media, WARC Data; per il digitale: Impression Share in Google Ads; SEMrush per la search.

---

### 6.4 Share of Search

**Definizione.** Quota di ricerche relative al brand sul totale delle ricerche di categoria.

**Formula.** `Share of Search = Ricerche brand ÷ Ricerche totale categoria × 100`

**Rilevanza strategica.** Kantar e la ricerca di Tom Roach (2025) mostrano che la Share of Search è un *leading indicator* della market share e della brand health in molte categorie [18, 24].

**Strumenti.** Google Trends, Google Search Console, SEMrush, Kantar.

**Limite.** Categorie con bassi volumi di ricerca (es. B2B niche, OOH) possono avere dati troppo ridotti per essere statisticamente significativi.

---

### 6.5 Brand Lift

**Definizione.** Incremento su metriche di brand (awareness, recall, consideration, purchase intent) misurato tramite RCT su esposti vs. controllo [4, 5].

**Metodologia.** Google Brand Lift Study (YouTube/Display), Meta Brand Lift Study, Happydemics (DOOH) [23], survey panel (Kantar, Dynata).

**Metriche misurate (Google [4]).** Absolute Lift (pp), Relative Lift (%), Headroom Lift (margine di crescita residuo), Lifted Users, Cost per Lifted User.

**Benchmark.** Lift medio YouTube: +3–5 pp su Ad Recall per campagne ben targettizzate [4].

---

### 6.6 Sentiment

**Definizione.** Tonalità delle menzioni del brand sui media digitali (social, news, review): positivo, neutro, negativo.

**Metodologia.** NLP/AI su dati social e news (Brandwatch, Sprinklr, Talkwalker); survey.

**Formula.** `Sentiment Score = (Menzioni positive − negative) ÷ totale × 100`

**Limite.** I tool NLP faticano con ironia, sarcasmo e contesto culturale. Il volume di menzioni può essere distorto da eventi esterni non correlati alla campagna.

---

### 6.7 NPS — Net Promoter Score

**Definizione.** Misura la propensione a raccomandare il brand su scala 0–10. Promotori (9–10) − Detrattori (0–6) = NPS nell'intervallo [−100, +100].

**Metodologia.** Survey post-acquisto o periodica. Introdotto da Fred Reichheld (Bain & Company, 2003) sull'*Harvard Business Review* [22].

**Formula.** `NPS = % Promotori − % Detrattori`

**Benchmark indicativi.** Tech: 40–60; Retail: 30–50; Telecomunicazioni: 20–40 (indicativi).

**Limite.** Response bias (tendenzialmente rispondono i clienti polarizzati); varia per cultura e momento del ciclo di vita del cliente; bassa correlazione diretta con la revenue in alcuni settori se usato isolatamente.

---

### 6.8 Consideration

**Definizione.** Percentuale del target che include il brand nel *consideration set* prima di un acquisto.

**Metodologia.** Survey ("Quale brand prenderesti in considerazione per acquistare…?"); Brand Lift Study Google/Meta [4].

---

### 6.9 Brand Preference

**Definizione.** Percentuale del target che preferirebbe il brand rispetto ai competitor in una situazione di scelta libera.

**Metodologia.** Survey forced-choice; Kantar Brand Health Tracking; Millward Brown BrandDynamics.

---

### 6.10 Purchase Intent

**Definizione.** Dichiarazione esplicita di intenzione di acquisto a breve-medio termine.

**Metodologia.** Survey ("Hai intenzione di acquistare il brand X nei prossimi 3 mesi?"); Brand Lift Study Google misura "Purchase Intent" come metrica opzionale [4].

**Limite.** *Intention-behavior gap*: la dichiarazione di intent non predice necessariamente l'acquisto effettivo; il gap stimato è del 20–40% in molte categorie.

---

## 7. Framework internazionali

### 7.1 AIDA

**Autore/Anno.** E. St. Elmo Lewis, 1898 (rivisto nel corso del '900).

**Struttura.** Awareness → Interest → Desire → Action.

| Fase AIDA | Obiettivo | KPI |
|-----------|-----------|-----|
| Awareness | Brand Awareness | Impressions, Reach, Brand Awareness Lift |
| Interest | Interesse | CTR, Time on page, Video Views |
| Desire | Considerazione | Branded Search, Consideration Lift, Purchase Intent |
| Action | Conversione | CVR, CPA, Revenue |

**Limiti.** Modello lineare, non prevede loyalty né advocacy; presuppone un processo decisionale razionale; difficile applicare a categorie a basso coinvolgimento (impulso).

---

### 7.2 DAGMAR

**Autore/Anno.** Russell H. Colley, 1961 — Association of National Advertisers.

**Struttura.** Awareness → Comprehension → Conviction → Action.

**Contributo principale.** Primo framework a insistere che gli obiettivi pubblicitari siano *comunicativi* (non di vendita), *misurabili*, *specifici per audience* e *time-bound* [20].

| Fase DAGMAR | KPI |
|-------------|-----|
| Awareness | Brand Awareness % target, Reach |
| Comprehension | Brand Knowledge Score, Message Recall |
| Conviction | Consideration, Purchase Intent |
| Action | Conversioni, Vendite |

**Limiti.** Approccio survey-centrico e costoso. Non prevede loyalty né post-acquisto. Presuppone processo lineare che raramente si verifica nella realtà digitale.

---

### 7.3 Hierarchy of Effects

**Autori/Anno.** Lavidge & Steiner, 1961 — *Journal of Marketing* [21].

**Struttura.** Awareness → Knowledge → Liking → Preference → Conviction → Purchase.

| Stadio | KPI |
|--------|-----|
| Awareness | Unaided Awareness, Reach |
| Knowledge | Brand Knowledge, Message Comprehension |
| Liking | Brand Favorability, Sentiment |
| Preference | Brand Preference Index |
| Conviction | Purchase Intent |
| Purchase | Conversioni, Vendite |

**Limiti.** Modello pre-digitale; non prevede il post-acquisto (loyalty, advocacy); processo non sempre lineare.

---

### 7.4 See-Think-Do-Care (STDC)

**Autore/Anno.** Avinash Kaushik, Google, 2013 [8].

**Struttura.** See (massima audience potenziale) → Think (audience in ricerca attiva) → Do (audience pronta all'acquisto) → Care (clienti esistenti).

| Fase STDC | Obiettivo | KPI primario | KPI secondario |
|-----------|-----------|-------------|----------------|
| See | Awareness, Reach | Reach, CPM, VTR | Impressions, Brand Lift |
| Think | Consideration, Interesse | CTR, Time on site, Video Completion | Branded Search, Consideration Lift |
| Do | Conversione, Vendite | CVR, CPA, ROAS | Revenue, New Customers |
| Care | Retention, Fidelizzazione | Retention Rate, NPS | CLV, Repeat Purchase Rate |

**Punti di forza.** Framework orientato al contenuto e all'intent del cliente; digitale-nativo; scalabile su tutti i canali; mette l'audience al centro della pianificazione [8].

---

### 7.5 Marketing Funnel (TOFU-MOFU-BOFU)

**Struttura.** Top of Funnel → Middle of Funnel → Bottom of Funnel.

| Fase | Obiettivi | KPI |
|------|-----------|-----|
| TOFU | Awareness, Reach, Engagement | Impressions, Reach, CPM, SOV |
| MOFU | Consideration, Lead Gen, Interesse | CTR, CPL, Video Views, Time on page |
| BOFU | Conversione, Vendite, Acquisizione | CVR, CPA, ROAS, Revenue |
| Post-funnel | Retention, Loyalty, Advocacy | Churn Rate, NPS, CLV, Referral Rate |

---

### 7.6 Pirate Metrics (AARRR)

**Autore/Anno.** Dave McClure, 2007 (500 Startups) — nata per startup e prodotti SaaS.

**Struttura.** Acquisition → Activation → Retention → Referral → Revenue.

| Fase AARRR | KPI |
|------------|-----|
| Acquisition | CAC, CPC, Installs, Leads, Organic Traffic |
| Activation | Day-1 Retention, Onboarding CVR, Feature Adoption |
| Retention | Retention Rate, Churn Rate, MAU/DAU |
| Referral | Referral Rate, NPS, Viral Coefficient |
| Revenue | MRR/ARR, LTV, ARPU |

**Limiti.** Progettato per prodotti digitali/subscription. Difficile applicare a FMCG, OOH tradizionale o prodotti fisici a basso ciclo di vita.

---

### 7.7 Full Funnel Marketing (Binet & Field)

**Concetto.** Approccio integrato che ottimizza su tutto il funnel simultaneamente, evitando la sub-ottimizzazione per fase. Binet & Field (IPA, 2013) hanno dimostrato — su 996 case study da 700 brand in 83 settori — che l'allocazione ottimale è circa **60% brand building / 40% activation** [6, 7].

| Tipo di investimento | % Budget (Binet & Field) | Obiettivo dominante | Orizzonte temporale |
|----------------------|--------------------------|---------------------|---------------------|
| Brand building (long) | ~60% | Awareness, SOV, Consideration, Posizionamento | 6–36 mesi |
| Sales activation (short) | ~40% | Conversione, Vendite, CPA | 0–3 mesi |

**KPI Full Funnel.** Brand Tracking (awareness, consideration, SOV) + Performance (ROAS, CPA, CVR) + Business (Revenue, CLV, Market Share).

---

### 7.8 Balanced Scorecard applicata al marketing

**Autori/Anno.** Kaplan & Norton, 1992 — *Harvard Business Review*.

**Struttura.** Quattro prospettive: Financial → Customer → Internal Processes → Learning & Growth.

| Prospettiva | KPI Marketing |
|-------------|--------------|
| Financial | ROAS, ROI, Revenue, MER, CLV |
| Customer | NPS, CLV, Churn Rate, Brand Loyalty, Preference |
| Internal Process | Time-to-market, Content Velocity, CPA, Campaign Quality Score |
| Learning & Growth | A/B Test Velocity, Attribution Model Accuracy, Team Upskilling |

---

### 7.9 OKR applicati al marketing

**Struttura.** Objective (qualitativo, ispirazionale) + Key Results (misurabili, time-bound, 3–5 per obiettivo).

**Esempio applicato a Gravity:**

| Objective | Key Results |
|-----------|-------------|
| "Diventare brand di riferimento nel segmento DOOH in Italia" | KR1: Brand Awareness +10 pp tra media owner italiani (Brand Lift Study, Q4 2026) |
| | KR2: Share of Voice 30% nel segmento DOOH (Nielsen Ad Intel, Q4 2026) |
| | KR3: 500 lead qualificati a CPL ≤ €80 (CRM, Q4 2026) |

**Punti di forza.** Allineamento tra obiettivi business e marketing; cadenza trimestrale con revisione; trasparenza organizzativa. **Limiti.** Non è un framework di misurazione ma di goal-setting: richiede una metodologia di KPI sottostante.

---

### 7.10 Tavola comparativa framework

| Framework | Anno | Fasi | Tipo | Punti di forza | Limiti |
|-----------|------|------|------|----------------|--------|
| AIDA | 1898 | 4 | Sequenziale | Semplice, universalmente noto | Lineare, pre-digitale, no loyalty |
| DAGMAR | 1961 | 4 | Comunicativo | Obiettivi misurabili e time-bound | Costoso, no post-acquisto |
| Hierarchy of Effects | 1961 | 6 | Cognitivo/attitudinale | Granularità psicologica | Pre-digitale, lineare |
| See-Think-Do-Care | 2013 | 4 | Audience intent | Digitale-nativo, content-first | Meno applicabile all'offline puro |
| Marketing Funnel TOFU-MOFU-BOFU | Anni '90–2000 | 3+1 | Processo | Universale, pratico | Incentiva sub-ottimizzazione per fase |
| Pirate Metrics AARRR | 2007 | 5 | SaaS/startup | Orientato alla crescita prodotto | Difficile per non-digital |
| Full Funnel (Binet & Field) | 2013 | 2 | Econometrico | Evidence-based, 996 casi reali | Richiede dati storici lunghi |
| Balanced Scorecard | 1992 | 4 | Strategico | Visione olistica 360° | Complessità di implementazione |
| OKR | Anni '70–'80, pop. 2013 | 2 | Goal-setting | Allineamento organizzativo | Non è un sistema di misurazione |

---

## 8. Costruzione di un sistema di misurazione

### 8.1 La cascata Obiettivo → Dashboard

Un sistema di misurazione efficace parte dall'obiettivo di *business* (non dalla campagna) e scende fino alle metriche operative monitorate quotidianamente:

```
1. OBIETTIVO DI BUSINESS
   "Aumentare la quota di mercato nel segmento DOOH italiano del 5% entro 12 mesi"
          │
2. OBIETTIVO DI MARKETING
   "Aumentare la notorietà del brand Gravity tra i media owner italiani
    (target: 200 aziende con circuiti DOOH)"
          │
3. OBIETTIVO DI CAMPAGNA
   "Raggiungere il 70% del target con almeno 5 esposizioni entro Q4 2026"
          │
4. KPI (max 3-4, uno North Star)
   ★ Brand Awareness Lift +8 pp (Brand Lift Study — metrica North Star)
   • Reach target ≥ 70%
   • Frequency media ≥ 5
   • Share of Voice: 30% del segmento
          │
5. METRICHE OPERATIVE (segnali diagnostici in-flight)
   • CPM, Impressions, Reach settimanale (efficienza media)
   • CTR, VTR (diagnosi creativa)
   • Pacing spesa vs. budget
          │
6. DASHBOARD (cadenze diverse per livello)
   • Giornaliera: Impressions, Spend, Reach, Frequency, Pacing
   • Settimanale: CTR, CPM, VTR per piattaforma/formato
   • Mensile: SOV, Share of Search, Lead Volume, CPL
   • Post-campagna: Brand Lift Study, Foot Traffic Lift (se rilevante)
```

### 8.2 Principi di un buon sistema di misurazione

1. **North Star Metric.** Ogni campagna ha un solo KPI primario — quello che determina il successo o il fallimento. I KPI secondari sono diagnostici, non decisionali [19].

2. **Separare leading da lagging indicators.** CTR e VTR sono leading (segnali rapidi in-flight per ottimizzare); Brand Awareness e Revenue sono lagging (effetti di lungo periodo).

3. **Incrementalità prima di scala.** Prima di investire pesantemente su un canale, validarne l'incrementalità con un geo test o holdout [16].

4. **Attribution framework chiaro e coerente.** Scegliere un modello di attribuzione (last-click, data-driven, MMM) e non cambiarlo a campagna in corso per non rendere i dati incomparabili.

5. **Cadenza di revisione multi-livello:**

| Cadenza | Metriche monitorate | Decisione |
|---------|--------------------|-----------| 
| Giornaliera | Pacing, CPM, Frequenza anomale, Reach | Aggiustamenti budget/targeting in-flight |
| Settimanale | CTR, CVR, CPA per canale | Ottimizzazione creativa e bid |
| Mensile | ROAS, MER, pipeline lead, SOV | Ottimizzazione allocazione budget |
| Trimestrale / Annuale | LTV, NPS, Market Share, Brand Lift | Decisioni strategiche di investimento |

### 8.3 Esempio pratico — campagna brand OOH/DOOH Gravity

| Livello | Elemento | Valore target (esempio) |
|---------|----------|------------------------|
| Obiettivo business | Crescita nuovi tenant attivi | +10 tenant in 12 mesi |
| Obiettivo marketing | Brand awareness tra media owner italiani | Awareness 15% → 25% |
| Obiettivo campagna | Copertura circuiti DOOH + digital | Reach 70% target, ≥5 esposizioni |
| KPI North Star | Brand Awareness Lift (Brand Lift Study) | +8 pp |
| KPI secondario 1 | Lead da form/evento (modulo Commercial) | 50 lead qualificati |
| KPI secondario 2 | Share of Voice segmento DOOH | 30% |
| Metrica operativa | CPM, Impressions, Reach settimanale | Monitoraggio giornaliero |
| Dashboard | Gravity modulo Commercial + Brand Lift Study | Aggiornamento settimanale |

---

## 9. Best practice

### 9.1 Google / Think with Google [4, 5, 8]

- Misurare l'intero funnel, non solo i clic. Usare il framework **See-Think-Do-Care** per pianificare contenuti, canali e KPI per ogni fase di intent [8].
- Adottare il **Brand Lift Study** su YouTube per validare l'impatto sulle metriche di brand: è l'unico modo per misurare l'incrementalità reale dell'awareness rispetto alla baseline.
- Per campagne app: usare Google UAC con target CPA/ROAS e affidarsi ai segnali first-party post iOS 14+, non solo ai click.
- Combinare Search Impression Share con metriche di brand per avere una visione completa: "un'alta Impression Share su branded keyword è il segnale che il brand è presente nel momento di intenzione" [Think with Google].

### 9.2 Meta

- Usare **Conversion Lift / Brand Lift Study** per misurare l'incrementalità reale, non affidarsi esclusivamente al ROAS platform (che, come dimostrato da ricerche terze, sovrastima in media di 2.3x [16]).
- Valorizzare la **frequenza ottimale**: per brand building, 2–4 esposizioni/settimana per persona è un range indicativo. Per performance, ottimizzare su segnali strong (conversioni, non solo click).
- Integrare conversioni offline (store visits, chiamate) nel CAPI (Conversions API) per recuperare le conversioni perse con iOS 14+.

### 9.3 HubSpot

- Strutturare il marketing funnel come **flywheel**: Attract → Engage → Delight. I clienti soddisfatti diventano promotori e alimentano nuova acquisizione.
- KPI chiave per il funnel: MQL → SQL conversion rate; Customer Acquisition Rate; NPS per misurare il Delight.
- Importanza della **lead scoring** per non ottimizzare solo sul volume CPL, ma sulla qualità del lead e sul suo percorso verso il ricavo.

### 9.4 Nielsen [17]

- **Share of Voice come predictor di crescita**: brand con Excess SOV (SOV > market share) tendono a crescere nel tempo. Questo principio, ripreso da Binet & Field, ha evidenza su dati pluridecennali.
- La misurazione OOH è evoluta con i Mobile Measurement Panel (Geopath negli USA, Nielsen in EU): usare sempre dati di audience certificati da provider accreditati, non stime interne.
- Multi-touch attribution: Nielsen raccomanda di non usare il last-click per campagne multicanale — il last-click favorisce sistematicamente i canali bottom-funnel (Search) penalizzando quelli brand (OOH, TV, YouTube).

### 9.5 Gartner [19]

- Nel **2025 CMO Survey**, il 54% dei CMO prioritizza il performance marketing vs. il 22% che prioritizza il brand marketing. Gartner avverte esplicitamente del rischio di sotto-investimento strutturale in brand building nel lungo periodo.
- *"Marketing KPIs should cascade from business outcomes"*: evitare le vanity metric (impressions, follower count) come KPI primari.
- La sfida principale nella misurazione rimane l'attribuzione (citata come top challenge dal 39% dei marketer nel 2024 Tech Marketing Benchmarks Survey [19]).

### 9.6 McKinsey

- Le aziende che combinano **Marketing Mix Modeling (MMM)** con test incrementali ottengono un ROI di marketing 15–30% superiore rispetto a quelle che usano solo l'attribuzione platform-reported.
- Misurare il marketing su **tre orizzonti**: (1) short-term ROAS e CPA, (2) medio-term brand equity e consideration, (3) long-term LTV e market share.
- La **personalizzazione basata su first-party data** genera CVR 2–5x superiori rispetto alle campagne non segmentate.

### 9.7 IPA / WARC — Binet & Field [6, 7]

- **60/40 rule**: ~60% del budget in brand building (effetti di lungo periodo) e ~40% in sales activation (effetti immediati). Sotto-investire in brand erode l'efficacia futura dell'activation.
- *"Emotional campaigns outperform rational ones"* in termini di brand fame e crescita di lungo periodo.
- *"Short-term metrics can mislead"*: ottimizzare esclusivamente su CTR e CPA a breve termine può erodere il brand equity nel tempo, riducendo l'efficacia e alzando il CAC nelle campagne future.
- Le metriche di brand (awareness, consideration, SOV) devono essere misurate in parallelo a quelle di performance — non in sostituzione.

---

## 10. OOH/DOOH e Gravity

### 10.1 Specificità del canale OOH/DOOH

Il canale OOH (Out-of-Home) e il suo evoluto digitale DOOH (Digital OOH) hanno caratteristiche di misurazione uniche rispetto al digital advertising tracciato individualmente [9, 10, 11]:

- **One-to-many**: un singolo pannello può essere esposto a migliaia di persone contemporaneamente; l'impression è modellata statisticamente, non tracciata individualmente.
- **No cookie, no pixel**: il canale non traccia individui tramite cookie, pixel o ID utente; la misurazione si basa su dati di traffico, mobile location data aggregati e survey.
- **Programmatic DOOH**: l'acquisto programmatico introduce *proof-of-play log* (registrazione di ogni ad effettivamente servito), audience targeting per momento/luogo/condizione, e la possibilità di integrare dati first-party per il targeting.

### 10.2 Metriche OOH/DOOH e applicabilità in Gravity

| Metrica | Definizione | Metodologia | Applicabilità Gravity |
|---------|-------------|-------------|----------------------|
| Impressions | Esposizioni totali stimate (visite × moltiplicatore audience) | Mobile panel (Geopath/Nielsen) + traffic counts [17] | Sì — inventory impianti, planning |
| CPM | Costo per 1.000 impressions | Spesa ÷ Impressions × 1.000 | Sì — pricing e reporting campagne |
| Reach % | Individui unici esposti / target totale × 100 | Modelli probabilistici su mobile panel | Sì — planning campagne |
| Frequency | Esposizioni medie per individuo unico | Impressions ÷ Reach | Sì — planning |
| GRP / TRP | Gross/Target Rating Point (Reach% × Frequency) | Panel + mobile data | Sì — planning |
| Brand Lift DOOH | Lift su awareness/recall/consideration post-campagna | Survey geofenced (Happydemics, Dynata) [23] | Sì — reporting post-campagna |
| Foot Traffic Lift | Incremento visite PDV post-esposizione | Location data (Foursquare, Placer.ai) | Possibile con integrazione provider |
| Share of Audience | % del traffico esposta al formato specifico | Panel mobile | Sì — inventory |
| Viewability DOOH | % schermi attivi e operativi durante l'esposizione | Proof-of-play log + sensori IoT | Sì per DOOH programmatic |
| Drive-to-Web | Incremento traffico web/app attribuito all'OOH | UTM + MMM (Marketing Mix Model) + branded search | Possibile con MMM |
| Scan Rate (QR/NFC) | % di esposti che interagiscono via QR o NFC | UTM tracking + analytics | Sì per DOOH interattivo |

### 10.3 Obiettivi campagna OOH/DOOH e KPI (mappa per Gravity)

Nel modulo Commercial di Gravity (Wizard Step 2 — "Goal"), l'advertiser seleziona l'obiettivo della campagna. La mappatura obiettivo → KPI specifici per OOH/DOOH:

| Obiettivo campagna (Gravity) | KPI primario OOH/DOOH | KPI secondario | Strumento di misurazione |
|-----------------------------|-----------------------|----------------|--------------------------|
| Brand Awareness | Brand Awareness Lift (pp) | Reach %, CPM, GRP | Brand Lift Study (survey geofenced) |
| Reach e Copertura | Net Reach %, Frequency | CPM, Impressions, GRP | Mobile panel (Geopath/Nielsen) |
| Considerazione | Consideration Lift, Branded Search Volume | Share of Search | Brand Lift Study + Google Trends |
| Traffico PDV (Drive-to-Store) | Foot Traffic Lift % | Store Visit Rate | Location data provider (Placer.ai) |
| Lead Generation | Lead da QR code / NFC scan | CPL, Scan Rate | UTM tracking + CRM |
| Vendite / Promozione | Sales Lift % | Revenue incrementale | Econometria / Brand Lift Sales |
| Engagement (DOOH interattivo) | Interaction Rate (QR/touch) | Dwell time, Social mentions | Proof-of-play + analytics URL |
| Educazione del mercato | Content Views, Message Recall | Brand Association Lift | Survey |
| Posizionamento brand | Brand Association Lift, Attribute Perception | SOV nel circuito | Brand tracking survey |

### 10.4 Limiti di misurabilità e opportunità per Gravity

**Limiti attuali dell'OOH classico:**
- Le impressions sono *stime* basate su modelli di traffico: non sono dati deterministici a livello individuale.
- Non esiste un "pixel OOH": l'attribuzione a conversioni online richiede modelli econometrici (MMM), esperimenti geo-lift o l'uso di promo code univoci.
- Il GDPR (EU) limita l'uso di Mobile Advertising ID per il tracciamento della location a livello individuale; i dati usati sono aggregati e anonimizzati.

**Opportunità per il pDOOH (programmatic DOOH):**
- Il **proof-of-play log** garantisce che ogni ad sia stato effettivamente servito su uno schermo attivo.
- Il **targeting contestuale** (meteo, ora del giorno, eventi locali) permette ottimizzazione in tempo reale e una misurazione della pertinenza non disponibile per l'OOH statico.
- L'integrazione con **QR code e NFC** converte l'esposizione OOH in un'azione digitale tracciabile, chiudendo il loop di attribuzione per obiettivi di performance.
- L'integrazione in un **Marketing Mix Model (MMM)** permette di stimare il contributo incrementale dell'OOH/DOOH sul business complessivo, superando i limiti dell'attribuzione last-click.

**Implicazioni per i moduli Gravity:**
- **Planning**: esporre Reach stimato, Frequency, CPM e GRP per circuito e zona geografica; consentire la simulazione di scenari di copertura.
- **Commercial (reporting campagna)**: consentire la selezione dell'obiettivo → la selezione automatica dei KPI pertinenti → la visualizzazione in dashboard appropriata per tipo di obiettivo.
- Per campagne con obiettivo Brand Awareness o Considerazione, guidare l'advertiser verso un Brand Lift Study integrato (Happydemics, Dynata [23]).
- Per campagne Drive-to-Store, offrire integrazione con location data provider certificati.

---

## 11. Fonti

**Benchmark e documentazione piattaforme (verificati live, luglio 2026):**

[1] WordStream / LocaliQ, *Google Ads Benchmarks 2025*, aggiornato 2025.
https://www.wordstream.com/blog/2025-google-ads-benchmarks

[2] WordStream / LocaliQ, *Facebook Ads Benchmarks 2025*, aggiornato 2025.
https://www.wordstream.com/blog/facebook-ads-benchmarks-2025

[3] The Eeedigital, *Facebook Ads Benchmarks 2026 / Google Ads Benchmarks 2026*, 2026.
https://www.theedigital.com/blog/facebook-ads-benchmarks · https://www.theedigital.com/blog/google-ads-benchmarks

[4] Google Ads Help, *About Brand Lift*, 2025.
https://support.google.com/google-ads/answer/9049825

[5] Think with Google, *Brand Lift's actionable metrics and insights*.
https://business.google.com/in/think/marketing-strategies/brand-lift-metrics-and-insights/

[6] Binet, L. & Field, P. (2013). *The Long and the Short of It: Balancing Short and Long-Term Marketing Strategies.* IPA (Institute of Practitioners in Advertising).
https://www.warc.com/content/paywall/article/event-reports/advertising-effectiveness-the-long-and-short-of-it/en-gb/98583

[7] IPA, *The Key Works of Les Binet & Peter Field*, 2013–2021.
https://ipa.co.uk/knowledge/effectiveness-research-analysis/les-binet-peter-field

[8] Kaushik, A. (2013). *See, Think, Do, Care Winning Combo: Content + Marketing + Measurement.* Occam's Razor.
https://www.kaushik.net/avinash/see-think-do-care-win-content-marketing-measurement/

[9] Broadsign, *Understanding (D)OOH metrics: How to measure the…*, 2024–2025.
https://broadsign.com/blog/dooh-metrics/

[10] StackAdapt, *DOOH Measurement: Techniques and Performance Metrics*, 2025.
https://www.stackadapt.com/resources/blog/dooh-measurement-methods-performance-metrics

[11] IAB, *Digital Out-Of-Home (DOOH) Measurement Guide*, 2024.
https://assets.contentstack.io/v3/assets/bltbeaed4aed52c223a/blt494e044b82a9dcb0/68cb0a53da7537f88855f47c/iab-dooh-measurement-guide.pdf

[12] Benly.ai / Meet-Lea, *LinkedIn Ads Benchmarks 2026: CTR, CPC & CPL*, 2026.
https://benly.ai/learn/linkedin-ads/linkedin-ads-benchmarks · https://meet-lea.com/en/blog/linkedin-ads-benchmarks

[13] Influee / Lebesgue, *TikTok Ads Benchmarks 2026: CPA, CPM, CTR, ROAS, and CVR by Industry*, 2026.
https://influee.co/blog/tiktok-ads-benchmarks

[14] Mega Digital / OwlClaw, *YouTube Ad Benchmarks by Industry 2026*, 2026.
https://megadigital.ai/en/blog/youtube-ad-benchmarks/ · https://owlclaw.com/benchmarks/youtube-ads-benchmarks/

[15] MailerLite / WebFX / Brevo, *Email Marketing Benchmarks 2025–2026 by Industry*, 2025–2026.
https://www.mailerlite.com/blog/compare-your-email-performance-metrics-industry-benchmarks

[16] Upcounting / Billo / Ecomcalctools, *Average eCommerce ROAS 2025; ROAS, CAC, LTV benchmarks*, 2025.
https://www.upcounting.com/blog/average-ecommerce-roas · https://billo.app/blog/what-is-a-good-roas/

[17] Nielsen, *Need to know: What is Share of Voice?*, 2025.
https://www.nielsen.com/insights/2025/what-is-share-voice/

[18] Kantar, *Demystifying share of search*, 2024.
https://www.kantar.com/north-america/inspiration/analytics/demystifying-share-of-search

[19] Gartner, *Elevating Brand Awareness in the Age of Performance Marketing*, maggio 2025.
https://www.gartner.com/en/newsroom/press-releases/2025-05-13-elevating-brand-awareness-in-the-age-of-performance-marketing

[20] Colley, R.H. (1961). *Defining Advertising Goals for Measured Advertising Results (DAGMAR).* Association of National Advertisers.
https://www.communicationtheory.org/dagmar-model-defining-advertising-goals-for-measured-advertising-results/

[21] Lavidge, R.J. & Steiner, G.A. (1961). A Model for Predictive Measurements of Advertising Effectiveness. *Journal of Marketing*, 25(6), 59–62.

[22] Reichheld, F. (2003). The One Number You Need to Grow. *Harvard Business Review*, December 2003.
https://hbr.org/2003/12/the-one-number-you-need-to-grow

[23] Happydemics, *Advertising Effectiveness Measurement with pDOOH & Brand Lift*, 2024–2025.
https://happydemics.com/blog/en/unlock-the-power-of-dooh-from-attention-to-action/

[24] Roach, T. (2025). *There's a new 'Share of' in town.* Tom Roach Blog, gennaio 2025.
https://thetomroach.com/2025/01/12/theres-a-new-share-of-in-town/

---

## 12. Tabella finale riepilogativa

Obiettivi ordinati dall'alto del funnel (Awareness) fino alla fidelizzazione e all'advocacy. I benchmark sono indicativi salvo fonte esplicita.

| Obiettivo | Descrizione | KPI principali | KPI secondari | Formula chiave | Strumenti di misurazione | Piattaforme principali | Fase funnel | Livello |
|-----------|-------------|----------------|---------------|----------------|--------------------------|------------------------|-------------|---------|
| Brand Awareness | Grado di riconoscimento del brand nel target (aided/unaided) | Brand Awareness Lift, Aided Awareness %, SOV | Impressions, Reach, GRP | Awareness Lift = % esposti − % controllo | Brand Lift Study (Google [4], Meta), Panel (Nielsen, Kantar) | YouTube, TV, OOH/DOOH, Display, Meta | Awareness | Strategico |
| Reach e Copertura | Individui unici esposti almeno una volta al messaggio | Net Reach %, Frequency media | CPM, GRP, TRP | Reach = individui unici ÷ target × 100 | DSP, DMP, Nielsen, Geopath | OOH/DOOH, TV, Programmatic, Meta, YouTube | Awareness | Tattico |
| Brand Recall | Capacità del target di ricordare il brand/annuncio post-esposizione | Ad Recall Lift (pp), Prompted Recall % | Frequency, VTR | Recall Lift = % recall esposti − % recall controllo | Brand Lift Study, Panel Kantar/Nielsen | YouTube, TV, OOH/DOOH, Meta | Awareness | Strategico |
| Interesse | Coinvolgimento attivo verso il brand: ricerche, tempo, video completi | CTR, Video Completion Rate, Time on page | Pages/session, Scroll depth | CTR = Click ÷ Impressions × 100 | GA4, Google Ads, Meta Insights | Google Display, Meta, LinkedIn, YouTube | Consideration | Tattico |
| Considerazione | Brand incluso nel consideration set prima dell'acquisto | Consideration Lift (pp), Branded Search Volume | CTR, Time on site | Consideration Lift = % esposti − % controllo | Brand Lift Study, Google Search Console, Trends | Google Search, YouTube, LinkedIn, OOH | Consideration | Strategico |
| Engagement | Interazione diretta con il contenuto (like, commenti, condivisioni) | Engagement Rate %, Interactions totali | Like, Commenti, Condivisioni, Saves | ER = Interazioni ÷ Reach × 100 | Meta Insights, TikTok Analytics | Meta, TikTok, Instagram, YouTube | Awareness/Consideration | Operativo |
| Posizionamento brand | Percezione del brand su attributi chiave rispetto ai competitor | Brand Association Lift (pp), Attribute Perception Score | SOV, Share of Search | Assoc. Lift = % esposti − % controllo | Brand tracking survey, Kantar BrandDynamics | OOH, TV, YouTube, LinkedIn | Awareness/Consideration | Strategico |
| Educazione del mercato | Aumentare la conoscenza su nuova categoria o soluzione | Content Completion Rate %, Knowledge Lift | Time on content, Share rate | Completion Rate = Completamenti ÷ Avvii × 100 | YouTube Analytics, GA4, Survey post-esposizione | YouTube, LinkedIn, Display, OOH/DOOH | Awareness/Consideration | Strategico |
| Reputazione | Percezione complessiva del brand dagli stakeholder | Sentiment Score %, NPS | Media mentions, Review score (Trustpilot) | Sentiment = (Pos − Neg) ÷ Totale × 100 | Brandwatch, Sprinklr, Survey | Social, News, Review platform | Trasversale | Strategico |
| Traffico sito/PDV | Visite digitali o fisiche generate dalla campagna | Sessions, Store Visits, Unique Visitors | Bounce Rate, Time on site | Store Visit Rate = Visite PDV ÷ Esposti | GA4, Google Ads Store Visits, Location data | Google Ads, Meta, OOH/DOOH geotargetato | Consideration/Conversion | Tattico/Operativo |
| Lead Generation | Raccolta di contatti qualificati interessati al prodotto/servizio | Lead Volume, CPL, Lead Quality Score | Form fill rate, CVR LP | CPL = Spesa ÷ Lead acquisiti | LinkedIn Lead Gen Forms, Meta Leads, CRM | LinkedIn, Meta, Google Search, Email | Consideration/Conversion | Tattico |
| Conversione | Completamento di un'azione desiderata (acquisto, iscrizione, form) | CVR %, CPA, Conversioni totali | Assisted Conversions, Micro-conversioni | CVR = Conv ÷ Click × 100; CPA = Spesa ÷ Conv | Google Ads, Meta Ads Manager, GA4 | Google Search/Shopping, Meta, Email | Conversion | Operativo |
| Vendite | Fatturato generato dalla campagna | Revenue, ROAS, AOV | Units sold, Cart value | ROAS = Revenue ÷ Spesa | GA4 e-commerce, Google Ads, Meta CAPI | Google Shopping, Meta, Email, OOH/DOOH | Conversion | Tattico/Operativo |
| Acquisizione clienti | Nuovi clienti paganti generati dalla campagna | CAC, New Customers acquisiti | CPA, LTV:CAC ratio | CAC = (Mktg + Sales spend) ÷ Nuovi clienti | CRM, MMP (AppsFlyer), GA4 | Google UAC, Meta, LinkedIn, Email | Conversion | Strategico/Tattico |
| Installazione app | Download e installazione di app mobile | Installs, CPI, Day-7 Retention | CTR, CVR, IPM | CPI = Spesa ÷ Installs | MMP (AppsFlyer, Adjust), Google UAC, SKAdNetwork | Google UAC, Meta App, TikTok | Conversion | Operativo |
| Download contenuti | Download di asset digitali (PDF, tool, guide) | Download Volume, CPD | CVR landing page, Lead quality | CPD = Spesa ÷ Download | GA4, CRM, form provider | LinkedIn, Google Search, Display | Consideration/Conversion | Operativo |
| Partecipazione eventi | Registrazioni e presenze a eventi fisici o digitali | Registrazioni, CPR, Attendees | Show-up rate, Post-event engagement | CPR = Spesa ÷ Registrazioni | Eventbrite, CRM, GA4 | LinkedIn, Google Ads, Email, OOH | Consideration/Conversion | Tattico |
| Retention | Mantenimento dei clienti esistenti nel tempo, riduzione del churn | Retention Rate %, Churn Rate % | MAU/DAU, Feature adoption | Churn = (inizio − fine) ÷ inizio × 100 | CRM, Mixpanel, Amplitude | Email, Push, Retargeting Display | Loyalty | Strategico |
| Fidelizzazione | Acquisti ripetuti e legame duraturo con il brand | Repeat Purchase Rate %, NPS, Purchase Frequency | Program enrollment, CLV | RPR = Clienti ≥2 acquisti ÷ clienti totali × 100 | CRM, Loyalty platform, Survey NPS | Email, Push, Retargeting, Loyalty program | Loyalty | Strategico |
| Preferenza di marca | Il target sceglie il brand rispetto ai competitor in fase di scelta | Brand Preference Index, Purchase Intent % | SOV, Consideration | Preference Lift = % esposti − % controllo | Kantar BrandDynamics, Survey, Brand Lift Study | OOH, TV, YouTube, LinkedIn | Loyalty/Consideration | Strategico |
| Customer Lifetime Value | Massimizzare il valore economico generato da ciascun cliente nel tempo | CLV €, Purchase Frequency | AOV, Churn Rate | CLV = AOV × Freq × (1 ÷ Churn) | CRM, CDP, Analytics avanzata | Email, CRM automation, Loyalty | Loyalty | Strategico |
| Riattivazione clienti | Recupero di clienti dormienti o già persi (win-back) | Reactivation Rate %, Revenue da win-back | CPA riattivazione, Email open rate | Reactivation Rate = Riattivati ÷ Dormienti × 100 | CRM, Email platform, Retargeting | Email, Retargeting Display, OOH locale | Loyalty/Conversion | Tattico |
| Advocacy | Trasformare clienti soddisfatti in promotori attivi del brand | NPS, Referral Rate %, UGC Volume | Review score, Ambassador engagement | NPS = % Promotori − % Detrattori | Survey NPS, CRM, Social listening | Social, Email, Programmi referral | Advocacy | Strategico |

---

*Documento preparato da Gravity Platform — Versione 1.0 — 2026-07-30. Benchmark numerici da fonti citate (luglio 2026); valori indicativi segnalati come tali. Aggiornare i benchmark annualmente e al rilascio di nuovi dati delle piattaforme.*
