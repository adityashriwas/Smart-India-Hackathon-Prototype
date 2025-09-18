'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useTranslation, Language } from '@/lib/i18n'
import { VoiceLanguageSelector } from './LanguageSelector'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onError?: (error: string) => void
  placeholder?: string
  className?: string
  autoStart?: boolean
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceInput({ 
  onTranscript, 
  onError, 
  placeholder = "Click to start voice input...",
  className = "",
  autoStart = false 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [confidence, setConfidence] = useState(0)
  const recognitionRef = useRef<any>(null)
  const { currentLanguageInfo, t } = useTranslation()

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)
    setSelectedLanguage(currentLanguageInfo || null)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
            setConfidence(result[0].confidence)
          } else {
            interimTranscript += result[0].transcript
          }
        }

        const fullTranscript = finalTranscript || interimTranscript
        setTranscript(fullTranscript)
        
        if (finalTranscript) {
          onTranscript(finalTranscript.trim())
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not available. Please check permissions.',
          'not-allowed': 'Microphone access denied. Please allow microphone access.',
          'network': 'Network error. Please check your connection.',
          'service-not-allowed': 'Speech recognition service not available.',
          'bad-grammar': 'Speech not recognized. Please try again.',
          'language-not-supported': 'Selected language not supported for speech recognition.'
        }

        const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`
        onError?.(errorMessage)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onError, currentLanguageInfo])

  useEffect(() => {
    if (autoStart && isSupported) {
      startListening()
    }
  }, [autoStart, isSupported])

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      onError?.('Speech recognition not supported in this browser')
      return
    }

    try {
      // Set language for speech recognition
      if (selectedLanguage) {
        const langMap: Record<string, string> = {
          'en': 'en-US',
          'hi': 'hi-IN',
          'bn': 'bn-IN',
          'te': 'te-IN',
          'mr': 'mr-IN',
          'ta': 'ta-IN',
          'gu': 'gu-IN',
          'kn': 'kn-IN',
          'ml': 'ml-IN',
          'pa': 'pa-IN',
          'or': 'or-IN',
          'as': 'as-IN',
          'ur': 'ur-PK'
        }
        recognitionRef.current.lang = langMap[selectedLanguage.code] || 'en-US'
      }

      setTranscript('')
      setConfidence(0)
      recognitionRef.current.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      onError?.('Failed to start speech recognition')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center text-gray-500">
          <MicOff className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Speech recognition not supported in this browser</p>
          <p className="text-xs mt-1">Try using Chrome, Edge, or Safari</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selection */}
      <VoiceLanguageSelector onLanguageSelect={setSelectedLanguage} />

      {/* Voice Input Interface */}
      <div className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
        isListening 
          ? 'border-red-400 bg-red-50 shadow-lg' 
          : 'border-gray-300 bg-gray-50 hover:border-blue-400'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <div>
              <p className="font-medium text-gray-800">
                {isListening ? 'Listening...' : 'Voice Input'}
              </p>
              <p className="text-sm text-gray-600">
                {selectedLanguage ? `${selectedLanguage.name} (${selectedLanguage.nativeName})` : 'Select language'}
              </p>
            </div>
          </div>

          {/* Audio Level Indicator */}
          {isListening && (
            <div className="flex items-center space-x-1">
              <Volume2 className="w-4 h-4 text-red-500" />
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-6 bg-red-400 rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        <div className="min-h-[60px] p-3 bg-white rounded-md border">
          {transcript ? (
            <div>
              <p className="text-gray-800">{transcript}</p>
              {confidence > 0 && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Confidence:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{Math.round(confidence * 100)}%</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">{placeholder}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setTranscript('')}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Clear
            </button>
            {transcript && (
              <button
                onClick={() => onTranscript(transcript)}
                className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Use Text
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {isListening ? (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span>Recording...</span>
              </span>
            ) : (
              'Click microphone to start'
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>💡 <strong>Tips:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Speak clearly and at a normal pace</li>
          <li>Ensure your microphone is working and permissions are granted</li>
          <li>Choose the correct language for better recognition</li>
          <li>Use in a quiet environment for best results</li>
        </ul>
      </div>
    </div>
  )
}

// Text-to-Speech Component
export function TextToSpeech({ 
  text, 
  language, 
  className = "" 
}: { 
  text: string
  language?: Language
  className?: string 
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
  }, [])

  const speak = () => {
    if (!isSupported || !text) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set language if provided
    if (language) {
      const langMap: Record<string, string> = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'bn': 'bn-IN',
        'te': 'te-IN',
        'mr': 'mr-IN',
        'ta': 'ta-IN',
        'gu': 'gu-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN',
        'pa': 'pa-IN',
        'or': 'or-IN',
        'as': 'as-IN',
        'ur': 'ur-PK'
      }
      utterance.lang = langMap[language.code] || 'en-US'
    }

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={isPlaying ? stop : speak}
      className={`p-2 rounded-md transition-colors ${
        isPlaying 
          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      } ${className}`}
      title={isPlaying ? 'Stop speaking' : 'Read aloud'}
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  )
}
