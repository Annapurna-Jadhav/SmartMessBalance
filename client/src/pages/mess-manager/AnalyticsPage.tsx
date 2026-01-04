import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { getMessAnalyticsSummary } from "@/api/mess.api";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import AnalyticsAIBox from "@/components/analyticsPage/AnalyticsAiBox";
import AnalyticsChart from "@/components/analyticsPage/AnalyticsChart";
import AnalyticsFilters, {type
  MetricKey,
 type  MealKey,
} from "@/components/analyticsPage/AnalyticsFilters";
import DateRangePicker from "@/components/analyticsPage/DateRangePicker";
import StatGrid from "@/components/analyticsPage/StatGrid";

export default function AnalyticsPage() {
  const [data, setData] = useState<{ range?: any; daily?: any; totals?: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastValidTotals, setLastValidTotals] = useState<any>(null);
const [rangeWarning, setRangeWarning] = useState<string | null>(null);


  // ✅ SINGLE SOURCE OF TRUTH
  const [metrics, setMetrics] = useState<MetricKey[]>(["served"]);
 const [meals, setMeals] = useState<MealKey[]>(["breakfast"]);


  const [dateRange, setDateRange] = useState<{
    from?: string;
    to?: string;
  }>({});

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await getMessAnalyticsSummary(30);
    setData(res.data);

    if (res.data.totals) {
      setLastValidTotals(res.data.totals);
    }

    setRangeWarning(null);
  } catch {
    setError("Failed to load analytics");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- DATE RANGE LOAD ---------------- */
  const loadRangeAnalytics = async () => {
  if (!dateRange.from || !dateRange.to) return;

  try {
    setLoading(true);
    setError(null);

    const res = await axiosClient.get(
      "/mess-manager/analytics",
      {
        params: {
          fromDate: dateRange.from,
          toDate: dateRange.to,
        },
      }
    );

    setData((prev: any) => ({
      ...prev,
      range: res.data.data.range,
      daily: res.data.data.daily,
      totals: res.data.data.totals || prev?.totals || null,
    }));

    if (!res.data.data.totals) {
      setRangeWarning(
        "Stats are not available for this date range. Try selecting a shorter or recent range."
      );
    } else {
      setLastValidTotals(res.data.data.totals);
      setRangeWarning(null);
    }

  } catch {
    setRangeWarning(
      "No data available for this date range. Please select a different range."
    );
  } finally {
    setLoading(false);
  }
};

  /* ---------------- METRIC TOGGLE FROM STAT GRID ---------------- */
  
  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-[320px] w-full" />
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error) {
    return (
      <Card className="max-w-xl mx-auto text-center">
        <CardContent className="py-8 space-y-2">
          <p className="text-destructive font-medium">
            {error}
          </p>
          <p className="text-sm text-muted-foreground">
            Try changing the date range.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!data || !data.daily?.length) {
    return (
      <Card className="max-w-xl mx-auto text-center">
        <CardContent className="py-8 space-y-2">
          <p className="font-medium">
            No analytics available
          </p>
          <p className="text-sm text-muted-foreground">
            Select a different date range.
          </p>
        </CardContent>
      </Card>
    );
  }

  /* ---------------- MAIN UI ---------------- */
  return (
    <div className="relative min-h-screen bg-background px-6 py-6 space-y-10">
      {/* ---------- HEADER ---------- */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Mess Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Combine metrics and meals to uncover trends and inefficiencies.
        </p>
      </div>

      {/* ---------- CONTROLS ---------- */}
      <div
        className="
       sticky top-4 z-10
backdrop-blur-md bg-background/80
border border-border/50

        rounded-2xl px-4 py-3
        flex flex-wrap gap-4 items-end
        shadow-sm
      "
      >
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onApply={loadRangeAnalytics}
        />

        <AnalyticsFilters
          metrics={metrics}
          setMetrics={setMetrics}
          meals={meals}
          setMeals={setMeals}
        />
      </div>

      {/* ---------- STATS ---------- */}

      <div className="
  rounded-2xl
  border
  bg-card
  p-4
  shadow-sm
">
   <StatGrid
  totals={data.totals || lastValidTotals}
  selectedMetrics={metrics}
  onToggleMetric={(m) =>
    setMetrics((prev) =>
      prev.includes(m as MetricKey)
        ? prev.filter((x) => x !== m)
        : [...prev, m as MetricKey]
    )
  }
/>

{rangeWarning && (
  <p className="mt-2 text-sm text-muted-foreground">
    {rangeWarning}
  </p>
)}



</div>


      {/* ---------- CHART ---------- */}
      <div className="relative h-[340px] w-full">
       <AnalyticsChart
  daily={data.daily}
  metrics={metrics}
  meals={meals.length ? (meals as string[]) : null}
/>

      </div>

      
     {/* ---------- AI COPILOT ---------- */}
<section
  className="
    mt-12
    pt-8
    border-t
    border-border/60
    space-y-4
  "
>
  <div className="space-y-1">
    
  </div>

  <AnalyticsAIBox />
</section>

    </div>
  );
}
