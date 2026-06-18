# File di lavoro — Aggiornamenti User Profile

> **Scopo:** tradurre il nuovo design fatto su **Figma Make** (`aggiornamenti/User Profile Gravity/`)
> in istruzioni per aggiornare il prototipo esistente `prototipi/test/user profile/index.html`.
>
> **Stack:** il nuovo export è in React + Tailwind/shadcn. Il nostro `index.html` resta in
> **Ant Design 5 via CDN + token Gravity** (vedi CLAUDE.md). Qui si portano i cambiamenti
> *concettuali e visivi*, non il codice Tailwind alla lettera.
>
> Fonte nuovo design: `aggiornamenti/User Profile Gravity/src/app/App.tsx`
> File da aggiornare: `prototipi/test/user profile/index.html`

---

## Direzione di lavoro — l'architettura per-ruolo RESTA

Il prototipo attuale è interamente **role-based**: 5 ruoli (Tenant Admin, Inventory Manager,
Operation Manager, Planner, Sales) con switcher nell'avatar, navbar/metriche/spazi/attività
che cambiano per ruolo, e persistenza in `localStorage`. **Questa architettura va mantenuta.**

Il design Figma Make è stato fatto **solo per la vista Operation Manager** (ruolo fisso,
utente "Mario Rossi"). Quindi:

- ✅ **Le revisioni di UX/UI (i pattern) vanno declinate su TUTTI i ruoli.** Sono migliorie
  trasversali: nuovo tenant switcher con loghi, avatar con overlay "Modifica", modale password
  rivista, layout KPI a card con trend, attività con categoria+chip+filtro, **schermata
  Cronologia**, skeleton. Questi pattern si applicano a ogni ruolo.
- 🎯 **La vista Operation Manager di Figma Make è il riferimento di contenuto** per quel ruolo
  (metriche, task, cronologia, prodotti, valori esatti).
- 🔁 **Per gli altri 4 ruoli** i contenuti vanno **adattati** allo stesso pattern: nuove
  metriche/task/cronologia coerenti col ruolo, riusando i dati già presenti nell'index.html
  dove possibile e completando ciò che manca (es. categorie attività, cronologia per ruolo).

> In sintesi: **UI/UX = universale** (per tutti i ruoli) · **contenuto = per ruolo**
> (Operation Manager dato da Figma Make, gli altri da declinare).

### Cosa è universale vs per-ruolo

| Elemento | Universale (UI/UX) | Per-ruolo (contenuto) |
|----------|:--:|:--:|
| Tenant switcher con loghi (navbar) | ✅ | |
| Avatar editabile con overlay "Modifica" | ✅ | |
| Modale password (toggle occhio + validazioni) | ✅ | |
| Layout KPI a 5 card + trend tag | ✅ | valori metriche |
| Sezione prodotti (Atlas/Orbit/Vector/Comet) | ✅ pattern card | quali prodotti/accessi per ruolo |
| Attività: categoria + chip + filtro + bottone Cronologia | ✅ | task e categorie del ruolo |
| Schermata Cronologia (timeline per data + stato) | ✅ | voci cronologia del ruolo |
| Skeleton di caricamento | ✅ | |

### Punti da sciogliere mentre si costruisce (default proposti)
- **Categorie attività per ruolo:** le 5 categorie del design (Pagamenti, Preventivi,
  Anagrafiche, Contratti, Assegnazioni) sono tarate sull'Operation Manager. _Default:_ assegnare
  a ogni task dei ruoli esistenti la categoria più pertinente; alcune categorie possono non
  comparire per certi ruoli (es. un Planner avrà più "Assegnazioni/Pianificazione" che "Pagamenti").
- **Numero metriche:** l'OM ne ha 5, i ruoli attuali ne hanno 4. _Default:_ portare tutti a un
  layout flessibile (`flex-wrap`) che regge 4 o 5 card senza rompersi.
- **Sezione prodotti vs spazi:** l'OM mostra 4 prodotti piattaforma. _Default:_ mostrare i prodotti
  a tutti i ruoli; valutare se la label/sottoinsieme cambia per ruolo.

---

## Riepilogo dei cambiamenti

> **N.B.** Il design Figma Make mostra solo la vista Operation Manager. "Dopo" = come deve
> diventare quel ruolo; i pattern UI/UX si declinano poi su tutti i ruoli (vedi sopra).

| # | Area | Prima (index.html) | Dopo (Figma Make, vista OM) |
|---|------|--------------------|-------------------|
| 1 | Architettura | Role-based (5 ruoli) | **Resta role-based**; OM è la vista di riferimento |
| 2 | Navbar | Menu dropdown role-driven + Select tenant borderless | Voci nav + **dropdown avatar-tenant con loghi** (lo switcher si applica a tutti i ruoli) |
| 3 | Switch tenant | Redirect a SSO per alessi/movingup | In-app, con spinner di caricamento |
| 4 | KPI | 4 metriche per ruolo | 5 metriche operative fisse |
| 5 | "I tuoi spazi" | 5 spazi fisici OOH (codice/città/tipo/stato/occ.) | 4 prodotti piattaforma (Atlas/Orbit/Vector/Comet) |
| 6 | Attività | TaskCard con icona generica, nessun filtro | TaskCard con categoria+chip colorato, filtro multi-categoria, bottone Cronologia |
| 7 | Cronologia | — (non esisteva) | **Nuova schermata** timeline per data con stato/categoria/utente |
| 8 | Avatar | Badge edit nell'angolo | Overlay hover "Modifica" con icona fotocamera |
| 9 | Modale password | Form base AntD | + toggle mostra/nascondi password, validazione 8 caratteri |

---

## Dettaglio per sezione

### 1. Navbar
- **Menu di navigazione: lasciare quello role-driven esistente** (`ROLE_NAV`, `NAV`,
  `SECTION_LABEL`, `ITEM_LABEL`) — le voci dipendono dal ruolo. Il design Figma Make mostra
  solo Overview/Inventory/Delivery perché è la vista Operation Manager.
- A destra: campana + un **unico controllo combinato avatar + tenant** (questo è il cambiamento
  universale che sostituisce il `Select` borderless attuale, per tutti i ruoli):
  - mostra avatar, label "Tenant" + nome tenant corrente, chevron.
  - al click apre un dropdown "Cambia tenant" con la lista dei tenant, **logo aziendale**
    per ciascuno (`unnamed.png` = Alessi, `image__1_.png` = Moving Up), e spunta sul tenant attivo.
  - In AntD: usare `Dropdown` con menu custom (non il `Select` borderless attuale).
- Durante lo switch tenant mostrare uno **spinner** al posto del chevron.

### 2. Switch tenant in-app (non più SSO)
- Rimuovere il redirect a `single-signon/index.html`. Il cambio tenant ora avviene in pagina:
  `setLoading(true)` → timeout ~800ms → aggiorna i dati del tenant. (vedi `useEffect` su `tenantKey`.)
- Tenant disponibili: **Alessi Platform** (`alessi`) e **Moving Up** (`movingup`). Il tenant
  "gravity" del vecchio prototipo non c'è nel nuovo design.

### 3. Header Card
- Saluto: `Benvenuto, {tenant.user}` (es. "Mario Rossi"), Tag ruolo **"Operation Manager"** (fisso).
- Meta row: `Azienda`, `Area di competenza`, `Email aziendale` (campi presi dal tenant).
- Avatar **editabile**: al passaggio del mouse mostra overlay scuro con icona fotocamera +
  testo "Modifica"; al click apre il file picker (immagine). Sostituisce il badge-edit d'angolo.
- Azione a destra: dropdown **"Gestisci"** → voci `Password` (apre modale) e `Notifiche`.

### 4. KPI / Metriche (5 card, non più 4)
Etichette fisse (valori indicativi per tenant, vedi dati sotto):
1. Anagrafiche da verificare
2. Nominativi da assegnare
3. Pagamenti scaduti
4. Preventivi da approvare
5. Contratti da preparare

- Trend tag verde se positivo, rosso altrimenti.
- Layout `flex-wrap`, ogni card `min-width: 180px`. Mantenere `InfoCircleOutlined` in alto a destra.

### 5. "I tuoi spazi" → 4 prodotti piattaforma
Non sono più spazi fisici OOH ma i **moduli/prodotti** della piattaforma. 4 card:

| Prodotto | Descrizione | Colore icona |
|----------|-------------|--------------|
| Atlas | Inventory & Planning | `#3E00FB` |
| Orbit | Campaign Delivery | `#0EA5E9` |
| Vector | Sales & CRM | `#16A34A` |
| Comet | Billing & Permessi | `#F59E0B` |

- Card semplice: quadrato colorato 40px con icona bianca + nome (15px semibold) + descrizione (12px).
- Nei dati esistono anche `status` e `metric` per prodotto, **ma la card del nuovo design mostra
  solo nome + descrizione** (status/metric non renderizzati). Valutare se mostrarli.

### 6. Attività — categorie + filtro + cronologia
- Header sezione "Le tue attività" con, a destra:
  - bottone **"Cronologia"** (icona orologio) → apre la schermata Cronologia.
  - filtro **"ActivityFilter"**: dropdown multi-selezione per categoria ("Tutte le attività" /
    1 categoria / "N tipologie"). Categorie: Pagamenti, Preventivi, Anagrafiche, Contratti, Assegnazioni.
- Due colonne invariate: **"Da gestire"** e **"In corso"** (5 task ciascuna), con contatore.
- **TaskCard aggiornata**: icona quadrata colorata per categoria + chip categoria colorato +
  titolo + pallino priorità (high=rosso, medium=arancio, low=verde) + descrizione + orario.
- Stato vuoto per colonna: "Nessuna attività per i filtri selezionati".

Colori categorie:
`Anagrafiche #3E00FB` · `Assegnazioni #0EA5E9` · `Pagamenti #ff4d4f` · `Preventivi #fa8c16` · `Contratti #16A34A`

### 7. NUOVA schermata — Cronologia attività
Schermata a sé (stato `view: 'dashboard' | 'history'`), raggiunta dal bottone "Cronologia".
- Header: bottone **back** (← torna alla dashboard) + titolo "Cronologia attività" + stesso filtro categorie.
- Lista **raggruppata per data** ("Oggi", "Ieri", "12 giu 2026", …), ordine d'inserimento preservato.
- Ogni voce: orario (col. 44px) + icona categoria + titolo + chip categoria + **stato**
  (Completata=verde / In corso=viola / Da gestire=arancio, con pallino) + descrizione + utente.
- Le voci **completate** sono mostrate barrate (line-through) e con opacità ridotta; icona = check grigio.
- ~11 voci per tenant (vedi `history` in App.tsx).

### 8. Modale Password
- Alert info: "La modifica riguarda il tuo account Gravity e si applica a **tutti i tenant**…".
- 3 campi: Password attuale, Nuova password, Conferma. Ognuno con **toggle occhio** mostra/nascondi.
- Validazioni: tutti i campi obbligatori, nuova password ≥ 8 caratteri, le due password devono coincidere.
- Stato di successo: check verde + "Password aggiornata", poi chiusura automatica.
- In AntD si può tenere `Input.Password` (ha già il toggle nativo) + `Form` con `rules`.

### 9. Skeleton di caricamento
Mantenere/aggiornare gli skeleton per: header, 5 metriche, 4 (o 5) spazi, 2 colonne attività,
e **nuovo** skeleton per la schermata Cronologia (vedi `HistoryScreenSkeleton`).

---

## Dati mock (da `App.tsx`)

I dati completi dei 2 tenant (metriche, prodotti, task `pending`/`inProgress`, `history`)
sono in `aggiornamenti/User Profile Gravity/src/app/App.tsx`, costante `TENANTS`
(`alessi` righe ~59-107, `movingup` righe ~108-156). Copiare da lì i valori esatti.

---

## Note di porting (Figma Make → index.html AntD)

- **Niente Tailwind**: tradurre le classi in stili AntD/inline come nel resto di `index.html`.
- **Font**: nel nuovo file è hardcoded `Inter`; nell'index.html **non** sovrascrivere `fontFamily`
  (il tema Gravity imposta già SF Pro Text). Usare `Typography.Title`/`Text`.
- **Componenti AntD da riusare**: `Card`, `Tag`, `Dropdown`, `Modal`, `Form`, `Input.Password`,
  `Skeleton`, `Avatar`, `Upload`. Per il filtro multi-categoria valutare `Dropdown` con
  `Checkbox` o `Select mode="multiple"`.
- **Colori**: usare i token Gravity dove esistono; i colori prodotto/categoria sopra sono specifici del design.
- Verificare nel browser prima dell'handoff su Figma.
