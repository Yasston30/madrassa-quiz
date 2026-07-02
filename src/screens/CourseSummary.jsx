import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, BookOpen } from 'lucide-react'
import { getModuleById } from '../data/registry'
import { containsArabic } from '../lib/speech'
import SpeakButton from '../components/SpeakButton'

export default function CourseSummary() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const module = getModuleById(moduleId)
  const [highlighted, setHighlighted] = useState(null)

  useEffect(() => {
    const hash = location.hash?.replace('#', '')
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setHighlighted(hash)
      const timer = setTimeout(() => setHighlighted(null), 2200)
      return () => clearTimeout(timer)
    }
  }, [location.hash])

  if (!module) {
    return (
      <div className="p-6 text-center text-madrassa-200">
        Module introuvable. <Link to="/" className="text-gold-300 underline">Retour</Link>
      </div>
    )
  }

  return (
    <div className="min-h-full pb-10">
      <header className="px-5 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="btn-press flex items-center gap-1.5 text-madrassa-300 text-sm mb-4">
          <ArrowLeft size={16} /> Retour
        </button>
        <p className="text-gold-300 text-xs uppercase tracking-wide flex items-center gap-1.5 mb-1">
          <BookOpen size={13} /> Résumé du cours
        </p>
        <h1 className="font-display text-2xl font-bold text-white">{module.titre}</h1>
      </header>

      <div className="px-5 space-y-4">
        {(module.resume ?? []).map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`rounded-2xl border p-4 transition-colors duration-500 scroll-mt-6 ${
              highlighted === section.id
                ? 'border-gold-400 bg-gold-400/10'
                : 'border-madrassa-700/50 bg-madrassa-900/60'
            }`}
          >
            <h2 className="font-display font-bold text-white mb-1.5">{section.titre}</h2>
            <p className="text-madrassa-200 text-sm leading-relaxed">{section.contenu}</p>
          </section>
        ))}

        {module.lexique && module.lexique.length > 0 && (
          <section id="lexique-table" className="rounded-2xl border border-madrassa-700/50 bg-madrassa-900/60 p-4">
            <h2 className="font-display font-bold text-white mb-3">Lexique</h2>
            <div className="space-y-2">
              {module.lexique.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3 bg-madrassa-950/40 rounded-xl px-3 py-2.5">
                  <span className="text-madrassa-200 text-sm flex-1">{item.francais}</span>
                  <span className="font-arabic text-gold-300 text-lg flex items-center gap-2">
                    {item.arabe}
                    {containsArabic(item.arabe) && <SpeakButton text={item.arabe} />}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="px-5 mt-8">
        <button
          onClick={() => navigate(`/module/${module.id}/quiz`)}
          className="btn-press w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 text-madrassa-950 font-display font-bold text-lg py-4 flex items-center justify-center gap-2 shadow-glow"
        >
          <Play size={20} fill="currentColor" /> Commencer le test
        </button>
      </div>
    </div>
  )
}
