import React from "react";
import { useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { exercises } from "@/data/mock";

const ExerciseDetail: React.FC = () => {
  const { id } = useParams();
  const e = exercises.find((x) => x.id === id);
  if (!e) return null;

  return (
    <MobileLayout title="Exercise">
      <Seo title={`${e.name} – Details`} description={`Steps, cues, and equipment for ${e.name}.`} canonical={window.location.href} />
      <article className="space-y-3">
        <header>
          <h2 className="text-xl font-semibold">{e.name}</h2>
          <p className="text-sm text-muted-foreground">{e.durationMin} min • {e.intensity} intensity • {e.space === 'tiny-room' ? 'tiny room friendly' : 'normal space'} • ≈ {e.caloriesBurn} kcal burned</p>
        </header>
        <section>
          <h3 className="font-medium mb-1">Equipment</h3>
          <p className="text-sm">{e.equipment.length === 0 ? "No equipment" : e.equipment.join(", ")}</p>
        </section>
        <section>
          <h3 className="font-medium mb-1">Steps & cues</h3>
          <ol className="list-decimal pl-5 text-sm">
            {e.steps.map((s, idx) => (<li key={idx}>{s}</li>))}
          </ol>
          <ul className="list-disc pl-5 text-xs text-muted-foreground mt-1">
            {e.cues.map((c, idx) => (<li key={idx}>{c}</li>))}
          </ul>
        </section>
        <section className="text-xs text-muted-foreground">
          <p>Disclaimer: Not medical advice; consult a professional. Exercise safely and within your limits.</p>
        </section>
      </article>
    </MobileLayout>
  );
};

export default ExerciseDetail;
