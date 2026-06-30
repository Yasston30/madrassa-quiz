const CODE_PREFIX = 'MQ1-'

export function encodeResultCode(payload) {
  const json = JSON.stringify(payload)
  const base64 = btoa(unescape(encodeURIComponent(json)))
  return CODE_PREFIX + base64
}

export function decodeResultCode(code) {
  const trimmed = String(code || '').trim()
  if (!trimmed.startsWith(CODE_PREFIX)) {
    throw new Error('Code invalide : ce code ne provient pas de Madrassa Quiz.')
  }
  const base64 = trimmed.slice(CODE_PREFIX.length)
  const json = decodeURIComponent(escape(atob(base64)))
  const payload = JSON.parse(json)
  if (!payload.profileId || !payload.moduleId || typeof payload.percent !== 'number') {
    throw new Error('Code invalide : données incomplètes.')
  }
  return payload
}

export function buildShareText({ profileName, moduleTitre, score, total, percent }) {
  const emoji = percent === 100 ? '🏆' : percent >= 80 ? '🔥' : percent >= 50 ? '👍' : '📖'
  return `${emoji} ${profileName} a obtenu ${score}/${total} (${percent}%) au test "${moduleTitre}" sur Madrassa Quiz !`
}
