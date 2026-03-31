"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, ShieldAlert, Sparkles, Sliders, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const handleSave = () => toast.success("Platform configuration updated successfully");

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-2">Global configurations impacting all users across EduBridge.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <Card className="border-slate-200 shadow-sm">
               <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="w-5 h-5 text-indigo-500" /> AI Features (Claude)</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base text-slate-900">Smart Matching Engine</Label>
                        <p className="text-sm text-slate-500">Automatically map students to volunteers based on criteria.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base text-slate-900">AI Study Buddy</Label>
                        <p className="text-sm text-slate-500">Enable conversational AI agents in student dashboards.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base text-slate-900">Dropout Risk Analytics</Label>
                        <p className="text-sm text-slate-500">Use LLMs to detect sentiment anomalies in call logs.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
               </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
               <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg"><Sliders className="w-5 h-5 text-primary" /> Application Workflow</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 pt-6">
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base text-slate-900">Accept New Students</Label>
                        <p className="text-sm text-slate-500">Open student intake registration portal.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <Label className="text-base text-slate-900">Accept New Volunteers</Label>
                        <p className="text-sm text-slate-500">Allow users to fill out the volunteer application wizard.</p>
                     </div>
                     <Switch defaultChecked />
                  </div>
               </CardContent>
            </Card>
            
            <div className="flex justify-end pt-2">
               <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white font-semibold py-6 px-8 text-base shadow-md">
                 <Save className="w-5 h-5 mr-2" /> Save Configuration
               </Button>
            </div>
         </div>

         <div className="md:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm bg-orange-50/50 border-orange-100">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-900 text-base"><ShieldAlert className="w-5 h-5 text-orange-600" /> Admin Access</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-orange-900">Current API Tier</Label>
                    <Input disabled defaultValue="Anthropic Claude 3.5 Sonnet" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-orange-900">Vercel Environment</Label>
                    <Input disabled defaultValue="Production" className="bg-white" />
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}