import React, { useMemo, useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { exercises as allExercises, Exercise } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const EQUIP = ["dumbbells", "bands", "no-equipment"];
const FOCUS = ["full body", "upper", "core", "cardio", "mobility"];
const INTENSITY = ["low", "medium", "high"] as const;

const Exercises: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [equip, setEquip] = useState<string[]>([]);
  const [focus, setFocus] = useState<string[]>([]);
  const [durationMax, setDurationMax] = useState<number>(20);
  const [intensity, setIntensity] = useState<typeof INTENSITY[number] | "">("");
  const [tinyRoom, setTinyRoom] = useState<boolean>(false);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return allExercises
      .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
      .filter((e) => e.durationMin <= durationMax)
      .filter((e) => (intensity ? e.intensity === intensity : true))
      .filter((e) => (tinyRoom ? e.space === "tiny-room" : true))
      .filter((e) => focus.length === 0 || focus.includes(e.bodyFocus))
      .filter((e) => {
        if (equip.includes("no-equipment")) return e.equipment.length === 0;
        if (equip.length === 0) return true;
        return e.equipment.every((x) => equip.includes(x));
      });
  }, [query, durationMax, intensity, tinyRoom, focus, equip]);

  const reset = () => {
    setQuery("");
    setEquip([]);
    setFocus([]);
    setDurationMax(20);
    setIntensity("");
    setTinyRoom(false);
  };

  return (
    <MobileLayout title="Exercises">
      <Seo title="Exercise Library – Minimal Gear" description="Find quick workouts by gear, focus, time, and intensity." canonical={window.location.href} />

      <div className="flex gap-2 mb-3">
        <Input placeholder="Search workouts" value={query} onChange={(e) => setQuery(e.target.value)} />
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
                <div className="text-sm mb-1">Body focus</div>
                <div className="flex flex-wrap gap-2">
                  {FOCUS.map((t) => {
                    const active = focus.includes(t);
                    return (
                      <Badge key={t} variant={active ? "default" : "secondary"} onClick={() => {
                        const s = new Set(focus);
                        s.has(t) ? s.delete(t) : s.add(t);
                        setFocus(Array.from(s));
                      }} className="cursor-pointer">{t}</Badge>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span>Duration (max)</span><span>{durationMax} min</span></div>
                <Slider value={[durationMax]} min={5} max={45} step={1} onValueChange={([v]) => setDurationMax(v)} />
              </div>
              <div>
                <div className="text-sm mb-1">Intensity</div>
                <div className="flex flex-wrap gap-2">
                  {INTENSITY.map((t) => (
                    <Badge key={t} variant={intensity === t ? "default" : "secondary"} className="cursor-pointer" onClick={() => setIntensity(intensity === t ? "" : t)}>{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiny room friendly</span>
                <Badge variant={tinyRoom ? "default" : "secondary"} className="cursor-pointer" onClick={() => setTinyRoom((v) => !v)}>{tinyRoom ? "Yes" : "No"}</Badge>
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
        {filtered.map((e: Exercise) => (
          <button key={e.id} className="w-full text-left border rounded p-3 hover:bg-muted"
            onClick={() => navigate(`/exercises/${e.id}`)}>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{e.name}</span>
              <span className="text-muted-foreground">{e.durationMin} min</span>
            </div>
            <div className="text-xs text-muted-foreground capitalize">{e.intensity} • {e.bodyFocus} • {e.equipment.length === 0 ? "no equipment" : e.equipment.join(", ")}</div>
          </button>
        ))}
      </div>
    </MobileLayout>
  );
};

export default Exercises;
