'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useTranslation, Language } from '@/lib/i18n'

interface LanguageSelectorProps {
  className?: string
  showFlag?: boolean
  showNativeName?: boolean
  compact?: boolean
}

export function LanguageSelector({ 
  className = '', 
  showFlag = true, 
  showNativeName = true,
  compact = false 
}: LanguageSelectorProps) {
  const { currentLanguage, currentLanguageInfo, setLanguage, availableLanguages } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) return
    
    setIsLoading(true)
    try {
      await setLanguage(langCode)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-selector')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  if (compact) {
    return (
      <div className={`language-selector relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
          disabled={isLoading}
        >
          {showFlag && currentLanguageInfo && (
            <span className="text-sm">{currentLanguageInfo.flag}</span>
          )}
          <span className="text-xs font-medium text-gray-600">
            {currentLanguageInfo?.code.toUpperCase() || 'EN'}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="py-1">
              {availableLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    language.code === currentLanguage ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {showFlag && <span>{language.flag}</span>}
                    <span>{language.name}</span>
                    {showNativeName && language.nativeName !== language.name && (
                      <span className="text-xs text-gray-500">({language.nativeName})</span>
                    )}
                  </div>
                  {language.code === currentLanguage && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`language-selector relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={isLoading}
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <div className="flex items-center space-x-2">
          {showFlag && currentLanguageInfo && (
            <span>{currentLanguageInfo.flag}</span>
          )}
          <span className="text-sm font-medium text-gray-700">
            {currentLanguageInfo?.name || 'English'}
          </span>
          {showNativeName && currentLanguageInfo && currentLanguageInfo.nativeName !== currentLanguageInfo.name && (
            <span className="text-xs text-gray-500">({currentLanguageInfo.nativeName})</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-full">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              Select Language
            </div>
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors ${
                  language.code === currentLanguage ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center space-x-3">
                  {showFlag && <span className="text-lg">{language.flag}</span>}
                  <div>
                    <div className="font-medium">{language.name}</div>
                    {showNativeName && language.nativeName !== language.name && (
                      <div className="text-xs text-gray-500">{language.nativeName}</div>
                    )}
                  </div>
                </div>
                {language.code === currentLanguage && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
          
          {/* Language Statistics */}
          <div className="border-t border-gray-100 px-3 py-2">
            <div className="text-xs text-gray-500 flex items-center justify-between">
              <span>{availableLanguages.length} languages available</span>
              {isLoading && <span>Switching...</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Voice Language Selector for speech recognition
export function VoiceLanguageSelector({ onLanguageSelect }: { onLanguageSelect: (lang: Language) => void }) {
  const { currentLanguageInfo, availableLanguages } = useTranslation()
  const [selectedVoiceLang, setSelectedVoiceLang] = useState<Language | null>(currentLanguageInfo || null)

  const handleVoiceLanguageChange = (language: Language) => {
    setSelectedVoiceLang(language)
    onLanguageSelect(language)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Voice Input Language</label>
      <div className="grid grid-cols-2 gap-2">
        {availableLanguages.slice(0, 6).map((language) => (
          <button
            key={language.code}
            onClick={() => handleVoiceLanguageChange(language)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md border transition-colors ${
              selectedVoiceLang?.code === language.code
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{language.flag}</span>
            <span className="text-sm">{language.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
