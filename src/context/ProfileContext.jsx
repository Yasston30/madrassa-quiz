import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredProfile, setStoredProfile } from '../lib/storage'
import { PROFILES } from '../lib/profiles'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profileId, setProfileId] = useState(() => getStoredProfile())

  useEffect(() => {
    if (profileId) setStoredProfile(profileId)
  }, [profileId])

  const value = {
    profileId,
    profile: profileId ? PROFILES[profileId] : null,
    setProfileId,
    clearProfile: () => setProfileId(null),
  }

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
