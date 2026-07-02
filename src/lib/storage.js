const PROFILE_KEY = 'mq_profile'
const RESULTS_KEY = 'mq_results_v1'
const IMPORTED_KEY = 'mq_imported_v1'
const WEAK_KEY = 'mq_weak_v1'

export function getStoredProfile() {
  return localStorage.getItem(PROFILE_KEY)
}

export function setStoredProfile(profileId) {
  localStorage.setItem(PROFILE_KEY, profileId)
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getAllResults() {
  return readJSON(RESULTS_KEY, {})
}

export function getModuleAttempts(profileId, moduleId) {
  const all = getAllResults()
  return all[profileId]?.[moduleId] ?? []
}

export function getBestAttempt(profileId, moduleId) {
  const attempts = getModuleAttempts(profileId, moduleId)
  if (!attempts.length) return null
  return attempts.reduce((best, a) => (a.percent > best.percent ? a : best), attempts[0])
}

export function getLatestAttempt(profileId, moduleId) {
  const attempts = getModuleAttempts(profileId, moduleId)
  if (!attempts.length) return null
  return attempts[attempts.length - 1]
}

export function saveAttempt(profileId, moduleId, attempt) {
  const all = getAllResults()
  if (!all[profileId]) all[profileId] = {}
  if (!all[profileId][moduleId]) all[profileId][moduleId] = []
  all[profileId][moduleId].push(attempt)
  writeJSON(RESULTS_KEY, all)
  return attempt
}

export function getProfileStats(profileId) {
  const all = getAllResults()[profileId] ?? {}
  let totalAttempts = 0
  let totalPercentSum = 0
  let perfectCount = 0
  const modulesDone = new Set()
  Object.entries(all).forEach(([moduleId, attempts]) => {
    if (attempts.length) modulesDone.add(moduleId)
    attempts.forEach((a) => {
      totalAttempts += 1
      totalPercentSum += a.percent
      if (a.percent === 100) perfectCount += 1
    })
  })
  return {
    totalAttempts,
    modulesDone: modulesDone.size,
    averagePercent: totalAttempts ? Math.round(totalPercentSum / totalAttempts) : 0,
    perfectCount,
  }
}

export function getImportedResults(moduleId) {
  const all = readJSON(IMPORTED_KEY, {})
  return all[moduleId] ?? {}
}

export function saveImportedResult(moduleId, profileId, attempt) {
  const all = readJSON(IMPORTED_KEY, {})
  if (!all[moduleId]) all[moduleId] = {}
  all[moduleId][profileId] = attempt
  writeJSON(IMPORTED_KEY, all)
}

function weakKey(moduleId, questionId) {
  return `${moduleId}::${questionId}`
}

export function recordAnswer(profileId, moduleId, questionId, correct) {
  const all = readJSON(WEAK_KEY, {})
  if (!all[profileId]) all[profileId] = {}
  const key = weakKey(moduleId, questionId)
  if (correct) {
    delete all[profileId][key]
  } else {
    const existing = all[profileId][key]
    all[profileId][key] = {
      moduleId,
      questionId,
      missCount: (existing?.missCount ?? 0) + 1,
      lastMissedAt: new Date().toISOString(),
    }
  }
  writeJSON(WEAK_KEY, all)
}

export function getWeakQuestions(profileId, moduleId = null) {
  const all = readJSON(WEAK_KEY, {})
  const entries = Object.values(all[profileId] ?? {})
  return moduleId ? entries.filter((e) => e.moduleId === moduleId) : entries
}

export function clearWeakQuestion(profileId, moduleId, questionId) {
  const all = readJSON(WEAK_KEY, {})
  if (!all[profileId]) return
  delete all[profileId][weakKey(moduleId, questionId)]
  writeJSON(WEAK_KEY, all)
}
