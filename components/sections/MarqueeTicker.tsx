const items = [
  'Street Dance',
  'K-POP',
  'Gimnastică',
  'Hip-Hop',
  'Dans Copii',
  'Dans Studenți',
  'Breakdance',
  'Iași · Din 1981',
  '600+ Membri',
  'Spectacole · Concursuri',
]

// Duplicate for seamless infinite loop
const doubled = [...items, ...items]

export default function MarqueeTicker() {
  return (
    <div
      className="w-full overflow-hidden bg-[#f8ef21] py-3 border-y border-[#e8d800]"
      aria-hidden="true"
    >
      <div className="marquee-track select-none">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-4 px-6 text-[#231f20] text-xs font-black uppercase tracking-[0.18em] whitespace-nowrap"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-[#231f20] opacity-40 flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
