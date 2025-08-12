import React, { useMemo, useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { useApp } from "@/context/AppState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Recipe, Exercise } from "@/data/mock";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { UpsellDialog } from "@/components/common/UpsellDialog";

const Home: React.FC = () => {
  const { plan, isGuest, swapItem, recordTap, completePlanItem, onboarding, recipes, exercises, addCustomRecipe, addCustomExercise } = useApp();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [upsell, setUpsell] = useState(false);
  const [query, setQuery] = useState("");
  const [exerciseFor, setExerciseFor] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const navigate = useNavigate();

  // Custom item form state
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customDuration, setCustomDuration] = useState("");
  const [customBurn, setCustomBurn] = useState("");
  const [customSave, setCustomSave] = useState(true);

  useEffect(() => {
    if (!exerciseFor || !timerRunning) return;
    const id = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [exerciseFor, timerRunning]);

  const activeItem = useMemo(() => plan.find((p) => p.id === openFor), [openFor, plan]);
  const pool = useMemo(() => {
    if (!activeItem) return [] as (Recipe | Exercise)[];
    if (activeItem.type === "meal") return recipes.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
    return exercises.filter((e) => e.name.toLowerCase().includes(query.toLowerCase()));
  }, [activeItem, query]);

  const stats = useMemo(() => {
    const mealItems = plan
      .filter((p) => p.type === "meal" && p.completed)
      .map((p) => recipes.find((r) => r.id === p.refId))
      .filter(Boolean) as Recipe[];
    const workoutItems = plan
      .filter((p) => p.type === "workout" && p.completed)
      .map((p) => exercises.find((e) => e.id === p.refId))
      .filter(Boolean) as Exercise[];

    const totalKcal = mealItems.reduce((s, r) => s + r.kcal, 0);
    const totalProtein = mealItems.reduce((s, r) => s + r.protein, 0);
    const totalPrep = mealItems.reduce((s, r) => s + r.prepTimeMin, 0);
    const totalWorkoutMin = workoutItems.reduce((s, w) => s + w.durationMin, 0);
    const totalBurn = workoutItems.reduce((s, w) => s + (w as any).caloriesBurn, 0);
    const netKcal = totalKcal - totalBurn;

    return { meals: mealItems.length, workouts: workoutItems.length, totalKcal, totalProtein, totalPrep, totalWorkoutMin, totalBurn, netKcal };
  }, [plan]);

  const recs = useMemo(() => {
    const current = onboarding.weightKg;
    const goal = onboarding.goalWeightKg;
    const baseWeight = goal ?? current ?? 70;

    // Simple heuristic: ~30 kcal/kg goal weight, adjust for direction
    let targetKcal = Math.round(baseWeight * 30);
    if (goal && current) {
      if (goal < current) targetKcal = Math.max(1200, targetKcal - 500); // cut for weight loss
      else if (goal > current) targetKcal = targetKcal + 300; // slight surplus for gain
    }

    const targetProtein = Math.round(baseWeight * 1.8); // g/day

    const remainingKcal = targetKcal - stats.netKcal; // compare against completed so far (net)
    const remainingProtein = targetProtein - stats.totalProtein; // completed protein so far

    return { targetKcal, targetProtein, remainingKcal, remainingProtein };
  }, [onboarding.weightKg, onboarding.goalWeightKg, stats.totalProtein, stats.netKcal]);

  const onStart = () => {
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
        <p className="text-sm text-muted-foreground">Tap Start to begin, Swap to choose another, Complete when done.</p>
        {plan.length === 0 && (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            No plan yet. Go to Onboarding to generate one.
            <div className="mt-2"><Button onClick={() => navigate("/onboarding")}>Start Onboarding</Button></div>
          </div>
        )}

        {plan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Completed today</p>
                  <p>{stats.meals} meals + {stats.workouts} workout</p>
                  <p className="text-muted-foreground">Food {stats.totalKcal} kcal − Burn {stats.totalBurn} kcal = Net {stats.netKcal} kcal • {stats.totalProtein}g protein • ~{stats.totalPrep} min prep • {stats.totalWorkoutMin} min workout</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Goal targets</p>
                  <p>Target ≈ {recs.targetKcal} kcal • {recs.targetProtein}g protein</p>
                  <p className="text-muted-foreground">{recs.remainingKcal >= 0 ? `Remaining ${recs.remainingKcal} kcal` : `Over by ${Math.abs(recs.remainingKcal)} kcal`} • {recs.remainingProtein >= 0 ? `Remaining ${recs.remainingProtein}g` : `Over by ${Math.abs(recs.remainingProtein)}g`}</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => navigate("/onboarding")}>
                Adjust inputs
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Meals section */}
        {plan.some((p) => p.type === "meal") && (
          <section aria-labelledby="meals-heading" className="space-y-2">
            <h2 id="meals-heading" className="text-sm font-medium text-muted-foreground">Meals</h2>
            {plan.filter((p) => p.type === "meal").map((p) => {
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
                    <Button size="sm" onClick={() => {
                      if (isMeal) {
                        recordTap("start");
                        navigate(`/recipes/${(ref as Recipe).id}`);
                      } else {
                        recordTap("start");
                        setExerciseFor(p.id);
                        setTimerSeconds(0);
                        setTimerRunning(true);
                      }
                    }}>Start</Button>
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
                        <div className="border-t mt-3 pt-3 space-y-2">
                          <p className="text-xs text-muted-foreground">Create custom {isMeal ? "meal" : "workout"}</p>
                          <Input placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                          {isMeal ? (
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="number" inputMode="numeric" placeholder="Calories (kcal)" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} />
                              <Input type="number" inputMode="numeric" placeholder="Protein (g)" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="number" inputMode="numeric" placeholder="Duration (min)" value={customDuration} onChange={(e) => setCustomDuration(e.target.value)} />
                              <Input type="number" inputMode="numeric" placeholder="Calories burn" value={customBurn} onChange={(e) => setCustomBurn(e.target.value)} />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Checkbox id={`save-${p.id}`} checked={customSave} onCheckedChange={(v) => setCustomSave(Boolean(v))} />
                            <Label htmlFor={`save-${p.id}`}>Save to library</Label>
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => {
                              if (!customName.trim()) return;
                              let newId = "";
                              if (isMeal) {
                                newId = addCustomRecipe({
                                  name: customName.trim(),
                                  kcal: Number(customKcal) || 0,
                                  protein: Number(customProtein) || 0,
                                  prepTimeMin: 10,
                                  equipmentRequired: [],
                                  dietaryTags: [],
                                  costPerServing: 0,
                                  category: "custom",
                                  ingredients: [],
                                  steps: ["Custom meal"],
                                  vitamins: [],
                                  allergyTags: [],
                                }, customSave);
                              } else {
                                newId = addCustomExercise({
                                  name: customName.trim(),
                                  durationMin: Number(customDuration) || 10,
                                  caloriesBurn: Number(customBurn) || 100,
                                  intensity: "medium",
                                  equipment: [],
                                  bodyFocus: "full body",
                                  steps: ["Custom workout"],
                                  cues: [],
                                  space: "normal",
                                }, customSave);
                              }
                              swapItem(p.id, { type: p.type, refId: newId });
                              setOpenFor(null);
                              setCustomName("");
                              setCustomKcal("");
                              setCustomProtein("");
                              setCustomDuration("");
                              setCustomBurn("");
                            }}>Use this</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {!isMeal && (
                      <Dialog open={exerciseFor === p.id} onOpenChange={(o) => {
                        if (o) { setExerciseFor(p.id); } else { setExerciseFor(null); setTimerRunning(false); }
                      }}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{(ref as Exercise).name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm space-y-2">
                            <p className="text-muted-foreground">{(ref as Exercise).durationMin} min • {(ref as Exercise).intensity} • ≈ {(ref as Exercise).caloriesBurn} kcal</p>
                            <div>
                              <p className="font-medium">Steps</p>
                              <ol className="list-decimal pl-5">
                                {(ref as Exercise).steps.map((s, idx) => (<li key={idx}>{s}</li>))}
                              </ol>
                            </div>
                            <div>
                              <p className="font-medium">Cues</p>
                              <ul className="list-disc pl-5 text-muted-foreground">
                                {(ref as Exercise).cues.map((c, idx) => (<li key={idx}>{c}</li>))}
                              </ul>
                            </div>
                            <div className="border rounded p-2 flex items-center justify-between">
                              <span className="font-mono tabular-nums">{String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}</span>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setTimerRunning((r) => !r)}>{timerRunning ? "Pause" : "Resume"}</Button>
                                <Button size="sm" variant="secondary" onClick={() => setTimerSeconds(0)}>Reset</Button>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" variant={p.completed ? "success" : "secondary"} onClick={() => completePlanItem(p.id)}>
                                {p.completed ? "Completed" : "Complete"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button size="sm" variant={p.completed ? "success" : "secondary"} onClick={() => completePlanItem(p.id)}>{p.completed ? "Completed" : "Complete"}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}

        {/* Workouts section */}
        {plan.some((p) => p.type === "workout") && (
          <section aria-labelledby="workouts-heading" className="space-y-2">
            <h2 id="workouts-heading" className="text-sm font-medium text-muted-foreground">Workouts</h2>
            {plan.filter((p) => p.type === "workout").map((p) => {
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
                    <Button size="sm" onClick={() => {
                      if (isMeal) {
                        recordTap("start");
                        navigate(`/recipes/${(ref as Recipe).id}`);
                      } else {
                        recordTap("start");
                        setExerciseFor(p.id);
                        setTimerSeconds(0);
                        setTimerRunning(true);
                      }
                    }}>Start</Button>
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
                        <div className="border-t mt-3 pt-3 space-y-2">
                          <p className="text-xs text-muted-foreground">Create custom {isMeal ? "meal" : "workout"}</p>
                          <Input placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                          {isMeal ? (
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="number" inputMode="numeric" placeholder="Calories (kcal)" value={customKcal} onChange={(e) => setCustomKcal(e.target.value)} />
                              <Input type="number" inputMode="numeric" placeholder="Protein (g)" value={customProtein} onChange={(e) => setCustomProtein(e.target.value)} />
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <Input type="number" inputMode="numeric" placeholder="Duration (min)" value={customDuration} onChange={(e) => setCustomDuration(e.target.value)} />
                              <Input type="number" inputMode="numeric" placeholder="Calories burn" value={customBurn} onChange={(e) => setCustomBurn(e.target.value)} />
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Checkbox id={`save-${p.id}`} checked={customSave} onCheckedChange={(v) => setCustomSave(Boolean(v))} />
                            <Label htmlFor={`save-${p.id}`}>Save to library</Label>
                          </div>
                          <div className="flex justify-end">
                            <Button size="sm" onClick={() => {
                              if (!customName.trim()) return;
                              let newId = "";
                              if (isMeal) {
                                newId = addCustomRecipe({
                                  name: customName.trim(),
                                  kcal: Number(customKcal) || 0,
                                  protein: Number(customProtein) || 0,
                                  prepTimeMin: 10,
                                  equipmentRequired: [],
                                  dietaryTags: [],
                                  costPerServing: 0,
                                  category: "custom",
                                  ingredients: [],
                                  steps: ["Custom meal"],
                                  vitamins: [],
                                  allergyTags: [],
                                }, customSave);
                              } else {
                                newId = addCustomExercise({
                                  name: customName.trim(),
                                  durationMin: Number(customDuration) || 10,
                                  caloriesBurn: Number(customBurn) || 100,
                                  intensity: "medium",
                                  equipment: [],
                                  bodyFocus: "full body",
                                  steps: ["Custom workout"],
                                  cues: [],
                                  space: "normal",
                                }, customSave);
                              }
                              swapItem(p.id, { type: p.type, refId: newId });
                              setOpenFor(null);
                              setCustomName("");
                              setCustomKcal("");
                              setCustomProtein("");
                              setCustomDuration("");
                              setCustomBurn("");
                            }}>Use this</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {!isMeal && (
                      <Dialog open={exerciseFor === p.id} onOpenChange={(o) => {
                        if (o) { setExerciseFor(p.id); } else { setExerciseFor(null); setTimerRunning(false); }
                      }}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{(ref as Exercise).name}</DialogTitle>
                          </DialogHeader>
                          <div className="text-sm space-y-2">
                            <p className="text-muted-foreground">{(ref as Exercise).durationMin} min • {(ref as Exercise).intensity} • ≈ {(ref as Exercise).caloriesBurn} kcal</p>
                            <div>
                              <p className="font-medium">Steps</p>
                              <ol className="list-decimal pl-5">
                                {(ref as Exercise).steps.map((s, idx) => (<li key={idx}>{s}</li>))}
                              </ol>
                            </div>
                            <div>
                              <p className="font-medium">Cues</p>
                              <ul className="list-disc pl-5 text-muted-foreground">
                                {(ref as Exercise).cues.map((c, idx) => (<li key={idx}>{c}</li>))}
                              </ul>
                            </div>
                            <div className="border rounded p-2 flex items-center justify-between">
                              <span className="font-mono tabular-nums">{String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:{String(timerSeconds % 60).padStart(2, '0')}</span>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => setTimerRunning((r) => !r)}>{timerRunning ? "Pause" : "Resume"}</Button>
                                <Button size="sm" variant="secondary" onClick={() => setTimerSeconds(0)}>Reset</Button>
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button size="sm" variant={p.completed ? "success" : "secondary"} onClick={() => completePlanItem(p.id)}>
                                {p.completed ? "Completed" : "Complete"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button size="sm" variant={p.completed ? "success" : "secondary"} onClick={() => completePlanItem(p.id)}>{p.completed ? "Completed" : "Complete"}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        )}
      </div>
    </MobileLayout>
  );
};

export default Home;
