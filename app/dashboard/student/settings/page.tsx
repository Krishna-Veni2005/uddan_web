"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, LogOut } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function StudentSettingsPage() {
  const { currentUser } = useAppStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Cookies.remove("edubridge_user_role");
      toast.success("Successfully logged out");
      router.push("/auth/login");
    } catch {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account preferences and notifications.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         {/* Navigation sidebar-like structural split within settings if needed, or simple stacked layout */}
         <div className="md:col-span-1 space-y-1">
            <Button variant="secondary" className="w-full justify-start bg-slate-200 text-slate-900"><User className="w-4 h-4 mr-2" /> Profile</Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600"><Bell className="w-4 h-4 mr-2" /> Notifications</Button>
            <Button variant="ghost" className="w-full justify-start text-slate-600"><Shield className="w-4 h-4 mr-2" /> Privacy & Security</Button>
         </div>
         
         <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
               <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label>Full Name</Label>
                     <Input defaultValue={currentUser?.firstName + " " + currentUser?.lastName || "Student Name"} />
                  </div>
                  <div className="space-y-2">
                     <Label>Email Address</Label>
                     <Input defaultValue={currentUser?.email || ""} disabled className="bg-slate-50 text-slate-500" />
                     <p className="text-xs text-slate-400">Email cannot be changed directly.</p>
                  </div>
                  <Button className="mt-2 bg-primary text-white">Save Changes</Button>
               </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
               <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you receive platform updates.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label>Email Alerts</Label>
                        <p className="text-sm text-slate-500">Receive emails about upcoming classes.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label>New Resource Added</Label>
                        <p className="text-sm text-slate-500">Get notified when mentors upload notes.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label>SMS Reminders</Label>
                        <p className="text-sm text-slate-500">Text alerts 15 minutes before sessions.</p>
                     </div>
                     <Switch />
                  </div>
               </CardContent>
            </Card>

            <Card className="border-red-100 shadow-sm bg-red-50/30">
               <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">Sign out of your account on this device.</p>
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