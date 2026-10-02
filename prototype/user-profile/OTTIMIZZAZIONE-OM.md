# Ottimizzazione schermata "Per te" — Operation Manager

> **Scopo:** idee per rendere la home ottima per l'OM, che ha un ruolo **operativo** (task da
> svolgere e portare a termine) e **di supervisione**. Proposte da validare con la UX research:
> oggi non sappiamo come l'OM lavori davvero (un task alla volta o per tipo).
>
> Stato: suggerimenti, **non implementati**. Riferimento: V2 di `prototype/user-profile/index.html`.

## Punto di partenza

La schermata mescola le due modalità: KPI e attività servono a chi opera, mappa e calendario a chi
supervisiona. Proposta: separarle, in modo che l'OM veda subito dove deve agire.

## 1. KPI come stato della coda, non solo contatori

- Oggi le 5 card dicono "quante cose ci sono". Per l'operatività serve anche "quanto sono vecchie
  e quanto urgenti": un secondo dato per card (es. "3 oltre 3 giorni", "più vecchia: 5 gg").
- Per la supervisione: tendenza rispetto a ieri / settimana scorsa (la coda cresce o si smaltisce?).
- La card "Anagrafiche da verificare" (dati reali dal Portafoglio) è il modello; le altre vanno
  allineate alla stessa logica quando i dati saranno reali.

## 2. Attività come lista di lavoro

- Filtro per tipo (anagrafiche, pagamenti, preventivi) e raggruppamento per urgenza (oggi, questa
  settimana), invece di una colonna unica ordinata per priorità.
- Azione diretta nella riga dove il task è semplice ("Revisiona", "Approva"): oggi ogni click porta
  fuori pagina, quindi ogni task è un cambio di contesto.
- Supervisione: carico del team (chi ha cosa in coda). Una vista "I miei task / Team" senza
  aggiungere una schermata.

## 3. Calendario come orizzonte, non decorazione

- Mostrare solo ciò che richiede una decisione nei prossimi giorni (scadenze di pagamenti,
  contratti, opzioni in scadenza), non tutte le scadenze.
- Un elenco "Prossimi 7 giorni" ordinato per urgenza sotto il calendario vale più del mese intero.

## 4. Mappa come strumento di supervisione

- Il tab "Impianti" dà il colpo d'occhio su disponibilità, opzioni e riserve nell'area.
- Evidenziare ciò che richiede azione: opzioni in scadenza, riservati senza trattativa collegata;
  filtro rapido "Da attenzionare".
- Il tab è dietro un click: una mini-sintesi sulla tab (es. "8 opzioni in scadenza") la rende
  visibile senza aprirla.

## 5. Gerarchia

- In alto il "cosa devo fare ora": KPI più urgenti e prime 3–5 attività.
- Sotto il "come sta andando": mappa, calendario, carico del team.
- Oggi l'ordine è simile, ma le due metà hanno lo stesso peso visivo.

## Priorità suggerita

Le due modifiche con più ritorno e meno rischio: **età/urgenza dentro le KPI** e **azione diretta
nella riga** delle attività "Anagrafiche" (i dati del Portafoglio ci sono già). Il resto richiede
dati o decisioni di prodotto che oggi mancano (carico del team, tendenze).
