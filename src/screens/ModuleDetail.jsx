import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, History, Users } from 'lucide-react'
import { getModuleById } from '../data/registry'
import { useProfile } from '../context/ProfileContext'
import { getModuleAttempts, getImportedResults, saveImportedResult } from '../lib/storage'
import { decodeResultCode } from '../lib/share'
import { getOtherProfile, PROFILES } from '../lib/profiles'
import CompareBlock from '../components/CompareBlock'

export default function ModuleDetail() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { profileId } = useProfile()
  const module = getModuleById(moduleId)
  const [importCode, setImportCode] = useState('')
  const [importError, setImportError] = useState('')

  if (!module) {
    return (
      <div className="p-6 text-center text-madrassa-200">
        Module introuvable. <Link to="/" className="text-gold-300 underline">Retour</Link>
      </div>
    )
  }

  const attempts = getModuleAttempts(profileId, module.id).slice().reverse()
  const other = getOtherProfile(profileId)
  const imported = getImportedResults(module.id)[other.id]

  function handleImport() {
    setImportError('')
    try {
      const payload = decodeResultCode(importCode)
      if (payload.moduleId !== module.id) {
        setImportError("Ce code correspond à un autre module.")
        return
      }
      saveImportedResult(module.id, payload.profileId, payload)
      setImportCode('')
    } catch (e) {
      setImportError(e.message || 'Code invalide.')
    }
  }

  return (
    <div className="min-h-full pb-10">
      <header className="px-5 pt-8 pb-4">
        <button onClick={() => navigate(-1)} className="btn-press flex items-center gap-1.5 text-madrassa-300 text-sm mb-4">
          <ArrowLeft size={16} /> Retour
        </button>
        <p className="font-arabic text-gold-300 text-xl">{module.titreArabe}</p>
        <h1 className="font-display text-2xl font-bold text-white mt-1">{module.titre}</h1>
        <p className="text-madrassa-300 text-sm mt-2 leading-relaxed">{module.description}</p>
        <p className="text-madrassa-400 text-xs mt-2">{module.questions.length} questions · {module.dureeEstimee}</p>
      </header>

      <div className="px-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate(`/module/${module.id}/quiz`)}
          className="btn-press w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 text-madrassa-950 font-display font-bold text-lg py-4 flex items-center justify-center gap-2 shadow-glow"
        >
          <Play size={20} fill="currentColor" /> {attempts.length ? 'Refaire le test' : 'Commencer le test'}
        </motion.button>
      </div>

      <div className="px-5 mt-8">
        <h2 className="text-madrassa-200 font-semibold text-sm flex items-center gap-2 mb-3">
          <Users size={16} /> Comparaison avec {other.emoji} {other.name}
        </h2>
        <CompareBlock
          moi={attempts[0]}
          autre={imported}
          autreNom={other.name}
          autreEmoji={other.emoji}
        />
        <div className="mt-3 flex gap-2">
          <input
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            placeholder={`Coller le code de ${other.name}…`}
            className="flex-1 bg-madrassa-900/70 border border-madrassa-700/60 rounded-xl px-3 py-2 text-sm text-white placeholder:text-madrassa-500 focus:outline-none focus:border-gold-400/60"
          />
          <button
            onClick={handleImport}
            className="btn-press bg-madrassa-700 text-white text-sm font-semibold px-4 rounded-xl"
          >
            Importer
          </button>
        </div>
        {importError && <p className="text-red-300 text-xs mt-2">{importError}</p>}
      </div>

      {attempts.length > 0 && (
        <div className="px-5 mt-8">
          <h2 className="text-madrassa-200 font-semibold text-sm flex items-center gap-2 mb-3">
            <History size={16} /> Historique de {PROFILES[profileId].name}
          </h2>
          <div className="space-y-2">
            {attempts.map((a, i) => (
              <div key={i} className="flex items-center justify-between bg-madrassa-900/60 border border-madrassa-700/50 rounded-xl px-4 py-2.5 text-sm">
                <span className="text-madrassa-300">{new Date(a.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                <span className={`font-bold ${a.percent >= 80 ? 'text-gold-300' : 'text-madrassa-100'}`}>{a.score}/{a.total} · {a.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
