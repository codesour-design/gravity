# Gravity Platform — Guida Prototipi

> **Fonte di verità unica: `CLAUDE.md`** (regole, brand, struttura, mappa di tutta la
> documentazione). Questo file esiste solo per i tool che cercano `AGENTS.md`: non aggiungere
> contenuto qui — aggiorna `CLAUDE.md` e i file che esso indicizza.

Regole dure (dettaglio in `CLAUDE.md`):

1. Mai lavorare su `main` — branch `nome/prototipo`, merge via PR.
2. Nuovo prototipo sempre da `prototipi/_template.html` (CDN + tokens + reset già inclusi).
3. Tema solo da `prototipi/tokens.js` (`window.GRAVITY_THEME`, CSS vars `--gravity-*`) — mai valori hardcoded.
4. Mai Oswald/Inter nell'interfaccia: la UI usa solo la tipografia Ant Design (SF Pro Text).
5. Prima di costruire un elemento UI: consultare `components/*.md` e riusare i JS condivisi in `prototipi/`.
6. Light mode default; naming cartelle kebab-case inglese, varianti `--`.
