import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function PassageModal({ section, onClose }) {
  return (
    <AnimatePresence>
      {section && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-madrassa-900 border border-madrassa-700 rounded-2xl w-full max-w-md max-h-[75vh] overflow-y-auto p-5 shadow-glow"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-display font-bold text-white text-lg">{section.titre}</h3>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="btn-press shrink-0 h-8 w-8 rounded-full bg-madrassa-800 border border-madrassa-700/60 flex items-center justify-center text-madrassa-300"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-madrassa-200 text-sm leading-relaxed">{section.contenu}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
