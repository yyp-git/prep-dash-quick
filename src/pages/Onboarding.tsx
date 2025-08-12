import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { useApp } from "@/context/AppState";
import { useNavigate } from "react-router-dom";

const DIET_TAGS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"];
const KITCHENWARE = ["oven", "air-fryer"];
const EXERCISE_EQUIP = ["dumbbells", "bands"];
const NO_EQUIPMENT = "no-equipment";
type Step = 1 | 2 | 3 | 4 | 5;

const Onboarding: React.FC = () => {
  const { onboarding, setOnboarding, generatePlan } = useApp();
  const [step, setStep] = useState<Step>(1);
  const navigate = useNavigate();

  const next = () => setStep((s) => (Math.min(5, s + 1) as Step));
  const back = () => setStep((s) => (Math.max(1, s - 1) as Step));

  const finish = () => {
    generatePlan();
    navigate("/home");
  };

  return (
    <MobileLayout title="Onboarding" hideTabBar>
      <Seo title="Onboarding – Meal Prep & Fitness" description="Answer 5 quick questions to auto-generate your plan." canonical={window.location.href} />
      <div className="text-sm text-muted-foreground mb-3">Step {step} of 5</div>

      {step === 1 && (
        <section className="space-y-3">
          <div>
            <Label>Height (cm)</Label>
            <Input type="number" inputMode="numeric" placeholder="170" value={onboarding.heightCm ?? ""}
              onChange={(e) => setOnboarding({ heightCm: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Weight (kg)</Label>
              <Input type="number" inputMode="numeric" placeholder="70" value={onboarding.weightKg ?? ""}
                onChange={(e) => setOnboarding({ weightKg: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Goal (kg)</Label>
              <Input type="number" inputMode="numeric" placeholder="65" value={onboarding.goalWeightKg ?? ""}
                onChange={(e) => setOnboarding({ goalWeightKg: Number(e.target.value) })} />
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-2">
          <Label>Dietary restrictions</Label>
          <div className="flex flex-wrap gap-2">
            {DIET_TAGS.map((t) => {
              const active = onboarding.dietaryRestrictions.includes(t);
              return (
                <Badge key={t} variant={active ? "default" : "secondary"}
                  onClick={() => {
                    const cur = new Set(onboarding.dietaryRestrictions);
                    cur.has(t) ? cur.delete(t) : cur.add(t);
                    setOnboarding({ dietaryRestrictions: Array.from(cur) });
                  }}
                  className="cursor-pointer select-none">
                  {t}
                </Badge>
              );
            })}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <Label>Equipment access</Label>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Kitchenware</p>
            <div className="flex flex-wrap gap-2">
              {KITCHENWARE.map((t) => {
                const active = onboarding.equipment.includes(t);
                return (
                  <Badge key={t} variant={active ? "default" : "secondary"}
                    onClick={() => {
                      const cur = new Set(onboarding.equipment);
                      cur.has(t) ? cur.delete(t) : cur.add(t);
                      setOnboarding({ equipment: Array.from(cur) });
                    }}
                    className="cursor-pointer select-none">
                    {t}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Exercise equipment</p>
            <div className="flex flex-wrap gap-2">
              {EXERCISE_EQUIP.map((t) => {
                const active = onboarding.equipment.includes(t);
                return (
                  <Badge key={t} variant={active ? "default" : "secondary"}
                    onClick={() => {
                      const cur = new Set(onboarding.equipment);
                      cur.has(t) ? cur.delete(t) : cur.add(t);
                      setOnboarding({ equipment: Array.from(cur) });
                    }}
                    className="cursor-pointer select-none">
                    {t}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">No equipment</p>
            <div className="flex flex-wrap gap-2">
              {[NO_EQUIPMENT].map((t) => {
                const active = onboarding.equipment.includes(t);
                return (
                  <Badge key={t} variant={active ? "default" : "secondary"}
                    onClick={() => {
                      const cur = new Set(onboarding.equipment);
                      cur.has(t) ? cur.delete(t) : cur.add(t);
                      setOnboarding({ equipment: Array.from(cur) });
                    }}
                    className="cursor-pointer select-none">
                    {t}
                  </Badge>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="space-y-4">
          <div>
            <div className="flex justify-between">
              <Label>Meals per day</Label>
              <span className="text-sm">{onboarding.mealsPerDay ?? 3}</span>
            </div>
            <Slider value={[onboarding.mealsPerDay ?? 3]} min={1} max={6} step={1}
              onValueChange={([v]) => setOnboarding({ mealsPerDay: v })} />
            <p className="text-xs text-muted-foreground mt-1">We'll recommend this many meals in your daily plan.</p>
          </div>
          <div>
            <div className="flex justify-between">
              <Label>Prep time per meal</Label>
              <span className="text-sm">{onboarding.timePerMealMin} min</span>
            </div>
            <Slider value={[onboarding.timePerMealMin]} min={5} max={30} step={1}
              onValueChange={([v]) => setOnboarding({ timePerMealMin: v })} />
            <p className="text-xs text-muted-foreground mt-1">We use this to filter recipes you can prep within this time.</p>
          </div>
          <div>
            <div className="flex justify-between">
              <Label>Time per workout</Label>
              <span className="text-sm">{onboarding.timePerWorkoutMin} min</span>
            </div>
            <Slider value={[onboarding.timePerWorkoutMin]} min={5} max={45} step={1}
              onValueChange={([v]) => setOnboarding({ timePerWorkoutMin: v })} />
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="space-y-3">
          <p className="text-sm">We’ve set easy, safe defaults (≤20 min, ≤8 ingredients). You can tweak these anytime in Profile—you're in control.</p>
          <div className="rounded-md border p-3 text-sm">
            <p><strong>Summary</strong></p>
              <ul className="list-disc pl-4">
                <li>Diet: {onboarding.dietaryRestrictions.join(", ") || "none"}</li>
                <li>Equip: {onboarding.equipment.join(", ") || "none"}</li>
                <li>Meals/day: {onboarding.mealsPerDay ?? 3}</li>
                <li>Meal time: {onboarding.timePerMealMin} min</li>
                <li>Workout time: {onboarding.timePerWorkoutMin} min</li>
              </ul>
          </div>
        </section>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="secondary" onClick={back} disabled={step === 1}>Back</Button>
        {step < 5 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={finish}>Generate Plan</Button>
        )}
      </div>
    </MobileLayout>
  );
};

export default Onboarding;
