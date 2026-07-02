# Gravity — Brand Concept & Direzione Sito

> Documento di sintesi del lavoro su brand, copy e concept visivo del sito Gravity.
> Fonti: `brand/Manuale Logo.pdf`, `brand/Gravity contenuti sito.pdf`, `PRD_Gravity_Platform_CodeSour.md`,
> `prototipi/sito/contenuti.md`, `intervista-bianca-2026-06-04.md`.
> Ultimo aggiornamento: 26 giugno 2026.

---

## 1. Essenza del brand — il sistema binario

Il nome e il marchio nascono da un concetto astronomico preciso (dal Manuale Logo):

- Il monogramma è una **G** composta da **due entità sferiche che si attraggono** e lasciano una **scia**.
- Si rifà al **sistema binario**: due corpi vicini tendono ad attrarsi verso **un solo punto** (il **baricentro**).
- Le **scie** sono metafora dell'**accurato sistema di tracciamento dati** restituito dalle dashboard.

**I due corpi del sistema binario = chi possiede gli spazi ↔ chi li vuole comprare** (offerta ↔ domanda,
sell side ↔ demand side). Gravity è il **baricentro**: il punto d'attrazione dove le due forze si incontrano.

Tre forze, tutte **cinetiche**:
1. **Attrazione** — i due corpi si tirano verso un punto condiviso.
2. **Binarietà** — domanda ↔ offerta: due poli in tensione che trovano equilibrio.
3. **La scia** — tutto ciò che si muove lascia una traccia = il dato.

---

## 2. Prodotto & posizionamento

- **Cos'è:** software gestionale B2B **white-label** per l'**advertising**, lato **offerta** (sell side).
- **Per chi:** **media owner** e **concessionarie** (chi possiede/vende spazi pubblicitari).
- **Canali (multicanale, NON solo OOH/DOOH):** affissioni/**OOH**, **DOOH**, **display web**, **advertorial**.
- **Cosa fa:** inventory spazi, permessi, fornitori, CRM/trattative, preventivi, contratti/ordini,
  pianificazione, espletamento campagne, reportistica; multi-tenant + RBAC; white-label.
- **Visione (fuori scope v1):** estensione lato DSP / ecosistema AdTech.

### Nota categoria — "ARM"
**Advertising Resource Management (ARM)** è categoria reale ma **di MINT** (Milano), definita sul **lato
domanda/brand** (governance del media buying). Gravity è il **gemello sell-side** → **NON usare "ARM"**
come categoria/keyword di Gravity. Resta a MINT. Eventualmente, solo nel pitch: *"il sell-side dell'ARM"*.

---

## 3. L'angolo strategico del copy (il cuneo)

La qualità della macchina interna di chi vende **non è burocrazia**: è ciò che fa tornare la domanda.
Riformula il gestionale da **costo organizzativo** a **leva commerciale**.

> **Se la supply lavora bene, la domanda resta soddisfatta.**
> (motivo in più per la supply di adottare Gravity — e traduzione esatta del sistema binario:
> l'ordine di un corpo *attrae* l'altro.)

**Proposizione single-minded:** *Metti in ordine l'offerta e la domanda ti sceglie.*

**Tone of voice:** sicuro, essenziale, lievemente provocatorio. Italiano pulito, **zero cliché astronomici**
("entra in orbita", "forza di gravità del tuo business", "stelle"). La metafora **vive nel segno**, non si spiega.

---

## 4. Copy attuale della hero (fissato)

**Claim (H1)** — contestualizzato sul settore + sistema binario in scena:
> Nell'advertising, la **domanda**
> va dove l'**offerta** è **strategica**.

**Value proposition (H2)** — semplice, una sola idea, con keyword:
> Un solo software per organizzare, vendere e ottimizzare
> su ogni canale i tuoi spazi pubblicitari.

---

## 5. SEO

- **Claim provocatorio/di marca** → le keyword pesanti vivono in **title, meta e value proposition**.
- **Keyword primarie (canale-agnostiche):** software gestionale advertising · gestione/vendita spazi
  pubblicitari · software concessionaria pubblicitaria · software media owner.
- **Cluster canali (secondario, landing dedicate):** affissioni/OOH · DOOH · display web · advertorial.
- **Keyword esplicitamente volute da Gloria:** `advertising`, `software`.

**Title** (~60): `Gravity · Software gestionale per l'advertising multicanale`
**Meta** (~155): `Un solo software per organizzare, vendere e ottimizzare i tuoi spazi pubblicitari su ogni
canale — OOH, DOOH, display web, advertorial. Nell'advertising, la domanda va dove l'offerta è strategica.`

---

## 6. Palette (dal Manuale Logo)

| Nome | HEX | Uso |
|------|-----|-----|
| Chrysler Blue | `#3E00FB` | Primary — pop elettrico, fiducia |
| Coquelicot | `#FF4A1C` | Accent caldo (domanda) |
| Russian Violet | `#45185C` | Profondità / "spazio" |
| Baby Powder | `#FFFFFA` | Sfondo chiaro |
| Smoky Black | `#231C07` | Testo |

Gradiente di brand: blu → viola → arancio.

---

## 7. Tipografia

- **Oswald** → **SOLO il logotipo** (peso ~420, kerning aureo). Non usarlo come font del sito.
- **Sito (display):** grottesco pulito e leggero. Direzione attuale: **Inter Tight** (peso leggero ~500).
  Scartato Archivo (troppo caratteriale), Oswald (è il font del logo).
- **Sito (body / value):** **Inter**.
- **App / interfaccia:** SF Pro Text (Ant Design) — NON i font di brand.

---

## 8. Concept visivo — stato e direzione

### La formula: "Due poli, un baricentro"
Ogni sezione ha due forze opposte (blu/offerta, arancio/domanda) che si risolvono in **un punto di
convergenza** dove vive il messaggio chiave. Il movimento **converge sempre**.

### Hero animata (stile mistral.ai)
Sezione **pinnata**: allo scroll la **colonna destra si allarga** e spinge fuori a sinistra la hero,
diventando la sezione successiva. La value proposition (3 righe fisse) **slitta e scala** senza riflusso
(`transform: scale`, niente cambio di `font-size`). Tecnica: griglia a 2 colonne con larghezze interpolate
sullo scroll. → **L'animazione di convergenza è già la fisica del sistema binario.**

### Direzione estetica scelta (in lavorazione)
**Fresco / pop / moderno**, type **leggera**, ispira **chiarezza e fiducia**:
- Sfondo chiaro (Baby Powder), molta aria.
- **Pop elettrico:** blocco sotto il claim in Chrysler Blue pieno.
- Evidenziati: domanda (arancio) · offerta (blu) · *strategica* (marker arancio soft).

**Scartato lungo il percorso:** gradiente scuro/aurora colorata (troppo denso/corporate), scia gradiente
animata sotto le parole (non piace), type grassa.

### Da esplorare la prossima volta
1. Type ancora più leggera (peso 400).
2. Grafismo dentro il blocco blu: **arco orbitale** soft (richiamo sistema binario).
3. Marker arrotondato (pill) su *strategica*.
4. Eventuale accent companion fresco/pastello per micro-dettagli (CTA, badge).
5. Seconda sezione sotto la hero.
6. Blocco Embed pronto per Webflow.

---

## 9. File di riferimento

- Prototipo hero: `prototipi/sito/hero-scroll.html` (preservato dalla sessione; era nello scratchpad).
- Contenuti sito esistenti: `prototipi/sito/contenuti.md` + `index.html`.
- Brand: `brand/Manuale Logo.pdf`, `brand/Gravity contenuti sito.pdf`, `brand/Gravity_type.svg`, `brand/Gravity_mark.svg`.
- PRD: `PRD_Gravity_Platform_CodeSour.md`.
