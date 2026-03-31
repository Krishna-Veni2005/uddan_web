"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Phone, Clock, AlertTriangle, ShieldCheck, Download, MoreHorizontal } from "lucide-react";

const CALL_LOGS = [
  { id: "CL-9082", date: "Oct 24, 2026, 6:00 PM", student: "Sneha V.", volunteer: "Rahul M.", duration: "45m", sentiment: "Positive", risk: "Low", tags: ["Math", "On-Track"] },
  { id: "CL-9081", date: "Oct 24, 2026, 5:30 PM", student: "Pooja M.", volunteer: "Karan D.", duration: "20m", sentiment: "Neutral", risk: "Low", tags: ["English"] },
  { id: "CL-9080", date: "Oct 23, 2026, 4:00 PM", student: "Rahul Sharma", volunteer: "Sneha V.", duration: "1h 15m", sentiment: "Negative", risk: "High", tags: ["Physics", "Frustrated"] },
  { id: "CL-9079", date: "Oct 22, 2026, 6:30 PM", student: "Karan D.", volunteer: "Vikram P.", duration: "55m", sentiment: "Positive", risk: "Low", tags: ["Science"] },
];

export default function AdminCallLogsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Communication Audit Logs</h1>
          <p className="text-slate-500 mt-2">Monitor voice and video session records for quality assurance and safety compliance.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export Logs</Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-2">
         <Card className="border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
            <CardHeader className="p-4 pb-0">
               <CardDescription className="text-slate-500 font-bold uppercase tracking-wider text-xs">Sessions Logged</CardDescription>
               <CardTitle className="text-3xl text-slate-800 pt-1">12,450</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
               <div className="text-sm font-medium text-emerald-600 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> 99.8% Safe Compliant</div>
            </CardContent>
         </Card>
         <Card className="border-slate-200 shadow-sm border-t-4 border-t-amber-500">
            <CardHeader className="p-4 pb-0">
               <CardDescription className="text-slate-500 font-bold uppercase tracking-wider text-xs">Avg. Duration</CardDescription>
               <CardTitle className="text-3xl text-slate-800 pt-1">42m</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
               <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> +5m compared to Jan</div>
            </CardContent>
         </Card>
         <Card className="border-slate-200 shadow-sm border-t-4 border-t-red-500">
            <CardHeader className="p-4 pb-0">
               <CardDescription className="text-red-500 font-bold uppercase tracking-wider text-xs">Flagged for Review</CardDescription>
               <CardTitle className="text-3xl text-red-600 pt-1">14</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
               <div className="text-sm font-medium text-red-500 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Action required</div>
            </CardContent>
         </Card>
      </div>

      <Card className="border-slate-200 shadow-sm border-t-0 border-x-0 sm:border rounded-none sm:rounded-xl">
         <CardHeader className="p-4 sm:p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input placeholder="Search by student, volunteer, or log ID..." className="pl-9 bg-white" />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="bg-white text-slate-600"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Log ID & Date</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Session Details</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">AI Sentiment Detection</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Tags</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {CALL_LOGS.map((log) => (
                     <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors ${log.risk === 'High' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900 font-mono text-xs">{log.id}</div>
                           <div className="text-xs font-medium text-slate-500 mt-0.5">{log.date}</div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-semibold text-slate-700">{log.student} ↔ {log.volunteer}</div>
                           <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {log.duration} • <Phone className="w-3 h-3 ml-1" /> Voice</div>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant="outline" className={
                              log.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              log.sentiment === 'Negative' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                           }>
                              {log.sentiment === 'Negative' && <AlertTriangle className="w-3 h-3 mr-1 text-red-600" />}
                              Sentiment: {log.sentiment}
                           </Badge>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-1.5 flex-wrap">
                              {log.tags.map(tag => (
                                 <span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{tag}</span>
                              ))}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           {log.risk === 'High' && (
                             <Button size="sm" variant="destructive" className="mr-2 h-8 text-xs py-0">Review Flag</Button>
                           )}
                           <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800">
                              <MoreHorizontal className="w-5 h-5" />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
         <CardFooter className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
            Showing 1 to {CALL_LOGS.length} of 12,450 records
            <div className="flex gap-1">
               <Button variant="outline" size="sm" disabled>Previous</Button>
               <Button variant="outline" size="sm">Next</Button>
            </div>
         </CardFooter>
      </Card>
    </div>
  );
}