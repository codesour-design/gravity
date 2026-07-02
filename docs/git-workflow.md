# Git workflow — Gravity

> Regola madre (in CLAUDE.md): **non si lavora mai direttamente su `main`.**
> `main` è il branch stabile; ogni designer lavora sul proprio branch e mergia solo quando il
> lavoro è pronto. Vercel deploya automaticamente ad ogni merge su `main`.

## Iniziare un nuovo prototipo

```bash
git checkout main
git pull origin main                      # parti sempre dall'ultimo main
git checkout -b nome/nome-prototipo       # crea il tuo branch
# es: git checkout -b gloria/planning
```

## Lavorare e salvare

```bash
git add .
git commit -m "descrizione del lavoro"
git push origin nome/nome-prototipo       # pusha il tuo branch, non main
```

## Quando il prototipo è pronto

1. Apri una **Pull Request** su GitHub: `nome/nome-prototipo` → `main`
2. L'altra designer fa una lettura veloce (review)
3. Si mergia su `main` — Vercel deploya automaticamente

## Ricevere le modifiche delle altre

```bash
git checkout main
git pull origin main                      # aggiorna il tuo main locale
git checkout nome/nome-prototipo
git rebase main                           # porta le novità nel tuo branch
```

(La skill `/morning-sync` fa questa sincronizzazione e mostra lo stato del lavoro.)

## Naming dei branch

| Formato | Esempio |
|---------|---------|
| `nome/prototipo` | `gloria/planning` |
| `nome/prototipo` | `elena/campagne` |

Usa il tuo nome (o iniziali) come prefisso. Non lavorare sul branch di un'altra.
