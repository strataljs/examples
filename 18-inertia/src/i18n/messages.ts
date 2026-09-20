const i18nMessages = {
  en: {
    app: {
      nav: {
        home: 'Home',
        notes: 'Notes',
      },
    },
  },
} as const

declare module 'stratal/i18n' {
  interface AppMessageNamespaces {
    app: (typeof i18nMessages)['en']['app']
  }
}

export default i18nMessages
