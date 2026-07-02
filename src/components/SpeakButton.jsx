import { Volume2 } from 'lucide-react'
import { canSpeak, speak, extractArabic } from '../lib/speech'
import { useProfile } from '../context/ProfileContext'

export default function SpeakButton({ text, className = '' }) {
  const { profile } = useProfile()
  if (!canSpeak()) return null

  function handleSpeak() {
    const arabicOnly = extractArabic(text)
    speak(arabicOnly || text, { gender: profile?.voiceGender })
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        handleSpeak()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation()
          e.preventDefault()
          handleSpeak()
        }
      }}
      aria-label="Écouter la prononciation"
      className={`btn-press shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-gold-300/15 text-gold-300 border border-gold-300/30 ${className}`}
    >
      <Volume2 size={14} />
    </span>
  )
}
