const ARABIC_RANGE = /[؀-ۿ]/

export function containsArabic(text) {
  return ARABIC_RANGE.test(String(text || ''))
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text, lang = 'ar-SA') {
  if (!canSpeak() || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8
  window.speechSynthesis.speak(utterance)
}
