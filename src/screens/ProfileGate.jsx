import { motion } from 'framer-motion'
import { useProfile } from '../context/ProfileContext'
import { PROFILES } from '../lib/profiles'

export default function ProfileGate() {
  const { setProfileId } = useProfile()

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <p className="font-arabic text-3xl text-gold-300 mb-2">الأصول الثلاثة</p>
        <h1 className="font-display text-3xl font-bold text-white">Madrassa Quiz</h1>
        <p className="text-madrassa-200 mt-2 max-w-xs mx-auto">
          Qui se connecte pour réviser aujourd'hui ?
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {Object.values(PROFILES).map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
            onClick={() => setProfileId(p.id)}
            className={`btn-press w-full rounded-2xl bg-gradient-to-br ${p.gradient} p-5 flex items-center gap-4 shadow-glow border border-white/10`}
          >
            <span className="text-4xl">{p.emoji}</span>
            <span className="font-display text-xl font-bold text-white">{p.name}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-madrassa-400 text-xs mt-12 text-center max-w-xs">
        Chacun son profil, chacun ses résultats — comparez-les ensuite !
      </p>
    </div>
  )
}
