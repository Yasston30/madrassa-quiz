const COMBINING_MARK_MIN = 0x0300
const COMBINING_MARK_MAX = 0x036f

export function normalize(str) {
  const lowered = String(str || '').toLowerCase().normalize('NFD')
  let stripped = ''
  for (const ch of lowered) {
    const code = ch.codePointAt(0)
    if (code >= COMBINING_MARK_MIN && code <= COMBINING_MARK_MAX) continue
    stripped += ch
  }
  return stripped
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isBlankAnswerCorrect(userInput, acceptedAnswers) {
  const normalizedInput = normalize(userInput)
  if (!normalizedInput) return false
  return acceptedAnswers.some((a) => normalize(a) === normalizedInput)
}
