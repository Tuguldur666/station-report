/**
 * Parsers for LDM / CPM / MVT plain-text messages.
 * Ported 1:1 from the `Station report builder.html` prototype.
 */

import type { ParsedReport, Uld } from '../types'

const ULD_PATTERN = /(\d\d[LRP])\/([A-Z]{3}\d{5}OM)\/[A-Z]{3}\/(\d+)\/?([A-Z])/g

function toHourMinute(compact: string): string {
  return `${compact.slice(0, 2)}:${compact.slice(2)}`
}

function parseUlds(block: string): Uld[] {
  return [...block.matchAll(ULD_PATTERN)].map((m) => ({
    position: m[1],
    id: m[2],
    weightKg: Number(m[3]),
    kind: m[4],
  }))
}

/**
 * Parse the combined message textarea.
 * CPM blocks are split into arriving vs departing by matching the
 * flight number from the LDM header.
 */
export function parseMessages(text: string): ParsedReport {
  const report: ParsedReport = {
    dangerousGoods: [],
    arrivingUlds: [],
    departingUlds: [],
  }

  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  let m: RegExpMatchArray | null

  m = text.match(/AA(\d{4})\/(\d{4})/)
  if (m) {
    report.landingTime = toHourMinute(m[1])
    report.onBlockTime = toHourMinute(m[2])
  }

  m = text.match(/AD(\d{4})\/(\d{4})\s+EA(\d{4})/)
  if (m) {
    report.offBlockTime = toHourMinute(m[1])
    report.takeOffTime = toHourMinute(m[2])
    report.estimateTime = toHourMinute(m[3])
  }

  m = text.match(/^(OM\d+)\/\d+\.(\w+)\.J(\d+)Y(\d+)/m)
  if (m) {
    report.flightNumber = m[1]
    report.registration = m[2]
    report.seats = Number(m[3]) + Number(m[4])
  }

  m = text.match(/^-([A-Z]{3})\.(\d+)\/(\d+)\/(\d+)\.\d+\.T(\d+)/m)
  if (m) {
    report.destination = m[1]
    report.adults = Number(m[2])
    report.children = Number(m[3])
    report.infants = Number(m[4])
    report.totalWeightKg = Number(m[5])
  }

  m = text.match(/PAX\/(\d+)\/(\d+)/)
  if (m) {
    report.classC = Number(m[1])
    report.classY = Number(m[2])
  }

  m = text.match(/FRE\s+(\d+)\s+BAG\s+(\d+)\s+POS\s+(\d+)/)
  if (m) {
    report.freightKg = Number(m[1])
    report.baggageKg = Number(m[2])
    report.mailKg = Number(m[3])
  }

  m = text.match(/CHECKED BAGGAGE PIECES\s+\w+\s+(.*)/)
  if (m) {
    report.baggagePcs = [...m[1].matchAll(/[A-Z]\/(\d+)/g)].reduce(
      (sum, x) => sum + Number(x[1]),
      0,
    )
  }

  // Dangerous-goods codes attached to CPM positions, e.g. "/C.RNG", ".RNG/…" or ".RNG" at end-of-line.
  // (Prototype only matched ".R.."+"/", missing the common EOL form — fixed here.)
  report.dangerousGoods = [...text.matchAll(/\.(R[A-Z]{2})(?=[/\s]|$)/g)].map((x) => x[1])

  for (const block of blocks) {
    if (!block.startsWith('CPM')) continue
    const flight = block.match(/OM\d+/)?.[0]
    const ulds = parseUlds(block)
    if (flight && flight === report.flightNumber) {
      report.departingUlds = ulds
    } else {
      report.arrivingUlds = ulds
    }
  }

  return report
}

/** Extract R.. dangerous-goods codes mentioned in the free-text cargo remarks. */
export function extractRemarkDgCodes(remarks: string): string[] {
  const fromWords = [...remarks.matchAll(/\b(R[A-Z]{2})\b/g)].map((x) => x[1])
  const known = remarks.match(/RNG|ROX|RFL|RCM|RRY|RCL|RFW|RPB|RMD|RCX|RGX/g) ?? []
  return [...new Set([...fromWords, ...known])]
}
