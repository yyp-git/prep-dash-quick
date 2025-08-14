import React, { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Seo } from "@/components/common/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/context/AppState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const Profile: React.FC = () => {
  const { isGuest, setGuest } = useApp();
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const save = () => toast({ title: "Saved", description: "Profile and preferences updated." });

  return (
    <MobileLayout title="Profile">
      <Seo title="Profile & Settings" description="Edit profile, preferences, privacy, and units." canonical={window.location.href} />
      <div className="space-y-4">
        <section className="space-y-2">
          <Label>Name</Label>
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </section>
        <section className="space-y-2">
          <Label>Units</Label>
          <div className="flex gap-2">
            <Button variant={units==='metric' ? 'default' : 'secondary'} onClick={() => setUnits('metric')}>Metric</Button>
            <Button variant={units==='imperial' ? 'default' : 'secondary'} onClick={() => setUnits('imperial')}>Imperial</Button>
          </div>
        </section>
        <section className="flex items-center justify-between">
          <span className="text-sm">Consent to health-data processing</span>
          <Switch checked={consent} onCheckedChange={setConsent} />
        </section>
        <Button onClick={save}>Save</Button>

        <section className="pt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="secondary">Delete account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm delete</AlertDialogTitle>
              </AlertDialogHeader>
              <p className="text-sm text-muted-foreground">This action is permanent.</p>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => toast({ title: "Deleted", description: "Account removed (mock)." })}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </section>

        {isGuest && (
          <div className="rounded-md border p-3 text-sm">
            <p className="font-medium mb-1">Guest mode</p>
            <p className="text-muted-foreground mb-2">Browse is open. Start/Save are locked.</p>
            <Button onClick={() => setGuest(false)}>Upgrade (mock)</Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Profile;
