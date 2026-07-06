/**
 * GRAVITY DESIGN TOKENS
 * Estratti dalla libreria Figma: Ant Design System for Gravity
 * File Figma: https://www.figma.com/design/uR6CBOh0Y7dUQvH30SyD0P/Ant-Design-System-for-Gravity
 *
 * Struttura nomi Figma → token Ant Design:
 *   Colors/Neutral/Text/colorText        → token.colorText
 *   Colors/Neutral/Bg/colorBgContainer   → token.colorBgContainer
 *   Space/Margin/marginXXS               → token.marginXXS
 *   Heading/1                            → token.fontSizeHeading1
 *   Components/Button/Global/...         → components.Button.*
 *
 * Usato come window.GRAVITY_THEME in ogni prototipo.
 */

window.GRAVITY_THEME = {
  token: {

    // ── Brand ──────────────────────────────────────────────────────────────
    colorPrimary:              '#3E00FB',   // Gravity blue elettrico
    colorLink:                 '#3E00FB',
    colorLinkHover:            '#6B3FFF',
    colorLinkActive:           '#2B00CC',
    colorInfo:                 '#3E00FB',
    colorSuccess:              '#52C41A',
    colorWarning:              '#FAAD14',
    colorError:                '#FF4A1C',   // Gravity orange secondario

    // ── Testo ─────────────────────────────────────────────────────────────
    // Figma: Colors/Neutral/Text/*
    colorText:                 'rgba(0,0,0,0.88)',   // #000000e0
    colorTextSecondary:        'rgba(0,0,0,0.65)',   // #000000a6
    colorTextTertiary:         'rgba(0,0,0,0.45)',   // #00000073
    colorTextQuaternary:       'rgba(0,0,0,0.25)',   // #00000040
    colorTextHeading:          'rgba(0,0,0,0.88)',   // #000000e0
    colorTextLabel:            'rgba(0,0,0,0.65)',
    colorTextDescription:      'rgba(0,0,0,0.45)',
    colorTextDisabled:         'rgba(0,0,0,0.25)',
    colorTextPlaceholder:      'rgba(0,0,0,0.25)',
    colorTextLightSolid:       '#ffffff',

    // ── Sfondi ────────────────────────────────────────────────────────────
    // Figma: Colors/Neutral/Bg/*
    colorBgBase:               '#ffffff',
    colorBgContainer:          '#ffffff',   // #ffffff
    colorBgLayout:             '#F5F5F5',   // #f5f5f5
    colorBgElevated:           '#ffffff',
    colorBgSpotlight:          'rgba(0,0,0,0.85)',
    colorBgMask:               'rgba(0,0,0,0.45)',
    colorBgContainerDisabled:  'rgba(0,0,0,0.04)',
    colorBgTextHover:          'rgba(0,0,0,0.06)',
    colorBgTextActive:         'rgba(0,0,0,0.15)',

    // ── Bordi ─────────────────────────────────────────────────────────────
    // Figma: Colors/Neutral/Border/*
    colorBorder:               '#D9D9D9',
    colorBorderSecondary:      '#F0F0F0',
    colorSplit:                'rgba(0,0,0,0.06)',   // #0000000f

    // ── Fill ──────────────────────────────────────────────────────────────
    colorFill:                 'rgba(0,0,0,0.15)',
    colorFillSecondary:        'rgba(0,0,0,0.06)',
    colorFillTertiary:         'rgba(0,0,0,0.04)',
    colorFillQuaternary:       'rgba(0,0,0,0.02)',
    colorFillContent:          'rgba(0,0,0,0.06)',
    colorFillContentHover:     'rgba(0,0,0,0.15)',

    // ── Tipografia ────────────────────────────────────────────────────────
    // Figma: Heading/* e Base/*
    fontFamily:                "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",  // font UI del design system
    fontFamilyCode:            "'JetBrains Mono', 'Courier New', monospace",

    fontSize:                  14,    // Base/Normal → 14px
    fontSizeSM:                12,
    fontSizeLG:                16,
    fontSizeXL:                20,

    // Figma: Heading/1 → 38px / 46 lineHeight
    // Figma: Heading/2 → 30px / 38 lineHeight
    // Figma: Heading/3 → 24px / 32 lineHeight
    fontSizeHeading1:          38,
    fontSizeHeading2:          30,
    fontSizeHeading3:          24,
    fontSizeHeading4:          20,
    fontSizeHeading5:          16,

    lineHeight:                1.5714,  // 22/14
    lineHeightLG:              1.5,     // 24/16
    lineHeightSM:              1.6667,  // 20/12

    // Figma: Heading/1 → lineHeight 46/38 = 1.2105
    lineHeightHeading1:        1.2105,
    lineHeightHeading2:        1.2667,  // 38/30
    lineHeightHeading3:        1.3333,  // 32/24
    lineHeightHeading4:        1.4,
    lineHeightHeading5:        1.5,

    fontWeightStrong:          600,

    // ── Spaziatura ────────────────────────────────────────────────────────
    // Figma: Space/Margin/* e Space/Padding/*
    paddingXXS:                4,    // marginXXS = 4
    paddingXS:                 8,
    paddingSM:                 12,
    padding:                   16,
    paddingMD:                 20,
    paddingLG:                 24,
    paddingXL:                 32,
    paddingContentHorizontalLG: 24,
    paddingContentVerticalLG:  16,
    paddingContentHorizontal:  16,
    paddingContentVertical:    12,
    paddingContentHorizontalSM: 16,

    marginXXS:                 4,
    marginXS:                  8,
    marginSM:                  12,
    margin:                    16,
    marginMD:                  20,
    marginLG:                  24,
    marginXL:                  32,
    marginXXL:                 48,

    // ── Altezza controlli ─────────────────────────────────────────────────
    controlHeight:             32,
    controlHeightLG:           40,
    controlHeightSM:           24,
    controlHeightXS:           16,

    // ── Border Radius ─────────────────────────────────────────────────────
    borderRadius:              6,
    borderRadiusLG:            8,
    borderRadiusSM:            4,
    borderRadiusXS:            2,
    borderRadiusOuter:         4,

    // ── Line Width ────────────────────────────────────────────────────────
    lineWidth:                 1,    // Components/Divider/Global/lineWidth = 1
    lineWidthBold:             2,
    lineWidthFocus:            4,

    // ── Ombre ─────────────────────────────────────────────────────────────
    // Figma: boxShadowTertiary (usato su Modal, Card)
    boxShadow:          '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
    boxShadowSecondary: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
    boxShadowTertiary:  '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',

    // ── Z-index ───────────────────────────────────────────────────────────
    zIndexBase:                0,
    zIndexPopupBase:           1000,

    // ── Animazioni ────────────────────────────────────────────────────────
    motionDurationFast:        '0.1s',
    motionDurationMid:         '0.2s',
    motionDurationSlow:        '0.3s',
    motionEaseOut:             'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseInOut:           'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOutBack:         'cubic-bezier(0.12, 0.4, 0.29, 1.46)',
    motionEaseOutCirc:         'cubic-bezier(0.08, 0.82, 0.17, 1)',
    motionEaseInOutCirc:       'cubic-bezier(0.78, 0.14, 0.15, 0.86)',

  },

  components: {

    // ── Button ────────────────────────────────────────────────────────────
    Button: {
      borderRadiusLG:            8,
      controlHeightLG:           40,
      contentFontSizeLG:         16,
      paddingInlineLG:           15,
      onlyIconSizeLG:            18,
    },

    // ── Input ─────────────────────────────────────────────────────────────
    Input: {
      borderRadius:              6,
      paddingInline:             11,
      paddingBlock:              4,
      paddingInlineLG:           11,
      paddingBlockLG:            7,
      paddingInlineSM:           7,
      paddingBlockSM:            0,
    },

    // ── Select ────────────────────────────────────────────────────────────
    Select: {
      borderRadius:              6,
    },

    // ── Card ──────────────────────────────────────────────────────────────
    Card: {
      borderRadiusLG:            8,
      paddingLG:                 24,
    },

    // ── Modal ─────────────────────────────────────────────────────────────
    Modal: {
      borderRadiusLG:            8,
      paddingMD:                 20,
      paddingContentHorizontalLG: 24,
    },

    // ── Table ─────────────────────────────────────────────────────────────
    Table: {
      borderRadiusLG:            8,
      cellPaddingBlock:          16,
      cellPaddingInline:         16,
      cellPaddingBlockSM:        8,
      cellPaddingInlineSM:       8,
    },

    // ── Menu ──────────────────────────────────────────────────────────────
    Menu: {
      itemBorderRadius:          6,
      itemHeight:                40,
      itemPaddingInline:         16,
      itemMarginInline:          4,
    },

    // ── Divider ───────────────────────────────────────────────────────────
    // Figma: Components/Divider/Global/lineWidth = 1, colorSplit = #0000000f
    Divider: {
      lineWidth:                 1,
      colorSplit:                'rgba(0,0,0,0.06)',
    },

    // ── Badge ─────────────────────────────────────────────────────────────
    Badge: {
      borderRadiusSM:            4,
    },

    // ── Tag ───────────────────────────────────────────────────────────────
    Tag: {
      borderRadiusSM:            4,
      paddingXXS:                4,
    },

    // ── Tabs ──────────────────────────────────────────────────────────────
    Tabs: {
      borderRadius:              6,
      cardPadding:               '8px 16px',
    },

    // ── Form ──────────────────────────────────────────────────────────────
    Form: {
      labelFontSize:             14,
      itemMarginBottom:          24,
    },

    // ── Alert ─────────────────────────────────────────────────────────────
    Alert: {
      borderRadiusLG:            8,
    },

    // ── Notification ──────────────────────────────────────────────────────
    Notification: {
      borderRadiusLG:            8,
    },

    // ── Drawer ────────────────────────────────────────────────────────────
    Drawer: {
      paddingLG:                 24,
    },

    // ── Avatar ────────────────────────────────────────────────────────────
    Avatar: {
      borderRadius:              6,
    },

    // ── Segmented ─────────────────────────────────────────────────────────
    Segmented: {
      borderRadius:              6,
      borderRadiusLG:            8,
      itemSelectedBg:            '#ffffff',
    },

    // ── Steps ─────────────────────────────────────────────────────────────
    Steps: {
      dotSize:                   8,
      dotCurrentSize:            10,
    },

    // ── Pagination ────────────────────────────────────────────────────────
    Pagination: {
      borderRadius:              6,
    },

  },
};

/**
 * CSS custom properties — per elementi custom non-Ant Design.
 * Chiama window.applyGravityTokens() per iniettarle nel :root.
 */
window.GRAVITY_CSS_VARS = {
  '--gravity-primary':          '#3E00FB',
  '--gravity-primary-hover':    '#6B3FFF',
  '--gravity-primary-active':   '#2B00CC',
  '--gravity-secondary':        '#FF4A1C',
  '--gravity-bg':               '#F5F5F5',
  '--gravity-bg-container':     '#ffffff',
  '--gravity-bg-subtle':        '#FAFAFA',   // sfondo neutro tra white e bg-layout
  '--gravity-primary-bg':       '#F0EAFF',   // sfondo per stati selected/active con tinta primary
  '--gravity-primary-border':   '#C5B4FF',   // bordi per aree con tinta primary (hover, pending, toolbar)
  '--gravity-text':             'rgba(0,0,0,0.88)',
  '--gravity-text-secondary':   'rgba(0,0,0,0.65)',
  '--gravity-text-tertiary':    'rgba(0,0,0,0.45)',
  '--gravity-text-disabled':    'rgba(0,0,0,0.25)',
  '--gravity-border':           '#D9D9D9',
  '--gravity-border-secondary': '#F0F0F0',
  '--gravity-split':            'rgba(0,0,0,0.06)',
  '--gravity-shadow':           '0 1px 2px 0 rgba(0,0,0,0.03), 0 1px 6px -1px rgba(0,0,0,0.02), 0 2px 4px 0 rgba(0,0,0,0.02)',
  '--gravity-shadow-md':        '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)',
  '--gravity-radius':           '6px',
  '--gravity-radius-lg':        '8px',
  '--gravity-radius-sm':        '4px',
  '--gravity-radius-xl':        '10px',   // card floating, map controls, overlay
  // ── Colori semantici di dominio (OOH/DOOH) ──────────────────────────────────
  // Non fanno parte della palette brand — sono stati UI specifici del prodotto
  '--gravity-domain-lt':          '#7C3AED',   // Long Term — testo badge
  '--gravity-domain-lt-bg':       '#EDE9FE',   // Long Term — sfondo badge
  '--gravity-domain-lt-incomp':   '#B45309',   // Long Term incompatibile — testo
  '--gravity-domain-lt-incomp-bg':'#FEF3C7',   // Long Term incompatibile — sfondo
  '--gravity-domain-discount':    '#059669',   // prezzo con sconto / risparmio
  '--gravity-domain-overbudget':  '#DC2626',   // importo over-budget
  '--gravity-domain-partial':     '#FA8C16',   // selezione parziale, elemento illuminato

  '--gravity-font-brand':       "'Oswald', sans-serif",   // SOLO logo/brand — NON usare nell'interfaccia
  '--gravity-font-brand-alt':   "'Inter', sans-serif",    // Brand/comunicazione/sito vetrina — NON usare nell'interfaccia
  '--gravity-font-body':        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",  // Font UI del design system
  '--gravity-font-code':        "'JetBrains Mono', 'Courier New', monospace",
  '--gravity-fs-micro':         '10px',   // label uppercase, codici impianto, metadati mappa
  '--gravity-fs-caption':       '11px',   // metadati, label impianti, footer calendari
  '--gravity-fs-xs':            '12px',
  '--gravity-fs-body-sm':       '13px',   // testo di riga standard (il più usato nell'interfaccia)
  '--gravity-fs-body-lg':       '15px',   // valore DataCard sidebar
  '--gravity-fs-sm':            '14px',
  '--gravity-fs-md':            '16px',
  '--gravity-fs-lg':            '20px',
  '--gravity-fs-xl':            '24px',
  '--gravity-fs-h1':            '38px',
  '--gravity-fs-h2':            '30px',
  '--gravity-fs-h3':            '24px',
  '--gravity-lh-body':          '1.5714',
  '--gravity-lh-h1':            '46px',
  '--gravity-lh-h2':            '38px',
  '--gravity-lh-h3':            '32px',
  '--gravity-space-xxs':        '4px',
  '--gravity-space-xs':         '8px',
  '--gravity-space-sm':         '12px',
  '--gravity-space-md':         '16px',
  '--gravity-space-lg':         '24px',
  '--gravity-space-xl':         '32px',
  '--gravity-space-xxl':        '48px',
};

window.applyGravityTokens = function() {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(window.GRAVITY_CSS_VARS)) {
    root.style.setProperty(key, value);
  }
};
