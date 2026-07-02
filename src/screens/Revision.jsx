import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Sparkles, ArrowLeft } from 'lucide-react'
import { getModuleById } from '../data/registry'
import { useProfile } from '../context/ProfileContext'
import { getWeakQuestions, recordAnswer } from '../lib/storage'
import QuestionCard from '../components/QuestionCard'

function resolveWeakQuestions(profileId, moduleFilter) {
  const entries = getWeakQuestions(profileId, moduleFilter)
  const resolved = []
  for (const entry of entries) {
    const mod = getModuleById(entry.moduleId)
    const question = mod?.questions.find((q) => q.id === entry.questionId)
    if (mod && question) resolved.push({ ...question, _sourceModuleId: mod.id, _moduleTitre: mod.titre })
  }
  return resolved
}

export default function Revision() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const moduleFilter = searchParams.get('module')
  const { profileId } = useProfile()

  const [questions] = useState(() => resolveWeakQuestions(profileId, moduleFilter))
  const [index, setIndex] = useState(0)
  const [masteredCount, setMasteredCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = useMemo(() => questions[index], [questions, index])
  const progress = questions.length ? (index / questions.length) * 100 : 0
  const moduleTitre = moduleFilter ? getModuleById(moduleFilter)?.titre : null

  function handleNext(isCorrect) {
    recordAnswer(profileId, current._sourceModuleId, current.id, isCorrect)
    if (isCorrect) setMasteredCount((c) => c + 1)
    if (index + 1 >= questions.length) {
      setFinished(true)
    } else {
      setIndex(index + 1)
    }
  }

  if (!questions.length || finished) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-4">{finished ? '🎉' : '✨'}</span>
        <h1 className="font-display text-2xl font-bold text-white mb-2">
          {finished ? 'Session de révision terminée !' : 'Aucun point faible pour le moment'}
        </h1>
        <p className="text-madrassa-300 text-sm max-w-xs mb-8">
          {finished
            ? `${masteredCount}/${questions.length} question(s) désormais maîtrisée(s). Continue comme ça !`
            : "Dès que tu rates une question dans un test, elle apparaîtra ici pour être retravaillée."}
        </p>
        <button onClick={() => navigate('/')} className="btn-press bg-gold-500 text-madrassa-950 font-bold rounded-xl px-6 py-3">
          Retour à l'accueil
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col max-w-2xl mx-auto w-full">
      <header className="px-5 md:px-10 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="btn-press text-madrassa-400">
            <X size={22} />
          </button>
          <p className="text-madrassa-300 text-sm font-medium flex items-center gap-1.5">
            <Sparkles size={14} className="text-gold-300" /> Révision {index + 1} / {questions.length}
          </p>
          <div className="w-[22px]" />
        </div>
        {moduleTitre && (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs text-madrassa-400 mb-2">
            <ArrowLeft size={12} /> {moduleTitre}
          </button>
        )}
        <div className="h-2 rounded-full bg-madrassa-900/80 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>
      </header>

      <div className="px-5 md:px-10 flex-1">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={`${current._sourceModuleId}:${current.id}`}
            question={current}
            onNext={handleNext}
            moduleId={current._sourceModuleId}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
