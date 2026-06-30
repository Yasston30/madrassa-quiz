import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { isBlankAnswerCorrect } from '../lib/grading'

const TYPE_LABELS = {
  qcm: 'QCM',
  vrai_faux: 'Vrai ou Faux',
  trou: 'Texte à trous',
  ouverte: 'Question ouverte',
}

export default function QuestionCard({ question, onNext }) {
  const [revealed, setRevealed] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedBool, setSelectedBool] = useState(null)
  const [blankInput, setBlankInput] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  function reveal(correct) {
    setIsCorrect(correct)
    setRevealed(true)
  }

  function handleQcmClick(index) {
    if (revealed) return
    setSelectedIndex(index)
    reveal(index === question.answerIndex)
  }

  function handleBoolClick(value) {
    if (revealed) return
    setSelectedBool(value)
    reveal(value === question.answer)
  }

  function handleBlankSubmit(e) {
    e.preventDefault()
    if (revealed || !blankInput.trim()) return
    reveal(isBlankAnswerCorrect(blankInput, question.answers))
  }

  function handleOuverteReveal() {
    if (revealed) return
    setRevealed(true)
  }

  function handleSelfAssess(correct) {
    setIsCorrect(correct)
    onNext(correct)
  }

  function handleContinue() {
    onNext(isCorrect)
  }

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
      className="bg-madrassa-900/70 border border-madrassa-700/50 rounded-2xl p-5"
    >
      <span className="inline-block text-[11px] uppercase tracking-wide text-gold-300 bg-gold-300/10 border border-gold-300/30 rounded-full px-2.5 py-1 mb-3">
        {TYPE_LABELS[question.type]}
      </span>
      <p className="font-display text-lg font-semibold text-white leading-snug mb-5">{question.question}</p>

      {question.type === 'qcm' && (
        <div className="space-y-2.5">
          {question.options.map((opt, i) => {
            let cls = 'border-madrassa-700/60 bg-madrassa-950/40 text-madrassa-100'
            if (revealed) {
              if (i === question.answerIndex) cls = 'border-emerald-400 bg-emerald-400/15 text-emerald-200'
              else if (i === selectedIndex) cls = 'border-red-400 bg-red-400/15 text-red-200'
              else cls = 'border-madrassa-800 bg-madrassa-950/20 text-madrassa-500'
            }
            return (
              <button
                key={i}
                onClick={() => handleQcmClick(i)}
                disabled={revealed}
                className={`btn-press w-full text-left rounded-xl border px-4 py-3 text-sm font-medium flex items-center justify-between gap-2 transition-colors ${cls}`}
              >
                {opt}
                {revealed && i === question.answerIndex && <Check size={16} />}
                {revealed && i === selectedIndex && i !== question.answerIndex && <X size={16} />}
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'vrai_faux' && (
        <div className="flex gap-3">
          {[true, false].map((val) => {
            let cls = 'border-madrassa-700/60 bg-madrassa-950/40 text-madrassa-100'
            if (revealed) {
              if (val === question.answer) cls = 'border-emerald-400 bg-emerald-400/15 text-emerald-200'
              else if (val === selectedBool) cls = 'border-red-400 bg-red-400/15 text-red-200'
              else cls = 'border-madrassa-800 bg-madrassa-950/20 text-madrassa-500'
            }
            return (
              <button
                key={String(val)}
                onClick={() => handleBoolClick(val)}
                disabled={revealed}
                className={`btn-press flex-1 rounded-xl border px-4 py-3 text-sm font-bold transition-colors ${cls}`}
              >
                {val ? 'Vrai' : 'Faux'}
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'trou' && (
        <form onSubmit={handleBlankSubmit}>
          <input
            value={blankInput}
            onChange={(e) => setBlankInput(e.target.value)}
            disabled={revealed}
            placeholder="Écris ta réponse…"
            autoCapitalize="off"
            autoCorrect="off"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-medium bg-madrassa-950/40 text-white placeholder:text-madrassa-500 focus:outline-none ${
              revealed
                ? isCorrect
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : 'border-red-400 bg-red-400/10'
                : 'border-madrassa-700/60 focus:border-gold-400/60'
            }`}
          />
          {!revealed && (
            <button type="submit" className="btn-press mt-3 w-full bg-gold-500 text-madrassa-950 font-bold rounded-xl py-2.5 text-sm">
              Valider
            </button>
          )}
        </form>
      )}

      {question.type === 'ouverte' && (
        <div>
          <textarea
            disabled={revealed}
            placeholder="Écris ta réponse ici (pour toi-même)…"
            rows={3}
            className="w-full rounded-xl border border-madrassa-700/60 px-4 py-3 text-sm bg-madrassa-950/40 text-white placeholder:text-madrassa-500 focus:outline-none focus:border-gold-400/60 resize-none"
          />
          {!revealed && (
            <button onClick={handleOuverteReveal} className="btn-press mt-3 w-full bg-gold-500 text-madrassa-950 font-bold rounded-xl py-2.5 text-sm">
              Voir la réponse modèle
            </button>
          )}
        </div>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-madrassa-700/50">
              {question.type === 'ouverte' ? (
                <>
                  <p className="text-madrassa-300 text-sm">
                    <span className="text-gold-300 font-semibold">Réponse modèle : </span>
                    {question.reponseModele}
                  </p>
                  <p className="text-madrassa-400 text-xs mt-2 mb-2">As-tu répondu correctement ?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleSelfAssess(true)} className="btn-press flex-1 rounded-xl border border-emerald-400/60 bg-emerald-400/10 text-emerald-200 text-sm font-semibold py-2.5">
                      ✅ J'avais juste
                    </button>
                    <button onClick={() => handleSelfAssess(false)} className="btn-press flex-1 rounded-xl border border-red-400/60 bg-red-400/10 text-red-200 text-sm font-semibold py-2.5">
                      ❌ Pas tout à fait
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className={`text-sm font-bold flex items-center gap-1.5 ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                    {isCorrect ? <Check size={16} /> : <X size={16} />} {isCorrect ? 'Bonne réponse !' : 'Pas tout à fait'}
                  </p>
                  {question.type === 'trou' && !isCorrect && (
                    <p className="text-madrassa-300 text-sm mt-1">Réponse attendue : <span className="text-gold-300 font-semibold">{question.answers[0]}</span></p>
                  )}
                  {question.explication && <p className="text-madrassa-300 text-sm mt-2">{question.explication}</p>}
                  <button onClick={handleContinue} className="btn-press mt-4 w-full bg-gold-500 text-madrassa-950 font-bold rounded-xl py-2.5 text-sm flex items-center justify-center gap-1.5">
                    Continuer <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
