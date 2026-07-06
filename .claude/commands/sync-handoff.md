# sync-handoff

Rigenera tutti i file `index--handoff.html` a partire dagli `index.html` corrispondenti.
Usare dopo aver modificato un prototipo senza passare da un commit git (es. durante sviluppo attivo).

## Steps

1. Trova tutti i file `handoff-steps.js` in `prototype/`
2. Per ognuno, rigenera `index--handoff.html` nella stessa cartella:
   - Copia il contenuto di `index.html`
   - Inietta prima di `</body>`:
     ```html
     <script src="./handoff-steps.js"></script>
     <script src="[percorso relativo a prototype/]/handoff.js"></script>
     ```
   - Percorso relativo: conta i livelli di directory tra la cartella del prototipo e `prototype/`
     - `prototype/nome/` → `../handoff.js`
     - `prototype/gruppo/nome/` → `../../handoff.js`
3. Mostra un riepilogo dei file rigenerati
4. Non committare — lascia all'utente la decisione

## Nota

Il pre-commit hook git esegue questa operazione automaticamente ad ogni commit.
`/sync-handoff` serve per aggiornare i file handoff durante lo sviluppo, prima di committare.
