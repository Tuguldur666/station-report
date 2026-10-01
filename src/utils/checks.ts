import { MAX_ULD_ROWS } from '../constants'
import type { ParsedReport, ReportCheck, ReportFormState, Uld } from '../types'
import { extractRemarkDgCodes } from './parse'

const toNumber = (value: string): number => Number(value) || 0

export function getVisibleDepartedUlds(
  report: ParsedReport | null,
  filter: ReportFormState['departedFilter'],
): Uld[] {
  if (!report) return []
  if (filter === 'B') return report.departingUlds.filter((u) => u.kind === 'B')
  return report.departingUlds
}

export function buildChecks(
  report: ParsedReport | null,
  form: ReportFormState,
  visibleDeparted: Uld[],
): ReportCheck[] {
  if (!report || !report.flightNumber) {
    return [
      {
        status: 'er',
        message: 'Nothing parsed yet. Paste the messages and press "Read messages".',
      },
    ]
  }

  const checks: ReportCheck[] = []
  const push = (status: ReportCheck['status'], message: string) =>
    checks.push({ status, message })

  const adults = report.adults ?? 0
  const children = report.children ?? 0
  const classC = report.classC ?? 0
  const classY = report.classY ?? 0
  const r2 = form.passengerRow2
  const r2Active = [
    r2.destination,
    r2.classC,
    r2.classY,
    r2.infants,
    r2.adults,
    r2.children,
    ...r2.zones,
  ].some((s) => s.trim() !== '')
  const extraAdults = toNumber(r2.adults)
  const extraChildren = toNumber(r2.children)
  const extraC = toNumber(r2.classC)
  const extraY = toNumber(r2.classY)
  const passengers = adults + children + extraAdults + extraChildren
  const cabinTotal = classC + classY + extraC + extraY
  const r2Note = r2Active ? ' (incl. second row)' : ''

  push(
    adults + children + extraAdults + extraChildren === cabinTotal ? 'ok' : 'er',
    `Passengers: ${adults + extraAdults} adults + ${children + extraChildren} children = ${passengers}; C ${classC + extraC} + Y ${classY + extraY} = ${cabinTotal}${r2Note}.`,
  )

  const zoneTotal =
    form.zones.reduce((sum, z) => sum + toNumber(z), 0) +
    r2.zones.reduce((sum, z) => sum + toNumber(z), 0)
  push(
    zoneTotal === cabinTotal ? 'ok' : 'er',
    `Zone total ${zoneTotal} ${zoneTotal === cabinTotal ? 'matches' : 'does not match'} passengers ${cabinTotal}${r2Note}.`,
  )

  push(
    !report.estimateTime || form.eta === report.estimateTime ? 'ok' : 'wn',
    `ETA on form ${form.eta} ${form.eta === report.estimateTime ? 'matches' : 'differs from'} MVT estimate ${report.estimateTime}.`,
  )

  const remained = toNumber(form.fuelRemained)
  const uplift = toNumber(form.fuelUplift)
  const block = toNumber(form.fuelBlock)
  push(
    remained + uplift === block ? 'ok' : 'er',
    `Fuel: remained + uplift = ${remained + uplift}; block fuel ${block}.`,
  )

  push(
    form.cargoPcs.trim() ? 'ok' : 'wn',
    form.cargoPcs.trim() ? 'Cargo pieces entered.' : 'Cargo pieces are blank.',
  )

  const mentioned = extractRemarkDgCodes(form.cargoRemarks)
  const missing = [...new Set(mentioned)].filter((c) => !report.dangerousGoods.includes(c))
  push(
    missing.length ? 'wn' : 'ok',
    missing.length
      ? `Cargo remarks list ${missing.join(', ')}, but the CPM shows only ${report.dangerousGoods.join(', ') || 'none'}.`
      : `Dangerous goods codes agree with the CPM (${report.dangerousGoods.join(', ') || 'none'}).`,
  )

  const net = (report.freightKg ?? 0) + (report.baggageKg ?? 0) + (report.mailKg ?? 0)
  const tare = (report.totalWeightKg ?? 0) - net
  push(
    'ok',
    `LDM gross ${report.totalWeightKg} kg - net ${net} kg = ${tare} kg implied ULD tare across ${report.departingUlds.length} ULDs.`,
  )

  const seats = report.seats ?? 0
  const loadFactor = seats ? ((passengers / seats) * 100).toFixed(0) : '0'
  push(
    report.departingUlds.length > 0 ? 'ok' : 'wn',
    `Bags: ${report.baggagePcs} pieces, ${report.baggageKg} kg. Load factor ${loadFactor}% of ${seats} seats.`,
  )

  push(
    visibleDeparted.length > MAX_ULD_ROWS
      ? 'er'
      : report.departingUlds.length !== visibleDeparted.length
        ? 'wn'
        : 'ok',
    `CPM has ${report.departingUlds.length} departing ULDs; ${visibleDeparted.length} will print (form has ${MAX_ULD_ROWS} rows).`,
  )

  return checks
}
