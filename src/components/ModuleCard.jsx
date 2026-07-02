import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { getBestAttempt } from '../lib/storage'

export default function ModuleCard({ module, index = 0 }) {
  const navigate = useNavigate()
  const { profileId } = useProfile()
  const best = getBestAttempt(profileId, module.id)

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/module/${module.id}`)}
      className="btn-press w-full text-left rounded-2xl bg-madrassa-900/80 border border-madrassa-700/60 p-4 flex items-center gap-3 hover:border-gold-400/60 transition-colors"
    >
      <div className="h-12 w-12 shrink-0 rounded-xl bg-madrassa-800 flex items-center justify-center text-xl">
        {module.isExamenCumulatif ? '🧩' : '📘'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-white truncate">{module.titre}</p>
        <p className="text-madrassa-300 text-xs truncate">{module.questions.length} questions · {module.dureeEstimee}</p>
        {best ? (
          <p className="text-gold-300 text-xs mt-1 flex items-center gap-1">
            <Sparkles size={12} /> Meilleur score : {best.percent}%
          </p>
        ) : (
          <p className="text-madrassa-400 text-xs mt-1">Pas encore tenté</p>
        )}
      </div>
      <ChevronRight className="text-madrassa-400 shrink-0" size={20} />
    </motion.button>
  )
}
