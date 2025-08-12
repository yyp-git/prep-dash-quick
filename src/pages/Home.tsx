import React, { useMemo, useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { useApp } from "@/context/AppState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { recipes, exercises, Recipe, Exercise } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UpsellDialog } from "@/components/common/UpsellDialog";

const Home: React.FC = () => {
  const { plan, isGuest, swapItem, recordTap } = useApp();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [upsell, setUpsell] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const activeItem = useMemo(() => plan.find((p) => p.id === openFor), [openFor, plan]);
  const pool = useMemo(() => {
    if (!activeItem) return [] as (Recipe | Exercise)[];
    if (activeItem.type === "meal") return recipes.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    return exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeItem, query]);

  const onStart = () => {
    if (isGuest) {
      setUpsell(true);
      return;
    }
    recordTap("start");
    toast({ title: "Let's go!", description: "Timer started (mock)." });
  };

  const onComplete = () => {
    recordTap("complete");
    toast({ title: "Completed", description: "Nice work!" });
  };

  return (
    <MobileLayout title="Today's Plan">
      <Seo title="Home – Meal & Workout Plan" description="3 meals + 1 workout tailored to your time and gear." canonical={window.location.href} />

      <UpsellDialog open={upsell} onOpenChange={setUpsell} />

      <div className="space-y-3">
        {plan.length === 0 && (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            No plan yet. Go to Onboarding to generate one.
            <div className="mt-2"><Button onClick={() => navigate("/onboarding")}>Start Onboarding</Button></div>
          </div>
        )}

        {plan.map((p) => {
          const isMeal = p.type === "meal";
          const ref = isMeal ? recipes.find((r) => r.id === p.refId)! : exercises.find((e) => e.id === p.refId)!;
          return (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-base flex justify-between">
                  <span>{isMeal ? (ref as Recipe).name : (ref as Exercise).name}</span>
                  <span className="text-sm text-muted-foreground">{isMeal ? `${(ref as Recipe).kcal} kcal / ${(ref as Recipe).protein}g P` : `${(ref as Exercise).durationMin} min`}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" onClick={onStart}>Start</Button>
                <Dialog open={openFor === p.id} onOpenChange={(o) => setOpenFor(o ? p.id : null)}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="secondary" onClick={() => setOpenFor(p.id)}>Swap</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Swap {isMeal ? "meal" : "workout"}</DialogTitle>
                    </DialogHeader>
                    <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <div className="max-h-64 overflow-auto mt-2 space-y-2">
                      {pool.map((item) => (
                        <button key={item.id} className="w-full border rounded p-2 text-left hover:bg-muted"
                          onClick={() => {
                            swapItem(p.id, { type: p.type, refId: item.id });
                            setOpenFor(null);
                          }}>
                          <div className="flex justify-between text-sm">
                            <span>{'kcal' in item ? item.name : item.name}</span>
                            <span className="text-muted-foreground">{'kcal' in item ? `${(item as Recipe).kcal} kcal` : `${(item as Exercise).durationMin} min`}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="secondary" onClick={onComplete}>Complete</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </MobileLayout>
  );
};

export default Home;
