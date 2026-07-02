const ARABIC_RANGE = /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/

export function containsArabic(text) {
  return ARABIC_RANGE.test(String(text || ''))
}

// Pulls out only the Arabic-script run(s) from a mixed French/Arabic string,
// so the speaker reads the vocabulary word instead of the whole sentence.
export function extractArabic(text) {
  const str = String(text || '')
  const runs = []
  let current = ''
  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ARABIC_RANGE.test(ch)) {
      current += ch
    } else if (/\s/.test(ch) && current) {
      let j = i
      while (j < str.length && /\s/.test(str[j])) j++
      if (j < str.length && ARABIC_RANGE.test(str[j])) {
        current += ' '
      } else {
        runs.push(current.trim())
        current = ''
      }
    } else if (current) {
      runs.push(current.trim())
      current = ''
    }
  }
  if (current) runs.push(current.trim())
  return runs.join(' ... ').trim()
}

export function canSpeak() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

const GENDER_HINTS = {
  female: ['female', 'zeina', 'salma', 'laila', 'leila', 'amira', 'fatima', 'hoda', 'salima'],
  male: ['male', 'majed', 'maged', 'tarik', 'tariq', 'hamed', 'ahmed', 'omar', 'khalid'],
}

// iOS Safari garbage-collects the utterance object if nothing keeps a
// reference to it, which silently kills playback — so we hold on to it here.
let lastUtterance = null

function pickVoice(lang, gender) {
  const voices = window.speechSynthesis.getVoices()
  const langPrefix = lang.split('-')[0]
  const matching = voices.filter((v) => v.lang === lang || v.lang.startsWith(langPrefix))
  if (!matching.length) return null
  if (gender && GENDER_HINTS[gender]) {
    const hinted = matching.find((v) => GENDER_HINTS[gender].some((hint) => v.name.toLowerCase().includes(hint)))
    if (hinted) return hinted
  }
  return matching[0]
}

function speakNow(text, lang, gender) {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.8
  const voice = pickVoice(lang, gender)
  if (voice) utterance.voice = voice
  lastUtterance = utterance
  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
}

export function speak(text, { lang = 'ar-SA', gender } = {}) {
  if (!canSpeak() || !text) return
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => speakNow(text, lang, gender), { once: true })
  }
  speakNow(text, lang, gender)
}
