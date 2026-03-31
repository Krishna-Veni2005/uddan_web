"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, CheckCircle2, TrendingUp, Users, Presentation, Calendar, Loader2 } from "lucide-react";
import { generateImpactReport } from "@/lib/claude";
import toast from "react-hot-toast";

const PLATFORM_STATS = {
  totalStudents: 12500,
  sessionsCompleted: 58000,
  avgProgressImprovement: "18%",
  topSkillsTaught: ["Spoken English", "Basic Math", "Coding Logic"],
  activeVolunteers: 4200,
  callAccessStudents: 3100, // Students studying via phone calls (no smartphone)
  atRiskResolved: 850
};

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportText, setReportText] = useState("");
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const responseText = await generateImpactReport(PLATFORM_STATS);
      setReportText(responseText);
      setIsDownloaded(false);
      toast.success("AI Impact Report successfully generated!");
    } catch (e) {
      toast.error("Failed to generate report. Using fallback...");
      setReportText("EduBridge Impact Report\n\nOver the past quarter, EduBridge has successfully paired over 12,500 students with 4,200 dedicated college volunteers. Collectively, they have completed an astounding 58,000 mentoring sessions, primarily focusing on Spoken English, Basic Math, and Coding Logic. \n\nOur unique phone-access feature allowed 3,100 underserved students to participate without needing a smartphone. Furthermore, our AI-driven at-risk detection enabled mentors to intervene early and resolve 850 potential dropout cases, yielding an 18% average improvement in academic progress scores.\n\nMoving forward, we remain dedicated to scaling this impact, ensuring every child in India has access to a mentor and a brighter future.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    toast.success("Downloading PDF... (Mocked)");
    setIsDownloaded(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-indigo-600" /> Platform Reports
          </h1>
          <p className="text-slate-500 mt-1">Generate comprehensive narrative impact reports for NGO funders instantly.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">Schedule Auto-Report</Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
             {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : <><FileText className="w-4 h-4 mr-2" /> Generate Impact Report</>}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8 mt-8">
        {[
          { icon: Users, label: "Total Students", val: "12.5k", col: "text-blue-600", bg: "bg-blue-100" },
          { icon: Calendar, label: "Sessions", val: "58k+", col: "text-green-600", bg: "bg-green-100" },
          { icon: TrendingUp, label: "Avg Progress", val: "+18%", col: "text-indigo-600", bg: "bg-indigo-100" },
          { icon: Presentation, label: "Volunteers", val: "4.2k", col: "text-orange-600", bg: "bg-orange-100" }
        ].map((s, i) => (
          <Card key={i} className="shadow-sm border-slate-200">
             <CardContent className="p-4 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg} ${s.col}`}>
                 <s.icon className="w-5 h-5" />
               </div>
               <div>
                 <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                 <p className="text-2xl font-bold text-slate-900">{s.val}</p>
               </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg border-Slate-200 shadow-slate-100/50 bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50 rounded-t-xl">
           <div className="flex justify-between items-center">
             <div>
               <CardTitle className="text-lg">Generated Narrative Report</CardTitle>
               <CardDescription>Synthesized by Claude based on real-time platform data metrics.</CardDescription>
             </div>
             {reportText && (
               <Button variant="outline" size="sm" onClick={handleDownload} className={`border bg-white ${isDownloaded ? 'text-green-600 hover:text-green-700' : 'text-slate-700'}`}>
                 {isDownloaded ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Downloaded PDF</> : <><Download className="w-4 h-4 mr-2" /> Download PDF</>}
               </Button>
             )}
           </div>
        </CardHeader>
        <CardContent className="pt-8">
           {isGenerating ? (
             <div className="py-24 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
                <p className="font-medium">Claude is analyzing 50,000+ data points...</p>
                <p className="text-sm">Synthesizing narrative report...</p>
             </div>
           ) : reportText ? (
             <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:text-indigo-900 mx-auto w-full md:w-4/5 lg:w-3/4 pb-8">
               {/* A naive split to render paragraphs since AI returns plain text strings with newlines */}
               {reportText.split('\\n').map((paragraph, index) => (
                 paragraph.trim() ? <p key={index} className="mb-4 text-justify text-slate-700">{paragraph}</p> : null
               ))}
               
               <div className="mt-12 flex justify-end items-end gap-2 border-t pt-8">
                 <div className="text-right">
                   <p className="font-bold text-slate-900">EduBridge Central Reporting</p>
                   <p className="text-sm text-slate-500">Generated automatically by AI System</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
               <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
               <h3 className="text-lg font-medium text-slate-900">No report generated yet</h3>
               <p className="text-slate-500 max-w-sm mx-auto mt-1">Click the button above to generate a new 400-word NGO impact report based on current platform statistics.</p>
             </div>
           )}
        </CardContent>
      </Card>

    </div>
  );
}