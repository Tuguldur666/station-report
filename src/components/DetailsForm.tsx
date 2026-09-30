import type { ReportFormState } from '../types'

interface DetailsFormProps {
  form: ReportFormState
  onChange: (patch: Partial<ReportFormState>) => void
  onPrint: () => void
}

export function DetailsForm({ form, onChange, onPrint }: DetailsFormProps) {
  const setZone = (index: number, value: string) => {
    const zones = [...form.zones] as ReportFormState['zones']
    zones[index] = value
    onChange({ zones })
  }

  return (
    <section className="card">
      <h2>2. Complete the rest</h2>

      <div className="row-2">
        <div>
          <label htmlFor="f-date">Date</label>
          <input id="f-date" value={form.date} onChange={(e) => onChange({ date: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-mgr">Station manager</label>
          <input id="f-mgr" value={form.manager} onChange={(e) => onChange({ manager: e.target.value })} />
        </div>
      </div>

      <div className="row-2">
        <div>
          <label htmlFor="f-dc">Door close (H:MM)</label>
          <input id="f-dc" value={form.doorClose} onChange={(e) => onChange({ doorClose: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-eta">ETA on form (H:MM)</label>
          <input id="f-eta" value={form.eta} onChange={(e) => onChange({ eta: e.target.value })} />
        </div>
      </div>

      <label htmlFor="f-delay">Delay information</label>
      <input id="f-delay" value={form.delay} onChange={(e) => onChange({ delay: e.target.value })} />

      <label>Passenger zones 0A / 0B / 0C / 0D</label>
      <div className="row-4">
        {form.zones.map((z, i) => (
          <input key={i} aria-label={`Zone 0${'ABCD'[i]}`} value={z} onChange={(e) => setZone(i, e.target.value)} />
        ))}
      </div>

      <label htmlFor="f-sph">Special passenger info</label>
      <input
        id="f-sph"
        value={form.specialPassengerInfo}
        onChange={(e) => onChange({ specialPassengerInfo: e.target.value })}
      />

      <div className="row-2">
        <div>
          <label htmlFor="f-xp">Excess bag pcs (text)</label>
          <input id="f-xp" value={form.excessBagPcs} onChange={(e) => onChange({ excessBagPcs: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-xk">Excess bag kgs</label>
          <input id="f-xk" value={form.excessBagKgs} onChange={(e) => onChange({ excessBagKgs: e.target.value })} />
        </div>
      </div>

      <label htmlFor="f-brem">Baggage remarks</label>
      <input id="f-brem" value={form.baggageRemarks} onChange={(e) => onChange({ baggageRemarks: e.target.value })} />

      <div className="row-2">
        <div>
          <label htmlFor="f-cp">Cargo pieces</label>
          <input id="f-cp" value={form.cargoPcs} onChange={(e) => onChange({ cargoPcs: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-crem">Cargo remarks</label>
          <input id="f-crem" value={form.cargoRemarks} onChange={(e) => onChange({ cargoRemarks: e.target.value })} />
        </div>
      </div>

      <div className="row-4">
        <div>
          <label htmlFor="f-fuel1">Remained</label>
          <input id="f-fuel1" value={form.fuelRemained} onChange={(e) => onChange({ fuelRemained: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-fuel2">Uplift</label>
          <input id="f-fuel2" value={form.fuelUplift} onChange={(e) => onChange({ fuelUplift: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-fuel3">Trip fuel</label>
          <input id="f-fuel3" value={form.fuelTrip} onChange={(e) => onChange({ fuelTrip: e.target.value })} />
        </div>
        <div>
          <label htmlFor="f-fuel4">Block fuel</label>
          <input id="f-fuel4" value={form.fuelBlock} onChange={(e) => onChange({ fuelBlock: e.target.value })} />
        </div>
      </div>

      <label htmlFor="f-dsel">Departed ULDs to print</label>
      <select
        id="f-dsel"
        value={form.departedFilter}
        onChange={(e) => onChange({ departedFilter: e.target.value as ReportFormState['departedFilter'] })}
      >
        <option value="B">Baggage ULDs only (current practice)</option>
        <option value="A">All ULDs in CPM</option>
      </select>

      <label htmlFor="f-oth">Other info</label>
      <input id="f-oth" value={form.otherInfo} onChange={(e) => onChange({ otherInfo: e.target.value })} />

      <button type="button" onClick={onPrint}>
        Print / save as PDF
      </button>
    </section>
  )
}
