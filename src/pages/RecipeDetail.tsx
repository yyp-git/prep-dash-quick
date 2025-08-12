import React from "react";
import { useParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { recipes } from "@/data/mock";

const RecipeDetail: React.FC = () => {
  const { id } = useParams();
  const r = recipes.find((x) => x.id === id);
  if (!r) return null;

  return (
    <MobileLayout title="Recipe">
      <Seo title={`${r.name} – Details`} description={`Ingredients, steps, and nutrition for ${r.name}.`} canonical={window.location.href} />
      <article className="space-y-3">
        <header>
          <h2 className="text-xl font-semibold">{r.name}</h2>
          <p className="text-sm text-muted-foreground">{r.kcal} kcal • {r.protein}g protein • {r.prepTimeMin} min prep</p>
        </header>
        <section>
          <h3 className="font-medium mb-1">Ingredients</h3>
          <ul className="list-disc pl-5 text-sm">
            {r.ingredients.map((i) => (<li key={i}>{i}</li>))}
          </ul>
        </section>
        <section>
          <h3 className="font-medium mb-1">Steps</h3>
          <ol className="list-decimal pl-5 text-sm">
            {r.steps.map((s, idx) => (<li key={idx}>{s}</li>))}
          </ol>
        </section>
        <section className="text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2 mb-2">
            {r.vitamins.map((v) => (<span key={v} className="border rounded px-2 py-0.5">vitamin {v}</span>))}
            {r.allergyTags.map((a) => (<span key={a} className="border rounded px-2 py-0.5">allergy: {a}</span>))}
            {r.equipmentRequired.map((e) => (<span key={e} className="border rounded px-2 py-0.5">equip: {e}</span>))}
            {r.equipmentRequired.length === 0 && (<span className="border rounded px-2 py-0.5">no equipment</span>)}
          </div>
          <p>Disclaimer: Not medical advice; consult a professional. Verify allergens and compatibility with your equipment.</p>
        </section>
      </article>
    </MobileLayout>
  );
};

export default RecipeDetail;
