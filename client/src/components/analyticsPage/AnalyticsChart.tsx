import type { JSX } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const METRIC_COLORS: Record<string, string> = {
  served: "#22c55e",
  declaredAbsent: "#f59e0b",
  noShow: "#ef4444",
};

const MEAL_STYLES: Record<string, string> = {
  breakfast: "0",
  lunch: "5 5",
  snacks: "2 2",
  dinner: "8 4",
};

export default function AnalyticsChart({
  daily,
  metrics, // array → ["served", "declaredAbsent"]
  meals,   // array → ["breakfast", "lunch"] | null
}: {
  daily: any[];
  metrics: string[];
  meals: string[] | null;
}) {
  if (!daily?.length) return null;

  /* ---------------- BUILD DATA ---------------- */
  const chartData = daily.map((d) => {
    const row: any = { date: d.date };

    metrics.forEach((metric) => {
      if (!meals || meals.length === 0) {
        row[metric] = d.totals?.[metric] || 0;
      } else {
        meals.forEach((meal) => {
          row[`${meal}_${metric}`] =
            d.meals?.[meal]?.[metric] || 0;
        });
      }
    });

    return row;
  });
  const formatDayDate = (dateStr: string) => {
  const d = new Date(dateStr);

  const day = d.toLocaleDateString("en-US", {
    weekday: "short",
  });

  const date = d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return `${day} ${date}`;
};


  /* ---------------- LINES ---------------- */
  const lines: JSX.Element[] = [];

  metrics.forEach((metric) => {
    if (!meals || meals.length === 0) {
      lines.push(
        <Line
          key={metric}
          type="monotone"
          dataKey={metric}
          stroke={METRIC_COLORS[metric]}
          strokeWidth={2.5}
          dot={false}
          name={metric.replace(/([A-Z])/g, " $1")}
        />
      );
    } else {
      meals.forEach((meal) => {
        lines.push(
          <Line
            key={`${meal}_${metric}`}
            type="monotone"
            dataKey={`${meal}_${metric}`}
            stroke={METRIC_COLORS[metric]}
            strokeWidth={2}
            strokeDasharray={MEAL_STYLES[meal]}
            dot={false}
            name={`${meal} • ${metric}`}
          />
        );
      });
    }
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="rounded-2xl border bg-card p-4">
      <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
        Attendance Trends
      </h3>
<div className="text-black dark:text-white">
     <ResponsiveContainer width="100%" height={340}>
  <LineChart data={chartData}>
   <XAxis
  dataKey="date"
  type="category"
  tickFormatter={formatDayDate}
  tick={{
    fill: "currentColor",
    fontSize: 12,
    fontWeight: 600,
  }}
  width={80}
/>

<YAxis
  tick={{
    fill: "currentColor",
    fontSize: 12,
  }}
/>




    <Tooltip
      content={<CustomTooltip />}
      wrapperStyle={{ zIndex: 50 }}
    />

    <Legend
      wrapperStyle={{
        fontSize: 12,
        color: "hsl(var(--foreground))",
      }}
    />

    {lines}
  </LineChart>
</ResponsiveContainer>
</div>

    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const date = new Date(label).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div
      className="
        rounded-xl border
        bg-background
        px-4 py-3
        shadow-2xl
        text-sm
      "
      style={{
        borderColor: "hsl(var(--border))",
        color: "hsl(var(--foreground))",
      }}
    >
      <p className="mb-2 font-semibold">{date}</p>

      <div className="space-y-1">
        {payload.map((p: any) => (
          <div
            key={p.dataKey}
            className="flex items-center justify-between gap-4"
          >
            <span
              className="capitalize"
              style={{ color: p.stroke }}
            >
              {p.name}
            </span>
            <span className="font-medium">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

