# User Acceptance Testing (UAT) Checklist
## PoC 21 â€“ Downtime Root Cause Explorer

**Project:** Infocreon Internship â€“ Downtime Root Cause Explorer
**Developer:** Niranjana T suresh
**PoC ID:** 21
**GitHub:** @niranjanats07
**Batch:** Batch8/MA College

---

## 1. UAT Summary

The application has completed the user acceptance tests listed below.

**UAT Status: PASS**

The application is considered ready for demonstration within the scope of the 18 completed and passed test cases.

A further two scenarios remain untested and are documented separately.

## 2. Test Environment

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Data processing: Pandas, DuckDB
- Visualization: Apache ECharts, Plotly, D3.js
- Data: Synthetic demonstration data
- Frontend URL: `http://localhost:3001`
- Backend URL: `http://localhost:8000`

## 3. Completed UAT Test Cases

| Test ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| UAT-001 | Open dashboard | Dashboard loads successfully | PASS |
| UAT-002 | KPI cards | KPI values display correctly | PASS |
| UAT-003 | Analytical charts | Charts display correctly | PASS |
| UAT-004 | Incident table | Incident records display correctly | PASS |
| UAT-005 | Browser refresh | Dashboard reloads successfully | PASS |
| UAT-006 | Cause Pareto chart | Root causes are visualized | PASS |
| UAT-007 | Frequency vs Duration chart | Incident frequency and duration are displayed | PASS |
| UAT-008 | Root Cause Tree | Root cause hierarchy is displayed | PASS |
| UAT-009 | Machine/Shift Heatmap | Machine and shift downtime values are displayed | PASS |
| UAT-010 | Chart tooltips | Tooltips display relevant chart information | PASS |
| UAT-011 | Incident investigation | Intelligence Panel opens for an incident | PASS |
| UAT-012 | Close Intelligence Panel | Panel closes successfully | PASS |
| UAT-013 | Loading state | Loading state is displayed appropriately | PASS |
| UAT-014 | API error handling | Backend/API errors are handled | PASS |
| UAT-015 | Backend communication | Frontend communicates with backend successfully | PASS |
| UAT-016 | Responsive layout | Layout works at a smaller viewport width | PASS |
| UAT-017 | Next.js production build | Production build completes successfully | PASS |
| UAT-018 | Production server startup | Production server starts successfully | PASS |

## 4. Pending / Untested Scenarios

| Test ID | Test Scenario | Status | Remarks |
|---|---|---|---|
| UAT-019 | Empty incident dataset | NOT TESTED | Empty-data behaviour has not been validated |
| UAT-020 | Accessibility | NOT TESTED | Dedicated accessibility validation has not been completed |

These two scenarios are outside the currently validated UAT scope and should not be interpreted as passed.

## 5. UAT Acceptance Criteria

The application is accepted for demonstration within the validated scope because:

- Dashboard loading and display were tested.
- KPI cards and analytical visualizations were tested.
- Incident investigation and Intelligence Panel interactions were tested.
- Backend communication was tested.
- Loading and API error handling were tested.
- A smaller viewport layout was tested.
- Production build and production server startup were tested.

## 6. Test Evidence

The PASS results in this checklist reflect the test outcomes reported by the developer.

Supporting screenshots, test outputs, or other evidence should be retained where available for review and demonstration.

## 7. Final UAT Decision

**Final Status: UAT PASS â€” WITHIN VALIDATED SCOPE**

The Downtime Root Cause Explorer has passed the 18 completed UAT test cases and is ready for demonstration within that validated scope.

UAT-019 (Empty incident dataset) and UAT-020 (Accessibility) remain untested. No PASS claim is made for these two scenarios.

---

**Developed by:** Niranjana T suresh
**PoC ID:** 21
**GitHub:** @niranjanats07
**Batch:** Batch8/MA College
**Infocreon Internship**
