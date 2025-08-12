import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { recipes as allRecipes, exercises as allExercises, Recipe, Exercise } from "@/data/mock";

export type OnboardingData = {
  heightCm?: number;
  weightKg?: number;
  goalWeightKg?: number;
  dietaryRestrictions: string[]; // e.g., ["vegetarian", "gluten-free"]
  equipment: string[]; // ["oven", "air-fryer", "no-equipment", "dumbbells", "bands"]
  mealsPerDay: number; // 1-6
  timePerMealMin: number; // 5-30
  timePerWorkoutMin: number; // 5-45
};

export type PlanItem = {
  id: string;
  type: "meal" | "workout";
  refId: string; // recipe or exercise id
  completed?: boolean;
};

export type Metrics = {
  taps: Record<"start" | "swap" | "complete", number>;
  planAccepted: boolean;
  streakCount: number; // simplistic streak demo
};

export type AppState = {
  isGuest: boolean;
  setGuest: (v: boolean) => void;
  onboarding: OnboardingData;
  setOnboarding: (u: Partial<OnboardingData>) => void;
  plan: PlanItem[];
  generatePlan: () => void;
  swapItem: (planItemId: string, replacement: { type: "meal" | "workout"; refId: string }) => void;
  completePlanItem: (planItemId: string) => void;
  recordTap: (t: keyof Metrics["taps"]) => void;
  metrics: Metrics;
  weightHistory: { date: string; weightKg: number }[];
  nutritionHistory: { date: string; kcal: number; protein: number; burn: number; net: number }[];
  addWeightEntry: (weightKg: number) => void;
  online: boolean;
  // Library and custom content
  recipes: Recipe[];
  exercises: Exercise[];
  addCustomRecipe: (r: Omit<Recipe, "id">, saveToLibrary: boolean) => string;
  addCustomExercise: (e: Omit<Exercise, "id">, saveToLibrary: boolean) => string;
};

const defaultOnboarding: OnboardingData = {
  dietaryRestrictions: [],
  equipment: [],
  mealsPerDay: 3,
  timePerMealMin: 20,
  timePerWorkoutMin: 20,
};

const Ctx = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState(true);
  const [onboarding, setOnboardingState] = useState<OnboardingData>(defaultOnboarding);
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    taps: { start: 0, swap: 0, complete: 0 },
    planAccepted: false,
    streakCount: 0,
  });
  const [weightHistory, setWeightHistory] = useState<{ date: string; weightKg: number }[]>([
    // simple seed for visual
  ]);
  const [online, setOnline] = useState<boolean>(navigator.onLine);
  const [nutritionHistory, setNutritionHistory] = useState<{ date: string; kcal: number; protein: number; burn: number; net: number }[]>([]);

  // Custom libraries (persistent and session-only)
  const [userRecipes, setUserRecipes] = useState<Recipe[]>(() => {
    try { return JSON.parse(localStorage.getItem("userRecipes") || "[]"); } catch { return []; }
  });
  const [userExercises, setUserExercises] = useState<Exercise[]>(() => {
    try { return JSON.parse(localStorage.getItem("userExercises") || "[]"); } catch { return []; }
  });
  const [tempRecipes, setTempRecipes] = useState<Recipe[]>([]);
  const [tempExercises, setTempExercises] = useState<Exercise[]>([]);

  useEffect(() => { localStorage.setItem("userRecipes", JSON.stringify(userRecipes)); }, [userRecipes]);
  useEffect(() => { localStorage.setItem("userExercises", JSON.stringify(userExercises)); }, [userExercises]);

  const recipes = useMemo(() => [...allRecipes, ...tempRecipes, ...userRecipes], [tempRecipes, userRecipes]);
  const exercises = useMemo(() => [...allExercises, ...tempExercises, ...userExercises], [tempExercises, userExercises]);


  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const setOnboarding = (u: Partial<OnboardingData>) =>
    setOnboardingState((prev) => ({ ...prev, ...u }));

  const filterRecipes = (limit = 20) => {
    return recipes
      .filter((r) => r.prepTimeMin <= onboarding.timePerMealMin)
      .filter((r) =>
        onboarding.dietaryRestrictions.length === 0 ||
        onboarding.dietaryRestrictions.every((d) => r.dietaryTags.includes(d))
      )
      .filter((r) => {
        if (onboarding.equipment.includes("no-equipment")) return r.equipmentRequired.length === 0;
        if (onboarding.equipment.length === 0) return true;
        // allow if all required equipment is accessible
        return r.equipmentRequired.every((e) => onboarding.equipment.includes(e));
      })
      .slice(0, limit);
  };

  const filterWorkouts = (limit = 20) => {
    return exercises
      .filter((w) => w.durationMin <= onboarding.timePerWorkoutMin)
      .filter((w) =>
        onboarding.equipment.includes("no-equipment") ? w.equipment.length === 0 : true
      )
      .filter((w) => onboarding.equipment.length === 0 || w.equipment.every((e) => onboarding.equipment.includes(e)))
      .slice(0, limit);
  };

  const generatePlan = () => {
    const mealCount = Math.max(1, Math.min(6, onboarding.mealsPerDay ?? 3));
    const picksMeals = filterRecipes(mealCount * 2).slice(0, mealCount);
    const picksWorkout = filterWorkouts(6).slice(0, 1);
    const newPlan: PlanItem[] = [
      ...picksMeals.map((m, i) => ({ id: `meal-${i}`, type: "meal" as const, refId: m.id, completed: false })),
      ...picksWorkout.map((w, i) => ({ id: `workout-${i}`, type: "workout" as const, refId: w.id, completed: false })),
    ];
    setPlan(newPlan);
    setMetrics((m) => ({ ...m, planAccepted: true }));
    toast({ title: "Plan generated", description: "Your day plan is ready." });
  };

  const swapItem = (planItemId: string, replacement: { type: "meal" | "workout"; refId: string }) => {
    setPlan((prev) => prev.map((p) => (p.id === planItemId ? { ...p, ...replacement } : p)));
    setMetrics((m) => ({ ...m, taps: { ...m.taps, swap: m.taps.swap + 1 } }));
    toast({ title: "Item swapped", description: "Updated your plan." });
  };

  const recordTap = (t: keyof Metrics["taps"]) => {
    setMetrics((m) => ({ ...m, taps: { ...m.taps, [t]: m.taps[t] + 1 } }));
  };

  const completePlanItem = (planItemId: string) => {
    setPlan((prev) => {
      const newPlan = prev.map((p) => (p.id === planItemId ? { ...p, completed: !p.completed } : p));
      // compute today's nutrition totals based on completed items
      const today = new Date().toISOString().slice(0, 10);
      const completedMeals = newPlan
        .filter((p) => p.type === "meal" && p.completed)
        .map((p) => recipes.find((r) => r.id === p.refId))
        .filter(Boolean) as Recipe[];
      const completedWorkouts = newPlan
        .filter((p) => p.type === "workout" && p.completed)
        .map((p) => exercises.find((e) => e.id === p.refId))
        .filter(Boolean) as Exercise[];
      const kcal = completedMeals.reduce((s, r) => s + r.kcal, 0);
      const protein = completedMeals.reduce((s, r) => s + r.protein, 0);
      const burn = completedWorkouts.reduce((s, w) => s + (w as any).caloriesBurn, 0);
      const net = kcal - burn;
      setNutritionHistory((prevNH) => {
        const others = prevNH.filter((e) => e.date !== today);
        return [...others, { date: today, kcal, protein, burn, net }].sort((a, b) => a.date.localeCompare(b.date));
      });
      return newPlan;
    });
    setMetrics((m) => ({ ...m, taps: { ...m.taps, complete: m.taps.complete + 1 } }));
    toast({ title: "Completed", description: "Updated status." });
  };

  const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const addCustomRecipe = (r: Omit<Recipe, "id">, saveToLibrary: boolean) => {
    const id = genId("custom-recipe");
    const full: Recipe = { id, ...r } as Recipe;
    if (saveToLibrary) setUserRecipes((prev) => [...prev, full]);
    else setTempRecipes((prev) => [...prev, full]);
    return id;
  };

  const addCustomExercise = (e: Omit<Exercise, "id">, saveToLibrary: boolean) => {
    const id = genId("custom-exercise");
    const full: Exercise = { id, ...e } as Exercise;
    if (saveToLibrary) setUserExercises((prev) => [...prev, full]);
    else setTempExercises((prev) => [...prev, full]);
    return id;
  };
  const addWeightEntry = (weightKg: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setWeightHistory((prev) => {
      const others = prev.filter((e) => e.date !== today);
      return [...others, { date: today, weightKg }].sort((a, b) => a.date.localeCompare(b.date));
    });
    toast({ title: "Weight logged", description: `${weightKg} kg recorded for today.` });
  };
  const value = useMemo<AppState>(
    () => ({
      isGuest,
      setGuest: setIsGuest,
      onboarding,
      setOnboarding,
      plan,
      generatePlan,
      swapItem,
      completePlanItem,
      recordTap,
      metrics,
      weightHistory,
      nutritionHistory,
      addWeightEntry,
      online,
      recipes,
      exercises,
      addCustomRecipe,
      addCustomExercise,
    }),
    [isGuest, onboarding, plan, metrics, weightHistory, nutritionHistory, online, recipes, exercises]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
