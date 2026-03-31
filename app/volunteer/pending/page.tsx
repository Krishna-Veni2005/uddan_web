"use client";

import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function VolunteerPendingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-primary/20">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
            <CheckCircle2 className="w-20 h-20 text-green-500 relative z-10" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Application Submitted!
        </h1>
        <p className="text-slate-600 mb-6">
          Thank you for offering to mentor! Your application is under review by our team. 
          Expect a decision within 24-48 hours.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 mb-8">
          <h3 className="font-semibold text-sm text-slate-800 uppercase tracking-wide mb-2">
            While You Wait
          </h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4 marker:text-primary">
            <li>Ensure your uploaded ID is clear.</li>
            <li>Explore our curriculum framework.</li>
            <li>We'll email you once you're approved!</li>
          </ul>
        </div>

        <Button onClick={() => router.push("/")} className="w-full">
          <Home className="w-4 h-4 mr-2" /> Return Home
        </Button>
      </div>
    </div>
  );
}
