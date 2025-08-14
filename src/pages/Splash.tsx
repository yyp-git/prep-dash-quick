import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Seo } from "@/components/common/Seo";
import { MobileLayout } from "@/components/layout/MobileLayout";
import heroImage from "@/assets/hero-minimal.png";

const Splash: React.FC = () => {
  const navigate = useNavigate();
  console.log("Splash component rendering");
  return (
    <MobileLayout title="Meal Prep & Fitness" hideTabBar>
      <Seo title="Meal Prep & Fitness – Fast, Simple" description="Low-effort meal prep and quick workouts in under 20 minutes." canonical={window.location.href} />
      <section className="flex flex-col items-center justify-center mt-12 text-center">
        <img src={heroImage} alt="Minimalist meal prep and dumbbell illustration" loading="lazy" className="mb-6 w-full max-w-xs h-auto rounded-md border" />
        <h2 className="text-2xl font-bold mb-2">Speedy, Safe, Simple</h2>
        <p className="text-muted-foreground mb-6">Under 20 min meals & workouts. No fluff.</p>
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
          <Button variant="secondary" onClick={() => navigate("/onboarding")}>Continue as Guest</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-6">Not medical advice. Consult a professional.</p>
      </section>
    </MobileLayout>
  );
};

export default Splash;
