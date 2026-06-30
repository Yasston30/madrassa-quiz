import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Share2, Copy, RotateCcw, Home as HomeIcon, Check } from 'lucide-react'
import { getModuleById } from '../data/registry'
import { useProfile } from '../context/ProfileContext'
import { getImportedResults, getLatestAttempt } from '../lib/storage'
import { encodeResultCode, buildShareText } from '../lib/share'
import { getOtherProfile } from '../lib/profiles'
import CompareBlock from '../components/CompareBlock'

function messageFor(percent) {
  if (percent === 100) return { title: 'Mashâ Allah, sans faute ! 🏆', sub: "Score parfait, qu'Allah t'augmente en science." }
  if (percent >= 80) return { title: 'Excellent travail ! 🔥', sub: 'Tu maîtrises très bien ce cours.' }
  if (percent >= 50) return { title: 'Bien joué ! 👍', sub: 'Encore un peu de révision et ce sera parfait.' }
  return { title: 'Continue tes efforts 📖', sub: 'Relis le cours et retente ta chance !' }
}

export default function Result() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { profile, profileId } = useProfile()
  const module = getModuleById(moduleId)
  const attempt = location.state?.attempt ?? getLatestAttempt(profileId, moduleId)
  const [copied, setCopied] = useState(false)

  const other = getOtherProfile(profileId)
  const imported = getImportedResults(moduleId)[other.id]

  useEffect(() => {
    if (attempt && attempt.percent >= 80) {
      const colors = ['#f3d27a', '#c9941f', '#1f7f5e']
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.4 }, colors })
    }
  }, [attempt])

  if (!module || !attempt) {
    return (
      <div className="p-6 text-center text-madrassa-200">
        Aucun résultat. <Link to="/" className="text-gold-300 underline">Retour à l'accueil</Link>
      </div>
    )
  }

  const { title, sub } = messageFor(attempt.percent)
  const shareCode = encodeResultCode({
    profileId,
    profileName: profile.name,
    moduleId: module.id,
    moduleTitre: module.titre,
    score: attempt.score,
    total: attempt.total,
    percent: attempt.percent,
    date: attempt.date,
  })
  const shareText = buildShareText({ profileName: profile.name, moduleTitre: module.titre, score: attempt.score, total: attempt.total, percent: attempt.percent })

  async function handleShare() {
    const fullText = `${shareText}\n\nCode à coller dans son app pour comparer :\n${shareCode}`
    if (navigator.share) {
      try {
        await navigator.share({ text: fullText, title: 'Mon résultat Madrassa Quiz' })
        return
      } catch {
        // user cancelled, fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const circumference = 2 * Math.PI * 54

  return (
    <div className="min-h-full flex flex-col items-center px-6 pt-10 pb-10">
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, type: 'spring' }} className="relative">
        <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#0b4a3f" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r="54" fill="none" stroke="url(#goldGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (attempt.percent / 100) * circumference }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3d27a" />
              <stop offset="100%" stopColor="#c9941f" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-extrabold text-white">{attempt.percent}%</span>
          <span className="text-madrassa-300 text-xs">{attempt.score}/{attempt.total}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mt-6">
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        <p className="text-madrassa-300 text-sm mt-1">{sub}</p>
      </motion.div>

      <div className="w-full max-w-sm mt-8">
        <h2 className="text-madrassa-200 font-semibold text-sm mb-3">Comparer avec {other.emoji} {other.name}</h2>
        <CompareBlock moi={attempt} autre={imported} autreNom={other.name} autreEmoji={other.emoji} />
      </div>

      <div className="w-full max-w-sm mt-6 space-y-2.5">
        <button onClick={handleShare} className="btn-press w-full bg-gradient-to-r from-gold-400 to-gold-600 text-madrassa-950 font-display font-bold rounded-xl py-3.5 flex items-center justify-center gap-2">
          {copied ? <Check size={18} /> : <Share2 size={18} />} {copied ? 'Copié ! Colle-le à ton/ta conjoint(e)' : 'Partager mon résultat'}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(shareCode).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })}
          className="btn-press w-full bg-madrassa-900/70 border border-madrassa-700/60 text-madrassa-200 font-semibold rounded-xl py-3 flex items-center justify-center gap-2 text-sm"
        >
          <Copy size={16} /> Copier juste le code
        </button>
        <div className="flex gap-2.5 pt-1">
          <button onClick={() => navigate(`/module/${module.id}/quiz`)} className="btn-press flex-1 bg-madrassa-800/80 border border-madrassa-700/60 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-1.5 text-sm">
            <RotateCcw size={15} /> Refaire
          </button>
          <button onClick={() => navigate('/')} className="btn-press flex-1 bg-madrassa-800/80 border border-madrassa-700/60 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-1.5 text-sm">
            <HomeIcon size={15} /> Accueil
          </button>
        </div>
      </div>
    </div>
  )
}
