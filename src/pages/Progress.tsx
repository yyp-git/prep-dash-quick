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
import { useNavigate } from "react-router-dom";

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
  const { metrics, weightHistory, addWeightEntry, plan, isGuest, nutritionHistory } = useApp();
  const [weightInput, setWeightInput] = useState<string>("");
  const navigate = useNavigate();

  if (isGuest) {
    return (
      <MobileLayout title="Progress">
        <Seo title="Progress – Sign in required" description="Sign up or log in to view your trends and history." canonical={window.location.href} />
        <div className="rounded-md border p-4 text-sm">
          Sign up or log in to access Progress features.
          <div className="mt-2"><Button onClick={() => navigate("/auth")}>Sign up / Log in</Button></div>
        </div>
      </MobileLayout>
    );
  }

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
    const s = ewma(data);
    return s.map((d) => ({ ...d, pop: 72 }));
  }, [weightHistory]);

  const baseDays = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    return days;
  }, [nutritionHistory]);

  const calData = useMemo(() => {
    return baseDays.map((date, idx) => {
      const entry = nutritionHistory.find((e) => e.date === date);
      return { day: `D${idx + 1}`, user: entry?.net ?? 0, pop: 2000 };
    });
  }, [baseDays, nutritionHistory]);

  const proteinData = useMemo(() => {
    return baseDays.map((date, idx) => {
      const entry = nutritionHistory.find((e) => e.date === date);
      return { day: `D${idx + 1}`, user: entry?.protein ?? 0, pop: 80 };
    });
  }, [baseDays, nutritionHistory]);

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
            <CardTitle className="text-base">Weight trend (7d EWMA vs. population)</CardTitle>
          </CardHeader>
          <CardContent onClick={() => toast({ title: "Trend detail", description: "Detail view coming soon." })}>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="ewma" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pop" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
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
            <CardTitle className="text-base">Calories trend (completed vs. avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="user" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pop" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Protein trend (completed vs. avg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={proteinData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <Line type="monotone" dataKey="user" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pop" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
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
