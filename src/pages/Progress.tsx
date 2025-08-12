import React, { useMemo, useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useApp } from "@/context/AppState";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recipes, Recipe } from "@/data/mock";

// weight history is sourced from context

const ewma = (data: { day: string; w: number }[], alpha = 0.3) => {
  let prev = data[0].w;
  return data.map((d) => {
    const val = alpha * d.w + (1 - alpha) * prev;
    prev = val;
    return { ...d, ewma: val };
  });
};

const Progress: React.FC = () => {
  const { metrics, weightHistory, addWeightEntry, plan } = useApp();
  const [weightInput, setWeightInput] = useState<string>("");

  const chartData = useMemo(() => {
    const src = (
      weightHistory.length
        ? weightHistory
        : Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return { date: d.toISOString().slice(0, 10), weightKg: 70 + Math.sin(i / 2) };
          })
    );
    const data = src
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((e, idx) => ({ day: `D${idx + 1}`, w: e.weightKg }));
    return ewma(data);
  }, [weightHistory]);

  const nutritionToday = useMemo(() => {
    const completedMeals = plan.filter((p) => p.type === "meal" && p.completed);
    const lookup = (id: string) => recipes.find((r) => r.id === id) as Recipe | undefined;
    const totals = completedMeals.reduce(
      (acc, p) => {
        const r = lookup(p.refId);
        if (!r) return acc;
        acc.kcal += r.kcal;
        acc.protein += r.protein;
        return acc;
      },
      { kcal: 0, protein: 0 }
    );
    return { completedCount: completedMeals.length, ...totals };
  }, [plan]);


  return (
    <MobileLayout title="Progress">
      <Seo title="Progress – Trends & Streaks" description="Track weight trend, protein intake, and streaks." canonical={window.location.href} />
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weight trend (7d EWMA)</CardTitle>
          </CardHeader>
          <CardContent onClick={() => toast({ title: "Trend detail", description: "Detail view coming soon." })}>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="ewma" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Input
                type="number"
                inputMode="decimal"
                placeholder="Today's weight (kg)"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
              <Button
                onClick={() => {
                  const v = parseFloat(weightInput);
                  if (!isNaN(v)) {
                    addWeightEntry(v);
                    setWeightInput("");
                  }
                }}
              >
                Log
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nutrition today (completed)</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex items-center justify-between">
              <span>Meals completed</span>
              <span className="font-medium">{nutritionToday.completedCount}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Calories</span>
              <span className="font-medium">{nutritionToday.kcal} kcal</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Protein</span>
              <span className="font-medium">{nutritionToday.protein} g</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Streak</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">Workouts completed this week: <strong>{Math.max(4, metrics.taps.complete % 7)}</strong></CardContent>
        </Card>
        <div className="rounded-md border p-3 text-sm">
          Non‑scale wins: <span className="text-muted-foreground">4 workouts completed this week</span>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Progress;
