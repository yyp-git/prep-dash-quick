import React, { useMemo, useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { recipes as allRecipes, Recipe } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const DIET_TAGS = ["vegetarian", "vegan", "gluten-free", "dairy-free", "nut-free"];
const EQUIP = ["oven", "air-fryer", "dumbbells", "bands", "no-equipment"];

const Recipes: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<string[]>([]);
  const [equip, setEquip] = useState<string[]>([]);
  const [calRange, setCalRange] = useState<[number, number]>([200, 600]);
  const [proteinRange, setProteinRange] = useState<[number, number]>([10, 40]);
  const [prepMax, setPrepMax] = useState<number>(20);
  const [costMax, setCostMax] = useState<number>(5);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return allRecipes
      .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
      .filter((r) => r.kcal >= calRange[0] && r.kcal <= calRange[1])
      .filter((r) => r.protein >= proteinRange[0] && r.protein <= proteinRange[1])
      .filter((r) => r.prepTimeMin <= prepMax)
      .filter((r) => r.costPerServing <= costMax)
      .filter((r) => diet.length === 0 || diet.every((d) => r.dietaryTags.includes(d)))
      .filter((r) => {
        if (equip.includes("no-equipment")) return r.equipmentRequired.length === 0;
        if (equip.length === 0) return true;
        return r.equipmentRequired.every((e) => equip.includes(e));
      });
  }, [query, calRange, proteinRange, prepMax, costMax, diet, equip]);

  const reset = () => {
    setQuery("");
    setDiet([]);
    setEquip([]);
    setCalRange([200, 600]);
    setProteinRange([10, 40]);
    setPrepMax(20);
    setCostMax(5);
  };

  return (
    <MobileLayout title="Recipes">
      <Seo title="Recipe Library – Quick Prep" description="Browse quick recipes with filters for diet, calories, protein, time, cost." canonical={window.location.href} />

      <div className="flex gap-2 mb-3">
        <Input placeholder="Search recipes" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="secondary">Filters</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-w-md mx-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-2">
              <div>
                <div className="text-sm mb-1">Dietary</div>
                <div className="flex flex-wrap gap-2">
                  {DIET_TAGS.map((t) => {
                    const active = diet.includes(t);
                    return (
                      <Badge key={t} variant={active ? "default" : "secondary"} onClick={() => {
                        const s = new Set(diet);
                        s.has(t) ? s.delete(t) : s.add(t);
                        setDiet(Array.from(s));
                      }} className="cursor-pointer">{t}</Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-sm mb-1">Equipment</div>
                <div className="flex flex-wrap gap-2">
                  {EQUIP.map((t) => {
                    const active = equip.includes(t);
                    return (
                      <Badge key={t} variant={active ? "default" : "secondary"} onClick={() => {
                        const s = new Set(equip);
                        s.has(t) ? s.delete(t) : s.add(t);
                        setEquip(Array.from(s));
                      }} className="cursor-pointer">{t}</Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Calories</span><span>{calRange[0]}–{calRange[1]}</span></div>
                <Slider value={calRange} min={200} max={800} step={10} onValueChange={(v) => setCalRange(v as [number, number])} />
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Protein (g)</span><span>{proteinRange[0]}–{proteinRange[1]}</span></div>
                <Slider value={proteinRange} min={10} max={60} step={1} onValueChange={(v) => setProteinRange(v as [number, number])} />
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Prep time (max)</span><span>{prepMax} min</span></div>
                <Slider value={[prepMax]} min={5} max={30} step={1} onValueChange={([v]) => setPrepMax(v)} />
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Cost per serving (max)</span><span>${costMax.toFixed(2)}</span></div>
                <Slider value={[costMax]} min={1} max={10} step={0.5} onValueChange={([v]) => setCostMax(v)} />
              </div>
              <div className="flex justify-between">
                <Button variant="secondary" onClick={reset}>Reset</Button>
                <Button onClick={() => setOpen(false)}>Apply</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="rounded-md border p-4 text-sm text-muted-foreground text-center">
            No results
            <div className="mt-2 flex gap-2 justify-center">
              <Button size="sm" variant="secondary" onClick={reset}>Reset Filters</Button>
              <Button size="sm" onClick={() => navigate("/home")}>Go Home</Button>
            </div>
          </div>
        )}
        {filtered.map((r: Recipe) => (
          <button key={r.id} className="w-full text-left border rounded p-3 hover:bg-muted"
            onClick={() => navigate(`/recipes/${r.id}`)}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{r.name}</span>
              <span className="text-muted-foreground">{r.prepTimeMin} min</span>
            </div>
            <div className="text-xs text-muted-foreground">{r.kcal} kcal • {r.protein}g protein</div>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Recipes;
