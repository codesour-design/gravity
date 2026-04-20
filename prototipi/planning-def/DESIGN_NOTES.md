# Planning — Note di Design (Nuova Rotta)

> Documento per la revisione interna del redesign del modulo Planning.
> Traccia l'evoluzione completa dal prodotto attuale e dal prototipo originale (derivato da Figma)
> fino allo stato di `nuovarotta`, con tutti i cambiamenti introdotti e i punti aperti da discutere in riunione.

---

## Contesto e cronologia

### Tre punti di riferimento

Questo documento confronta tre stati distinti:

| Riferimento | Descrizione |
|-------------|-------------|
| **Prodotto attuale** | Il prodotto in produzione oggi, documentato tramite screenshot (Alessi, aprile 2026) |
| **Prototipo originale** | Trasposizione HTML del design Figma esistente — punto di partenza del redesign, in inglese |
| **Nuova Rotta** | Redesign consolidato — `planning--gloria-nuovarotta` |

### Iterazioni del redesign

| Prototipo | Descrizione |
|-----------|-------------|
| `planning` | Trasposizione del design Figma, in inglese |
| `planning--gloria` | Prime modifiche: mappa Leaflet reale, filtri interattivi, traduzione IT, rimozione WEB |
| `planning--gloria--a/b/ab` | Varianti sperimentali su layout e flusso |
| `planning--gloria-nuovarotta` | Redesign consolidato |

---

## 1. Navigazione e architettura dell'app

**Prodotto attuale:** navigazione principale con quattro sezioni — GESTIONE, VENDITE, DISTRIBUZIONE, MEDIA MONITOR.

**Prototipo originale / Nuova Rotta:** navigazione con Overview, Inventario, Espletamento (con sottovoci Campagne e Pianificazioni).

Le due strutture riflettono architetture informative diverse. Il redesign non tocca la navigazione globale.

**Punto da discutere:** La struttura di navigazione del prodotto attuale è quella da mantenere, o il redesign prevede anche una revisione dell'IA?

---

## 2. Lingua e nomenclatura

**Prodotto attuale:** interfaccia in italiano. Dati tecnici (codici impianto, nomi colonne nei filtri) in italiano con alcune eccezioni (es. "J-SPOTLIGHT" per illuminazione).

**Prototipo originale:** interfaccia completamente in inglese ("Plannings List", "Search Systems", "Draft", "Completed", ecc.).

**Nuova Rotta:** interfaccia completamente in italiano ("Pianificazioni", "Inizia a pianificare", "Da pianificare", ecc.) — allineata al prodotto attuale.

---

## 3. Categorie di pianificazione

**Prodotto attuale:** OOH e DOOH. Nessuna categoria WEB visibile.

**Prototipo originale:** OOH, DOOH e **WEB** (con colore viola dedicato).

**Nuova Rotta:** solo OOH e DOOH — allineata al prodotto attuale.

**Punto da discutere:** È confermata la rimozione definitiva di WEB? Esiste un piano per un modulo Web separato?

---

## 4. Stati della pianificazione

**Prodotto attuale:** due stati — **Bozza** e **Completato**. Le pianificazioni nuove mostrano un badge verde "New" accanto al nome.

**Prototipo originale:** tre stati — Draft, Completed, In Progress.

**Nuova Rotta:** quattro stati con flusso di avanzamento esplicito:

```
Da pianificare → In trattativa → Allegato a trattativa → Completato
```

Il prodotto attuale è più semplice. Nuova Rotta introduce due stati intermedi ("In trattativa", "Allegato a trattativa") che non esistono oggi.

### Azioni contestuali agli stati (Nuova Rotta)

| Stato | Azione disponibile |
|-------|-------------------|
| Da pianificare | "Inizia a pianificare" → apre la selezione impianti |
| In trattativa | "Allega a trattativa" |
| Allegato a trattativa | "Segna come completo" |
| Completato | Nessuna azione — interfaccia in sola lettura |

### Modalità sola lettura (Nuova Rotta)

Quando una pianificazione è Completata, la selezione impianti è non modificabile: checkbox disabilitate, pannello aperto su "Selezionati" per default.

**Punti da discutere:**
- I due nuovi stati intermedi corrispondono a fasi reali del processo commerciale?
- I nomi degli stati sono già allineati con il linguaggio del team commerciale?
- È possibile riaprire una pianificazione da Completato? Chi ha questa autorizzazione?

---

## 5. Lista pianificazioni — colonne e struttura

### Confronto colonne

| Colonna | Prodotto attuale | Prototipo originale | Nuova Rotta |
|---------|-----------------|---------------------|-------------|
| Nome pianificazione | ✓ | ✓ (in inglese) | ✓ |
| Canale (OOH/DOOH) | ✓ | ✓ (Category) | ✓ (Tipo) |
| Stato | ✓ | ✓ | ✓ |
| Inizio campagna | ✓ | ✓ (Start Date) | ✓ (Data inizio) |
| Fine campagna | ✓ | ✓ (End Date) | ✓ (Data fine) |
| Inserzionista | ✓ | ✓ (Advertiser) | ✓ |
| Budget | ✓ | ✓ | — (non in tabella) |
| Obiettivo | ✓ | ✓ (Goal) | — (non in tabella) |
| Campagna Associata | ✓ (con link) | — | — |
| Impianti | ✓ (count + "Controlla") | ✓ (Faces) | ✓ (Facce) |
| Agente | — | — | ✓ (novità) |
| Creata il | — | — | ✓ (novità) |
| Azioni | — | ✓ (Share + More) | ✓ |

**Differenze rilevanti:**
- Il prodotto attuale ha **"Campagna Associata"** come colonna esplicita — assente in nuova rotta (la campagna è visibile solo nel dettaglio).
- Il prodotto attuale ha **Budget e Obiettivo** direttamente in tabella — nuova rotta li nasconde nel dettaglio.
- Nuova rotta introduce **Agente** e **Creata il** — non presenti nel prodotto attuale.

**Punti da discutere:**
- La colonna "Campagna Associata" è utile nella lista o basta nel dettaglio?
- Budget e Obiettivo in tabella sono necessari per il planner in fase di scansione?
- La colonna Agente corrisponde a un campo reale nel sistema attuale?

---

## 6. KPI nella lista pianificazioni

**Prodotto attuale:** nessuna metrica in cima alla lista. Solo titolo + bottone "Nuova Pianificazione".

**Prototipo originale:** nessuna metrica.

**Nuova Rotta:** tre card di metrica:

| Card | Metrica | Colore |
|------|---------|--------|
| Da prendere in carico | Pianificazioni non assegnate | Rosso (#FF4A1C) |
| Le mie bozze | Mie pianificazioni in bozza | Viola (#3E00FB) |
| Senza impianti | Mie pianificazioni senza impianti | Arancione (#FAAD14) |

Le KPI sono un'aggiunta del redesign — non esistono nel prodotto attuale.

**Punto da discutere:** I nomi delle metriche usano il linguaggio corretto? "Le mie bozze" è coerente con il nuovo stato "Da pianificare"?

---

## 7. Pulsante "Prendi in carico" e colonna Agente

**Prodotto attuale:** nessuna colonna Agente, nessun meccanismo di assegnazione visibile.

**Prototipo originale:** nessuno dei due.

**Nuova Rotta:** colonna Agente + pulsante "Prendi in carico" sulle pianificazioni non assegnate → assegna la pianificazione al planner corrente.

Entrambe le funzionalità sono nuove rispetto al prodotto attuale.

**Punto da discutere:** Il concetto di "assegnazione" al planner esiste nel sistema attuale? Il campo Agente è già nel database?

---

## 8. Mappa — provider e funzionalità

**Prodotto attuale:** **Google Maps** con toggle Mappa/Satellite. Legenda con tre stati (Disponibile verde, Riservato blu/viola, In Opzione arancione). Nessun clustering visibile negli screenshot.

**Prototipo originale:** SVG hardcoded, non interattiva, solo illustrativa.

**Nuova Rotta:** **Leaflet** (CartoDB Light). Marker clustering automatico, marker interattivi, `flyTo()` programmabile, marker speciale per impianti premium.

Sia il prodotto attuale che nuova rotta usano una mappa reale e interattiva, ma con provider diversi.

**Punto da discutere:** Il passaggio da Google Maps a Leaflet è una scelta intenzionale? Ci sono vincoli di licenza o funzionalità che impongono l'uno o l'altro?

---

## 9. Selezione impianti — layout generale

**Prodotto attuale:** un'unica interfaccia integrata (non un passo separato) con:
- Header: "Seleziona Impianti | [Nome]" + badge "New"
- Riga info: "Periodo di esposizione: [date]" *(attualmente mostra "Invalid Date" — bug)*
- Search bar con selezione tipo (vedi §10)
- Mappa a tutto schermo
- "Lista Pianificazione" button in alto destra → apre pannello selezionati
- "Salva ed Esci" button

**Prototipo originale:** layout a 3 colonne (storico ricerche | lista risultati | filtri), senza mappa.

**Nuova Rotta:** mappa centrale con brief sidebar sinistra collassabile + pannello risultati destra collassabile. Il flusso di accesso alla selezione passa per il dettaglio pianificazione ("Inizia a pianificare").

**Differenze rilevanti tra prodotto attuale e nuova rotta:**
- Il prodotto attuale usa **"Salva ed Esci"** (uscita esplicita) — nuova rotta usa solo "Salva".
- Il prodotto attuale ha il brief solo nel dettaglio pianificazione, **non nella selezione** — nuova rotta lo porta nella sidebar sinistra della selezione.
- Il prodotto attuale mostra il badge **"New"** sul nome planning — nuova rotta lo gestisce tramite stati.

**Punto da discutere:** Il bug "Invalid Date" nel prodotto attuale è noto? È un problema di formato data da correggere nel redesign?

---

## 10. Ricerca impianti — modalità di ricerca

**Prodotto attuale:** search bar con **selezione del tipo di ricerca** tramite dropdown:
- Comune
- Provincia
- Regione
- Indirizzo *(default)*
- Numero chiesa
- Cimasa
- Codice Impianto

**Prototipo originale:** search bar singola con dropdown "Address/Code/Name" (3 opzioni generiche).

**Nuova Rotta:** search bar con autocomplete geografico (suggerimenti di città/zone) — **non ha la selezione del tipo di ricerca**.

Il prodotto attuale è significativamente più granulare: permette di cercare per codice cimasa o codice impianto direttamente, funzionalità utile per il planner esperto che conosce i codici a memoria.

**Punti da discutere:**
- La ricerca per Cimasa e Codice Impianto è utilizzata frequentemente dal planner?
- Nuova rotta deve reintrodurre questa modalità o l'autocomplete geografico è sufficiente?
- "Numero chiesa" è un campo reale del sistema? Cosa rappresenta?

---

## 11. Selezione impianti — pannello "Lista Pianificazione"

**Prodotto attuale:** pulsante **"Lista Pianificazione"** in alto a destra apre un pannello overlay con la lista degli impianti già selezionati, con contatore facce ("X / Y Facce selezionate") per ciascuno.

**Prototipo originale:** nessun pannello separato.

**Nuova Rotta:** pannello destra con due tab — "Risultati" (impianti disponibili filtrati) e "Sel." (impianti selezionati). Il pannello è sempre presente, collassabile tramite toggle.

La differenza principale: nel prodotto attuale i risultati di ricerca e la lista selezionati sono due superfici separate (mappa + pannello a richiesta). In nuova rotta convivono nello stesso pannello come tab.

---

## 12. Filtri — confronto sezioni

**Prodotto attuale** (da screenshot):

| Sezione filtro | Note |
|---------------|------|
| Proprietario impianto | Proprietario / Fornito — **non presente nel prototipo** |
| Stato | Disponibile, In Opzione, Riservato (chip) |
| Categoria impianto | 15+ tipi granulari, con badge "NEW" |
| Modalità di vendita | Standard, Lungo Termine, Stagionale |
| Illuminazione | Nessuno, Faretti, Retro Illuminazione |

**Nuova Rotta:**

| Sezione filtro | Note |
|---------------|------|
| Stato commerciale | Disponibile, In Opzione, Riservato (chip) |
| Numero facce | Checkbox + InputNumber ≥ N — **non presente nel prodotto attuale** |
| Tipo impianto | Albero checkbox (3 gruppi generici) |
| Modello commerciale | Standard, Lungo Termine, Stagionale |
| Illuminazione | Nessuno, Faretti, Retroilluminato |
| Zone | TreeSelect gerarchico — **non presente nel prodotto attuale** |

**Differenze rilevanti:**
- Il prodotto attuale ha **"Proprietario impianto"** (Proprietario / Fornito) — non in nuova rotta. Indica se l'impianto è di proprietà del concessionario o in fornitura da terzi.
- Il prodotto attuale ha **15+ categorie granulari** (Palina, Palina_butterfly, Cartello, Cassonetto, Stendardo, Telo, ecc.) — nuova rotta usa 3 gruppi generici. Il badge "NEW" sulla categoria suggerisce che questa granularità è stata aggiunta di recente al sistema.
- Nuova rotta introduce **"Numero facce"** e **"Zone"** come filtri — non presenti nel prodotto attuale.

**Punti da discutere:**
- Il filtro "Proprietario impianto" (Proprietario/Fornito) va aggiunto a nuova rotta?
- La tassonomia granulare del prodotto attuale (15+ tipi) è quella da usare anche nel redesign, sostituendo i 3 gruppi generici?
- Il badge "NEW" su Categoria impianto nel prodotto attuale suggerisce una feature in rollout — siamo allineati con il team dev?

---

## 13. Lista impianti — colonne della tabella facce

**Prodotto attuale** (colonne visibili nello screenshot):

| Colonna | Esempio |
|---------|---------|
| Tipo Faccia | FRONT |
| Coordinate | 13.32697°, 38.12333° |
| Orientamento | 1° |
| *(Grandezza/Visibilità)* | >100.0m |
| Formato | W 100m x 5200m |
| Illuminazione | J-SPOTLIGHT |
| Modalità di vendita | STANDARD |
| Slots | *(dato presente)* |
| Stato | Disponibile |
| Selezione | Checkbox |

**Nuova Rotta** (colonne):

| Colonna | Note |
|---------|------|
| Tipo faccia | — |
| Coordinate | — |
| Orientamento | — |
| Visibilità | — |
| Formato | — |
| Illuminazione | — |
| Modello comm. | — |
| Stato | — |
| *(checkbox selezione)* | — |

**Differenza rilevante:** il prodotto attuale ha la colonna **Slots** — non presente in nuova rotta. Rappresenta probabilmente il numero di slot pubblicitari disponibili per quella faccia (DOOH).

**Punto da discutere:** La colonna Slots è rilevante per il planner in fase di selezione? Va aggiunta al redesign?

---

## 14. Scala dei dati reali

**Prodotto attuale:** il database contiene **4.467 impianti** (visibile nel contatore "Totale: 4467 impianti").

**Nuova Rotta:** 32 impianti mock generati algoritmicamente.

Questa differenza di scala ha implicazioni progettuali dirette:
- Il **clustering** della mappa è essenziale con migliaia di punti — già presente in nuova rotta.
- I **filtri** devono funzionare lato server, non lato client — da verificare nell'implementazione.
- L'**accordion** con espansione per impianto deve gestire liste molto più lunghe — la paginazione nel pannello diventa critica.
- Il contatore "Totale: N impianti" cambia significato: con 4467 risultati, l'utente ha bisogno di filtri efficaci prima ancora di scorrere la lista.

**Punto da discutere:** La paginazione del pannello risultati in nuova rotta è sufficiente per 4467 impianti? È prevista la ricerca server-side?

---

## 15. Brief nella selezione impianti

**Prodotto attuale:** il brief (Inserzionista, Budget, Obiettivo, Periodo) è visibile solo nella **vista dettaglio pianificazione** (sidebar sinistra) — NON nella schermata di selezione impianti.

**Prototipo originale:** brief come striscia orizzontale sopra la lista risultati.

**Nuova Rotta:** brief come **sidebar sinistra collassabile** (264px) nella selezione impianti.

Nuova rotta porta il brief dentro la selezione per mantenere il contesto mentre si lavora sulla mappa. È una scelta progettuale deliberata che il prodotto attuale non ha.

### Sidebar collassabile

- Quattro card: Inserzionista, Budget, Obiettivo, Periodo
- "Nascondi brief" → collassa a 28px con label verticale "BRIEF"
- Hover sul pannello collassato → si tinge del colore primario
- Click → riapre

**Punto da discutere:** La sidebar del brief deve ricordare lo stato aperta/chiusa tra sessioni?

### Sezione "In arrivo" nel brief (Nuova Rotta)

Cinque funzionalità segnate come prossimamente:

| Voce | Icona |
|------|-------|
| Suggerisci POI per settore | Bulb |
| Ottimizza selezione con AI | Robot |
| Blocco budget a soglia | Tuono |
| Pianificazione automatica | Robot |
| Previsione performance | Tuono |

**Punto da discutere:** Queste voci sono comunicazione di roadmap verso l'utente, o vanno rimosse dal prodotto finale?

---

## 16. Chip del brief e navigazione sulla mappa

**Prodotto attuale:** nessun chip nel flusso di selezione.

**Prototipo originale:** chip statici on/off.

**Nuova Rotta:** chip divisi in due gruppi con comportamento distinto:
- **Chip zona** → click: mappa vola (`flyTo`) su quella zona
- **Chip tipo impianto** → click: filtra i risultati per quel tipo

### Smart toggle tipologia

1. **Primo click** (da "tutti i tipi"): seleziona solo quel tipo
2. **Secondo click** (già attivo): deseleziona — se rimane vuoto, ripristina "tutti i tipi"

---

## 17. Pannello risultati / selezionati

**Prodotto attuale:** pulsante "Lista Pianificazione" apre un pannello separato con solo gli impianti **già selezionati**. Non esiste una lista dei risultati di ricerca in formato panel — quelli si vedono sulla mappa o nella vista lista.

**Nuova Rotta:** pannello fisso a destra (420px) con due tab:

| Tab | Contenuto | Default |
|-----|-----------|---------|
| Risultati (N) | Impianti filtrati disponibili | Default in editing |
| Sel. (N imp. · M fc.) | Solo impianti con facce selezionate | Default in sola lettura |

Il pannello è collassabile tramite toggle sul bordo sinistro.

### Toolbar selezione rapida

Contatore impianti visibili + **"Seleziona tutti" / "Deseleziona tutti"** su tutte le facce disponibili degli impianti filtrati.

Il prodotto attuale ha "Seleziona tutti" come pulsante separato in alto — nuova rotta lo integra nella toolbar del pannello.

---

## 18. Accordion impianti nel pannello

**Prodotto attuale:** ogni impianto è una riga espandibile con la tabella delle facce. La struttura è simile ma il layout differisce: nessuna barra colorata sinistra, nessun badge stato nell'header, il contatore facce è nel formato "X / Y Facce selezionate".

**Nuova Rotta:**
- Barra colorata sinistra (verde/arancione/rosso) — segnale visivo immediato dello stato
- Badge facce: "N/M disp." con colore (verde=tutte selezionate, blu=parziale, grigio=nessuna)
- Checkbox impianto con stato indeterminate
- Pulsante etichette per label system

---

## 19. Info box sulla mappa

**Prodotto attuale:** non presente (nessun riquadro informativo sulla mappa).

**Prototipo originale:** non presente.

**Nuova Rotta:** riquadro in basso a sinistra con:
- Contatore dinamico ("N impianti disponibili" / "N facce selezionate · M impianti")
- Dettagli contesto: canale, periodo, stato commerciale con dot colorato
- Badge filtri attivi + link "Modifica →"
- Toggle **"Solo selezionati su mappa"** (nasconde i marker non selezionati)

**Punto da discutere:** Il toggle "Solo selezionati su mappa" deve influenzare anche la lista nel pannello, o solo i marker visibili?

---

## 20. Sistema di etichette

**Prodotto attuale:** non presente.

**Prototipo originale:** non presente.

**Nuova Rotta:** sistema di tagging per categorizzare gli impianti durante il lavoro:
- Ogni impianto può avere una o più etichette colorate
- Popover con lista etichette + checkbox + creazione inline
- Etichette default: "Prioritario", "Da verificare", "Confermato"

**Punti da discutere:**
- Le etichette sono personali o condivise tra chi accede alla stessa pianificazione?
- Devono persistere tra sessioni?

---

## 21. Drawer POI

**Prodotto attuale:** non visibile negli screenshot.

**Prototipo originale:** stub vuoto (pulsante presente, drawer non funzionale).

**Nuova Rotta:** drawer completo con ricerca libera, categorie rapide, slider raggio (100–2000m), "Le mie collezioni" e filtro zone.

**Punti da discutere:**
- La funzionalità POI è nel MVP o in una fase successiva?
- "Le mie collezioni" presuppone persistenza dati — è prevista nell'architettura?

---

## 22. Dettaglio pianificazione — layout

**Prodotto attuale:** sidebar sinistra (Inserzionista, Budget, Obiettivo, mini calendario) + area principale con mappa Leaflet. Pulsante "Lista Pianificazione" in alto destra + "Salva ed Esci".

**Prototipo originale:** sidebar sinistra analoga + area principale con toggle 4 viste (mappa SVG, lista, griglia placeholder, tabella placeholder).

**Nuova Rotta:** struttura simile al prodotto attuale. La mappa usa Leaflet. Le 4 viste sono presenti ma griglia e tabella restano placeholder.

**Punto da discutere:** Le viste griglia e tabella nel dettaglio sono nella roadmap? Con quale priorità?

---

## 23. Drawer creazione nuova pianificazione

**Prodotto attuale:** non documentato dagli screenshot disponibili.

**Prototipo originale:** drawer 520px, in inglese, inserzionista fisso precompilato ("Gohan Sushi").

**Nuova Rotta:** drawer 520px in italiano:
- Nome planning
- Collega a campagna (checkbox condizionale)
- Brief: Categoria, Periodo, Inserzionista, Budget, Obiettivi (con unità: Visualizzazioni / OTS / Reach)

**Punti da discutere:**
- L'inserzionista è selezionato dal planner o precompilato dalla campagna collegata?
- Le unità dell'obiettivo (Visualizzazioni / OTS / Reach) implicano logiche di calcolo diverse?

---

## 24. Impianti "premium"

**Prodotto attuale:** non visibile dagli screenshot.

**Nuova Rotta:** marker speciale con stella (★) e label "Premium" sulla mappa e nel pannello.

**Punto da discutere:** "Premium" è una categoria commerciale codificata nel sistema attuale o è un'invenzione del prototipo?

---

## Riepilogo punti aperti

| # | Domanda | Area |
|---|---------|------|
| 1 | La struttura di navigazione del prodotto attuale è quella da mantenere? | IA |
| 2 | La categoria WEB è definitivamente fuori dal modulo Planning? | Scope |
| 3 | I due nuovi stati ("In trattativa", "Allegato a trattativa") corrispondono a fasi reali del processo? | Workflow |
| 4 | I nomi degli stati sono allineati con il linguaggio del team commerciale? | Nomenclatura |
| 5 | È possibile riaprire una pianificazione da Completato? Chi può farlo? | Permessi |
| 6 | La colonna "Campagna Associata" è utile nella lista o basta nel dettaglio? | UX |
| 7 | Budget e Obiettivo devono tornare come colonne in tabella (come nel prodotto attuale)? | UX |
| 8 | La colonna Agente corrisponde a un campo reale nel database? | Data model |
| 9 | Il flusso "Prendi in carico" corrisponde al processo reale di assegnazione? | Workflow |
| 10 | Il bug "Invalid Date" nel periodo di esposizione è noto al team dev? | Bug |
| 11 | Il passaggio da Google Maps a Leaflet è una scelta intenzionale? | Infrastruttura |
| 12 | La ricerca per Cimasa e Codice Impianto è usata frequentemente? Va reintrodotta? | UX |
| 13 | Cosa rappresenta "Numero chiesa" come tipo di ricerca nel prodotto attuale? | Dominio |
| 14 | Il filtro "Proprietario impianto" (Proprietario/Fornito) va aggiunto a nuova rotta? | Feature |
| 15 | La tassonomia granulare dei tipi impianto (15+) sostituisce i 3 gruppi generici? | Feature / Data model |
| 16 | Il badge "NEW" su Categoria impianto nel prodotto attuale — siamo allineati sul rollout? | Coordinamento dev |
| 17 | La colonna Slots (DOOH) è rilevante per il planner? Va aggiunta? | Feature |
| 18 | La paginazione del pannello è sufficiente per 4467+ impianti? Filtri lato server? | Architettura |
| 19 | La sidebar del brief deve ricordare lo stato aperta/chiusa tra sessioni? | UX / persistenza |
| 20 | Le voci "In arrivo" nel brief vanno mostrate nel prodotto finale? | Roadmap |
| 21 | Il toggle "Solo selezionati su mappa" influenza anche il pannello destra? | UX |
| 22 | Le etichette sugli impianti sono personali o condivise? Persistono? | Data model |
| 23 | La funzionalità POI è nel MVP o in una fase successiva? | Priorità |
| 24 | "Le mie collezioni" (POI) — la persistenza è prevista nell'architettura? | Architettura |
| 25 | Le viste griglia e tabella nel dettaglio sono nella roadmap? Con che priorità? | Roadmap |
| 26 | "Premium" è una categoria commerciale codificata o un'invenzione del prototipo? | Data model |
| 27 | L'inserzionista nel drawer creazione è selezionato dal planner o precompilato? | Flusso dati |
| 28 | I nomi delle KPI card usano il linguaggio corretto del team? | Nomenclatura |
