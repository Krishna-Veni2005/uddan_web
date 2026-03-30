"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Bell, Shield, Smartphone, BookOpen, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function VolunteerSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulated mock save for the UI
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile settings updated successfully!");
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your mentorship profile, availability, and preferences.</p>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start mt-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="flex flex-col space-y-1 bg-white border border-slate-200 p-2 rounded-xl sticky top-24">
          <Button variant="ghost" className="justify-start bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
            <User className="w-4 h-4 mr-2" /> Public Profile
          </Button>
          <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
            <BookOpen className="w-4 h-4 mr-2" /> Subjects & Skills
          </Button>
          <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
            <Clock className="w-4 h-4 mr-2" /> Availability Map
          </Button>
          <div className="my-2 border-t border-slate-100"></div>
          <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </Button>
          <Button variant="ghost" className="justify-start text-slate-600 hover:text-slate-900">
            <Shield className="w-4 h-4 mr-2" /> Security
          </Button>
        </div>

        {/* Main Settings Form */}
        <div className="space-y-6">
          <form onSubmit={handleSave}>
            {/* Base Profile Details */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">Public Profile</CardTitle>
                <CardDescription>
                  This is how you will appear to students and administrators.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 pb-4">
                  <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <Button type="button" variant="outline" size="sm">Change Avatar</Button>
                    <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Full Name</label>
                     <Input defaultValue="Rahul Sharma" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Contact Number</label>
                     <div className="relative flex">
                       <Smartphone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                       <Input defaultValue="+91 9876543210" className="pl-9" />
                     </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-medium">Short Bio</label>
                   <Textarea 
                     defaultValue="Computer Science major who loves breaking down complex math problems into highly visual, easy to understand pieces."
                     rows={4}
                   />
                   <p className="text-xs text-slate-400 text-right">0 / 160 characters</p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Preferences */}
            <Card className="shadow-sm border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Teaching Preferences</CardTitle>
                <CardDescription>
                  Update the subjects and grades you are willing to mentor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">Active Subjects (Comma Separated)</label>
                   <Input defaultValue="Mathematics, Physics, Chemistry" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Ideal Grades</label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                     <option>Middle School (Grades 6-8)</option>
                     <option selected>High School (Grades 9-10)</option>
                     <option>Senior Secondary (Grades 11-12)</option>
                   </select>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t justify-end py-4">
                 <Button type="submit" disabled={isSaving}>
                   {isSaving ? "Saving Config..." : "Save All Changes"}
                 </Button>
              </CardFooter>
            </Card>
          </form>

          {/* Danger Zone */}
          <Card className="border-red-100 shadow-sm mt-8">
             <CardHeader>
               <CardTitle className="text-red-600 text-sm font-bold uppercase tracking-wider">Danger Zone</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium text-slate-900">Pause Matchmaking</p>
                   <p className="text-sm text-slate-500 text-balance">Temporarily hide your profile from new students if you are overwhelmed.</p>
                 </div>
                 <Button variant="outline" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200">
                   Pause Profile
                 </Button>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
