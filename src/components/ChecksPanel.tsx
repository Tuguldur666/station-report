import type { ReportCheck } from '../types'

export function ChecksPanel({ checks }: { checks: ReportCheck[] }) {
  return (
    <section className="card no-print">
      <h2>Checks</h2>
      <div>
        {checks.map((c, i) => (
          <div key={i} className={`chk ${c.status}`}>
            {c.message}
          </div>
        ))}
      </div>
    </section>
  )
}
