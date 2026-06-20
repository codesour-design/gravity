# Intervista raccolta insight — Gravity Platform

**Data:** 4 giugno 2026
**Intervistata:** Bianca — segreteria commerciale / operations (potenziale ruolo Operation Manager su Gravity)
**Intervistatori:** team design Gravity (Gloria, Alessia, Elena)
**Sistemi attualmente in uso:** LANSA (gestionale: anagrafiche, disponibilità, preventivi, ordini), Alyante (amministrazione: solleciti di credito), CRM (lead, attività, opportunità, estratti conto), Excel, Teams, WhatsApp, agenda cartacea

> Trascrizione ripulita dal rumore della registrazione automatica. I concetti sono riportati fedelmente; le frasi sono state riformulate per leggibilità.

---

## Introduzione

**Design:** Ti abbiamo chiesto questa chiamata per un confronto e per raccogliere informazioni: stiamo progettando dei flussi all'interno del nostro software, in particolare per la tua figura. Vorremmo prima rinfrescare le cose di cui abbiamo già parlato e poi scendere nel dettaglio su alcuni punti. Ti ruberemo circa un'ora.

**Bianca:** Ok.

## La giornata tipo e i software utilizzati

**Design:** A livello di massima, com'è la tua giornata di lavoro, da quando inizi fino a fine giornata? Per raccontarcelo ti chiederei di condividere lo schermo, così vediamo i vari software che utilizzi. Raccontaci una giornata media, quella più normale; sulle eccezioni scendiamo dopo.

**Bianca:** La giornata è molto variegata. Parto dal programma con cui mi interfaccio di più, LANSA, che è dove c'è l'anagrafica del cliente.

**Design:** La mattina il primo software che apri è quindi LANSA?

**Bianca:** Dipende. Ti direi di sì, ma può essere anche il CRM, oppure Alyante se devo mandare un sollecito di credito. Non te lo so dire con esattezza, dipende da cosa devo fare. Per esempio stamattina il signor Noara mi ha chiesto di inserire un nominativo su LANSA e di assegnarglielo: ho creato una nuova anagrafica — un nuovo contatto — e ho inserito i dati su LANSA.

## Verifica disponibilità affissioni

**Bianca:** Dopo aver caricato l'anagrafica, se poi serve un preventivo per un'affissione, prima vado a verificare la disponibilità. In teoria la disponibilità dovrebbero verificarla gli agenti, ma a mio avviso quattro occhi sono meglio di due, quindi la ricontrollo io.

Su LANSA vado su Gestione affissioni → Disponibilità affissioni. Inserisco la quattordicina di riferimento (in questo caso la prossima, che parte il 15 giugno), la competenza (es. Sicilia occidentale) e il comune o la provincia (es. Palermo). Il sistema mi mostra la lista di tutti gli impianti che abbiamo in provincia di Palermo, con la disponibilità su tre quattordicine: quella gialla è la prima (15–29 giugno), poi le due successive (una evidenziata in blu). Così vedo, per esempio, che se devo fare un preventivo per 50 pensiline/fermate bus, gli spazi ci sono.

## Anagrafica cliente

**Bianca:** Quando creo l'anagrafica non è detto che io abbia tutti i dati: a un primo contatto potrei avere anche solo il nome dell'azienda e basta. L'agente mi darà tutti i dati nel momento in cui devo fare il contratto: non posso fare il contratto senza i dati anagrafici completi — ragione sociale, partita IVA, codice fiscale, codice univoco, PEC, tutto.

## Creazione dell'attività

**Bianca:** Ogni preventivo è collegato a un'attività. Dall'anagrafica del cliente faccio "Nuova attività" e compilo: tipo mezzo (es. affissione), stagionalità (il 15 giugno siamo ancora in primavera), la quattordicina di riferimento, la categoria, lo stato della trattativa (es. "in corso") e il ruolo. Il sistema riprende l'utenza con cui sono entrata; io però imposto il ruolo dell'agente (es. il signor Noara) e il campo "assegnata a". Quando entro con la mia utenza vedo tutte le attività che mi sono assegnate.

Questa fase in teoria la fanno i ragazzi: il preventivo lo fanno loro, non io. Ci sono volte in cui lo faccio io, o lo vediamo insieme, ma di norma è compito loro.

## Il preventivo

**Bianca:** Dall'attività entro in "Preventivi". Nel preventivo ci sono informazioni che all'inizio non posso sapere, come le condizioni di pagamento (30 giorni? 60? acconto?): il preventivo è solo la fase iniziale. Devo però inserire necessariamente:

- **La quattordicina di riferimento** (es. il 15).
- **Il formato materiale**: o stampiamo noi ("nostro") — e allora il preventivo calcola i costi di stampa, che sono fissi da listino e su cui non si può fare alcuno sconto — oppure stampa il cliente ("da cliente"). C'è poi la voce "esistente", che usiamo quando una campagna di 28 giorni prosegue nella quattordicina successiva con lo stesso soggetto: non c'è nuova stampa, e l'azienda sa che non deve stampare né ricevere materiale.
- **Il soggetto** della campagna.
- **Il dettaglio**: con tasto destro → "Inserimento dettaglio" inserisco comune (es. Palermo), mezzo/strumento, quantità, e avanzo con il tab.

Il prezzo unitario proposto è il prezzo di listino (di "destino"), caricato in LANSA sia per gli impianti sia per la stampa. Esempio: 4 poster formato 4x3, stampa a 25 € l'uno.

**Sconti e budget:** il cliente magari mi dice "il mio budget non è 620 €, ne ho 500". Inserisco 500 nel campo budget e il sistema in automatico mi mostra che sto applicando uno sconto del 23,07%: il prezzo unitario passa da 130 € di listino a 100 €. Al contrario, se inserisco 800 € (sopra il prezzo di listino), mi dice che sto vendendo a un prezzo superiore — es. 174 € invece di 130. Poi faccio "Elabora prezzi" e "Salva".

**Conferma:** quando confermo il preventivo e faccio "Elabora prenotazione", il sistema aggiorna subito in automatico la disponibilità degli impianti. (Per questo ora non posso mostrarvelo dal vivo: aggiornerei davvero la disponibilità.)

## Provvigioni e agenzia

**Bianca:** I ragazzi di Media Hub non hanno provvigioni, quindi per loro non c'è calcolo provvigionale. Gli agenti di Alessi invece prendono provvigioni, calcolate sulla base del prezzo di vendita: se vendono a listino hanno una provvigione, se applicano un certo sconto ne hanno un'altra. Il sistema le calcola in automatico quando confermiamo il preventivo e si entra nell'ordine: ti dice "l'agente Pippo sta al 7%" e così via.

Quello che invece inserisco io a mano è la percentuale di **agenzia**: siccome il sistema è tutto di Alessi, Media Hub funge da agenzia, quindi c'è una provvigione che Alessi deve riconoscere a Media Hub e la inserisco manualmente.

## Documenti: riepilogo per il cliente e disamina

**Bianca:** Dal preventivo posso stampare un documento riepilogativo forfettario con le informazioni principali: soggetto della campagna, comune, tipo mezzo, quantità, costo stampa e un totale forfettario (senza il prezzo unitario per impianto). In teoria al cliente non andrebbe dato, ma capita che il cliente sia fuori e l'agente lo chieda stampato. Io personalmente non lo uso quasi mai: ad altri non si può dare il dettaglio unitario, e a cliente chiuso si fa il contratto.

Poi c'è la **disamina**, che stampo da LANSA e salvo nelle nostre cartelle documenti (per mese/anno). La disamina contiene la parte economica completa: prezzo di listino, sconto applicato (es. 18,01%), costo unitario scontato, totale. Nelle disamine degli agenti ci sono anche le colonne delle provvigioni: la provvigione è a scaglioni in base allo sconto applicato (es. con sconto tra il 10% e il 15% prende tot), con percentuali diverse su impianti e stampa (es. 8% sugli impianti, 6% sulla stampa). C'è la colonna con l'importo effettivo che prenderà l'agente, l'eventuale percentuale di agenzia, e infine il netto per l'azienda.

## Riepilogo campagne e proseguimenti

**Bianca:** All'interno dello stesso preventivo posso fare più campagne: vado a variare la quattordicina di riferimento (es. non più il 15 giugno ma il 13 luglio) e rifaccio l'inserimento dettaglio — il sistema riprende in automatico i dati della campagna precedente. Nella maschera "Riepilogo campagne" vedo tutte le campagne del preventivo: la prima che esce il 15 giugno, la seconda il 13 luglio, e così via.

Come **tipo campagna** il sistema mette "normale". Se invece il cliente dice "usciamo il 15 per 28 giorni", la seconda quattordicina è un **proseguimento**: imposto tipo campagna "proseguimento", il sistema mette in automatico formato materiale "esistente" (stesso soggetto, niente nuova stampa — bisogna stare attenti a togliere/azzerare il formato stampa con "annulla formato stampa" e reinserire il dettaglio). Nel proseguimento il costo dell'impianto è inferiore al listino della prima campagna: non più 130 €, ma ad esempio 123,50 €. Nel riepilogo campagne la seconda riga risulta "proseguimento" (PRO). Allo stesso modo esiste il tipo "campagna web".

## Situazione contabile del cliente e solleciti

**Bianca:** Nella parte finale, dobbiamo stare attenti alla situazione contabile del cliente verso l'azienda. Sono successi casi in cui un cliente non aveva saldato la campagna precedente e l'agente arrivava chiedendo un nuovo preventivo. Prima l'agente deve parlare col cliente di ciò che abbiamo di residuo, poi si può procedere con una nuova trattativa.

Sarebbe cosa gradita che queste informazioni fossero lì [nel flusso del preventivo]; in realtà non ci sono, quindi andiamo un po' a sentimento e a memoria. Quindi: quando l'agente mi chiede un preventivo per un cliente, prima vado a controllare la situazione di quel cliente. La controllo sul **CRM**: cerco l'azienda e vedo, per esempio, che il cliente ha uno scaduto di 100 €. A quel punto stampo l'estratto conto del cliente e lo mando — io o l'agente, dipende dalla situazione.

Poi ci sono i **solleciti**, documenti estrapolati da **Alyante**:

- **Sollecito di pagamento** ("gentile", primo o secondo): riporta i dati anagrafici dell'azienda e l'elenco delle fatture — numero fattura, data di emissione, totale, data di scadenza (legata alle condizioni di pagamento: a 30 giorni dalla data di emissione il cliente deve saldare) — e il totale dello scaduto (es. 552 €).
- **Sollecito prelegale**: se il cliente non risponde e non paga dopo il primo/secondo sollecito. La dicitura è simile ma più dura: "a seguito di numerosi solleciti scritti e verbali, la invitiamo a rimettere l'importo entro 5 giorni dalla ricezione della presente; in caso contrario passeremo la pratica al nostro legale". Lì il mio lavoro finisce: c'è un ufficio che si occupa del legale.

**Design:** Questi come li mandate, via mail?

**Bianca:** Via **PEC**, dalla nostra PEC alla PEC del cliente.

## Supporto agli agenti sui preventivi

**Design:** Hai detto che il preventivo di solito lo fa il commerciale, ma ogni tanto capita di farlo tu. Quali sono le situazioni in cui devi dare supporto a un commerciale per un preventivo?

**Bianca:** Soprattutto per quanto riguarda **lo sconto**. Parliamoci chiaro: i ragazzi, per chiudere il contratto, applicano sconti importanti. Loro sanno che prima di mandare il preventivo al cliente, o di dare risposta, devono fare un passaggio da qua: se non passa da questo ufficio il preventivo non esce. Quindi capita spesso che li vediamo insieme: l'agente mi dice "ho fatto il 25%", io dico "assolutamente no, puoi fare il 20%". Magari, già che sono nella mia stanza, per comodità apriamo il preventivo dal mio computer e modifichiamo insieme il budget — avevano messo 500, dico "500 è uno sconto troppo alto, mettiamo 600".

Il preventivo **viene visto sempre da me**, ma che venga creato da loro è altrettanto vero. Capita anche che per velocità un agente mi chiami e lo carichiamo insieme al volo.

Inoltre: il preventivo lo posso **confermare solo io** e solo io lo posso **trasformare in ordine**. Gli agenti non possono trasformare il preventivo in ordine.

## Contratto e ordine

**Bianca:** Sono io che faccio il contratto e l'ordine. Generalmente lo stampo cartaceo per i ragazzi, che lo portano al cliente per la firma. Se il cliente è fuori, lo mando via mail e chiedo al cliente di rimandarcelo via **PEC**, perché è un documento ufficiale: dovremmo averlo sempre in originale, timbrato e firmato — non si sa mai, se dovesse succedere qualcosa abbiamo tutto in regola.

## Ricerca nominativi

**Bianca:** Poi c'è tutta la parte di ricerca dei nominativi. Roberto è in giro, mi scrive: "passo da un panificio, il panificio Pinco Pallo è libero?". Io faccio la ricerca, e purtroppo la devo fare sia su LANSA sia sul CRM. I lead sul CRM se li caricano loro, io non li carico.

Spesso i ragazzi mi danno solo "la gelateria che sta a Campiano" — ma quello è il nome insegna, la ragione sociale potrebbe essere "Fagone S.r.l.". Quindi chiedo loro di mandarmi direttamente la **partita IVA**: la copio, la cerco su internet e trovo la ragione sociale. È uno dei miei "tips", anche se è una lotta continua.

## Riunione commerciale settimanale

**Bianca:** Sul CRM vado anche a verificare l'agenda dei ragazzi, cioè tutte le attività che inseriscono, per capire cosa fanno. Mi serve perché il lunedì sono in riunione commerciale con il signor Rino: presento le visite fatte, le trattative in corso, ed è anche un'analisi — il signor Rino vuole vedere cosa sta facendo il gruppo, se ci sono criticità, suggerimenti da dare ai ragazzi. Ne discutiamo tutti insieme.

**Design:** Quali tipologie di informazioni ti serve recuperare per la riunione? Fai un collage dai diversi software?

**Bianca:** I ragazzi usano il CRM per tutte le loro attività (visite, telefonate); LANSA la usano solo per verificare la disponibilità e creare il preventivo. Quindi per la riunione:

1. **Attività da CRM**: imposto la settimana di riferimento (la riunione è settimanale), estraggo in Excel le attività — per esempio solo le **visite** dei quattro ragazzi (Margherita, Giorgio Focarini, Alessandro Nicoletti, Roberto) per la settimana 11–17 maggio — e in Excel mi creo una tabella pivot con le quantità, perché il signor Rino la vuole così. La lista dei nomi serve anche da spunto in riunione: ad esempio "ottica Rino": ora che entriamo nella stagione estiva si lavora sul mondo degli ottici, dei medici, delle aziende di giardinaggio, eccetera.
2. **Ordini definiti da LANSA**: è LANSA che gestisce gli ordini, quindi da lì estraggo gli ordini che i ragazzi hanno definito in settimana. Così oltre alle visite si vede anche il concreto.
3. **Trattative dal CRM** (sezione Opportunità): le presento e le commentiamo una a una — "questa è di Giorgio Focarini, ha questa trattativa con questo cliente…".

Faccio anche analisi sulle campagne uscite nello stesso periodo dell'**anno scorso**, per dare suggerimenti ai ragazzi ("vedi che l'anno scorso è uscito questo cliente", "la categoria merceologica che usciva in pubblicità era questa"), e sulla **concorrenza** — su quella mi aiuta molto Francesco, ci sentiamo spesso.

Premessa importante: questa impostazione è **mia**. La riunione la imposto io, nel modo in cui il signor Rino chiede a me determinate cose. Lia, per esempio, che fa le riunioni a Catania (e io partecipo anche a quelle), usa file Excel completamente diversi: lei le trattative se le ricopia una a una in Excel, mentre io le vado a vedere nel CRM nelle opportunità. Ognuno lo fa in base alle proprie esigenze. Per questo secondo me questa chiamata dovreste farla anche con le altre colleghe: io ho competenze su certe cose, altre parti (per esempio [certe pratiche]) non le tratto io.

**Design:** Come mai certe parti non le tratti tu?

**Bianca:** Perché qui stiamo parlando di Media Hub, mentre le altre persone che ho nominato lavorano in Alessi e devono gestire anche le provvigioni. Ma a livello di ruolo, il ruolo è lo stesso: io in questo momento "sono" Monica, Nia, Martina, Simona — voi state parlando con me, ma dovreste parlare un po' con tutte.

## Lead in entrata (candidature spontanee)

**Design:** Ci sono casi in cui è il cliente a contattarvi spontaneamente per fare pubblicità?

**Bianca:** Certo. Chiamano **Alessi** — nessuno sa chi è Media Hub, l'utente cerca Alessi e trova Alessi. Tutti i nuovi nominativi passano da me, anche per aiutare i ragazzi a incrementare i loro portafogli. Mi chiama il signor Valenti, "avrei bisogno di…": già al telefono chiedo "avete già lavorato con noi?" — c'è chi dice "sì, venticinque anni fa", c'è chi dice no. Faccio il controllo, raccolgo le informazioni principali generiche (nel merito non entro io, è il ruolo dell'agente) e poi passo il contatto all'agente di zona: se sono su Trapani e provincia, che adesso è gestita da Roberto, passo il contatto a Roberto su WhatsApp e dico al cliente "la farà contattare il nostro agente".

Altri canali: le richieste che arrivano a **info@** (me le inoltrano e le gestiamo), la **campagna autopromozionale** gestita su cloud — c'è un file Excel a cui ho accesso, verifico chi ha lasciato il contatto e se è cliente nuovo o no, e poi lo assegno — e ancora spunti dalla **concorrenza**. Quindi i nominativi non arrivano solo dai ragazzi.

## Doppia assegnazione di un cliente

**Design:** È capitato che venga assegnato lo stesso cliente a due commerciali contemporaneamente? Come lo gestite?

**Bianca:** È capitato, e proprio per un errore mio: la verifica non era stata fatta in modo corretto e quel nominativo è stato visitato e contattato da due persone diverse. L'ho gestita io con i ragazzi — "mi dispiace, è stato un errore mio" — e tra loro hanno deciso: "vai tu, che ormai ti conosce di persona".

Però il CRM su questo ci aiuta molto: quando si carica un lead, anche con il solo numero di telefono, il CRM segnala "questo numero esiste già, è già assegnato all'agente Margherita — perché lo stai caricando?". Quindi capita raramente, ma può capitare.

## Canali di comunicazione e gestione delle attività

**Design:** Vorrei farti domande sui canali di comunicazione che usate tra voi per capire le attività da fare. A inizio chiamata hai detto che il signor Noara ti ha fatto una richiesta: dove ti è arrivata?

**Bianca:** [Via messaggio/mail] — mi ha scritto tutte le informazioni, è stato molto preciso, mi ha mandato un sacco di dati utili per la ricerca.

Capita — ora meno di prima — che i ragazzi usino **WhatsApp**. Ma io non ho il telefono aziendale e il mio telefono privato per lavoro non lo voglio usare, quindi ho detto loro di scrivermi su **Teams** o via **mail**, che sono gli strumenti aziendali che abbiamo. Noi parliamo molto su Teams. Se sono fuori, mi chiamano al telefono.

**Design:** Quindi non c'è una parte di uno dei software che ti segnala già all'interno le attività da fare?

**Bianca:** No. E io non posso schedulare il mio lavoro: posso schedulare nella giornata, ma non posso programmare oggi la giornata di domani, perché appena chiudo con te non so cosa mi succede. È un lavoro molto dinamico: mi chiama Giovanni che sta guidando e mi dice "mi vedi la disponibilità di…?", arriva Giorgio, mi chiama un cliente per un appuntamento sulla campagna…

Ho un'agenda cartacea, all'antica, scritta a mano: siccome vivo un po' con la testa tra le nuvole, prendo appunti — so che devo riscontrare la richiesta del signor Rino, eccetera. Ho delle **attività fisse giornaliere**: verificare le nuove lead arrivate dalla campagna autopromozionale (sono davvero poche), verificare i **bonifici** — se aspetto un bonifico da un cliente e oggi non arriva, so già che devo mandare il sollecito. E so che domani ho la riunione ordini con il signor Alessio. Ma il resto non si può schedulare.

## Annullamento di un contratto firmato

**Design:** Per curiosità: che succede, in termini tecnici, se dovete annullare un contratto già firmato?

**Bianca:** Il cliente comunica il problema e chiede di annullare. La comunicazione deve essere inviata ad Alessi; io parlo con Rosy, che si occupa di ricontattare il cliente. Lo comunichiamo al signor Rino — "c'è questa situazione, il cliente ha annullato un contratto già firmato" — e il signor Rino deve dare l'ok per annullarlo. A quel punto Rosy **annulla l'ordine da LANSA**: gli impianti, che erano stati tolti dalla disponibilità perché riservati a quell'ordine e a quel cliente, tornano disponibili.

Questa è una cosa che prima potevo fare anch'io, ma ora non più: da circa **tre mesi** noi della segreteria, una volta confermato l'ordine, non possiamo più modificarlo. L'ordine può essere modificato solo dall'ufficio di Rosy.

## Chiusura

**Design:** Grazie mille. Stiamo lavorando sul tuo ruolo: sulle responsabilità, sui permessi da assegnargli, sui dati che gli interessano — quelli da visualizzare la mattina quando ci si connette, per questo la prima domanda è stata quella. Il flusso preventivi e il resto li stiamo approfondendo anche con altre persone. Ci interessava la panoramica di come lavori tu, per progettare funzionalità che ti tornino davvero utili: è un lavoro di design a livello di servizio, per questo le domande erano generiche.

**Bianca:** Ho capito, va bene, perfetto. Per qualsiasi cosa — dubbi, domande, o se ho dimenticato qualcosa — sentiamoci pure. Grazie a voi.

---

## Note a margine (fuori intervista)

- I primi minuti della registrazione riguardano il setup tecnico (prova di Granola e Notion per la trascrizione, problemi audio/rete, attesa dell'arrivo di Bianca) e sono stati omessi.
- "L'Ansa" nella trascrizione automatica corrisponde al gestionale **LANSA**; "Aliante" ad **Alyante**; "Amilia Hub / Amidia" a **Media Hub**.
