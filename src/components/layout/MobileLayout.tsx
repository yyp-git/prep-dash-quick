import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, UtensilsCrossed, Dumbbell, BarChart3, User } from "lucide-react";

export const MobileLayout: React.FC<{
  title: string;
  children: React.ReactNode;
  hideTabBar?: boolean;
  rightAction?: React.ReactNode;
}> = ({ title, children, hideTabBar, rightAction }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-background">
      <header className="h-12 flex items-center justify-between px-4 border-b">
        <h1 className="text-base font-semibold">{title}</h1>
        <div>{rightAction}</div>
      </header>
      <main className="flex-1 p-3">{children}</main>
      {!hideTabBar && (
        <nav className="h-14 border-t bg-card flex items-center justify-around">
          {[
            { to: "/home", icon: Home, label: "Home" },
            { to: "/recipes", icon: UtensilsCrossed, label: "Recipes" },
            { to: "/exercises", icon: Dumbbell, label: "Exercise" },
            { to: "/progress", icon: BarChart3, label: "Progress" },
            { to: "/profile", icon: User, label: "Profile" },
          ].map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <i.icon className="h-5 w-5" />
              <span className="mt-0.5">{i.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
};
