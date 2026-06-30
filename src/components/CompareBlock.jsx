import { useProfile } from '../context/ProfileContext'

function Bar({ emoji, name, percent, colorClass }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-madrassa-200 font-medium">{emoji} {name}</span>
        <span className="text-madrassa-300">{percent}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-madrassa-900/80 overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-700`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default function CompareBlock({ moi, autre, autreNom, autreEmoji }) {
  const { profile } = useProfile()

  if (!moi && !autre) {
    return (
      <p className="text-madrassa-400 text-sm bg-madrassa-900/50 border border-madrassa-700/40 rounded-xl px-4 py-3">
        Aucun résultat pour le moment. Faites le test puis échangez vos codes pour comparer !
      </p>
    )
  }

  return (
    <div className="bg-madrassa-900/60 border border-madrassa-700/50 rounded-xl px-4 py-4 space-y-3">
      <Bar emoji={profile.emoji} name={profile.name} percent={moi?.percent ?? 0} colorClass="bg-gradient-to-r from-madrassa-400 to-madrassa-600" />
      <Bar emoji={autreEmoji} name={autreNom} percent={autre?.percent ?? 0} colorClass="bg-gradient-to-r from-gold-400 to-gold-600" />
      {!autre && (
        <p className="text-madrassa-400 text-xs pt-1">
          {autreNom} n'a pas encore importé de résultat pour ce test.
        </p>
      )}
    </div>
  )
}
