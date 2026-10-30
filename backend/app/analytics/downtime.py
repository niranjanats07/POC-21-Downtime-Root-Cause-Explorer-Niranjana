from app.data.loader import load_downtime_data


def calculate_downtime_by_cause():
    """Calculate downtime and cumulative percentage by root cause."""

    df = load_downtime_data()

    result = (
        df.groupby("root_cause")["downtime_minutes"]
        .sum()
        .reset_index()
    )

    result = result.sort_values(
        by="downtime_minutes",
        ascending=False
    )

    total_downtime = result["downtime_minutes"].sum()

    result["cumulative_downtime"] = (
        result["downtime_minutes"].cumsum()
    )

    result["cumulative_percentage"] = (
        result["cumulative_downtime"] / total_downtime * 100
    ).round(2)

    return result


def calculate_dashboard_kpis():
    """Calculate key dashboard metrics."""

    df = load_downtime_data()

    total_incidents = len(df)
    total_downtime = df["downtime_minutes"].sum()
    average_downtime = df["downtime_minutes"].mean()

    closed_incidents = df[df["status"] == "Closed"]

    mttr = (
        closed_incidents["downtime_minutes"].mean()
        if not closed_incidents.empty
        else 0
    )

    return {
        "total_incidents": int(total_incidents),
        "total_downtime_minutes": int(total_downtime),
        "average_downtime_minutes": round(
            float(average_downtime), 2
        ),
        "mttr_minutes": round(float(mttr), 2)
    }


def calculate_downtime_by_machine():
    """Calculate downtime for each machine."""

    df = load_downtime_data()

    result = (
        df.groupby("machine_id")["downtime_minutes"]
        .sum()
        .reset_index()
    )

    result = result.sort_values(
        by="downtime_minutes",
        ascending=False
    )

    return result


def calculate_machine_shift_heatmap():
    """Calculate downtime for each machine and shift."""

    df = load_downtime_data()

    result = (
        df.pivot_table(
            index="machine_id",
            columns="shift",
            values="downtime_minutes",
            aggfunc="sum",
            fill_value=0
        )
    )

    return result