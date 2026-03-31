"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, CopyPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { addDocument } from "@/lib/firestore";

export default function CreateWorkshopPage() {
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("You must be logged in to propose a workshop");
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    // rough conversion to ISO string or just store string
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    
    try {
      await addDocument("workshops", {
         volunteerId: auth.currentUser.uid,
         title: formData.get("title"),
         description: formData.get("description"),
         skillCategory: formData.get("subject"),
         scheduledAt: scheduledAt,
         duration: formData.get("duration"),
         maxStudents: parseInt(formData.get("capacity") as string) || 50,
         registeredStudents: [],
         status: "pending_approval",
         mode: "online",
         language: formData.get("language"),
         targetGrade: formData.get("targetAudience"),
         createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success("Workshop Proposal Submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center relative shadow-sm">
             <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
             <CheckCircle2 className="w-10 h-10 text-green-600 relative z-10" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Proposal Submitted!</h1>
        <p className="text-slate-600 mt-3 text-lg">Thank you! The Admin team will review your workshop proposal and approve it shortly. You will be notified via email.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard/volunteer/workshops">
            <Button variant="outline">View My Workshops</Button>
          </Link>
          <Button onClick={() => setSubmitted(false)} className="bg-primary hover:bg-primary/90">
             <CopyPlus className="w-4 h-4 mr-2" /> Submit Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Propose a Workshop</h1>
        <p className="text-slate-500 mt-2">Create a live, multi-student class to teach a specific topic.</p>
      </div>

      <Card className="shadow-lg border-0 ring-1 ring-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle>Workshop Details</CardTitle>
          <CardDescription>Fill out the curriculum and scheduling limits below.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold" htmlFor="title">Workshop Title <span className="text-red-500">*</span></Label>
              <Input id="title" required placeholder="e.g. Masterclass: Newton's Laws of Motion" className="text-base py-6 focus-visible:ring-primary/20" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="subject">Subject Area <span className="text-red-500">*</span></Label>
                 <select required id="subject" className="w-full border-slate-200 rounded-md py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <option value="" disabled selected>Select a subject...</option>
                    <option value="math">Mathematics</option>
                    <option value="science">Science (Physics/Chem/Bio)</option>
                    <option value="english">English & Communications</option>
                    <option value="history">History & Civics</option>
                    <option value="tech">Computers & Coding</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="targetAudience">Target Grade Level <span className="text-red-500">*</span></Label>
                 <select required id="targetAudience" className="w-full border-slate-200 rounded-md py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                    <option value="" disabled selected>Select grade range...</option>
                    <option value="1-5">Primary (Grades 1-5)</option>
                    <option value="6-8">Middle (Grades 6-8)</option>
                    <option value="9-10">High School (Grades 9-10)</option>
                    <option value="11-12">Senior Secondary (Grades 11-12)</option>
                 </select>
               </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-800 font-semibold" htmlFor="description">Detailed Description <span className="text-red-500">*</span></Label>
              <Textarea required id="description" placeholder="What will students learn in this workshop?" className="min-h-[120px] focus-visible:ring-primary/20" />
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-2 border-t border-slate-100">
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="date">Proposed Date <span className="text-red-500">*</span></Label>
                 <Input required id="date" type="date" className="focus-visible:ring-primary/20" />
               </div>
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="time">Time <span className="text-red-500">*</span></Label>
                 <Input required id="time" type="time" className="focus-visible:ring-primary/20" />
               </div>
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
                 <select required id="duration" className="w-full border-slate-200 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none h-10">
                    <option value="30m">30 Minutes</option>
                    <option value="1h" selected>1 Hour</option>
                    <option value="1h30m">1.5 Hours</option>
                    <option value="2h">2 Hours</option>
                 </select>
               </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pb-2">
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="capacity">Maximum Students</Label>
                 <Input id="capacity" type="number" defaultValue={50} min={5} max={100} className="focus-visible:ring-primary/20" />
               </div>
               <div className="space-y-2">
                 <Label className="text-slate-800 font-semibold" htmlFor="language">Teaching Language <span className="text-red-500">*</span></Label>
                 <select required id="language" className="w-full border-slate-200 rounded-md py-2 px-3 text-sm flex h-10 w-full items-center justify-between bg-white border outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="en" selected>English</option>
                    <option value="hi">Hindi</option>
                    <option value="hinglish">Hinglish</option>
                    <option value="ta">Tamil</option>
                    <option value="ml">Malayalam</option>
                 </select>
               </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 py-4 flex justify-between items-center">
             <p className="text-xs text-slate-500">Proposals are manually verified by admins.</p>
             <div className="flex gap-3">
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-sm">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </Button>
             </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}