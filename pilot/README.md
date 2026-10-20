# Kish Strategy Execution — Perdoo-inspired Pilot

Public preview: https://hassnboudlaie.github.io/kish-ports-airports-strategy/pilot/

## Scope and isolation
- Independent `pilot/` route on existing GitHub Pages repository. The published parent app files are unchanged.
- Based on the 13 strategic objectives, six proposed pillars and 18 health KPIs already defined in the standalone Strategy Execution app.
- **Important source-coverage gap**: this standalone app represents **42 named KR labels**, whereas the separate full Kish OKR workspace contains **53 document-derived KRs**. Do not represent the simplified pilot as the complete authorized strategy record or silently invent the missing 11.
- A link to the full OKR workspace is provided from the Pilot hub.
- No baseline, current performance, target, owner or approval status is fabricated.
- Local storage uses isolated keys `kish-pilot-base-*` and `kish_perdoo_pilot_data_v1`. The parent production frontend and any central backend/authentication are unchanged.
- **Not a multiuser organization platform**. Users should not enter sensitive or confidential operational data here; the browser stores local clear-text workspace entries.
- JSON export/import is an explicit local transfer operation; there is no cross-device automatic synchronization.

## Implemented workflow
1. Choose a focus cycle and 1–5 strategic objectives.
2. Select a strategic KR and record a numeric baseline, target and current value. The progress formula is `clamp(100*(current-baseline)/(target-baseline),0,100)`. Targets may represent increases or decreases; baseline and target must differ.
3. Record a risk status, owner, source note, and time-stamped numerical check-in. KPI data is kept separate from deliverables.
4. Create, complete, reopen or remove execution tasks linked to a strategic objective and optionally a KR.
5. Record management reviews; if a related objective and next action are entered, create a follow-up task.
6. Inspect live pilot counters, active goals, tracked KR coverage and past-due tasks.
7. Export/import JSON backups. Import validates the edition marker and basic schema and asks before overwriting browser data.

## QA
- File publication verified through public URL; all three GitHub files exist.
- JavaScript parsed with V8 function compiler; static checks validated HTML asset paths, separate storage keys and 13 objective definitions.
- Live browser QA (2026-10-20): home and navigation, two selected objectives, save cycle, numeric KR check-in (100 → 75 versus target 50 computes 50%), create a synthetic task, and dashboard totals (2 active objectives, 1 measured KR, 50% average progress, 0 overdue) passed.
- Browser automation confirmed save/read within the same session. Separate post-refresh and second-device tests are not independently certified.
- Meeting form, backup import/export, direct-link deep navigation on Android, and mobile visual polish require additional real-browser QA.

## Proposed next development
1. Replace the pilot's 42-KR simplified source with the immutable **53 document-derived KRs** from the full workspace, retaining exact formula, unit and source page references. Conduct a source-to-interface reconciliation first.
2. Implement managed cycle activation, department-to-company alignments, approval workflow and governance.
3. Deploy a secure centrally backed workspace before inviting real users. RBAC, durable database, audit logs, device synchronization and HTTPS backend must be validated.
4. Extend weekly executive review with evidence provenance, data freshness, trend charts, exportable executive reports and meeting follow-through.
