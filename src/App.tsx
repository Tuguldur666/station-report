import { useMemo, useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { ChecksPanel } from './components/ChecksPanel'
import { DetailsForm } from './components/DetailsForm'
import { MessageInput } from './components/MessageInput'
import { ReportPreview } from './components/ReportPreview'
import { INITIAL_FORM_STATE, SAMPLE_MESSAGE } from './constants'
import type { ParsedReport, ReportFormState } from './types'
import { buildChecks, getVisibleDepartedUlds } from './utils/checks'
import { parseMessages } from './utils/parse'

export default function App() {
  const [rawMessages, setRawMessages] = useState(SAMPLE_MESSAGE)
  const [report, setReport] = useState<ParsedReport | null>(() =>
    parseMessages(SAMPLE_MESSAGE),
  )
  const [form, setForm] = useState<ReportFormState>(INITIAL_FORM_STATE)

  const patchForm = (patch: Partial<ReportFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }))

  const visibleDeparted = useMemo(
    () => getVisibleDepartedUlds(report, form.departedFilter),
    [report, form.departedFilter],
  )

  const checks = useMemo(
    () => buildChecks(report, form, visibleDeparted),
    [report, form, visibleDeparted],
  )

  const departedIds = useMemo(
    () => visibleDeparted.map((u) => u.id),
    [visibleDeparted],
  )

  const handleParse = () => setReport(parseMessages(rawMessages))

  const handleResetSample = () => {
    setRawMessages(SAMPLE_MESSAGE)
    setReport(parseMessages(SAMPLE_MESSAGE))
  }

  return (
    <>
      <AppHeader />
      <main className="layout">
        <div className="controls">
          <MessageInput
            value={rawMessages}
            onChange={setRawMessages}
            onParse={handleParse}
            onResetSample={handleResetSample}
          />
          <DetailsForm form={form} onChange={patchForm} onPrint={() => window.print()} />
        </div>
        <div>
          <ChecksPanel checks={checks} />
          <ReportPreview report={report} form={form} departedUldIds={departedIds} />
        </div>
      </main>
    </>
  )
}
