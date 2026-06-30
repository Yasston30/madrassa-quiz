import { motion } from 'framer-motion'
import { Repeat } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { matieres } from '../data/registry'
import { getProfileStats } from '../lib/storage'
import { getOtherProfile } from '../lib/profiles'
import ModuleCard from '../components/ModuleCard'
import StatPill from '../components/StatPill'

export default function Home() {
  const { profile, profileId, clearProfile } = useProfile()
  const stats = getProfileStats(profileId)
  const other = getOtherProfile(profileId)

  return (
    <div className="min-h-full pb-10">
      <header className="px-5 pt-8 pb-6 bg-gradient-to-b from-madrassa-800/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-madrassa-300 text-sm">Salam</p>
            <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
              {profile.emoji} {profile.name}
            </h1>
          </div>
          <button
            onClick={clearProfile}
            className="btn-press flex items-center gap-1.5 text-xs text-madrassa-200 bg-madrassa-900/70 border border-madrassa-700/60 rounded-full px-3 py-2"
          >
            <Repeat size={14} /> Changer
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mt-5"
        >
          <StatPill label="Modules faits" value={stats.modulesDone} />
          <StatPill label="Moy. score" value={`${stats.averagePercent}%`} />
          <StatPill label="Sans-faute" value={`${stats.perfectCount} 🏆`} />
        </motion.div>

        <p className="text-madrassa-400 text-xs mt-4">
          Face à face avec {other.emoji} {other.name} — comparez vos résultats après chaque test.
        </p>
      </header>

      <div className="px-5 mt-2 space-y-8">
        {matieres.map((matiere) => (
          <section key={matiere.id}>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-1">
              <span>{matiere.emoji}</span> {matiere.nom}
            </h2>
            <div className="geo-divider w-12 rounded-full mb-4" />
            {matiere.sousMatieres.map((sous) => (
              <div key={sous.id} className="mb-5">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-madrassa-200 font-semibold text-sm">{sous.nom}</h3>
                  {sous.nomArabe && <span className="font-arabic text-gold-300/80 text-sm">{sous.nomArabe}</span>}
                </div>
                <div className="space-y-2.5">
                  {sous.modules.map((module, i) => (
                    <ModuleCard key={module.id} module={module} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
