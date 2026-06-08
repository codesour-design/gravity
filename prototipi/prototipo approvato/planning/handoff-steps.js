/**
 * Handoff tours — Planning
 * Ogni tour = una user story. Aggiungere nuovi tour all'array HANDOFF_TOURS.
 */

window.HANDOFF_META = {
  title:   'Planning',
  version: '1.0',
  date:    'Giugno 2026',
  author:  'Gloria Bonanno',
};

window.HANDOFF_SCREENS = {
  'lista': {
    label:  'Lista pianificazioni',
    detect: function () {
      return !!document.querySelector('.page-content') && !document.querySelector('.ss-card-map');
    },
  },
  'selezione-spazi': {
    label:  'Selezione spazi',
    detect: function () { return !!document.querySelector('.ss-card-map'); },
  },
};

window.HANDOFF_TOURS = [

  // ──────────────────────────────────────────────────────────────────────────
  // US: Presa in carico (da lista)
  // Ruolo: Planner
  // Schermata di partenza: Lista pianificazioni
  // ──────────────────────────────────────────────────────────────────────────
  {
    id:          'presa-in-carico-lista',
    title:       'US#1.1 — Assegnazione Pianificazione (Presa in carico)',
    description: '(GRP-432) Come **pianificatore**, voglio poter prendere in carico una pianificazione non assegnata così da assegnarmi il lavoro senza intermediari.',
    roles:       ['Planner'],
    startScreen: 'lista',
    steps: [

      {
        title:       'Lista pianificazioni',
        description: 'Questa è la lista di tutte le pianificazioni accessibili al Planner. Le pianificazioni **non ancora assegnate** (senza planner) sono identificabili dalla **colonna "Pianificatore"**.',
        selector:    '.ant-table-wrapper',
        placement:   'top',
        dev: [
          { label: 'Componente', value: '<Table\n  dataSource={pianificazioni}\n  columns={columns}\n  rowKey="id"\n/>' },
          { label: 'Tipo dato', value: 'Pianificazione {\n  id: string\n  nome: string\n  canale: string\n  inserzionista: string\n  planner: User | null\n}' },
        ],
      },

      {
        title:       'Colonna "Pianificatore"',
        description: 'La colonna mostra **tre stati possibili**: il nome del planner assegnato (se già presa in carico), il bottone **"Prendi in carico"** (se non assegnata e il ruolo è **Planner**), oppure **"—"** (se non assegnata ma il ruolo non è Planner).',
        colIndex:    4,
        placement:   'left',
        dev: [
          { label: 'Logica render cella', value: 'if (record.planner)\n  → <Avatar /> + nome\nelse if (role === "Planner")\n  → <Button type="dashed" />\nelse\n  → "—"' },
          { label: 'Definizione colonna', value: '{\n  key: "planner",\n  title: "Pianificatore",\n  render: (_, record) => ...\n}' },
        ],
      },

      {
        title:       'Bottone "Prendi in carico"',
        description: 'Bottone **dashed** con icona **UserAdd**. Renderizzato solo se la pianificazione **non ha un planner assegnato** AND il **ruolo corrente è Planner**. Altrimenti la cella mostra il nome del planner o "—".',
        selector:    '.ant-table-tbody .ant-btn-dashed',
        placement:   'left',
        dev: [
          { label: 'Componente', value: '<Button\n  type="dashed"\n  icon={<UserAddOutlined />}\n>\n  Prendi in carico\n</Button>' },
          { label: 'Condizione render', value: '!record.planner\n&& currentUser.role === "Planner"' },
        ],
      },

      {
        title:       'Popconfirm di conferma',
        description: 'Il click apre un **Popconfirm**. Titolo: "Prendere in carico la pianificazione?". Azioni: **"Prendi in carico"** (okText) e "Annulla". **Non blocca** il resto dell\'interfaccia.',
        selector:    '.ant-popover.ant-popconfirm',
        placement:   'left',
        onEnter: function () {
          var btn = document.querySelector('.ant-table-tbody .ant-btn-dashed');
          if (btn) btn.click();
        },
        delay: 180,
        dev: [
          { label: 'Componente', value: '<Popconfirm\n  title="Prendere in carico\n         la pianificazione?"\n  okText="Prendi in carico"\n  cancelText="Annulla"\n  onConfirm={handleAssign}\n>' },
          { label: 'API', value: 'PATCH /api/pianificazioni/:id\n{ planner: { id: currentUser.id } }' },
          { label: 'On success', value: 'message.success("Pianificazione\npresa in carico")\n+ aggiorna record in state' },
          { label: 'On error', value: 'message.error("Errore...")\n+ nessun aggiornamento UI' },
        ],
      },

      {
        title:       'Feedback: message.success',
        description: 'Alla conferma appare un **message.success** in cima alla pagina. Scompare automaticamente dopo **3 secondi**.',
        selector:    '.ant-message-notice',
        placement:   'bottom',
        onEnter: function () {
          var okBtn = document.querySelector('.ant-popconfirm .ant-btn-primary');
          if (okBtn) okBtn.click();
        },
        delay: 220,
        dev: [
          { label: 'Chiamata', value: 'message.success(\n  "Pianificazione presa in carico"\n)' },
          { label: 'Durata default', value: '3 secondi (antd default)\nSe serve più tempo: message.success(testo, 6)' },
          { label: 'Posizione', value: 'Fixed, top center — gestito\nautomaticamente da antd' },
        ],
      },

      {
        title:       'Risultato: colonna aggiornata',
        description: 'La colonna Pianificatore si aggiorna con **avatar + nome** del planner assegnato. Aggiornamento **in-memory** — non persiste tra navigazioni nel prototipo.',
        colIndex:    4,
        placement:   'left',
        dev: [
          { label: 'Stato aggiornato', value: 'record.planner = {\n  id: currentUser.id,\n  nome: currentUser.nome,\n  avatar: currentUser.avatarUrl\n}' },
          { label: 'Rollback su errore', value: 'Ripristina planner: null\nmessage.error("Operazione\nnon riuscita")' },
          { label: 'Nota prototipo', value: 'L\'aggiornamento è in-memory.\nNon persiste tra navigazioni.' },
        ],
      },

    ],
  },

];
