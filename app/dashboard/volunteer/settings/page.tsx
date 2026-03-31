"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Bell, Shield, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { auth } from "@/lib/firebase";
import { getDocument, setDocument } from "@/lib/firestore";
import { Volunteer } from "@/types";
import toast from "react-hot-toast";

export default function VolunteerSettingsPage() {
  const [profile, setProfile] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!auth.currentUser) return;
      try {
        const doc = await getDocument<Volunteer>("users", auth.currentUser.uid);
        if (doc) setProfile(doc);
      } catch (e) {
        console.error("Error loading profile", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Successfully logged out");
      window.location.href = "/auth/login";
    } catch {
      toast.error("Error signing out");
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser || !profile) return;
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    
    try {
      await setDocument("users", auth.currentUser.uid, {
         name: `${firstName} ${lastName}`.trim()
      });
      toast.success("Profile saved successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
     return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading settings...</div>;
  }

  const nameParts = profile?.name?.split(' ') || ["Volunteer", ""];
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your volunteer profile and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <div className="md:col-span-1 space-y-1">
            <Button variant="secondary" className="w-full justify-start bg-slate-200 text-slate-900"><UserIcon className="w-4 h-4 mr-2" /> Profile</Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600"><Bell className="w-4 h-4 mr-2" /> Notifications</Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600"><Shield className="w-4 h-4 mr-2" /> Privacy & Security</Button>
         </div>
         
         <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200">
               <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
               </CardHeader>
               <form onSubmit={handleSave}>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="firstName">First Name</Label>
                           <Input id="firstName" name="firstName" defaultValue={firstName} required />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="lastName">Last Name</Label>
                           <Input id="lastName" name="lastName" defaultValue={lastName} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input defaultValue={profile?.email || ""} disabled className="bg-slate-50 text-slate-500" />
                     </div>
                     <Button type="submit" disabled={isSaving} className="mt-2 bg-primary text-white">
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {isSaving ? "Saving..." : "Save Changes"}
                     </Button>
                  </CardContent>
               </form>
            </Card>

            <Card className="border-slate-200">
               <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you receive student updates.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label>Email Alerts</Label>
                        <p className="text-sm text-slate-500">Receive emails about upcoming sessions.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label>SMS Reminders</Label>
                        <p className="text-sm text-slate-500">Text alerts before live classes.</p>
                     </div>
                     <Switch />
                  </div>
               </CardContent>
            </Card>

            <Card className="border-red-100 bg-red-50/30">
               <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">Sign out of your account.</p>
                  <Button variant="destructive" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                     <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}