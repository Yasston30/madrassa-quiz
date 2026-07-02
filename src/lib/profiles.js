export const PROFILES = {
  yassin: {
    id: 'yassin',
    name: 'Yassin',
    emoji: '🧔🏻',
    gradient: 'from-madrassa-500 to-madrassa-800',
    accent: 'madrassa',
    voiceGender: 'male',
  },
  nargis: {
    id: 'nargis',
    name: 'Nargis',
    emoji: '🧕🏻',
    gradient: 'from-gold-400 to-gold-600',
    accent: 'gold',
    voiceGender: 'female',
  },
}

export function getOtherProfile(profileId) {
  return profileId === 'yassin' ? PROFILES.nargis : PROFILES.yassin
}
