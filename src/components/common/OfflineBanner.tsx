import React from "react";
import { useApp } from "@/context/AppState";

export const OfflineBanner: React.FC = () => {
  const { online } = useApp();
  if (online) return null;
  return (
    <aside className="w-full bg-muted text-foreground border-b px-3 py-2 text-sm">
      Offline mode – showing cached content.
    </aside>
  );
};
