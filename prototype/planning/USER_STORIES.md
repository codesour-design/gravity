# User Stories — Modulo Planning

Epic singola: **Planning** — gestione e pianificazione di campagne OOH/DOOH.

Ruolo: **Planner** — responsabile della selezione degli spazi pubblicitari e della consegna delle pianificazioni.

> Per il comportamento dettagliato della ricerca geografica e dei filtri avanzati vedi [`RICERCA.md`](./RICERCA.md).

---

## US-01 — Gestione del portfolio pianificazioni

**Come** planner
**voglio** avere una visione d'insieme del mio portfolio di pianificazioni
**così che** possa capire subito cosa richiede la mia attenzione e su cosa sto lavorando.

---

### US-01.1 — Panoramica portfolio

**Come** planner
**voglio** visualizzare tutte le pianificazioni del mio perimetro in una tabella con KPI rapide
**così che** possa orientarmi nel lavoro senza dover aprire le singole pianificazioni.

#### Criteri di accettazione

- [ ] Nella parte alta della pagina sono visibili 3 KPI card:
  - "Da prendere in carico" — pianificazioni senza assegnatario
  - "Le mie bozze" — bozze assegnate al planner loggato
  - "In trattativa" — pianificazioni in stato di negoziazione
- [ ] La tabella mostra tutte le pianificazioni dell'area di competenza
- [ ] Ogni riga mostra: nome, canale (OOH/DOOH), inserzionista, pianificatore, stato, numero spazi, date, tipo vendita
- [ ] Le colonne sono ordinabili (data creazione, data aggiornamento, data inizio/fine, numero spazi)
- [ ] È possibile filtrare per: canale, inserzionista, pianificatore, stato
- [ ] È possibile cercare per nome pianificazione con input testuale
- [ ] Lo stato è visualizzato con un badge colorato (Bozza / In trattativa / Completata)
- [ ] Clicking su una riga apre la pianificazione in modalità selezione spazi

#### Schermate
- `PlanningsList` — tabella principale
- Colonna "Pianificatore" — mostra avatar + nome, oppure CTA "Prendi in carico" se non assegnata

---

### US-01.2 — Prendere in carico una pianificazione orfana

**Come** planner
**voglio** poter assegnarmi una pianificazione che non ha ancora un responsabile
**così che** possa iniziare a lavorarci senza attendere un'assegnazione manuale.

#### Criteri di accettazione

- [ ] Le pianificazioni senza assegnatario mostrano il pulsante "Prendi in carico" nella colonna pianificatore
- [ ] Clicking su "Prendi in carico" apre un popconfirm di conferma
- [ ] Confermando, la pianificazione viene assegnata al planner loggato
- [ ] Viene mostrato un toast di successo ("Pianificazione presa in carico")
- [ ] La pianificazione scompare dalla KPI "Da prendere in carico" e appare in "Le mie bozze"
- [ ] La colonna pianificatore si aggiorna immediatamente con avatar e nome del planner

#### Schermate
- `PlanningsList` — riga con stato "orfano"
- `Popconfirm` di conferma
- Toast di feedback

---

## US-02 — Selezione spazi

**Come** planner
**voglio** poter selezionare gli spazi pubblicitari più adatti per una pianificazione
**così che** possa costruire una proposta coerente con il brief dell'inserzionista.

---

### US-02.1 — Visualizzare il contesto della pianificazione

**Come** planner
**voglio** avere il brief della pianificazione visibile mentre cerco gli spazi
**così che** possa tenere a mente l'obiettivo, il budget e le preferenze dell'inserzionista senza cambiare schermata.

#### Criteri di accettazione

- [ ] Il pannello brief è visibile sulla sinistra dello spazio di lavoro
- [ ] Il pannello mostra: inserzionista (avatar + nome + settore), budget (importo + barra di avanzamento sul preventivato), obiettivo della campagna, periodo (mini-calendario con range evidenziato)
- [ ] Il mini-calendario naviga mese per mese e mostra il range di date della pianificazione
- [ ] Il pannello brief si nasconde in modalità fullscreen senza perdere lo stato
- [ ] Tornando dalla modalità fullscreen il pannello riappare con gli stessi dati
- [ ] La modalità fullscreen espande solo l'area ricerca e mappa: la navbar resta sempre visibile in alto

#### Schermate
- `BriefPanelNR` — sidebar sinistra
- `MiniCalendar` — calendario con range
- `DataCard` — card informative (budget, goal)

---

### US-02.2 — Visualizzare i KPI obiettivo della campagna

**Come** planner
**voglio** vedere le metriche target associate all'obiettivo della campagna
**così che** possa orientare la selezione degli spazi verso i risultati attesi dall'inserzionista.

#### Criteri di accettazione

- [ ] Nel pannello brief è presente un pulsante "Vedi KPI" associato all'obiettivo
- [ ] Clicking apre una modale con il dettaglio dei KPI per quell'obiettivo
- [ ] La modale mostra: nome obiettivo, descrizione, elenco metriche (Reach, GRP, Frequenza, ROAS, ecc.) ciascuna con valore target, unità e una barra di progresso
- [ ] I KPI sono specifici per tipo di obiettivo (traffico, consapevolezza, conversione, fidelizzazione, lead gen, coinvolgimento)
- [ ] La modale è chiudibile senza perdere la selezione spazi in corso

#### Schermate
- `KpiModal` — modale KPI
- `BriefPanelNR` — trigger "Vedi KPI"

---

### US-02.3 — Visualizzare il profilo audience dell'inserzionista

**Come** planner
**voglio** consultare il profilo demografico e comportamentale del target dell'inserzionista
**così che** possa privilegiare spazi in zone con maggiore concentrazione di quel pubblico.

#### Criteri di accettazione

- [ ] Nel pannello brief è presente un pulsante "Audience" associato all'inserzionista
- [ ] Clicking apre una modale con il profilo audience
- [ ] La modale mostra: distribuzione per genere (barra), distribuzione per fascia d'età (barre), professioni prevalenti, interessi principali, preferenze media
- [ ] I dati sono specifici per inserzionista
- [ ] La modale è chiudibile senza perdere la selezione spazi in corso

#### Schermate
- `AudienceModal` — modale profilo audience
- `BriefPanelNR` — trigger "Audience"

---

### US-02.4 — Cercare spazi per zona geografica

> Comportamento dettagliato in [`RICERCA.md` — US-01](./RICERCA.md#us-01--ricerca-per-zona-geografica).

**Come** planner
**voglio** restringere la ricerca a una o più zone geografiche specifiche
**così che** i risultati sulla mappa e in tabella mostrino solo gli spazi rilevanti per l'area della campagna.

#### Criteri di accettazione

- [ ] Vedi RICERCA.md — US-01

---

### US-02.5 — Cercare spazi per punto d'interesse (POI)

> Comportamento dettagliato in [`RICERCA.md` — US-02](./RICERCA.md#us-02--ricerca-per-punto-dinteresse-poi).

**Come** planner
**voglio** filtrare gli spazi in prossimità di luoghi o categorie rilevanti per il target
**così che** possa selezionare impianti con alta affinità con il pubblico dell'inserzionista.

#### Criteri di accettazione

- [ ] Vedi RICERCA.md — US-02

---

### US-02.6 — Applicare filtri avanzati

> Comportamento dettagliato in [`RICERCA.md` — US-03 e US-04](./RICERCA.md#us-03--filtri-avanzati).

**Come** planner
**voglio** raffinare i risultati per tipologia, formato, disponibilità e prezzo
**così che** la selezione sia coerente con i vincoli tecnici e di budget della pianificazione.

#### Criteri di accettazione

- [ ] Vedi RICERCA.md — US-03 e US-04

---

### US-02.7 — Selezionare spazi sulla mappa

**Come** planner
**voglio** scegliere singole facce di impianti direttamente sulla mappa o dalla tabella risultati
**così che** possa costruire la selezione in modo spazialmente consapevole.

#### Criteri di accettazione

- [ ] Ogni impianto è rappresentato sulla mappa da un marker; il colore indica lo stato di disponibilità
- [ ] Clicking un marker apre una focus card con: nome, tipo, indirizzo, stato, prezzo/faccia, numero facce disponibili
- [ ] Dalla focus card è possibile aggiungere o rimuovere l'impianto dalla selezione
- [ ] Nella tabella risultati è possibile espandere una riga per vedere le singole facce con checkbox di selezione
- [ ] Le facce selezionate vengono conteggiate in tempo reale nel tab "Spazi selezionati"
- [ ] Il badge del counter diventa arancione se sotto il target del brief, viola se lo raggiunge o supera
- [ ] Gli spazi in stato "Riservato" non sono selezionabili

#### Schermate
- Mappa interattiva con marker
- Focus card floating su mappa
- Tabella risultati con expand riga
- Tab counter "Spazi selezionati"

---

### US-02.8 — Gestire la selezione e applicarla

**Come** planner
**voglio** rivedere gli spazi che ho selezionato e confermarli
**così che** la pianificazione registri ufficialmente la mia proposta di spazi.

#### Criteri di accettazione

- [ ] Il tab "Selezionati" mostra l'elenco degli spazi scelti con: nome, tipo, facce selezionate, prezzo unitario
- [ ] In fondo alla lista è visibile il totale spazi e il totale preventivato
- [ ] È possibile rimuovere singoli spazi o facce dalla selezione
- [ ] Il pulsante "Applica selezione" è abilitato solo se almeno una faccia è selezionata
- [ ] Confermando, la pianificazione passa da stato "Bozza" a "In trattativa"
- [ ] L'utente viene riportato alla lista pianificazioni
- [ ] La pianificazione aggiornata appare correttamente nella KPI "In trattativa"

#### Schermate
- Tab "Selezionati" nel pannello risultati
- `PlanningHeaderNR` — counter spazi + pulsante applica

---

## US-03 — Consegna a trattativa

**Come** planner
**voglio** consegnare la selezione di spazi a una trattativa esistente
**così che** il team commerciale possa procedere con la negoziazione a partire dalla mia proposta.

---

### US-03.1 — Collegare la pianificazione a una trattativa e consegnare

**Come** planner
**voglio** associare la pianificazione a una trattativa e registrare la data di consegna
**così che** rimanga traccia di cosa ho consegnato e quando.

#### Criteri di accettazione

- [ ] Nell'header della schermata di selezione è visibile il pulsante "Consegna in trattativa"
- [ ] Il pulsante è abilitato solo se la pianificazione è in stato "In trattativa" e ha spazi selezionati
- [ ] Clicking apre un dropdown con la lista delle trattative disponibili
- [ ] Selezionando una trattativa viene richiesta la data di consegna
- [ ] Confermando, la pianificazione salva: trattativa collegata, data di consegna, snapshot delle facce selezionate al momento della consegna
- [ ] Lo snapshot permette di calcolare successivamente le modifiche rispetto alla consegna
- [ ] Dopo la consegna, la pianificazione passa allo stato "Completata" e diventa in sola lettura
- [ ] L'header mostra la data di consegna accanto al nome della trattativa

#### Schermate
- `PlanningHeaderNR` — pulsante "Consegna in trattativa" + dropdown trattative
- `Popconfirm` data consegna
- Badge stato "Completata"

---

## US-04 — Duplicare una pianificazione (GRP-480) **NUOVO**

**Come** planner
**voglio** duplicare una pianificazione, a prescindere dallo stato in cui si trova,
**così che** possa riutilizzarne la selezione degli spazi per un'altra pianificazione.

#### Contesto e accesso

L'utente può duplicare una pianificazione sia dalle azioni di riga (icona ellipsis → dropdown), sia dal dettaglio (button "Azioni" → dropdown).

#### Criteri di accettazione

- [ ] Il click su "Duplica" apre una modale di duplicazione
- [ ] Il nome della copia è precompilato aggiungendo "(copia)" al nome originale; l'utente può sostituirlo con uno custom
- [ ] L'utente può duplicare senza associare trattativa/campagna (da collegare in un secondo momento) oppure impostarle subito
- [ ] La pianificazione duplicata è sempre in stato "Bozza"
- [ ] Con trattativa selezionata, la campagna è scelta tramite select filtrata per **canale**: duplicando una pianificazione OOH si può collegare solo un'altra campagna OOH
- [ ] Selezionata la campagna, i campi tipo di vendita e periodo **scompaiono** e la modale mostra un box con inserzionista, canale, tipo di vendita e periodo espositivo ereditati dalla campagna — stesso comportamento del drawer "Nuova pianificazione" (US-05)
- [ ] Un banner avvisa che con un periodo di esposizione diverso da quello originale potrebbero non risultare disponibili tutti gli impianti della pianificazione di partenza (nota: in futuro un controllo più esaustivo, es. "per il periodo selezionato sono disponibili solo 40 dei 50 impianti originali")
- [ ] Senza trattativa (o senza campagna selezionata), l'utente compila tipo di vendita (standard / long term) e periodo di esposizione
- [ ] **Stato Bozza**: duplicabile solo se ha almeno una faccia impianto selezionata (a prescindere da trattativa collegata o meno)
- [ ] **Stato In trattativa / Completata**: duplicabile senza condizioni

#### Schermate
- `DuplicateModal` — lista e dettaglio
- Menu Azioni (riga e dettaglio)

---

## US-05 — Creare una nuova pianificazione (GRP-481) **NUOVO**

**Come** planner
**voglio** creare una nuova pianificazione, da eventualmente collegare a una trattativa e una campagna,
**così che** possa cercare e selezionare gli impianti che mi interessano.

#### Contesto e accesso

L'utente crea una nuova pianificazione tramite il button primary "+ Nuova Pianificazione" nell'header della lista.

#### Criteri di accettazione

- [ ] Il click apre un drawer con: nome pianificazione, trattativa, campagna, canale, tipo di vendita, periodo espositivo
- [ ] L'utente può creare la pianificazione e associare subito una trattativa
- [ ] Selezionata la trattativa, l'utente sceglie una campagna tra quelle che non hanno già una pianificazione associata
- [ ] Selezionata la campagna, il drawer non mostra più i campi canale/tipo di vendita/periodo espositivo: al loro posto compare un box con questi stessi dati ereditati dalla campagna

#### Schermate
- `PlanningFormDrawer` (mode: create)

---

## US-06 — Eliminare una pianificazione (GRP-507) **NUOVO**

**Come** planner
**voglio** eliminare una pianificazione esistente
**così che** possa rimuovere un'entità inutilizzata o errata.

#### Contesto e accesso

L'utente elimina una pianificazione sia dalle azioni di riga (icona ellipsis → dropdown → voce "Elimina") sia dal dettaglio (button "Azioni" → dropdown), come per Duplica (US-04) — *nota: il testo di brief originale citava solo le azioni di riga, ma il componente `Azioni` del dettaglio espone la stessa voce.*

#### Criteri di accettazione

- [ ] Il click su "Elimina" apre una finestra di dialogo che richiede conferma prima di procedere
- [ ] La pianificazione può essere eliminata **se e solo se** si trova in stato "Bozza" **e** non ha una trattativa/campagna collegata

#### Schermate
- Dialogo di conferma eliminazione (`Modal.confirm`)
- Menu Azioni (riga e dettaglio)
