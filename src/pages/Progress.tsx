import React, { useMemo } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useApp } from "@/context/AppState";
import { toast } from "@/hooks/use-toast";

const genWeights = () => {
  // 10 days sample
  const base = 70;
  return Array.from({ length: 10 }).map((_, i) => ({ day: `D${i+1}`, w: base + Math.sin(i/2) }));
};

const ewma = (data: { day: string; w: number }[], alpha = 0.3) => {
  let prev = data[0].w;
  return data.map((d) => {
    const val = alpha * d.w + (1 - alpha) * prev;
    prev = val;
    return { ...d, ewma: val };
  });
};

const Progress: React.FC = () => {
  const { metrics } = useApp();
  const data = useMemo(() => ewma(genWeights()), []);

  return (
    <MobileLayout title="Progress">
      <Seo title="Progress – Trends & Streaks" description="Track weight trend, protein intake, and streaks." canonical={window.location.href} />
      <div className="space-y-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weight trend (7d EWMA)</CardTitle>
          </CardHeader>
          <CardContent className="h-36" onClick={() => toast({ title: "Trend detail", description: "Detail view coming soon." })}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={[66, 74]} />
                <Line type="monotone" dataKey="ewma" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Protein intake</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Placeholder chart • Tap to view soon</CardContent>
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
