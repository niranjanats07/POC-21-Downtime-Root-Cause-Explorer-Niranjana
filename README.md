# POC-21: Downtime Root Cause Explorer

**Infocreon Internship Project**

An interactive dashboard for exploring machinery downtime incidents, identifying root causes, and analysing machine performance.

## Features

- View downtime incidents and key performance indicators.
- Filter incidents by machine.
- Explore downtime using interactive charts.
- Investigate incident details through the Intelligence Panel.
- Export filtered incident data as CSV or JSON.
- View project and developer information.

## Technology Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS  
**Backend:** FastAPI, Python, Pandas, DuckDB  
**Visualisation:** Apache ECharts, Plotly, D3.js  
**Tables:** TanStack Table

## Project Structure

```text
POC-21/
├── backend/
├── data/
├── frontend/
├── .gitignore
├── README.md
├── UAT_CHECKLIST.md
└── VAR_REPORT.md
```

## Running the Project

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

## Developer Details

- **Developed by:** Niranjana T suresh
- **PoC ID:** 21
- **GitHub:** [niranjanats07](https://github.com/niranjanats07)
- **Batch:** Batch8/MA College
- **Organisation:** Infocreon Internship

---

*Downtime Root Cause Explorer — Machinery & Asset Utilization*