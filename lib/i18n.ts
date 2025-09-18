// Internationalization configuration for multi-language support
export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true }
]

export type TranslationKey = 
  | 'common.dashboard'
  | 'common.reports'
  | 'common.analytics'
  | 'common.departments'
  | 'common.users'
  | 'common.tasks'
  | 'common.settings'
  | 'common.logout'
  | 'common.login'
  | 'common.submit'
  | 'common.cancel'
  | 'common.save'
  | 'common.delete'
  | 'common.edit'
  | 'common.view'
  | 'common.search'
  | 'common.filter'
  | 'common.export'
  | 'common.import'
  | 'common.refresh'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.warning'
  | 'common.info'
  | 'dashboard.welcome'
  | 'dashboard.totalReports'
  | 'dashboard.pendingReports'
  | 'dashboard.resolvedReports'
  | 'dashboard.criticalIssues'
  | 'dashboard.recentActivity'
  | 'dashboard.quickActions'
  | 'reports.createNew'
  | 'reports.title'
  | 'reports.description'
  | 'reports.category'
  | 'reports.priority'
  | 'reports.status'
  | 'reports.assignedTo'
  | 'reports.createdBy'
  | 'reports.createdAt'
  | 'reports.updatedAt'
  | 'reports.location'
  | 'reports.attachments'
  | 'auth.username'
  | 'auth.password'
  | 'auth.rememberMe'
  | 'auth.forgotPassword'
  | 'auth.invalidCredentials'
  | 'auth.loginSuccess'
  | 'notifications.newReport'
  | 'notifications.reportAssigned'
  | 'notifications.reportResolved'
  | 'notifications.systemUpdate'
  | 'categories.waterSupply'
  | 'categories.roadMaintenance'
  | 'categories.wasteManagement'
  | 'categories.publicSafety'
  | 'categories.electricalIssues'
  | 'categories.other'
  | 'priority.low'
  | 'priority.medium'
  | 'priority.high'
  | 'priority.critical'
  | 'status.pending'
  | 'status.inProgress'
  | 'status.resolved'
  | 'status.closed'

export type Translations = Record<TranslationKey, string>

// Translation storage and management
class I18nManager {
  private currentLanguage: string = 'en'
  private translations: Record<string, Translations> = {}
  private fallbackLanguage: string = 'en'

  constructor() {
    // Load saved language preference
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('preferred-language')
      if (savedLang && this.isLanguageSupported(savedLang)) {
        this.currentLanguage = savedLang
      } else {
        // Detect browser language
        const browserLang = navigator.language.split('-')[0]
        if (this.isLanguageSupported(browserLang)) {
          this.currentLanguage = browserLang
        }
      }
    }
  }

  private isLanguageSupported(langCode: string): boolean {
    return supportedLanguages.some(lang => lang.code === langCode)
  }

  async loadTranslations(langCode: string): Promise<void> {
    if (this.translations[langCode]) {
      return // Already loaded
    }

    try {
      const translations = await import(`../locales/${langCode}.json`)
      this.translations[langCode] = translations.default
    } catch (error) {
      console.warn(`Failed to load translations for ${langCode}:`, error)
      if (langCode !== this.fallbackLanguage) {
        await this.loadTranslations(this.fallbackLanguage)
      }
    }
  }

  async setLanguage(langCode: string): Promise<void> {
    if (!this.isLanguageSupported(langCode)) {
      throw new Error(`Language ${langCode} is not supported`)
    }

    await this.loadTranslations(langCode)
    this.currentLanguage = langCode

    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', langCode)
      document.documentElement.lang = langCode
      
      // Set RTL direction for right-to-left languages
      const language = supportedLanguages.find(lang => lang.code === langCode)
      if (language?.rtl) {
        document.documentElement.dir = 'rtl'
      } else {
        document.documentElement.dir = 'ltr'
      }
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  getCurrentLanguageInfo(): Language | undefined {
    return supportedLanguages.find(lang => lang.code === this.currentLanguage)
  }

  translate(key: TranslationKey, params?: Record<string, string | number>): string {
    const translations = this.translations[this.currentLanguage] || this.translations[this.fallbackLanguage]
    
    if (!translations) {
      return key // Return key if no translations available
    }

    let translation = translations[key] || key

    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value))
      })
    }

    return translation
  }

  // Pluralization support
  translatePlural(key: TranslationKey, count: number, params?: Record<string, string | number>): string {
    const pluralKey = `${key}.${count === 1 ? 'one' : 'other'}` as TranslationKey
    return this.translate(pluralKey, { ...params, count })
  }

  // Format numbers according to locale
  formatNumber(number: number): string {
    const language = this.getCurrentLanguageInfo()
    if (!language) return number.toString()

    try {
      return new Intl.NumberFormat(language.code === 'hi' ? 'hi-IN' : language.code).format(number)
    } catch {
      return number.toString()
    }
  }

  // Format dates according to locale
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const language = this.getCurrentLanguageInfo()
    if (!language) return date.toLocaleDateString()

    try {
      const locale = language.code === 'hi' ? 'hi-IN' : language.code
      return new Intl.DateTimeFormat(locale, options).format(date)
    } catch {
      return date.toLocaleDateString()
    }
  }

  // Get available languages
  getAvailableLanguages(): Language[] {
    return supportedLanguages
  }
}

// Create singleton instance
export const i18n = new I18nManager()

// React hook for translations
export function useTranslation() {
  return {
    t: (key: TranslationKey, params?: Record<string, string | number>) => i18n.translate(key, params),
    tPlural: (key: TranslationKey, count: number, params?: Record<string, string | number>) => 
      i18n.translatePlural(key, count, params),
    currentLanguage: i18n.getCurrentLanguage(),
    currentLanguageInfo: i18n.getCurrentLanguageInfo(),
    setLanguage: (langCode: string) => i18n.setLanguage(langCode),
    availableLanguages: i18n.getAvailableLanguages(),
    formatNumber: (number: number) => i18n.formatNumber(number),
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => i18n.formatDate(date, options)
  }
}

// Higher-order component for class components
export function withTranslation<P extends object>(Component: React.ComponentType<P & { t: typeof i18n.translate }>) {
  return function TranslatedComponent(props: P) {
    const { t } = useTranslation()
    return <Component {...props} t={t} />
  }
}
