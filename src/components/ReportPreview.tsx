import { FORM_META, MAX_ULD_ROWS } from '../constants'
import type { ParsedReport, ReportFormState } from '../types'

interface ReportPreviewProps {
  report: ParsedReport | null
  form: ReportFormState
  departedUldIds: string[]
}

export function ReportPreview({ report, form, departedUldIds }: ReportPreviewProps) {
  const arriving = report?.arrivingUlds.map((u) => u.id) ?? []

  const rows = Array.from({ length: MAX_ULD_ROWS }, (_, i) => (
    <tr key={i}>
      <td style={{ background: '#ddd' }} />
      <td>{arriving[i] ?? ''}</td>
      <td>{departedUldIds[i] ?? ''}</td>
      <td style={{ background: '#ddd' }} />
      <td />
    </tr>
  ))

  return (
    <section className="card preview">
      <h2 className="no-print">Report preview</h2>
      <div className="form">
        <h3>
          <span>{FORM_META.title}</span>
          <span>{FORM_META.operator}</span>
        </h3>

        <table>
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

        <table>
          <tbody>
            <tr>
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
              <th>Delay Information</th>
              <td colSpan={5}>{form.delay}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
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
              <td>
                {report?.classY != null
                  ? `${report.classY}+${report.infants ?? 0}INF`
                  : ''}
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
              <th>Special passenger info</th>
              <td className="l" colSpan={9}>
                {form.specialPassengerInfo}
              </td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th rowSpan={2}>Baggage [Net weight]</th>
              <th colSpan={2}>Total</th>
              <th colSpan={2}>Excess bag</th>
              <th rowSpan={2}>Remarks</th>
            </tr>
            <tr>
              <th>Pcs</th>
              <th>Kgs</th>
              <th>Pcs</th>
              <th>Kgs</th>
            </tr>
            <tr>
              <td>{report?.destination}</td>
              <td>{report?.baggagePcs}</td>
              <td>{report?.baggageKg}</td>
              <td>{form.excessBagPcs}</td>
              <td>{form.excessBagKgs}</td>
              <td>{form.baggageRemarks}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Cargo [Net weight]</th>
              <th>Pcs</th>
              <th>Kgs</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <td>{report?.destination}</td>
              <td>{form.cargoPcs}</td>
              <td>{report?.freightKg}</td>
              <td>{form.cargoRemarks}</td>
            </tr>
            <tr>
              <th>Mail [Net weight]</th>
              <th>Pcs</th>
              <th>Kgs</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <td>{report?.destination}</td>
              <td />
              <td>{report?.mailKg}</td>
              <td>{report?.mailKg === 0 ? 'NIL' : ''}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Fuel</th>
              <th>Remained</th>
              <th>Uplift</th>
              <th>Trip fuel</th>
              <th>Block fuel</th>
              <th>Remarks</th>
            </tr>
            <tr>
              <td />
              <td>{form.fuelRemained}</td>
              <td>{form.fuelUplift}</td>
              <td>{form.fuelTrip}</td>
              <td>{form.fuelBlock}</td>
              <td>NIL</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Previous stock</th>
              <th>Arrived</th>
              <th>Departed</th>
              <th>Stock after flight</th>
              <th>Missing or damage info</th>
            </tr>
            {rows}
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th style={{ width: 110 }}>Other info</th>
              <td>{form.otherInfo}</td>
            </tr>
          </tbody>
        </table>

        <div className="ft">
          <span>
            Revision Date: {FORM_META.revisionDate}
            <br />
            Form No: {FORM_META.formNo}
          </span>
          <span>
            {FORM_META.department}
            <br />
            {FORM_META.departmentLine2}
          </span>
          <span>
            Revision by: {FORM_META.revisedBy}
            <br />
            Approved by: {FORM_META.approvedBy}
          </span>
        </div>
      </div>
    </section>
  )
}
