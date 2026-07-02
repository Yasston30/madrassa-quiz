import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getModuleById } from '../data/registry'
import { useProfile } from '../context/ProfileContext'
import { saveAttempt, recordAnswer } from '../lib/storage'
import QuestionCard from '../components/QuestionCard'

export default function Quiz() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { profileId } = useProfile()
  const module = getModuleById(moduleId)
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [startedAt] = useState(() => Date.now())

  const questions = module?.questions ?? []
  const progress = questions.length ? ((index) / questions.length) * 100 : 0

  function handleNext(isCorrect) {
    const sourceModuleId = current._sourceModuleId ?? module.id
    recordAnswer(profileId, sourceModuleId, current.id, isCorrect)
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0)
    if (index + 1 >= questions.length) {
      const total = questions.length
      const percent = Math.round((newCorrectCount / total) * 100)
      const attempt = {
        date: new Date().toISOString(),
        score: newCorrectCount,
        total,
        percent,
        durationSec: Math.round((Date.now() - startedAt) / 1000),
      }
      saveAttempt(profileId, module.id, attempt)
      navigate(`/module/${module.id}/result`, { state: { attempt } })
    } else {
      setCorrectCount(newCorrectCount)
      setIndex(index + 1)
    }
  }

  const current = useMemo(() => questions[index], [questions, index])

  if (!module || !current) {
    return <div className="p-6 text-center text-madrassa-200">Module introuvable.</div>
  }

  return (
    <div className="min-h-full flex flex-col max-w-2xl mx-auto w-full">
      <header className="px-5 md:px-10 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => navigate(-1)} className="btn-press text-madrassa-400">
            <X size={22} />
          </button>
          <p className="text-madrassa-300 text-sm font-medium">
            Question {index + 1} / {questions.length}
          </p>
          <div className="w-[22px]" />
        </div>
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
            key={`${current._sourceModuleId ?? module.id}:${current.id}`}
            question={current}
            onNext={handleNext}
            moduleId={current._sourceModuleId ?? module.id}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
