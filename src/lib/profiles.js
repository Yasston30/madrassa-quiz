export const PROFILES = {
  yassin: {
    id: 'yassin',
    name: 'Yassin',
    emoji: '🧔🏻',
    gradient: 'from-madrassa-500 to-madrassa-800',
    accent: 'madrassa',
  },
  nargis: {
    id: 'nargis',
    name: 'Nargis',
    emoji: '🧕🏻',
    gradient: 'from-gold-400 to-gold-600',
    accent: 'gold',
  },
}

export function getOtherProfile(profileId) {
  return profileId === 'yassin' ? PROFILES.nargis : PROFILES.yassin
}
