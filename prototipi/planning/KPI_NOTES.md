# KPI obiettivi — Mappatura e stima di raggiungimento

> Documento di lavoro interno. Descrive la mappatura obiettivo → KPI usata nel prototipo
> e la logica dietro la stima di raggiungimento mostrata nella modale KPI.

---

## Contesto

Nel modulo Planning, ogni pianificazione ha un **obiettivo di campagna** (goal).
L'obiettivo determina quali KPI vengono mostrati nella modale dedicata.

La modale serve a due scopi:
1. **Orientare il planner** sui risultati attesi dalla campagna
2. **Stimare in tempo reale** quanto i KPI target sono raggiungibili con gli impianti già selezionati

---

## Obiettivi e KPI selezionati

Per ogni obiettivo sono stati scelti **4 KPI primari** tra quelli standard del mercato OOH/DOOH italiano.
I valori target sono benchmark di riferimento per una campagna media su scala regionale (Sicilia).

---

### Consapevolezza del brand

> Aumentare la notorietà del marchio presso un pubblico ampio nel territorio.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Reach netto | 450.000 | persone uniche | 1.00 |
| GRP | 120 | punti | 0.95 |
| Frequenza media | 3,5× | esposizioni / persona | 0.82 |
| Copertura geografica | 75% | zone target coperte | 1.10 |

---

### Fidelizzazione dei clienti

> Rafforzare la relazione con i clienti esistenti e aumentare la frequenza di visita o acquisto.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Reach su target fidelizzato | 85.000 | clienti raggiunti | 0.90 |
| Frequenza di esposizione | 4× | / settimana | 0.85 |
| Uplift visite | +18% | incremento visite | 0.75 |
| Brand recognition | 35% | ricordo spontaneo | 0.80 |

---

### Traffico

> Generare flusso verso un punto vendita, una destinazione fisica o un canale digitale.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Uplift traffico pedonale | +22% | incremento pedonale | 0.80 |
| Visite incrementali | 12.000 | visite | 0.85 |
| Catchment area reach | 280.000 | persone | 1.00 |
| Costo per visita | € 1,80 | costo per visita | 1.10 |

---

### Generazione di lead

> Acquisire nuovi contatti qualificati interessati al prodotto o servizio.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Lead generati | 3.200 | contatti | 0.90 |
| Tasso di conversione | 2,4% | conversioni | 0.80 |
| Costo per lead (CPL) | € 6,90 | per lead | 1.05 |
| Interazioni CTA | 8.500 | scan / click | 0.95 |

---

### Coinvolgimento

> Creare una connessione attiva con il pubblico, stimolando interazioni e partecipazione.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Dwell time medio | 4,2s | per esposizione | 0.85 |
| Interazioni DOOH | 6.800 | touch / scan | 0.90 |
| Engagement rate | 3,8% | tasso di engagement | 0.80 |
| Social mention correlate | 420 | menzioni organiche | 0.75 |

---

### Conversione

> Trasformare l'esposizione pubblicitaria in vendite, acquisti o azioni concrete misurabili.

| KPI | Target | Unità | Factor |
|-----|--------|-------|--------|
| Uplift vendite | +15% | incremento vendite | 0.80 |
| ROAS | 3,2× | € per €1 investito | 0.85 |
| Tasso di conversione | 1,8% | esposti → acquisto | 0.80 |
| Revenue lift | € 48.000 | incremento fatturato | 0.85 |

---

## Stima di raggiungimento

### Segnale principale: numero di facce selezionate

La stima si basa sul numero di **facce impianto selezionate** nella pianificazione.
La logica è che più facce vengono aggiunte rispetto a quelle necessarie per saturare il budget,
più la campagna si avvicina ai target previsti.

### Formula

```
refFaces  = max(5, round(budget / 2500))
baseScore = min(1, faceCount / refFaces)
stima_kpi = min(100, round(baseScore × 100 × factor))
```

| Variabile | Descrizione |
|-----------|-------------|
| `budget` | Budget totale della pianificazione in euro |
| `refFaces` | Numero di riferimento di facce per saturare il budget (€2.500 per faccia come benchmark) |
| `faceCount` | Numero di facce attualmente selezionate nella pianificazione |
| `baseScore` | Rapporto tra facce selezionate e facce di riferimento, compreso tra 0 e 1 |
| `factor` | Coefficiente per-KPI che riflette la difficoltà di raggiungimento (vedi tabelle sopra) |

### Logica del factor

Il `factor` modula la stima per rendere alcuni KPI più o meno facili da raggiungere
con la stessa copertura di impianti:

| Intervallo factor | Significato | Esempi |
|-------------------|-------------|--------|
| ≥ 1.05 | KPI strutturalmente favorito dalla copertura geografica | Copertura geografica, Costo per visita, CPL |
| 0.95 – 1.00 | Proporzionale alla copertura | Reach netto, GRP, Catchment area reach |
| 0.85 – 0.94 | Richiede qualità e continuità oltre alla quantità | Frequenza media, ROAS, Frequenza di esposizione |
| < 0.85 | Dipende da fattori esterni difficili da controllare | Uplift visite, Social mention, Tasso di conversione |

### Colori della progress bar

| Soglia | Colore | Significato |
|--------|--------|-------------|
| ≥ 75% | Verde `#52C41A` | Raggiungimento probabile |
| 45 – 74% | Arancio `#FA8C16` | Raggiungimento parziale — aggiungere impianti |
| < 45% | Rosso `#FF4A1C` | Raggiungimento a rischio |

### Stato senza selezione

Se non ci sono facce selezionate (`faceCount = 0`), la progress bar non viene mostrata.
Al suo posto compare il testo: *"Seleziona impianti per stimare il raggiungimento"*.

---

## Punti aperti

| # | Domanda | Impatto |
|---|---------|---------|
| 1 | Il benchmark €2.500/faccia è realistico per il mercato siciliano? | Cambia `refFaces` e quindi tutta la curva di stima |
| 2 | La stima dovrebbe considerare anche la durata della campagna? | Campagne lunghe = frequenza più alta = KPI di fidelizzazione più raggiungibili |
| 3 | I factor per obiettivo sono calibrati su dati reali o sono stime editoriali? | Andrebbe fatto un esercizio di benchmarking su campagne passate |
| 4 | Ha senso mostrare la stima anche per pianificazioni già completate? | Per le completate si potrebbe sostituire la stima con i dati consuntivi effettivi |
| 5 | Il CPL e il Costo per visita hanno logica inversa (più spendi, più sale il costo unitario) — il factor attuale li tratta come gli altri | Potrebbe servire una logica separata per i KPI di efficienza |
