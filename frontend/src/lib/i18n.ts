import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const en = {
  translation: {
    app: { name: 'Somnilingua', tagline: 'Track your language journey' },

    nav: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      reportBug: 'Report a bug',
      history: 'History',
      stats: 'Statistics',
      menu: 'Menu',
      theme: 'Theme',
      language: 'Language',
    },

    common: {
      add: 'Add',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      next: 'Next',
      back: 'Back',
      done: 'Done',
      hours: 'hours',
      minutes: 'minutes',
      min: 'min',
      today: 'Today',
      goal: 'Goal',
      level: 'Level',
      total: 'Total',
      words: 'words',
      days: 'days',
      streak: 'Streak',
      activity: 'Activity',
      language: 'Language',
      notes: 'Notes',
      date: 'Date',
      duration: 'Duration',
      type: 'Type',
      retry: 'Retry',
    },

    errors: {
      api: {
        generic: 'Something went wrong. Please try again.',
        conflict: 'This action conflicts with existing data.',
        notFound: 'The requested resource was not found.',
        validation: 'Please check your input and try again.',
      },
    },

    level: {
      a0: 'Pre-beginner — very basic words and survival recognition.',
      a1: 'Beginner — basic phrases and survival language.',
      a2: 'Elementary — simple everyday conversation.',
      b1: 'Intermediate — handle most travel situations.',
      b2: 'Upper-intermediate — fluent everyday speech.',
      c1: 'Advanced — fluent and spontaneous expression.',
      c2: 'Mastery — near-native understanding.',
    },

    levelDescriptions: {
      'level.a0':
        'Can understand only the most basic words and phrases with very limited communication ability.',
      'level.a1':
        'Can understand and use basic everyday expressions and very simple phrases.',
      'level.a2':
        'Can communicate in simple and routine tasks requiring simple information exchange.',
      'level.b1':
        'Can deal with most situations likely to arise while traveling in an area where the language is spoken.',
      'level.b2':
        'Can interact with a degree of fluency and spontaneity with native speakers.',
      'level.c1':
        'Can express ideas fluently and spontaneously without much obvious searching for expressions.',
      'level.c2':
        'Can understand with ease virtually everything heard or read.',
    },

    dashboard: {
      title: 'My Languages',
      empty: 'No languages yet',
      emptyDesc: 'Start tracking your first language to see your progress.',
      addFirst: 'Add your first language',
      addLanguage: 'Add language',
    },

    history: {
      title: 'All activity',
      desc: 'Every session you\'ve logged across all languages.',
      empty: 'No activities yet — start logging from a language page.',
      filterAll: 'All languages',
      filterType: 'All types',
    },

    overall: {
      title: 'Overall statistics',
      desc: 'Your learning across every language.',
      totalHours: 'Total hours',
      totalSessions: 'Sessions logged',
      activeLangs: 'Active languages',
      bestStreak: 'Best streak',
      byLang: 'Time by language',
      byType: 'Time by activity type',
      daily: 'Minutes per day (all languages)',
      empty: 'Add a language and log activities to see stats.',
    },

    addLang: {
      title: 'Add a new language',
      step1: 'Choose language',
      step2: 'Your starting level',
      step3: 'Daily goal',
      pickLang: 'Which language are you learning?',
      pickLangPh: 'Search a language…',
      pickLevel: 'What\'s your current level?',
      orManual: 'Or enter hours manually',
      manualHours: 'Hours already spent',
      goalQ: 'How many minutes per day?',
      goalDesc: 'We\'ll celebrate every day you hit this goal.',
      create: 'Start learning',
      selectLanguage: 'Select language',
      noResults: 'No results',
      success: 'Successfully enrolled in a language',
      errors: {
        retry: 'Retry',
        loadLanguages: {
          title: 'Could not load languages',
          message: 'Check your connection and try again.',
        },
        loadLevels: {
          title: 'Could not load levels',
          message: 'Check your connection and try again.',
        },
      },
    },

    detail: {
      tabs: {
        overview: 'Overview',
        history: 'History',
        stats: 'Stats',
        roadmap: 'Roadmap',
      },
      totalTime: 'Total time',
      untilGoal: 'Until daily goal',
      goalReached: 'Daily goal reached!',
      addActivity: 'Log activity',
      noActivities: 'No activities logged yet.',
      timeByType: 'Time by activity type',
      dailyMinutes: 'Minutes per day',
      currentLevel: 'Current level',
      daysToNext: 'Days to next level',
      atGoal: 'at your current daily goal',
    },

    activity: {
      title: 'Log an activity',
      types: {
        watching: 'Watching',
        listening: 'Listening',
        reading: 'Reading',
        speaking: 'Speaking',
        writing: 'Writing',
        studying: 'Studying',
        other: 'Other',
      },
      durationMin: 'Duration (minutes)',
      notesPh: 'Anything to remember about this session?',
      saved: 'Activity saved',
      deleted: 'Activity deleted',
    },

    settings: {
      title: 'Settings',
      appearance: 'Appearance',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      language: 'Interface language',
      account: 'Account',
      accountDesc: 'Local-only — your data lives in this browser.',
      links: 'Links',
      buyCoffee: 'Buy me a coffee',
      sourceCode: 'Source code',
    },

    bug: {
      title: 'Report a bug',
      desc: 'Help us improve. Add a title, description, and optional screenshot.',
      bugTitle: 'Title',
      description: 'Description',
      screenshot: 'Screenshot (optional)',
      send: 'Send report',
      sent: 'Bug report ready to send',
    },
  },
};

const es = {
  translation: {
    app: { name: 'Somnilingua', tagline: 'Sigue tu progreso de idiomas' },

    nav: {
      dashboard: 'Panel',
      settings: 'Ajustes',
      reportBug: 'Reportar error',
      history: 'Historial',
      stats: 'Estadísticas',
      menu: 'Menú',
      theme: 'Tema',
      language: 'Idioma',
    },

    common: {
      add: 'Añadir',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      next: 'Siguiente',
      back: 'Atrás',
      done: 'Listo',
      hours: 'horas',
      minutes: 'minutos',
      min: 'min',
      today: 'Hoy',
      goal: 'Meta',
      level: 'Nivel',
      total: 'Total',
      words: 'palabras',
      days: 'días',
      streak: 'Racha',
      activity: 'Actividad',
      language: 'Idioma',
      notes: 'Notas',
      date: 'Fecha',
      duration: 'Duración',
      type: 'Tipo',
      retry: 'Reintentar',
    },

    errors: {
      api: {
        generic: 'Algo salió mal. Inténtalo de nuevo.',
        conflict: 'Esta acción entra en conflicto con datos existentes.',
        notFound: 'No se encontró el recurso solicitado.',
        validation: 'Comprueba los datos e inténtalo de nuevo.',
      },
    },

    addLang: {
      title: 'Añadir un idioma',
      step1: 'Elegir idioma',
      step2: 'Tu nivel inicial',
      step3: 'Meta diaria',
      pickLang: '¿Qué idioma estás aprendiendo?',
      pickLangPh: 'Buscar un idioma…',
      pickLevel: '¿Cuál es tu nivel actual?',
      orManual: 'O introduce las horas manualmente',
      manualHours: 'Horas ya dedicadas',
      goalQ: '¿Cuántos minutos al día?',
      goalDesc: 'Celebraremos cada día que alcances esta meta.',
      create: 'Empezar a aprender',
      selectLanguage: 'Seleccionar idioma',
      noResults: 'Sin resultados',
      success: 'Te has inscrito correctamente en un idioma',
      errors: {
        retry: 'Reintentar',
        loadLanguages: {
          title: 'No se pudieron cargar los idiomas',
          message: 'Comprueba tu conexión e inténtalo de nuevo.',
        },
        loadLevels: {
          title: 'No se pudieron cargar los niveles',
          message: 'Comprueba tu conexión e inténtalo de nuevo.',
        },
      },
    },

    level: {
      a0: 'Pre-principiante — palabras muy básicas.',
      a1: 'Principiante — frases básicas.',
      a2: 'Elemental — conversaciones simples.',
      b1: 'Intermedio — situaciones cotidianas.',
      b2: 'Intermedio alto — habla fluida.',
      c1: 'Avanzado — expresión espontánea.',
      c2: 'Maestría — comprensión casi nativa.',
    },

    levelDescriptions: {
      'level.a0':
        'Puede entender solo palabras muy básicas con comunicación muy limitada.',
      'level.a1': 'Puede entender y usar expresiones cotidianas muy básicas.',
      'level.a2': 'Puede comunicarse en tareas simples y rutinarias.',
      'level.b1': 'Puede manejar situaciones cotidianas durante viajes.',
      'level.b2': 'Puede interactuar con fluidez con hablantes nativos.',
      'level.c1': 'Puede expresarse de forma fluida y espontánea.',
      'level.c2': 'Puede entender prácticamente todo lo que escucha o lee.',
    },

    settings: {
      title: 'Ajustes',
      appearance: 'Apariencia',
      theme: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema',
      language: 'Idioma de la interfaz',
      account: 'Cuenta',
      accountDesc: 'Solo local — tus datos viven en este navegador.',
      links: 'Enlaces',
      buyCoffee: 'Invítame un café',
      sourceCode: 'Código fuente',
    },

    bug: {
      title: 'Reportar error',
      desc: 'Ayúdanos a mejorar. Añade un título, descripción y captura opcional.',
      bugTitle: 'Título',
      description: 'Descripción',
      screenshot: 'Captura (opcional)',
      send: 'Enviar reporte',
      sent: 'Reporte listo para enviar',
    },
  },
};

const de = {
  translation: {
    app: { name: 'Somnilingua', tagline: 'Verfolge deinen Sprachweg' },

    nav: {
      dashboard: 'Übersicht',
      settings: 'Einstellungen',
      reportBug: 'Fehler melden',
      history: 'Verlauf',
      stats: 'Statistik',
      menu: 'Menü',
      theme: 'Thema',
      language: 'Sprache',
    },

    common: {
      add: 'Hinzufügen',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      next: 'Weiter',
      back: 'Zurück',
      done: 'Fertig',
      hours: 'Stunden',
      minutes: 'Minuten',
      min: 'Min',
      today: 'Heute',
      goal: 'Ziel',
      level: 'Niveau',
      total: 'Gesamt',
      words: 'Wörter',
      days: 'Tage',
      streak: 'Serie',
      activity: 'Aktivität',
      language: 'Sprache',
      notes: 'Notizen',
      date: 'Datum',
      duration: 'Dauer',
      type: 'Typ',
      retry: 'Erneut versuchen',
    },

    errors: {
      api: {
        generic: 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
        conflict: 'Diese Aktion steht im Konflikt mit vorhandenen Daten.',
        notFound: 'Die angeforderte Ressource wurde nicht gefunden.',
        validation: 'Bitte überprüfe deine Eingabe und versuche es erneut.',
      },
    },

    addLang: {
      title: 'Neue Sprache hinzufügen',
      step1: 'Sprache wählen',
      step2: 'Dein Startniveau',
      step3: 'Tagesziel',
      pickLang: 'Welche Sprache lernst du?',
      pickLangPh: 'Sprache suchen…',
      pickLevel: 'Wie ist dein aktuelles Niveau?',
      orManual: 'Oder Stunden manuell eingeben',
      manualHours: 'Bereits investierte Stunden',
      goalQ: 'Wie viele Minuten pro Tag?',
      goalDesc: 'Wir feiern jeden Tag, an dem du dieses Ziel erreichst.',
      create: 'Lernen starten',
      selectLanguage: 'Sprache auswählen',
      noResults: 'Keine Ergebnisse',
      success: 'Erfolgreich in eine Sprache eingeschrieben',
      errors: {
        retry: 'Erneut versuchen',
        loadLanguages: {
          title: 'Sprachen konnten nicht geladen werden',
          message: 'Überprüfe deine Verbindung und versuche es erneut.',
        },
        loadLevels: {
          title: 'Niveaus konnten nicht geladen werden',
          message: 'Überprüfe deine Verbindung und versuche es erneut.',
        },
      },
    },

    level: {
      a0: 'Vorstufe — sehr grundlegende Wörter.',
      a1: 'Anfänger — grundlegende Phrasen.',
      a2: 'Grundlegend — einfache Gespräche.',
      b1: 'Mittelstufe — Alltagssituationen.',
      b2: 'Obere Mittelstufe — flüssiges Sprechen.',
      c1: 'Fortgeschritten — spontaner Ausdruck.',
      c2: 'Meisterschaft — nahezu muttersprachlich.',
    },

    levelDescriptions: {
      'level.a0':
        'Kann nur sehr grundlegende Wörter und einfache Phrasen verstehen.',
      'level.a1':
        'Kann einfache alltägliche Ausdrücke verstehen und verwenden.',
      'level.a2':
        'Kann sich in einfachen, routinemäßigen Situationen verständigen.',
      'level.b1':
        'Kann die meisten Alltagssituationen auf Reisen bewältigen.',
      'level.b2': 'Kann sich fließend und spontan verständigen.',
      'level.c1': 'Kann sich fließend und spontan ausdrücken.',
      'level.c2': 'Kann praktisch alles mühelos verstehen.',
    },

    settings: {
      title: 'Einstellungen',
      appearance: 'Erscheinungsbild',
      theme: 'Thema',
      light: 'Hell',
      dark: 'Dunkel',
      system: 'System',
      language: 'Oberflächensprache',
      account: 'Konto',
      accountDesc: 'Nur lokal — deine Daten bleiben in diesem Browser.',
      links: 'Links',
      buyCoffee: 'Spendiere mir einen Kaffee',
      sourceCode: 'Quellcode',
    },

    bug: {
      title: 'Fehler melden',
      desc: 'Hilf uns, besser zu werden. Titel, Beschreibung und optionaler Screenshot.',
      bugTitle: 'Titel',
      description: 'Beschreibung',
      screenshot: 'Screenshot (optional)',
      send: 'Bericht senden',
      sent: 'Bericht zum Senden bereit',
    },
  },
};

i18n.use(initReactI18next).init({
  resources: { en, es, de },
  lng: localStorage.getItem('lt.lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;