"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, GraduationCap, Clock, Check, X, ShieldAlert, BadgeCheck } from "lucide-react";
import toast from "react-hot-toast";

// Dummy MATCH Data
const MATCH_REQUESTS = [
  { id: "REQ-01", name: "Sneha V.", grade: "9th Grade", subject: "Mathematics", pace: "Fast", overlap: ["Weekends", "Evenings"], score: 95 },
  { id: "REQ-02", name: "Karan D.", grade: "11th Grade", subject: "Physics", pace: "Medium", overlap: ["Saturdays"], score: 82 },
  { id: "REQ-03", name: "Pooja M.", grade: "7th Grade", subject: "English Literature", pace: "Slow", overlap: ["Wednesdays", "Evenings"], score: 68 },
];

export default function MatchRequestsPage() {
  const handleAction = (id: string, action: "accept" | "decline") => {
    if (action === "accept") toast.success(`Successfully mapped to student request ${id}!`);
    else toast("Request declined.", { icon: "🗑️" });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Match Requests <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{MATCH_REQUESTS.length} New</Badge>
          </h1>
          <p className="text-slate-500 mt-1">
            EduBridge AI has found highly compatible students for your expertise. Accept a request to begin mentoring.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">Filter by Subject</Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">Sort by Score</Button>
        </div>
      </div>

      <div className="grid gap-4">
        {MATCH_REQUESTS.map((req) => (
          <Card key={req.id} className="border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
            <CardContent className="p-0 sm:flex items-stretch relative overflow-hidden">
              {/* Compatibility Score Pillar */}
              <div className={`sm:w-32 flex flex-col items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-100 ${req.score > 90 ? 'bg-primary/5' : req.score > 80 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <div className="text-3xl font-black text-slate-800 tracking-tight">{req.score}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1 text-center">Compatibility</div>
              </div>

              {/* Request Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{req.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" /> {req.grade} • Needs help with <span className="font-semibold text-slate-700">{req.subject}</span>
                    </p>
                  </div>
                  {req.score > 90 && (
                    <Badge className="bg-primary hover:bg-primary flex gap-1">
                      <BadgeCheck className="w-3 h-3" /> Perfect Match
                    </Badge>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start gap-2 text-sm">
                    <Layers className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Learning Profile</p>
                      <p className="text-slate-500">Prefers a {req.pace.toLowerCase()} pace, hands-on learning.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-900">Schedule Overlap</p>
                      <p className="text-slate-500">{req.overlap.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="bg-slate-50 p-6 flex sm:flex-col items-center justify-center gap-3 sm:border-l border-slate-100 min-w-[140px]">
                <Button onClick={() => handleAction(req.id, "accept")} className="w-full bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                   <Check className="w-4 h-4 mr-1.5" /> Accept
                </Button>
                <Button onClick={() => handleAction(req.id, "decline")} variant="ghost" className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 flex-1 sm:flex-none h-10">
                   <X className="w-4 h-4 mr-1.5" /> Pass
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-lg flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-orange-900">Capacity Notice</p>
            <p className="text-orange-700 mt-0.5">You currently have 3 students assigned. Accepting more matches may require adjusting your availability schedule to avoid burnout constraints.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
