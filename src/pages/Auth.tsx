import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Seo } from "@/components/common/Seo";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useApp } from "@/context/AppState";

const Auth: React.FC = () => {
  const { setGuest } = useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuest(false);
    navigate("/onboarding");
  };

  return (
    <MobileLayout title="Welcome" hideTabBar>
      <Seo title="Sign in – Meal Prep & Fitness" description="Create your plan and save progress." canonical={window.location.href} />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button variant={mode === "signup" ? "default" : "secondary"} onClick={() => setMode("signup")}>Create account</Button>
          <Button variant={mode === "signin" ? "default" : "secondary"} onClick={() => setMode("signin")}>Sign in</Button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit">Continue</Button>
        </form>
        <p className="text-xs text-muted-foreground">By continuing you agree to our terms. Health data processed with consent.</p>
      </div>
    </MobileLayout>
  );
};

export default Auth;
