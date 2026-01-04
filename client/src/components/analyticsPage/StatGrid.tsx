import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MetricKey } from "@/components/analyticsPage/AnalyticsFilters";

const METRIC_META: Record<
  MetricKey | "foodWaste",
  { label: string; color: string }
> = {
  served: {
    label: "Served",
    color: "emerald",
  },
  declaredAbsent: {
    label: "Declared Absent",
    color: "amber",
  },
  noShow: {
    label: "No Show",
    color: "red",
  },
  foodWaste: {
    label: "Food Waste",
    color: "rose",
  },
};

export default function StatGrid({
  totals,
  selectedMetrics,
  onToggleMetric,
}: {
  totals: any;
  selectedMetrics: MetricKey[];
  onToggleMetric: (metric: MetricKey) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {(Object.keys(METRIC_META) as Array<
        keyof typeof METRIC_META
      >).map((key) => {
        const meta = METRIC_META[key];
        const active =
          key !== "foodWaste" &&
          selectedMetrics.includes(key as MetricKey);

        return (
          <Card
            key={key}
            onClick={() => {
              if (key !== "foodWaste") {
                onToggleMetric(key as MetricKey);
              }
            }}
            className={cn(
              "cursor-pointer transition-all rounded-2xl hover:shadow-md",
              active
                ? `ring-2 ring-${meta.color}-500 bg-${meta.color}-50/40 dark:bg-${meta.color}-500/10`
                : "opacity-80 hover:opacity-100"
            )}
          >
            <CardContent className="p-4 text-center space-y-1">
              <p className="text-sm text-muted-foreground">
                {meta.label}
              </p>
              <p
                className={cn(
                  "text-2xl font-semibold",
                  active &&
                    `text-${meta.color}-600 dark:text-${meta.color}-400`
                )}
              >
                {totals[key]}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
