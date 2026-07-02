# Product Requirements Document (PRD)
## Gravity Platform — CodeSour Tech Srl

---

| Campo | Dettaglio |
|---|---|
| **Prodotto** | Gravity Platform |
| **Azienda** | CodeSour Tech Srl |
| **Autore** | Gloria Bonanno |
| **Versione documento** | 1.0 |
| **Data** | 19 marzo 2026 |
| **Stato** | MVP in corso |

---

## Indice

1. [Executive Summary](#1-executive-summary)
2. [Obiettivi di Business](#2-obiettivi-di-business)
3. [Utenti Target e Personas](#3-utenti-target-e-personas)
4. [Ambito del Prodotto](#4-ambito-del-prodotto)
5. [Architettura e Principi Tecnici](#5-architettura-e-principi-tecnici)
6. [Requisiti Funzionali](#6-requisiti-funzionali)
   - 6.1 [Flusso Inventory](#61-flusso-inventory)
   - 6.2 [Flusso Operation Campaign](#62-flusso-operation-campaign)
   - 6.3 [Reportistica](#63-reportistica)
   - 6.4 [Funzionalità Trasversali](#64-funzionalità-trasversali)
7. [Requisiti Non Funzionali](#7-requisiti-non-funzionali)
8. [Roadmap e Priorità](#8-roadmap-e-priorità)
9. [KPI e Metriche di Successo](#9-kpi-e-metriche-di-successo)
10. [Rischi e Dipendenze](#10-rischi-e-dipendenze)
11. [Fuori Scope (v1)](#11-fuori-scope-v1)

---

## 1. Executive Summary

La **Gravity Platform** di CodeSour Tech Srl è una piattaforma SaaS multi-tenant e multi-ruolo progettata per **ottimizzare l'intera catena operativa della supply pubblicitaria** per media owner e concessionarie. La piattaforma integra in un unico sistema due macro-workflow:

- **Flusso Inventory**: gestione strutturata degli spazi pubblicitari OOH (Out of Home), DOOH (Digital Out of Home), display web e advertorial, comprensiva di permessi, concessioni e fornitori.
- **Flusso Operation Campaign**: gestione end-to-end del ciclo di vita commerciale e operativo, dalla trattativa con il cliente fino all'espletamento della campagna, con funzionalità CRM integrate.

Il sistema eroga anche **reportistica avanzata** — sia finanziaria che di performance — ed è progettato per essere venduto in modalità **white-label** a player del settore advertising.

La visione a lungo termine prevede l'estensione della piattaforma al lato DSP (Demand-Side Platform), creando un ecosistema AdTech proprietario completo.

---

## 2. Obiettivi di Business

### 2.1 Problema da Risolvere

Media owner e concessionarie pubblicitarie operano today con strumenti frammentati: fogli Excel per l'inventario, CRM generici non specializzati per l'adv, sistemi di delivery disconnessi, e reportistica manuale. Questo genera inefficienze operative, errori nella gestione degli spazi e difficoltà nel monitoraggio finanziario e di performance.

### 2.2 Proposta di Valore

La piattaforma offre:

- **Centralizzazione** di tutti i flussi operativi in un'unica interfaccia
- **Automazione** dei passaggi ripetitivi tra vendita, pianificazione e delivery
- **Visibilità in tempo reale** su inventory, performance e KPI finanziari
- **Collaborazione multi-ruolo** con assegnazione task e approvazioni integrate
- **Flessibilità commerciale** grazie al modello white-label e multi-tenant

### 2.3 Obiettivi Strategici

| Obiettivo | Indicatore |
|---|---|
| Riduzione del tempo operativo medio per campagna | ≥ 30% rispetto al pre-adozione |
| Eliminazione degli errori da doppia gestione (Excel / email) | Tasso errori tracciabili → 0 |
| Time-to-market per nuovi clienti white-label | < 5 giorni lavorativi |
| Ricavi da modulo reportistica premium | Contributo ≥ 20% ARR entro 18 mesi |

---

## 3. Utenti Target e Personas

### 3.1 Segmenti di Mercato

**Target primari:**

- **Media Owner** (es. proprietari di impianti OOH/DOOH, editori digitali): aziende che possiedono direttamente gli spazi pubblicitari e devono gestirne l'inventario, la vendita e la delivery.
- **Concessionarie pubblicitarie**: intermediari che gestiscono la commercializzazione degli spazi per conto di media owner, con portafogli clienti articolati.

**Target secondari (white-label):**

- **Software house e system integrator** del settore media che vogliono offrire una piattaforma proprietaria ai propri clienti adv.

### 3.2 Personas Principali

#### Persona 1 — Responsabile Commerciale / Sales Manager

> *"Ho bisogno di tracciare ogni trattativa, sapere quali spazi sono disponibili in ogni momento e generare preventivi precisi senza perdere tempo."*

- **Ruolo**: gestisce il portafoglio clienti e le trattative commerciali
- **Pain point**: perdita di trattative per mancanza di visibilità sull'inventario disponibile; preventivi manuali lenti e soggetti ad errori
- **Bisogni**: CRM integrato, disponibilità spazi in real-time, generazione preventivi automatizzata

#### Persona 2 — Traffic Manager / Campaign Manager

> *"Devo coordinare la pianificazione degli spazi, monitorare il delivery e gestire le modifiche dell'ultimo minuto senza impattare altre campagne."*

- **Ruolo**: pianifica e coordina l'esecuzione delle campagne pubblicitarie
- **Pain point**: conflitti di prenotazione spazi, assenza di un sistema di alerting sul delivery
- **Bisogni**: vista calendario degli spazi, gestione ordini e pianificazioni, alerting su KPI delivery

#### Persona 3 — Responsabile Inventory / Operations

> *"Devo tenere aggiornato l'inventario OOH/DOOH, gestire le scadenze delle concessioni e monitorare i fornitori."*

- **Ruolo**: gestisce il patrimonio di spazi fisici e digitali
- **Pain point**: scadenze di permessi non monitorate, inventario non aggiornato in tempo reale
- **Bisogni**: gestione permessi con alert scadenze, anagrafica spazi completa, gestione fornitori

#### Persona 4 — CFO / Responsabile Amministrativo

> *"Ho bisogno di report finanziari affidabili: ricavi per campagna, margini per spazio, proiezioni."*

- **Ruolo**: supervisione finanziaria e reporting verso il management
- **Pain point**: aggregazione manuale dei dati da fonti diverse; report non attendibili
- **Bisogni**: reportistica finanziaria automatica, export dati, dashboard executive

#### Persona 5 — Amministratore di Sistema / IT Manager

> *"Devo configurare i tenant, assegnare i ruoli e garantire la sicurezza dei dati."*

- **Ruolo**: configurazione tecnica e gestione accessi
- **Pain point**: strumenti non progettati per ambienti multi-tenant
- **Bisogni**: pannello amministrativo, gestione ruoli granulare, log di audit

---

## 4. Ambito del Prodotto

### 4.1 In Scope (MVP)

| Area | Macro-funzionalità |
|---|---|
| **Inventory** | Gestione permessi OOH/DOOH, Gestione fornitori, Gestione spazi |
| **Operation Campaign** | Trattative, Portafoglio commerciale, Strategie di campagna, Preventivi, Contratti, Ordini, Pianificazioni spazi, Campagne, Espletamento campagne |
| **Reportistica** | Report finanziari, Report performance spazi e campagne |
| **Trasversale** | Multi-tenant, Multi-ruolo, Gestione task collaborativa, White-label |

### 4.2 Fuori Scope (MVP) — Previsto per versioni future

- Integrazione DSP (Demand-Side Platform)
- Programmatic advertising (RTB, header bidding)
- Modulo billing / fatturazione automatica
- App mobile nativa
- Integrazione diretta con sistemi di digital signage per DOOH

---

## 5. Architettura e Principi Tecnici

### 5.1 Modello Architetturale

La piattaforma è progettata come **SaaS multi-tenant** con le seguenti caratteristiche architetturali chiave:

**Multi-tenancy**: ogni cliente (media owner o concessionaria) opera in un ambiente logicamente isolato. I dati non sono mai condivisi tra tenant diversi. La configurazione per tenant include: branding, ruoli, permessi personalizzabili, domini white-label.

**White-label**: la piattaforma supporta la personalizzazione completa del brand (logo, palette colori, dominio custom) per ogni tenant, abilitando la rivendita della soluzione con brand del cliente.

**Multi-ruolo**: il sistema implementa un modello RBAC (Role-Based Access Control) con ruoli predefiniti (es. Admin, Sales, Traffic Manager, Operations, Finance, Viewer) e possibilità di configurazione custom per tenant.

**Collaborazione e Task Management**: i workflow operativi includono assegnazione task tra ruoli, notifiche, stati di avanzamento e approvazioni, abilitando la collaborazione asincrona tra team.

### 5.2 Tipo di Prodotto

- **Deployment**: Cloud SaaS (multi-tenant)
- **Interfaccia principale**: Web Application (browser-based)
- **API**: esposizione di API per integrazioni esterne (partner, white-label avanzato)
- **Modello di pricing**: subscription (funzionalità base) + add-on a pagamento (reportistica avanzata)

---

## 6. Requisiti Funzionali

---

### 6.1 Flusso Inventory

Il flusso inventory è il cuore anagrafico della piattaforma. Gestisce il patrimonio di spazi pubblicitari fisici e digitali, la loro conformità normativa e i rapporti con i fornitori.

---

#### 6.1.1 Gestione Permessi sugli Spazi OOH/DOOH

**Descrizione**: modulo per la gestione di tutte le autorizzazioni e concessioni associate agli spazi pubblicitari fisici (OOH e DOOH), con tracciamento delle scadenze e degli enti competenti.

**User stories:**

- Come Responsabile Inventory, voglio registrare ogni permesso/concessione associato a uno spazio OOH/DOOH, con ente rilasciante, data di scadenza e documentazione allegata, così da avere sempre il quadro normativo aggiornato.
- Come Responsabile Inventory, voglio ricevere notifiche automatiche a 90, 30 e 7 giorni dalla scadenza di un permesso, così da poter avviare per tempo il rinnovo.
- Come Admin, voglio visualizzare una dashboard con lo stato di tutti i permessi (attivi, in scadenza, scaduti), così da avere visibilità immediata sui rischi normativi.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| INV-P-01 | Registrazione permesso con: tipo (concessione, autorizzazione), ente, numero pratica, data rilascio, data scadenza, allegati | Must Have |
| INV-P-02 | Associazione permesso → spazio (1 spazio può avere N permessi) | Must Have |
| INV-P-03 | Sistema di alert automatici su scadenze (90/30/7 giorni) via notifica in-app e email | Must Have |
| INV-P-04 | Dashboard riepilogativa stato permessi con filtri per stato, scadenza, tipo | Must Have |
| INV-P-05 | Storico dei permessi per spazio (anche dopo scadenza) | Should Have |
| INV-P-06 | Export lista permessi (CSV/Excel) | Should Have |
| INV-P-07 | Workflow di rinnovo con stati (in lavorazione, inviato, approvato) | Could Have |

---

#### 6.1.2 Gestione Fornitori

**Descrizione**: anagrafica strutturata dei fornitori coinvolti nella gestione degli spazi (es. installatori, stampatori, manutentori, fornitori di hardware DOOH).

**User stories:**

- Come Responsabile Inventory, voglio registrare e gestire l'anagrafica dei fornitori con contatti, tipologia di servizio e contratti associati.
- Come Sales Manager, voglio consultare rapidamente i fornitori disponibili per un determinato tipo di impianto OOH nella mia area geografica.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| INV-F-01 | Anagrafica fornitore: ragione sociale, P.IVA, contatti, tipologia servizi offerti | Must Have |
| INV-F-02 | Associazione fornitore → spazi gestiti | Must Have |
| INV-F-03 | Gestione contratti con fornitori (allegati, scadenze, condizioni) | Should Have |
| INV-F-04 | Valutazione/rating interno del fornitore | Could Have |
| INV-F-05 | Ricerca e filtro fornitori per tipologia, area geografica | Must Have |

---

#### 6.1.3 Gestione Spazi

**Descrizione**: anagrafica completa degli spazi pubblicitari gestiti dalla piattaforma. Supporta tipologie OOH (affissioni, impianti stradali, etc.), DOOH (schermi digitali), web (banner, native, advertorial) con tutte le caratteristiche tecniche e commerciali.

**User stories:**

- Come Responsabile Inventory, voglio caricare e aggiornare l'anagrafica di ogni spazio con tutte le sue caratteristiche tecniche (formato, risoluzione, posizione, target area), commerciali (listino prezzi, disponibilità) e normative (permessi associati).
- Come Sales Manager, voglio cercare spazi disponibili per un dato periodo con filtri su tipologia, area geografica e budget, così da costruire rapidamente un pacchetto per il cliente.
- Come Traffic Manager, voglio visualizzare la disponibilità degli spazi su un calendario, così da evitare sovrapposizioni nelle pianificazioni.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| INV-S-01 | Scheda spazio con: nome, tipologia (OOH/DOOH/Web/Advertorial), formato/dimensioni, localizzazione, target audience, note | Must Have |
| INV-S-02 | Gestione disponibilità spazio con calendario e stati (disponibile, prenotato, in manutenzione) | Must Have |
| INV-S-03 | Listino prezzi per spazio (per periodo, formato, stagionalità) | Must Have |
| INV-S-04 | Associazione spazio → permessi e → fornitori | Must Have |
| INV-S-05 | Upload documenti e foto/rendering spazio | Should Have |
| INV-S-06 | Geolocalizzazione spazi OOH/DOOH con vista mappa | Should Have |
| INV-S-07 | Import massivo spazi via CSV/Excel | Should Have |
| INV-S-08 | Storico modifiche alla scheda spazio (audit trail) | Should Have |
| INV-S-09 | Gestione spazi web con specifiche tecniche (dimensioni banner, formati accettati, URL) | Must Have |

---

### 6.2 Flusso Operation Campaign

Il flusso operation campaign gestisce l'intero ciclo di vita commerciale e operativo, dalla prima interazione con il cliente fino al completamento e rendicontazione della campagna.

---

#### 6.2.1 Gestione Trattative

**Descrizione**: modulo CRM integrato per la gestione delle opportunità commerciali. Traccia l'avanzamento delle trattative con i clienti dall'interesse iniziale alla chiusura.

**User stories:**

- Come Sales Manager, voglio registrare ogni trattativa con il cliente, associarla a un'azienda/contatto, e tracciare il suo stato di avanzamento lungo la pipeline commerciale.
- Come Responsabile Commerciale, voglio visualizzare la pipeline di tutte le trattative del mio team, filtrate per stato, valore e data di chiusura prevista.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-T-01 | Registrazione trattativa con: cliente (da anagrafica), referente, valore stimato, data apertura, data chiusura prevista, canale di acquisizione | Must Have |
| OP-T-02 | Pipeline Kanban/lista con stati configurabili (es. Nuovo lead → Qualificato → Proposta inviata → Negoziazione → Chiuso vinto/perso) | Must Have |
| OP-T-03 | Assegnazione trattativa a Sales Manager con notifica | Must Have |
| OP-T-04 | Log delle attività sulla trattativa (note, chiamate, incontri) | Must Have |
| OP-T-05 | Associazione trattativa → preventivi generati | Must Have |
| OP-T-06 | Motivo di perdita per trattative chiuse perso | Should Have |
| OP-T-07 | Previsioni di chiusura e report pipeline | Should Have |

---

#### 6.2.2 Gestione Portafoglio Commerciale

**Descrizione**: anagrafica clienti e contatti, gestione del portafoglio clienti assegnato ai commerciali, con storico delle relazioni e delle campagne realizzate.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-PC-01 | Anagrafica cliente (azienda): ragione sociale, P.IVA, settore, indirizzo, contatti associati | Must Have |
| OP-PC-02 | Anagrafica contatti con ruolo, email, telefono, associazione ad azienda | Must Have |
| OP-PC-03 | Storico campagne e contratti per cliente | Must Have |
| OP-PC-04 | Assegnazione cliente a Sales Manager (con visibilità controllata da ruolo) | Must Have |
| OP-PC-05 | Segmentazione clienti per settore, budget storico, area geografica | Should Have |

---

#### 6.2.3 Gestione Strategie di Campagna Pubblicitaria

**Descrizione**: definizione delle strategie media da proporre al cliente, con selezione e simulazione dei mix di spazi pubblicitari ottimali per gli obiettivi di campagna.

**User stories:**

- Come Sales Manager / Media Planner, voglio costruire una strategia media per il cliente selezionando spazi e periodi, così da avere una base solida per il preventivo.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-STR-01 | Creazione strategia di campagna con: obiettivi (awareness, conversion, etc.), target audience, periodo, budget totale | Must Have |
| OP-STR-02 | Selezione spazi da inventory con verifica disponibilità in tempo reale | Must Have |
| OP-STR-03 | Simulazione del mix media (GRP, reach stimata, investimento) | Should Have |
| OP-STR-04 | Associazione strategia → trattativa e → preventivo | Must Have |
| OP-STR-05 | Versioning delle strategie (possibilità di avere più varianti) | Should Have |

---

#### 6.2.4 Gestione Preventivi

**Descrizione**: generazione di preventivi commerciali strutturati, basati sulla strategia di campagna e sull'inventario disponibile, con approvazione e invio al cliente.

**User stories:**

- Come Sales Manager, voglio generare un preventivo dettagliato partendo dalla strategia, con prezzi degli spazi, sconti applicati e totale, e inviarlo al cliente in formato professionale.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-PV-01 | Generazione preventivo da strategia con righe di dettaglio (spazio, periodo, formato, prezzo listino, sconto, prezzo netto) | Must Have |
| OP-PV-02 | Applicazione sconti a livello di riga e di totale con validazione su margini | Must Have |
| OP-PV-03 | Generazione PDF preventivo brandizzato (logo cliente/white-label) | Must Have |
| OP-PV-04 | Workflow approvazione preventivo (bozza → approvazione interna → inviato al cliente → accettato/rifiutato) | Must Have |
| OP-PV-05 | Invio preventivo via email direttamente dalla piattaforma | Should Have |
| OP-PV-06 | Storico versioni preventivo con diff tra versioni | Should Have |
| OP-PV-07 | Firma digitale del preventivo da parte del cliente (link esterno) | Could Have |

---

#### 6.2.5 Gestione Contratti

**Descrizione**: gestione del contratto commerciale che formalizza l'accordo con il cliente, a valle dell'accettazione del preventivo.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-C-01 | Creazione contratto da preventivo accettato (pre-compilazione automatica) | Must Have |
| OP-C-02 | Gestione clausole standard e personalizzate | Should Have |
| OP-C-03 | Workflow firma contratto (bozza → revisione legale → firmato) | Must Have |
| OP-C-04 | Upload contratto firmato (PDF) e archiviazione | Must Have |
| OP-C-05 | Alert su scadenze contrattuali | Should Have |
| OP-C-06 | Associazione contratto → ordini generati | Must Have |

---

#### 6.2.6 Gestione Ordini

**Descrizione**: trasformazione del contratto in ordine operativo, che costituisce la base per la pianificazione e l'esecuzione della campagna.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-O-01 | Generazione ordine da contratto con dettaglio spazi, periodi, quantità | Must Have |
| OP-O-02 | Stato ordine (confermato, in lavorazione, completato, annullato) | Must Have |
| OP-O-03 | Assegnazione ordine al Traffic Manager per pianificazione | Must Have |
| OP-O-04 | Modifica ordine con tracciamento delle variazioni (change log) | Should Have |
| OP-O-05 | Associazione ordine → pianificazioni spazi → campagna | Must Have |

---

#### 6.2.7 Gestione Pianificazioni Spazi Pubblicitari

**Descrizione**: modulo di pianificazione che assegna gli spazi dell'ordine a date e periodi specifici, verificando la disponibilità e gestendo eventuali conflitti.

**User stories:**

- Come Traffic Manager, voglio pianificare gli spazi dell'ordine su un calendario, vedendo in tempo reale le disponibilità e le sovrapposizioni, così da garantire un delivery senza conflitti.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-PLAN-01 | Vista calendario/Gantt degli spazi con occupazione per periodo | Must Have |
| OP-PLAN-02 | Assegnazione spazio a periodo con verifica disponibilità real-time | Must Have |
| OP-PLAN-03 | Gestione conflitti (alert in caso di doppia prenotazione) | Must Have |
| OP-PLAN-04 | Blocco spazi in attesa di conferma ordine (opzione) | Should Have |
| OP-PLAN-05 | Vista per spazio (storico occupazione) e per campagna (tutti gli spazi pianificati) | Must Have |

---

#### 6.2.8 Gestione Campagne Pubblicitarie

**Descrizione**: il progetto campagna aggrega tutte le pianificazioni, i materiali creativi e i task operativi necessari all'esecuzione.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-CAM-01 | Dashboard campagna con: cliente, periodo, spazi, stato delivery, KPI principali | Must Have |
| OP-CAM-02 | Gestione materiali creativi (upload, versioni, formati per spazio) | Must Have |
| OP-CAM-03 | Checklist pre-lancio con task assegnabili ai ruoli | Must Have |
| OP-CAM-04 | Notifiche su attività critiche (materiali mancanti, approvazioni in sospeso) | Must Have |
| OP-CAM-05 | Multi-campagna per stesso cliente in periodi sovrapposti | Must Have |

---

#### 6.2.9 Gestione Espletamento Campagne

**Descrizione**: monitoraggio dell'esecuzione operativa della campagna, raccolta dei dati di delivery, gestione delle anomalie e chiusura con rendicontazione finale.

**User stories:**

- Come Traffic Manager, voglio tracciare l'avanzamento del delivery in tempo reale, segnalare anomalie e generare il report di fine campagna da consegnare al cliente.

**Requisiti:**

| ID | Requisito | Priorità |
|---|---|---|
| OP-ESP-01 | Dashboard delivery: avanzamento per spazio, date di pubblicazione effettiva vs pianificata | Must Have |
| OP-ESP-02 | Registrazione anomalie (ritardi, materiali non conformi, spazi non disponibili) con cause | Must Have |
| OP-ESP-03 | Gestione make-good (compensazione automatica o manuale per delivery non completato) | Should Have |
| OP-ESP-04 | Chiusura campagna con report di espletamento (delivery completato vs contratto) | Must Have |
| OP-ESP-05 | Raccolta prove di pubblicazione (foto, screenshot, log digitali per DOOH) | Should Have |
| OP-ESP-06 | Approvazione chiusura campagna da parte del cliente (workflow) | Could Have |

---

### 6.3 Reportistica

La reportistica è un modulo **a pagamento** che offre funzionalità avanzate di analisi e visualizzazione dati, sia di natura finanziaria che di performance degli spazi e delle campagne.

---

#### 6.3.1 Report Finanziari

| ID | Requisito | Priorità |
|---|---|---|
| RPT-F-01 | Report ricavi per periodo (mensile, trimestrale, annuale) con breakdown per cliente, spazio, tipologia | Must Have |
| RPT-F-02 | Report margini per campagna (ricavo vs costo di produzione/fornitore) | Must Have |
| RPT-F-03 | Report ordini e contratti in scadenza con valore | Must Have |
| RPT-F-04 | Proiezioni ricavi basate su pipeline trattative e ordini confermati | Should Have |
| RPT-F-05 | Export report in Excel e PDF | Must Have |
| RPT-F-06 | Dashboard executive con KPI finanziari in tempo reale | Should Have |

---

#### 6.3.2 Report Performance Spazi e Campagne

| ID | Requisito | Priorità |
|---|---|---|
| RPT-P-01 | Report occupancy per spazio (% di periodi occupati vs disponibili) | Must Have |
| RPT-P-02 | Report delivery campagna (planned vs actual per spazio e periodo) | Must Have |
| RPT-P-03 | Analisi performance storica degli spazi (ROI medio, tasso di riutilizzo) | Should Have |
| RPT-P-04 | Report per cliente (campagne realizzate, investimento storico, tasso di rinnovo) | Should Have |
| RPT-P-05 | Dashboard interattiva con filtri dinamici (periodo, cliente, tipologia spazio) | Should Have |
| RPT-P-06 | Scheduled report via email (automatici a cadenza configurabile) | Could Have |

---

### 6.4 Funzionalità Trasversali

#### 6.4.1 Multi-Tenancy

| ID | Requisito | Priorità |
|---|---|---|
| TRANS-MT-01 | Isolamento completo dei dati tra tenant (data isolation) | Must Have |
| TRANS-MT-02 | Configurazione per tenant: brand, ruoli, moduli abilitati, lingua | Must Have |
| TRANS-MT-03 | Pannello amministrativo super-admin per gestione tenant | Must Have |
| TRANS-MT-04 | Onboarding nuovo tenant (provisioning automatizzato) | Should Have |

#### 6.4.2 Multi-Ruolo e Controllo Accessi (RBAC)

| ID | Requisito | Priorità |
|---|---|---|
| TRANS-RBAC-01 | Ruoli predefiniti: Super Admin, Admin Tenant, Sales Manager, Traffic Manager, Operations, Finance, Viewer | Must Have |
| TRANS-RBAC-02 | Permessi granulari per funzionalità (view, create, edit, delete, approve) | Must Have |
| TRANS-RBAC-03 | Possibilità di creare ruoli custom per tenant | Should Have |
| TRANS-RBAC-04 | Audit log delle azioni per ruolo e utente | Should Have |

#### 6.4.3 Gestione Task Collaborativa

| ID | Requisito | Priorità |
|---|---|---|
| TRANS-TASK-01 | Creazione task associati a entità (trattativa, campagna, ordine) con assegnatario e scadenza | Must Have |
| TRANS-TASK-02 | Notifiche in-app e email su task assegnati, scaduti, completati | Must Have |
| TRANS-TASK-03 | Vista personale "My Tasks" con lista e stati | Must Have |
| TRANS-TASK-04 | Commenti e thread di discussione per task | Should Have |

#### 6.4.4 White-Label

| ID | Requisito | Priorità |
|---|---|---|
| TRANS-WL-01 | Personalizzazione logo, favicon, colori primari per tenant | Must Have |
| TRANS-WL-02 | Dominio custom (subdomain o dominio completo) per tenant | Must Have |
| TRANS-WL-03 | Email transazionali con branding del tenant | Should Have |
| TRANS-WL-04 | Documenti generati (preventivi, contratti) con branding del tenant | Must Have |

---

## 7. Requisiti Non Funzionali

| Categoria | Requisito |
|---|---|
| **Performance** | Tempo di risposta delle pagine principali ≤ 2 secondi a 100 utenti concorrenti per tenant |
| **Disponibilità** | SLA uptime ≥ 99,5% su base mensile |
| **Sicurezza** | Autenticazione multi-fattore (MFA), crittografia dati at-rest e in-transit (TLS 1.2+), OWASP Top 10 compliance |
| **Privacy & Compliance** | GDPR compliant: consenso, diritto all'oblio, portabilità dei dati |
| **Scalabilità** | Architettura orizzontalmente scalabile per supportare crescita tenant e volume dati |
| **Usabilità** | Interfaccia responsive (desktop-first), onboarding guidato per nuovi utenti |
| **Audit & Logging** | Log completo delle operazioni critiche per utente, con retention minima 12 mesi |
| **Internazionalizzazione** | Supporto i18n (italiano e inglese nella prima release) |
| **Backup** | Backup automatici giornalieri con RPO ≤ 24h e RTO ≤ 4h |

---

## 8. Roadmap e Priorità

### Fase 1 — MVP Core (in corso)

**Obiettivo**: rendere operativi i due flussi principali per i primi clienti pilota.

| Modulo | Stato |
|---|---|
| Gestione Spazi (base) | 🔄 In sviluppo |
| Gestione Permessi OOH/DOOH | 🔄 In sviluppo |
| Gestione Fornitori | 🔄 In sviluppo |
| Trattative & Portafoglio Commerciale | 🔄 In sviluppo |
| Preventivi (con PDF) | 🔄 In sviluppo |
| Contratti e Ordini | 🔄 In sviluppo |
| Pianificazioni Spazi | 🔄 In sviluppo |
| Campagne & Espletamento | 🔄 In sviluppo |
| Multi-tenant & RBAC base | 🔄 In sviluppo |
| White-label base | 🔄 In sviluppo |

### Fase 2 — Reportistica & Ottimizzazione (post-MVP)

- Modulo Reportistica finanziaria e performance
- Dashboard executive
- Scheduled reports
- Task management avanzato
- Notifiche avanzate e integrazioni email

### Fase 3 — Espansione (12-24 mesi)

- Integrazione DSP (Demand-Side Platform)
- Marketplace white-label
- Mobile app (iOS/Android)
- Integrazioni con sistemi di digital signage per DOOH
- Programmatic / RTB

---

## 9. KPI e Metriche di Successo

### KPI Prodotto (da misurare post-lancio)

| Metrica | Target (6 mesi dal lancio) |
|---|---|
| Tempo medio per generare un preventivo | < 15 minuti (vs ore con metodi tradizionali) |
| Tasso di adozione features core (trattative + campagne) | ≥ 80% degli utenti attivi mensili |
| Tasso di errori nel delivery campagne tracciati | Riduzione ≥ 40% vs baseline |
| NPS (Net Promoter Score) clienti pilota | ≥ 40 |
| Time-to-onboard nuovo tenant | < 5 giorni lavorativi |

### KPI Business

| Metrica | Target |
|---|---|
| Tenant attivi a 12 mesi | ≥ 10 |
| ARR da modulo reportistica | ≥ 20% dell'ARR totale |
| Churn rate annuo | < 10% |
| Conversion trattative white-label | ≥ 2 contratti entro 18 mesi |

---

## 10. Rischi e Dipendenze

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| Complessità dei flussi OOH (variabilità normativa locale per permessi) | Alta | Alto | Modello dati flessibile per tipi di permesso; consulenza legale settoriale |
| Over-engineering dell'MVP (scope creep) | Media | Alto | Strict priorità MoSCoW; sprint review con stakeholder |
| Bassa adozione se UX risulta complessa per profili non tecnici | Media | Alto | Test usabilità con utenti reali nelle fasi pilota; onboarding guidato |
| Integrazione DSP: complessità tecnica elevata | Bassa (v1) | Alto | Mantenuta fuori scope MVP; architettura API-first per facilitare futura integrazione |
| Gestione dati multi-tenant: data leakage tra tenant | Bassa | Critico | Test di isolamento automatizzati; security review dedicata |
| Dipendenza da fornitori cloud (uptime, costi) | Bassa | Medio | SLA contrattuali con cloud provider; disaster recovery plan |

---

## 11. Fuori Scope (v1)

Le seguenti funzionalità sono esplicitamente escluse dall'MVP e posizionate in roadmap futura:

- **DSP (Demand-Side Platform)**: gestione lato domanda, acquisto programmatic, RTB
- **Fatturazione automatica**: integrazione con sistemi di billing/ERP (es. FattureInCloud, SAP)
- **App mobile nativa**: iOS/Android; la v1 è web-responsive
- **Integrazioni digital signage**: controllo diretto di player DOOH da piattaforma
- **Marketplace spazi**: esposizione pubblicitaria dell'inventory verso acquirenti terzi
- **AI/ML per ottimizzazione media planning**: suggerimenti automatici di mix media basati su performance storica

---

*Documento preparato da Gloria Bonanno — CodeSour Tech Srl*
*Versione 1.0 — 19 marzo 2026*
*Tutti i requisiti con priorità "Must Have" sono previsti per l'MVP. I requisiti "Should Have" e "Could Have" sono soggetti a prioritizzazione sprint-by-sprint.*
