# Pricing impianti — Ragionamenti e decisioni

> Documento di lavoro interno. Traccia le logiche alla base del modello di prezzo
> per gli spazi OOH e DOOH, le decisioni prese e i punti ancora aperti.

---

## Contesto

Il prezzo degli spazi pubblicitari in Gravity viene impostato dall'operatore
nell'inventario (modulo non ancora prototipato). Nel modulo Planning, il planner
non imposta prezzi: li *consulta* per stimare il costo della selezione e verificare
la compatibilità con il budget della pianificazione.

---

## Unità atomica di vendita per canale

Ogni canale vende il tempo in modo diverso. La scelta di un'unità atomica (UA)
permette al motore di pricing di calcolare il totale partendo da un'unica
variabile di listino per faccia.

| Canale | Unità atomica (UA) | Note |
|--------|--------------------|------|
| OOH | 1 quattordicina = 14gg per faccia | Unità standard del mercato OOH italiano |
| DOOH | 1 slot × 1 settimana (7gg) per faccia | Slot = singola inserzione nel loop |
| WEB *(futuro)* | 1.000 impressioni (CPM) | Non ancora affrontato |

Il **listino inventario** esprime sempre il prezzo di 1 UA.
Tutto il resto (durata, stagione, sconto) è moltiplicatori applicati a quella base.

---

## Formula generale

```
Prezzo totale = unitPrice × n_unità × moltiplicatore_durata × moltiplicatore_stagione
```

Dove:

- `unitPrice` = prezzo di listino per 1 UA (impostato nell'inventario)
- `n_unità` = quante UA coprono il periodo della campagna
- `moltiplicatore_durata` = 1.0 (standard) oppure 0.85 (long-term)
- `moltiplicatore_stagione` = 1.0 fisso per ora; previsto per versioni future

---

## OOH

### Calcolo durata
```
n_quattordicine = Math.ceil(giorni_campagna / 14)
```

Una campagna di 15 giorni = 2 quattordicine. Non esiste frazionamento
al di sotto della quattordicina per il modello standard.

### Long-term
Soglia attuale: **> 30 giorni** → sconto del **15%**.

```
totale = unitPrice × n_quattordicine × (1 − 0.15)
```

### Modello di vendita fisso (`long_term_only`)
Alcuni impianti hanno modello di vendita vincolato al long-term e **non possono
essere venduti a quattordicina**. Nel prototipo sono:

- `Telo` — grande formato, strutturalmente long-term
- `Speciale` — installazioni custom, tempi di montaggio/smontaggio lunghi
- ~20% degli altri tipi (simulazione mock; nel sistema reale sarà configurato
  per impianto dall'operatore nell'inventario)

**Comportamento UI**: se la campagna è < 30gg e l'impianto è `long_term_only`,
il sistema mostra un badge ambra ("Solo LT") con avviso di incompatibilità.
La faccia rimane selezionabile — la decisione finale spetta al planner,
che potrebbe trattare separatamente la durata con il cliente.

---

## DOOH

### Calcolo durata
```
settimane = Math.ceil(max(giorni_campagna, 7) / 7)
totale    = unitPrice × settimane
```

Minimo garantito: **7 giorni** anche per campagne custom di durata inferiore.
Sotto i 7gg non è possibile acquistare uno slot DOOH.

Per date custom non allineate alla settimana (es. 10 giorni), si applica
il pro-rata in settimane intere: 10gg → 2 settimane.

### Slot
Ogni faccia DOOH ha N slot disponibili per settimana (configurati nell'inventario).
Nel prototipo attuale si acquista sempre 1 slot per faccia.
La selezione del numero di slot è un'evoluzione prevista (vedi §Punti aperti).

---

## Stagionalità *(prevista, non implementata)*

Il modello prevede un campo `seasonalMultipliers: {}` su ogni impianto.
Finché vuoto, il moltiplicatore è 1.0.

In futuro permetterà di configurare per esempio:
```js
seasonalMultipliers: {
  '2025-07': 1.30,  // luglio +30% (alta stagione balneare)
  '2025-01': 0.80,  // gennaio −20% (bassa stagione)
}
```

Il periodo di applicazione e la granularità (mensile, settimanale) sono da definire.

---

## Struttura dati nel prototipo

```js
// A livello di faccia (face.*)
{
  price:     480,             // unitPrice: € per 1 UA (quattordicina o slot/sett)
  saleModel: 'standard',      // 'standard' | 'long_term_only'
  illuminated: true,          // influenza il prezzo base (già incluso in price)
}

// A livello di sistema (sys.*)
{
  saleModel: 'long_term_only', // propagato a tutte le facce del sistema
}
```

Il `price` nella faccia è **già il prezzo finale di listino per 1 UA**, comprensivo
del sovrapprezzo illuminazione (+20%) calcolato nella generazione dei mock.
Il motore `computeFacePrice` ci applica sopra i moltiplicatori di durata.

---

## CPM e canale WEB *(futuro)*

CPM = costo per mille impressioni. Entra in gioco per le pianificazioni WEB.

Concettualmente compatibile con lo stesso schema:
```
UA = 1.000 impression
unitPrice = € X / CPM
n_unità = impression_stimate / 1.000
```

Le impression stimate dipendono da dati di traffico degli impianti/siti,
che richiedono un modello di dati separato. Per ora fuori scope.

---

## Pricing pacchetti *(potenziale futuro)*

Attualmente il prezzo si calcola faccia per faccia e si somma.
Non esiste ancora un "prezzo circuito" o "prezzo pacchetto".

Potrebbe emergere se Gravity vende bundle predefiniti (es. "Circuito Centro
Palermo — 10 impianti a tariffa fissa"). Nell'architettura attuale si gestirebbe
aggiungendo un campo `circuitId` opzionale al sistema: il motore di pricing
potrebbe intercettare i sistemi con stesso `circuitId` e applicare una tariffa
aggregata invece di sommare i singoli.

Per ora **non implementato** e non previsto a breve.

---

## Costanti attuali nel codice

| Costante | Valore | File |
|----------|--------|------|
| `LONG_TERM_THRESHOLD` | 30gg | `planning-def/index.html` |
| `LONG_TERM_DISCOUNT` | 0.15 (15%) | `planning-def/index.html` |
| Minimo DOOH | 7gg (implicito in `computeFacePrice`) | `planning-def/index.html` |

---

## Punti aperti

| # | Domanda | Impatto |
|---|---------|---------|
| 1 | Lo sconto long-term (15%) è fisso nel listino o negoziabile per pianificazione? | Se negoziabile, serve un campo "tariffa concordata" sulla pianificazione, non sulla faccia |
| 2 | La soglia long-term (30gg) è sempre valida o varia per tipo di impianto? | Alcuni formati potrebbero avere soglie diverse |
| 3 | Per DOOH, il pro-rata è sempre settimanale o è possibile un pro-rata giornaliero oltre un certo numero di giorni? | Cambia il calcolo per campagne custom lunghe |
| 4 | La selezione del numero di slot per faccia DOOH è una feature del MVP? | Richiede InputNumber nella riga faccia e nuova logica `slots × unitPrice × weeks` |
| 5 | Il prezzo varia per fascia oraria in DOOH (prime time vs off-peak)? | Introduce una terza dimensione nel pricing DOOH |
| 6 | La stagionalità sarà configurabile dall'operatore nell'inventario o gestita da un team commerciale centralizzato? | Impatta l'architettura del dato e chi ha i permessi di scrittura |
| 7 | Esiste un "prezzo minimo garantito" per contratti molto brevi o impianti speciali? | Aggiunge un `floor` alla formula |
| 8 | Il prezzo mostrato al planner è sempre IVA esclusa? | Comunicazione da standardizzare nell'interfaccia |
