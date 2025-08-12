import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const UpsellDialog: React.FC<{ open: boolean; onOpenChange: (v: boolean) => void }>
= ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock start & save</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Create a free account to start workouts, save progress, and keep your plan.</p>
        <div className="flex gap-2 justify-end mt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Later</Button>
          <Button onClick={() => (window.location.href = "/auth")}>Sign up</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
