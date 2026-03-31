"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileWarning, Search, Bot, Loader2, Mail, PhoneCall } from "lucide-react";
import { detectDropoutRisk } from "@/lib/claude";
import toast from "react-hot-toast";

const MOCK_STUDENT_METRICS = [
  { studentId: "s1", name: "Ravi Kumar", grade: "9", sessions_missed: 3, days_since_last_session: 14, progress_score_trend: "declining", rating_given: 3 },
  { studentId: "s2", name: "Anjali Gupta", grade: "10", sessions_missed: 0, days_since_last_session: 5, progress_score_trend: "stable", rating_given: 5 },
  { studentId: "s3", name: "Surya Prakash", grade: "6", sessions_missed: 1, days_since_last_session: 20, progress_score_trend: "declining", rating_given: 4 },
  { studentId: "s4", name: "Priya S.", grade: "12", sessions_missed: 4, days_since_last_session: 30, progress_score_trend: "declining", rating_given: 2 },
];

type RiskResult = {
  studentId: string;
  riskLevel: "medium" | "high" | "critical";
  reason: string;
};

export default function AtRiskPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [risks, setRisks] = useState<RiskResult[]>([]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const response = await detectDropoutRisk(MOCK_STUDENT_METRICS);
      const start = response.indexOf("[");
      const end = response.lastIndexOf("]") + 1;
      
      if (start !== -1 && end !== -1) {
        setRisks(JSON.parse(response.slice(start, end)));
        toast.success("AI scan complete. At-risk students identified.");
      } else {
        throw new Error("Invalid format");
      }
    } catch (e) {
      toast.error("Failed to parse AI response. Loading mock data...");
      setRisks([
        { studentId: "s4", riskLevel: "critical", reason: "Missed 4 sessions, 30 days since last active. High chance of dropping out." },
        { studentId: "s1", riskLevel: "high", reason: "Missed 3 sessions and declining progress. Needs immediate intervention." },
        { studentId: "s3", riskLevel: "medium", reason: "20 days since last session and declining. Check with volunteer." }
      ]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-500" /> At-Risk Detection
          </h1>
          <p className="text-slate-500 mt-1">AI-powered early warning system for student dropouts.</p>
        </div>
        <Button onClick={handleScan} disabled={isScanning} variant="destructive" className="shadow-md shadow-red-200">
           {isScanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning Platform Data...</> : <><Bot className="w-4 h-4 mr-2" /> Run AI Risk Scan</>}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
         <Card className="border-red-200 bg-red-50/50">
           <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
             <CardTitle className="text-sm font-medium text-red-800">Critical Risk</CardTitle>
             <AlertCircle className="w-4 h-4 text-red-500" />
           </CardHeader>
           <CardContent><div className="text-2xl font-bold text-red-600">{risks.filter(r => r.riskLevel === 'critical').length}</div></CardContent>
         </Card>
         <Card className="border-orange-200 bg-orange-50/50">
           <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
             <CardTitle className="text-sm font-medium text-orange-800">High Risk</CardTitle>
             <FileWarning className="w-4 h-4 text-orange-500" />
           </CardHeader>
           <CardContent><div className="text-2xl font-bold text-orange-600">{risks.filter(r => r.riskLevel === 'high').length}</div></CardContent>
         </Card>
         <Card className="border-yellow-200 bg-yellow-50/50">
           <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
             <CardTitle className="text-sm font-medium text-yellow-800">Medium Risk</CardTitle>
             <AlertCircle className="w-4 h-4 text-yellow-500" />
           </CardHeader>
           <CardContent><div className="text-2xl font-bold text-yellow-600">{risks.filter(r => r.riskLevel === 'medium').length}</div></CardContent>
         </Card>
      </div>

      {risks.length > 0 ? (
        <Card className="shadow-sm border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <CardHeader>
            <CardTitle>Flagged Students</CardTitle>
            <CardDescription>Review and intervene with vulnerable students based on AI insights.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {risks.map((risk, i) => {
               const student = MOCK_STUDENT_METRICS.find(s => s.studentId === risk.studentId);
               if (!student) return null;

               const bgType = risk.riskLevel === 'critical' ? 'bg-red-50 border-red-200' :
                              risk.riskLevel === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-yellow-50 border-yellow-200';
               const badgeType = risk.riskLevel === 'critical' ? 'destructive' : 'secondary';
               
               return (
                 <div key={i} className={`p-4 rounded-xl border flex flex-col md:flex-row gap-6 md:items-center justify-between ${bgType}`}>
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <h3 className="font-bold text-slate-900 text-lg">{student.name}</h3>
                         <Badge variant={badgeType} className="uppercase text-[10px] tracking-wider">{risk.riskLevel}</Badge>
                         <span className="text-xs text-slate-500 px-2 border-l border-slate-300">Grade {student.grade}</span>
                       </div>
                       <div className="text-sm bg-white/60 p-3 rounded-lg border border-white/50 inline-block text-slate-700">
                         <strong>AI Analysis:</strong> {risk.reason}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0 md:w-48">
                      <Button variant="outline" size="sm" className="w-full justify-start bg-white hover:bg-slate-50">
                        <PhoneCall className="w-3.5 h-3.5 mr-2 text-slate-400" /> Schedule Check-in
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-white hover:bg-slate-50">
                        <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> Notify Volunteer
                      </Button>
                      <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 hover:text-green-600">
                        Mark Resolved
                      </Button>
                    </div>
                 </div>
               );
            })}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed shadow-none bg-slate-50/50">
           <CardContent className="py-16 text-center text-slate-500">
             <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
             <h3 className="text-lg font-medium text-slate-900 mb-1">No pending risks detected</h3>
             <p className="max-w-sm mx-auto">Run a new AI Risk Scan to analyze the latest platform data and identify vulnerable students.</p>
           </CardContent>
        </Card>
      )}
    </div>
  );
}