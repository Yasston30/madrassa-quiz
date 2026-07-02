import { Volume2 } from 'lucide-react'
import { canSpeak, speak } from '../lib/speech'

export default function SpeakButton({ text, className = '' }) {
  if (!canSpeak()) return null
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.stopPropagation()
          e.preventDefault()
          speak(text)
        }
      }}
      aria-label="Écouter la prononciation"
      className={`btn-press shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-full bg-gold-300/15 text-gold-300 border border-gold-300/30 ${className}`}
    >
      <Volume2 size={14} />
    </span>
  )
}
