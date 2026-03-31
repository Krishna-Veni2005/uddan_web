"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRightLeft, CheckCircle2, User, Loader2 } from "lucide-react";
import { generateSmartMatches } from "@/lib/claude";
import toast from "react-hot-toast";

// Dummy Data
const UNASSIGNED_STUDENTS = [
  { id: "s1", name: "Rahul S.", grade: "8", subjects: ["Math", "Science"], language: "Hindi", pace: "Needs more time" },
  { id: "s2", name: "Priya P.", grade: "10", subjects: ["English"], language: "English", pace: "Average" },
];

const AVAILABLE_VOLUNTEERS = [
  { id: "v1", name: "Amit K.", subjects: ["Math", "Physics"], languages: ["Hindi", "English"], load: "0/3 students", availability: "Weekends" },
  { id: "v2", name: "Neha G.", subjects: ["English", "History"], languages: ["English"], load: "1/5 students", availability: "Evenings" },
];

type MatchResult = {
  studentId: string;
  volunteerId: string;
  reason: string;
  confidenceScore: number;
};

export default function AssignmentsPage() {
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const handleSmartMatch = async () => {
    setIsMatching(true);
    try {
      const response = await generateSmartMatches(UNASSIGNED_STUDENTS, AVAILABLE_VOLUNTEERS);
      
      // Attempt to parse JSON strictly. The prompt demands JSON response.
      // Claude might wrap it in \`\`\`json
      const jsonStart = response.indexOf("[");
      const jsonEnd = response.lastIndexOf("]") + 1;
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = response.slice(jsonStart, jsonEnd);
        const parsed = JSON.parse(jsonStr) as MatchResult[];
        setMatches(parsed);
        toast.success("AI found optimal mentor pairings!");
      } else {
        throw new Error("Could not parse AI response.");
      }
    } catch (error) {
       console.error(error);
       toast.error("Failed to generate smart matches. Try again.");
       // Fallback mock
       setMatches([
         { studentId: "s1", volunteerId: "v1", reason: "Amit teaches Math and speaks Hindi, an ideal fit for Rahul.", confidenceScore: 92 },
         { studentId: "s2", volunteerId: "v2", reason: "Neha teaches English and matches Priya's language preference.", confidenceScore: 88 },
       ]);
       toast("Loaded fallback mock matches due to parse error.", { icon: "🤖" });
    } finally {
      setIsMatching(false);
    }
  };

  const confirmMatch = (sId: string, vId: string) => {
    toast.success(`Match confirmed! Student ${sId} assigned to Volunteer ${vId}.`);
    setMatches(prev => prev.filter(m => m.studentId !== sId));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assignments Engine</h1>
          <p className="text-slate-500 mt-1">Pair unassigned students with available mentors automatically.</p>
        </div>
        <Button onClick={handleSmartMatch} disabled={isMatching} className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200">
          {isMatching ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Sparkles className="w-4 h-4 mr-2" /> AI Smart Match</>}
        </Button>
      </div>

      {matches.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50/30 mb-8 border-2 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CardHeader className="pb-3 border-b border-indigo-100">
             <CardTitle className="text-indigo-900 flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-indigo-600" /> Recommended Pairings
             </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
             {matches.map((m, idx) => {
                const s = UNASSIGNED_STUDENTS.find(x => x.id === m.studentId);
                const v = AVAILABLE_VOLUNTEERS.find(x => x.id === m.volunteerId);
                if (!s || !v) return null;

                return (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-8 flex-1">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex justify-center items-center"><User className="w-5 h-5" /></div>
                          <div>
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-xs text-slate-500">Grade {s.grade} • {s.language}</p>
                          </div>
                       </div>
                       
                       <div className="text-indigo-300 hidden sm:block"><ArrowRightLeft className="w-5 h-5" /></div>

                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex justify-center items-center"><User className="w-5 h-5" /></div>
                          <div>
                            <p className="font-bold text-slate-900">{v.name}</p>
                            <p className="text-xs text-slate-500">{v.availability} • {v.load}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-sm text-slate-600 flex-1">
                      <span className="font-semibold text-slate-800">Why?</span> {m.reason}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center px-3 border-r border-slate-200">
                        <span className="block text-2xl font-bold text-indigo-600">{m.confidenceScore}%</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Match</span>
                      </div>
                      <Button onClick={() => confirmMatch(m.studentId, m.volunteerId)} className="bg-indigo-600 hover:bg-indigo-700">
                         Confirm
                      </Button>
                    </div>
                  </div>
                );
             })}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Unassigned Students */}
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-4 border-b border-slate-100">
             <div className="flex justify-between items-center">
               <CardTitle>Unassigned Students</CardTitle>
               <Badge variant="secondary">{UNASSIGNED_STUDENTS.length}</Badge>
             </div>
           </CardHeader>
           <CardContent className="pt-4 space-y-4">
              {UNASSIGNED_STUDENTS.map(s => (
                <div key={s.id} className="p-3 border rounded-lg bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{s.name} <span className="text-slate-400 font-normal text-sm ml-1">• Grade {s.grade}</span></h4>
                    <p className="text-sm text-slate-500 mt-1">Needs: {s.subjects.join(", ")}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Lang: {s.language} | {s.pace}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7">Manual Assign</Button>
                </div>
              ))}
           </CardContent>
        </Card>

        {/* Available Volunteers */}
        <Card className="shadow-sm border-slate-200">
           <CardHeader className="pb-4 border-b border-slate-100">
             <div className="flex justify-between items-center">
               <CardTitle>Available Mentors</CardTitle>
               <Badge variant="secondary">{AVAILABLE_VOLUNTEERS.length}</Badge>
             </div>
           </CardHeader>
           <CardContent className="pt-4 space-y-4">
              {AVAILABLE_VOLUNTEERS.map(v => (
                <div key={v.id} className="p-3 border rounded-lg bg-white flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{v.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">Teaches: {v.subjects.join(", ")}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Avail: {v.availability} | Lang: {v.languages.join(", ")}</p>
                  </div>
                  <Badge variant="outline" className={v.load.startsWith("0") ? "text-green-600 border-green-200 bg-green-50" : "text-slate-600"}>{v.load}</Badge>
                </div>
              ))}
           </CardContent>
        </Card>
      </div>
    </div>
  );
}