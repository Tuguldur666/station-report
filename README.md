# station-report

Station report builder — paste LDM/CPM/MVT text, validate, and print MIAT Form No. 10 (rev 15-Jul-2022).

Migrated from the single-file prototype `Station report builder.html` to a professional Vite + React + TypeScript structure. Prototype behavior and print layout are preserved.

## Stack

- Vite 5 + React 18 + TypeScript 5
- No UI framework — plain CSS with CSS variables (light/dark + print styles)

## Project structure

```
index.html                  # Vite entry
vite.config.ts
tsconfig.json / tsconfig.node.json
src/
  main.tsx                  # React bootstrap
  App.tsx                   # state + layout
  types.ts                  # ParsedReport, ReportFormState, Uld, checks
  constants.ts              # sample messages, initial form, Form No. 10 meta
  utils/
    parse.ts                # LDM/CPM/MVT parsing, DG-code extraction
    checks.ts               # validation rules, departed-ULD filtering
  components/
    AppHeader.tsx
    MessageInput.tsx        # step 1: paste messages
    DetailsForm.tsx         # step 2: manual fields
    ChecksPanel.tsx
    ReportPreview.tsx       # printable Form No. 10
  index.css                 # theme + form + print styles
Station report builder.html # legacy prototype (kept for reference)
```

## Run

Requires Node.js 20+ (not currently installed on this machine).

```powershell
npm install
npm run dev      # local dev
npm run build    # type-check + production build
npm run preview  # preview dist/
```

## Logic notes

- `parseMessages()` splits on blank lines, reads AA/AD-EA times, LDM header (`OM…/…J…Y…`), `-DEST.ad/ch/inf.T…`, `PAX`, `FRE/BAG/POS`, `CHECKED BAGGAGE PIECES`, and CPM ULDs. CPM blocks matching the LDM flight number become departing ULDs, others arriving.
- `buildChecks()` reproduces the prototype validations: pax totals, zone totals, ETA vs MVT, fuel balance, cargo pcs, DG-code agreement, tare math, load factor, and 13-row ULD limit.
- DG extraction was cleaned up: the prototype had dead vars and a precedence bug (`'R'+x.slice(1)==x`). Now uses `\b(R[A-Z]{2})\b` + known-code list, deduped.
- React state: raw textarea is uncontrolled until “Read messages”; all form fields re-render checks/preview live via `useMemo`.
