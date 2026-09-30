export interface Uld {
  /** Hold position, e.g. "11P", "22L". */
  position: string
  /** ULD id, e.g. "PMC20070OM". */
  id: string
  /** Net weight in kg. */
  weightKg: number
  /** Single-letter kind from CPM (B = baggage, C = cargo, …). */
  kind: string
}

export interface ParsedReport {
  flightNumber?: string
  registration?: string
  seats?: number
  destination?: string
  adults?: number
  children?: number
  infants?: number
  /** LDM gross weight (T value). */
  totalWeightKg?: number
  classC?: number
  classY?: number
  freightKg?: number
  baggageKg?: number
  mailKg?: number
  baggagePcs?: number
  dangerousGoods: string[]
  landingTime?: string
  onBlockTime?: string
  offBlockTime?: string
  takeOffTime?: string
  estimateTime?: string
  arrivingUlds: Uld[]
  departingUlds: Uld[]
}

export type DepartedFilter = 'B' | 'A'

export interface ReportFormState {
  date: string
  manager: string
  doorClose: string
  eta: string
  delay: string
  zones: [string, string, string, string]
  specialPassengerInfo: string
  excessBagPcs: string
  excessBagKgs: string
  baggageRemarks: string
  cargoPcs: string
  cargoRemarks: string
  fuelRemained: string
  fuelUplift: string
  fuelTrip: string
  fuelBlock: string
  departedFilter: DepartedFilter
  otherInfo: string
}

export type CheckStatus = 'ok' | 'wn' | 'er'

export interface ReportCheck {
  status: CheckStatus
  message: string
}
