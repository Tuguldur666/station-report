interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onParse: () => void
  onResetSample: () => void
}

export function MessageInput({ value, onChange, onParse, onResetSample }: MessageInputProps) {
  return (
    <section className="card">
      <h2>1. Paste messages</h2>
      <textarea
        aria-label="LDM, CPM and MVT messages"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="button-row">
        <button type="button" onClick={onParse}>
          Read messages
        </button>
        <button type="button" className="secondary" onClick={onResetSample}>
          Reset sample
        </button>
      </div>
    </section>
  )
}
