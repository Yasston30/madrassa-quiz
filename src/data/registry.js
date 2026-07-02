import cours1 from './courses/aqida/3-fondements/cours-1'
import cours2 from './courses/aqida/3-fondements/cours-2'
import cours3 from './courses/aqida/3-fondements/cours-3'

function buildCumulativeExam(sousMatiereId, courseA, courseB, examNumber) {
  const merged = []
  const maxLen = Math.max(courseA.questions.length, courseB.questions.length)
  for (let i = 0; i < maxLen; i++) {
    if (courseA.questions[i]) merged.push({ ...courseA.questions[i], _sourceModuleId: courseA.id })
    if (courseB.questions[i]) merged.push({ ...courseB.questions[i], _sourceModuleId: courseB.id })
  }
  const seuilA = courseA.seuilReussite ?? 60
  const seuilB = courseB.seuilReussite ?? 60
  const nomA = courseA.titre.split('—')[0].trim()
  const nomB = courseB.titre.split('—')[0].trim()
  return {
    id: `${sousMatiereId}-examen-${examNumber}`,
    matiereId: courseA.matiereId,
    sousMatiereId,
    titre: `Examen cumulatif — ${nomA} & ${nomB}`,
    titreArabe: courseA.titreArabe,
    description: `Grand contrôle qui mélange les questions de « ${courseA.titre} » et « ${courseB.titre} », pour vérifier que tout reste bien retenu dans la durée.`,
    dureeEstimee: '20-25 min',
    seuilReussite: Math.round((seuilA + seuilB) / 2),
    isExamenCumulatif: true,
    questions: merged,
  }
}

function withCumulativeExams(sousMatiereId, modules) {
  const result = []
  let examCount = 0
  for (let i = 0; i < modules.length; i += 2) {
    result.push(modules[i])
    if (modules[i + 1]) {
      result.push(modules[i + 1])
      examCount += 1
      result.push(buildCumulativeExam(sousMatiereId, modules[i], modules[i + 1], examCount))
    }
  }
  return result
}

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
        modules: withCumulativeExams('3-fondements', [cours1, cours2, cours3]),
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
