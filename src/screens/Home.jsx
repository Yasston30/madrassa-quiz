import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Repeat, Sparkles, ChevronRight } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { matieres } from '../data/registry'
import { getProfileStats, getWeakQuestions } from '../lib/storage'
import { getOtherProfile } from '../lib/profiles'
import ModuleCard from '../components/ModuleCard'
import StatPill from '../components/StatPill'

export default function Home() {
  const navigate = useNavigate()
  const { profile, profileId, clearProfile } = useProfile()
  const stats = getProfileStats(profileId)
  const other = getOtherProfile(profileId)
  const weakCount = getWeakQuestions(profileId).length

  return (
    <div className="min-h-full pb-10">
      <header className="bg-gradient-to-b from-madrassa-800/80 to-transparent">
        <div className="max-w-3xl mx-auto px-5 md:px-10 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-madrassa-300 text-sm">Salam</p>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
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
            className="flex gap-2 sm:gap-4 mt-5 sm:max-w-md"
          >
            <StatPill label="Modules faits" value={stats.modulesDone} />
            <StatPill label="Moy. score" value={`${stats.averagePercent}%`} />
            <StatPill label="Sans-faute" value={`${stats.perfectCount} 🏆`} />
          </motion.div>

          <p className="text-madrassa-400 text-xs mt-4">
            Face à face avec {other.emoji} {other.name} — comparez vos résultats après chaque test.
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 md:px-10">
        {weakCount > 0 && (
          <div className="mt-2 mb-6">
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate('/revision')}
              className="btn-press w-full sm:max-w-md rounded-2xl bg-gradient-to-r from-gold-400/20 to-gold-600/10 border border-gold-400/40 px-4 py-3.5 flex items-center gap-3"
            >
              <span className="h-10 w-10 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-gold-300" />
              </span>
              <span className="flex-1 text-left">
                <span className="block font-display font-bold text-white text-sm">Réviser mes points faibles</span>
                <span className="block text-madrassa-300 text-xs">{weakCount} question{weakCount > 1 ? 's' : ''} à retravailler</span>
              </span>
              <ChevronRight size={18} className="text-gold-300" />
            </motion.button>
          </div>
        )}

        <div className="mt-2 space-y-8">
          {matieres.map((matiere) => (
            <section key={matiere.id}>
              <h2 className="font-display text-lg md:text-xl font-bold text-white flex items-center gap-2 mb-1">
                <span>{matiere.emoji}</span> {matiere.nom}
              </h2>
              <div className="geo-divider w-12 rounded-full mb-4" />
              {matiere.sousMatieres.map((sous) => (
                <div key={sous.id} className="mb-5">
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-madrassa-200 font-semibold text-sm">{sous.nom}</h3>
                    {sous.nomArabe && <span className="font-arabic text-gold-300/80 text-sm">{sous.nomArabe}</span>}
                  </div>
                  <div className="space-y-2.5 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
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
    </div>
  )
}
