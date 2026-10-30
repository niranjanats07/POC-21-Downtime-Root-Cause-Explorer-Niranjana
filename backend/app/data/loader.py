from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[3]

DATA_FILE = (
    PROJECT_ROOT
    / "data"
    / "synthetic"
    / "downtime_incidents.csv"
)


def load_downtime_data():
    """Load and validate synthetic downtime incident records."""

    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_FILE}")

    df = pd.read_csv(DATA_FILE)

    required_columns = [
        "incident_id",
        "machine_id",
        "incident_date",
        "shift",
        "root_cause",
        "sub_cause",
        "downtime_minutes",
        "failure_frequency",
        "severity",
        "status",
        "description",
    ]

    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Dataset is missing columns: {', '.join(missing_columns)}"
        )

    df["downtime_minutes"] = pd.to_numeric(
        df["downtime_minutes"], errors="coerce"
    ).fillna(0)

    df["failure_frequency"] = pd.to_numeric(
        df["failure_frequency"], errors="coerce"
    ).fillna(0)

    return df