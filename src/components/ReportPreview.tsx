import logoUrl from '../assets/miat-logo.png'
import { FORM_META } from '../constants'
import type { ParsedReport, ReportFormState } from '../types'

interface ReportPreviewProps {
  report: ParsedReport | null
  form: ReportFormState
  departedUldIds: string[]
}

/** Column widths in px — ported 1:1 from the prototype's `tb()` colgroups. */
function Cols({ widths }: { widths: number[] }) {
  const total = widths.reduce((sum, w) => sum + w, 0)
  return (
    <colgroup>
      {widths.map((w, i) => (
        <col key={i} style={{ width: `${((w / total) * 100).toFixed(2)}%` }} />
      ))}
    </colgroup>
  )
}

/** N gray placeholder cells, like the prototype's `G(n)` helper. */
function GrayCells({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <td key={i} className="g" />
      ))}
    </>
  )
}

/** ULD id list stacked with line breaks, like the prototype's `.join('<br>')`. */
function UldList({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id, i) => (
        <span key={i}>
          {id}
          <br />
        </span>
      ))}
    </>
  )
}

const PAX_WIDTHS = [70, 70, 51.5, 51.5, 51.5, 51.5, 51.5, 51.5, 51.5, 51.5, 51.5]
const REMARKS_WIDTHS = [70, 70, 77, 78, 309]

/**
 * Printable Form No. 10 — markup ported 1:1 from the
 * `Station report builder.html` prototype's `pv()` function.
 */
const isNil = (value: string | null | undefined) =>
  (value ?? '').trim().toUpperCase() === 'NIL';

export function ReportPreview({ report, form, departedUldIds }: ReportPreviewProps) {
  const arriving = report?.arrivingUlds.map((u) => u.id) ?? []
  const mailKg = report?.mailKg
  const p2 = form.passengerRow2
  const b2 = form.baggageRow2
  const p2y = p2.classY ? `${p2.classY}${p2.infants ? `+${p2.infants}INF` : ''}` : ''

  return (
    <section className="card preview">
      <h2 className="no-print">Report preview</h2>
      <div className="form">
        <div className="hd">
          <span>All times in UTC</span>
          <b>STATION REPORT</b>
          <span style={{ textAlign: 'right' }}>
            <img alt="MIAT Mongolian Airlines" src={logoUrl} />
          </span>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[140, 155, 154, 155]} />
            <tbody>
              <tr>
                <th>Date</th>
                <th>Flight Number</th>
                <th>A/C Registration</th>
                <th>Station Manager</th>
              </tr>
              <tr>
                <td>{form.date}</td>
                <td>{report?.flightNumber}</td>
                <td>{report?.registration}</td>
                <td>{form.manager}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[70, 70, 78, 77, 78, 76, 78, 77]} />
            <tbody>
              <tr>
                <th colSpan={2} rowSpan={2}>
                  Times
                </th>
                <th>Landing</th>
                <th>On block</th>
                <th>Door close</th>
                <th>Off block</th>
                <th>Take off</th>
                <th>ETA</th>
              </tr>
              <tr>
                <td>{report?.landingTime}</td>
                <td>{report?.onBlockTime}</td>
                <td>{form.doorClose}</td>
                <td>{report?.offBlockTime}</td>
                <td>{report?.takeOffTime}</td>
                <td>{form.eta}</td>
              </tr>
              <tr>
                <th colSpan={2}>Delay Information</th>
                <td colSpan={6} className={isNil(form.delay) ? 'nil' : ''}>
                  {form.delay}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={PAX_WIDTHS} />
            <tbody>
              <tr>
                <th rowSpan={5}>Passenger</th>
                <th rowSpan={2}>Destination</th>
                <th colSpan={2}>Class</th>
                <th rowSpan={2}>Adult</th>
                <th rowSpan={2}>Child</th>
                <th rowSpan={2}>Infant</th>
                <th colSpan={4}>Passenger distribution</th>
              </tr>
              <tr>
                <th>C</th>
                <th>Y</th>
                <th>0A</th>
                <th>0B</th>
                <th>0C</th>
                <th>0D</th>
              </tr>
              <tr>
                <td>{report?.destination}</td>
                <td>{report?.classC}</td>
                <td style={{ fontSize: 9 }}>
                  {report?.classY != null ? `${report.classY}+${report.infants ?? 0}INF` : ''}
                </td>
                <td>{report?.adults}</td>
                <td>{report?.children}</td>
                <td>{report?.infants}</td>
                <td>{form.zones[0]}</td>
                <td>{form.zones[1]}</td>
                <td>{form.zones[2]}</td>
                <td>{form.zones[3]}</td>
              </tr>
              <tr>
                <td>{p2.destination}</td>
                <td>{p2.classC}</td>
                <td style={{ fontSize: 9 }}>{p2y}</td>
                <td>{p2.adults}</td>
                <td>{p2.children}</td>
                <td>{p2.infants}</td>
                <td>{p2.zones[0]}</td>
                <td>{p2.zones[1]}</td>
                <td>{p2.zones[2]}</td>
                <td>{p2.zones[3]}</td>
              </tr>
              <tr>
                <td className="g">Total</td>
                <GrayCells count={9} />
              </tr>
              <tr className="sp">
                <th colSpan={2}>Special passenger info</th>
                <td colSpan={9} className={isNil(form.specialPassengerInfo) ? 'nil' : 'l'}>
                  {form.specialPassengerInfo}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[70, 70, 51.5, 51.5, 51.5, 51.5, 257]} />
            <tbody>
              <tr>
                <th rowSpan={5}>
                  Baggage
                  <br />
                  [Net weight]
                </th>
                <th rowSpan={2}>Destination</th>
                <th colSpan={2}>Total</th>
                <th colSpan={2}>Excess bag</th>
                <th>Remarks</th>
              </tr>
              <tr>
                <th>Pcs</th>
                <th>Kgs</th>
                <th>Pcs</th>
                <th>Kgs</th>
                <td rowSpan={4} className={isNil(form.baggageRemarks) ? 'nil' : 'l'}>
                  {form.baggageRemarks}
                </td>
              </tr>
              <tr>
                <td>{report?.destination}</td>
                <td>{report?.baggagePcs}</td>
                <td>{report?.baggageKg}</td>
                <td style={{ fontSize: 9 }}>{form.excessBagPcs}</td>
                <td>{form.excessBagKgs}</td>
              </tr>
              <tr>
                <td>{b2.destination}</td>
                <td>{b2.pcs}</td>
                <td>{b2.kgs}</td>
                <td style={{ fontSize: 9 }}>{b2.excessPcs}</td>
                <td>{b2.excessKgs}</td>
              </tr>
              <tr>
                <td className="g">Total</td>
                <GrayCells count={4} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={REMARKS_WIDTHS} />
            <tbody>
              <tr>
                <th rowSpan={5}>
                  Cargo
                  <br />
                  [Net weight]
                </th>
                <th rowSpan={2}>Destination</th>
                <th colSpan={2}>Total</th>
                <th>Remarks</th>
              </tr>
              <tr>
                <th>Pcs</th>
                <th>Kgs</th>
                <td rowSpan={4} className={isNil(form.cargoRemarks) ? 'nil' : 'l'}>
                  {form.cargoRemarks}
                </td>
              </tr>
              <tr>
                <td>{report?.destination}</td>
                <td>{form.cargoPcs}</td>
                <td>{report?.freightKg}</td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td className="g">Total</td>
                <GrayCells count={2} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={REMARKS_WIDTHS} />
            <tbody>
              <tr>
                <th rowSpan={5}>
                  Mail
                  <br />
                  [Net weight]
                </th>
                <th rowSpan={2}>Destination</th>
                <th colSpan={2}>Total</th>
                <th>Remarks</th>
              </tr>
              <tr>
                <th>Pcs</th>
                <th>Kgs</th>
                <td rowSpan={4} className={mailKg === 0 ? 'nil' : 'l'}>
                  {mailKg === 0 ? 'NIL' : ''}
                </td>
              </tr>
              <tr>
                <td>{report?.destination}</td>
                <td />
                <td>{mailKg}</td>
              </tr>
              <tr>
                <td />
                <td />
                <td />
              </tr>
              <tr>
                <td className="g">Total</td>
                <GrayCells count={2} />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[70, 70, 77, 78, 78, 76, 155]} />
            <tbody>
              <tr>
                <th rowSpan={2}>Fuel</th>
                <th>Remained</th>
                <th>Uplift</th>
                <th>Trip fuel</th>
                <th>Block fuel</th>
                <th>Fuel price</th>
                <th>Remarks</th>
              </tr>
              <tr>
                <td>{form.fuelRemained}</td>
                <td>{form.fuelUplift}</td>
                <td>{form.fuelTrip}</td>
                <td>{form.fuelBlock}</td>
                <td />
                <td className="nil">NIL</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[70, 122, 103, 103, 102, 104]} />
            <tbody>
              <tr>
                <th rowSpan={2}>ULD info</th>
                <th>Previous stock</th>
                <th>Arrived</th>
                <th>Departed</th>
                <th>Stock after flight</th>
                <th>
                  Missing or
                  <br />
                  damage info
                </th>
              </tr>
              <tr>
                <td className="u" />
                <td className="u">
                  <UldList ids={arriving} />
                </td>
                <td className="u">
                  <UldList ids={departedUldIds} />
                </td>
                <td className="u" />
                <td className="u" />
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bx">
          <table>
            <Cols widths={[70, 534]} />
            <tbody>
              <tr>
                <th>Other info</th>
                <td className={`oi ${isNil(form.otherInfo) ? 'nil' : 'l'}`}>{form.otherInfo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="ft">
          <span>
            Revision Date: {FORM_META.revisionDate}
            <br />
            Form No: {FORM_META.formNo}
          </span>
          <span style={{ textAlign: 'center' }}>
            {FORM_META.department}
            <br />
            {FORM_META.departmentLine2}
          </span>
          <span style={{ textAlign: 'right' }}>
            Revision by: {FORM_META.revisedBy}
            <br />
            Approved by: {FORM_META.approvedBy}
          </span>
        </div>
      </div>
    </section>
  )
}
