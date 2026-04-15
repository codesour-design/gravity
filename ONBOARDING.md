# Onboarding — Nuova Designer Gravity

Questa guida ti permette di replicare esattamente l'ambiente di lavoro usato per i prototipi Gravity: HTML → Figma → deploy su Vercel tramite GitHub.

---

## 1. Prerequisiti

- Mac con macOS recente
- Account Anthropic (necessario per Claude Code)
- Account GitHub (ti verrà aggiunto come collaboratore al repo)
- Account Figma con accesso ai file Gravity (ti verrà condiviso)

---

## 2. Installa Claude Code

Scarica e installa l'app desktop Claude Code da [claude.ai/code](https://claude.ai/code).

Apri l'app, fai login con il tuo account Anthropic.

---

## 3. Clona il repository

```bash
git clone https://github.com/codesour-design/gravity.git
cd gravity
```

Per essere aggiunta come collaboratrice al repo, chiedi a Gloria di invitarti da GitHub Settings → Collaborators.

---

## 4. Apri il progetto in Claude Code

Apri Claude Code e punta la working directory su `/percorso/dove/hai-clonato/gravity`.

Il progetto contiene già:
- `CLAUDE.md` — regole del progetto, stack, brand, mappa componenti React → Figma
- `LAYOUT.md` — pattern di layout dell'app e struttura file Figma
- `.claude/commands/` — comandi pronti all'uso (`/deploy`, `/gravity-tokens`, `/handoff`)
- `.claude/skills/` — skill Figma già configurate per Gravity

Claude Code li legge automaticamente all'avvio — non devi fare nulla.

---

## 5. Abilita i plugin

In Claude Code, vai su **Settings → Plugins** e abilita:

| Plugin | Perché |
|--------|--------|
| `figma` | Per leggere e scrivere su Figma |
| `vercel` | Per verificare i deploy (opzionale) |
| `github` | Per operazioni GitHub avanzate (opzionale) |
| `frontend-design` | Per la generazione di UI di qualità |

---

## 6. Connetti Figma MCP

Il plugin Figma di Claude Code si connette tramite l'app desktop Figma.

1. Apri **Figma Desktop**
2. Vai su **Plugins → Development** e verifica che il plugin Claude Code sia attivo (di solito si attiva in automatico al primo uso)
3. In Claude Code, nella chat, scrivi qualcosa come "chi sono su Figma?" — se risponde con il tuo nome, la connessione funziona

---

## 7. Accesso ai file Figma

Ti servono i permessi di accesso a questi file (chiedi a Gloria di condividerli):

| File | Uso |
|------|-----|
| `Ant Design System for Gravity` | Libreria componenti — da abilitare come library in Figma |
| File schermate del modulo su cui lavori | Canvas di lavoro |
| File handoff | Documentazione flussi per sviluppatori |

Per abilitare la libreria: in Figma → **Assets → Libraries** → cerca "Ant Design System for Gravity" → Enable.

---

## 8. Workflow quotidiano

### Regola fondamentale: non lavorare mai su `main`

Ogni designer lavora sul proprio branch. `main` è il branch stabile — si aggiorna solo tramite Pull Request.

### Iniziare un nuovo prototipo

```bash
git checkout main
git pull origin main                  # aggiorna il tuo main locale
git checkout -b tuonome/prototipo     # crea il tuo branch
# es: git checkout -b alice/campagne
```

### Costruire un prototipo HTML

1. Crea la cartella in `prototipi/nome-prototipo/` (kebab-case, inglese, no numeri)
2. Parti da `prototipi/_template.html` come base
3. Lavora in Claude Code — `CLAUDE.md`, `LAYOUT.md` e `components/` sono i tuoi riferimenti
4. Verifica nel browser aprendo il file in locale
5. Salva spesso con commit:

```bash
git add .
git commit -m "descrizione breve del lavoro"
git push origin tuonome/prototipo
```

### Trasporre su Figma

```
/gravity-tokens [URL della schermata Figma]
```

Oppure usa `/handoff` per costruire un flusso completo di handoff.

### Quando il prototipo è pronto — aprire una PR

1. Vai su [github.com/codesour-design/gravity](https://github.com/codesour-design/gravity)
2. Clicca **"Compare & pull request"** sul tuo branch
3. Descrivi brevemente cosa hai fatto
4. Chiedi a Gloria (o all'altra designer) di fare una lettura rapida
5. Una volta approvata, si mergia su `main` — Vercel deploya automaticamente in 10–20 secondi

### Ricevere le modifiche delle altre

```bash
git checkout main
git pull origin main                  # aggiorna main
git checkout tuonome/prototipo
git rebase main                       # porta le novità nel tuo branch
```

**Non hai bisogno di un account Vercel** — il deploy avviene tramite GitHub e il progetto Vercel è già configurato.

Puoi verificare il risultato su: https://gravity-prototipi-codesour.vercel.app

---

## 9. Riferimenti

| Risorsa | URL / Percorso |
|---------|----------------|
| Repo GitHub | https://github.com/codesour-design/gravity |
| Deploy produzione | https://gravity-prototipi-codesour.vercel.app |
| Design System Figma | https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity |
| Regole progetto | `CLAUDE.md` |
| Pattern di layout | `LAYOUT.md` |

---

## 10. Aggiornare le skill in futuro

Le skill si trovano in `.claude/skills/` dentro il repo. Se vengono aggiornate:

```bash
git pull
```

Le modifiche sono disponibili immediatamente alla prossima sessione di Claude Code.
