import cours1 from './courses/aqida/3-fondements/cours-1'
import cours2 from './courses/aqida/3-fondements/cours-2'

export const matieres = [
  {
    id: 'aqida',
    nom: 'Aqida',
    emoji: '🕌',
    sousMatieres: [
      {
        id: '3-fondements',
        nom: 'Les 3 Fondements',
        nomArabe: 'الأصول الثلاثة',
        modules: [cours1, cours2],
      },
    ],
  },
]

export const allModules = matieres.flatMap((m) =>
  m.sousMatieres.flatMap((s) => s.modules.map((mod) => ({ ...mod, matiereNom: m.nom, matiereEmoji: m.emoji, sousMatiereNom: s.nom })))
)

export function getModuleById(id) {
  return allModules.find((m) => m.id === id)
}
