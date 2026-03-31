"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowUpRight, Check, X, BookOpen } from "lucide-react";

const APPROVAL_QUEUE = [
  { id: "WS-101", title: "Algebra: Quadratic Equations", volunteer: "Sneha V.", audience: "9th-10th", duration: "1h", requests: 4 },
  { id: "WS-102", title: "Creative Writing Workshop", volunteer: "Dr. Vikram P.", audience: "6th-8th", duration: "1.5h", requests: 12 },
  { id: "WS-103", title: "Physics Crash Course", volunteer: "Rahul M.", audience: "11th-12th", duration: "2h", requests: 8 },
];

export default function AdminWorkshopsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Workshop Approvals</h1>
          <p className="text-slate-500 mt-2">Review public classes proposed by volunteers before they go live on the student dashboard.</p>
        </div>
      </div>

      <div className="grid gap-4">
         <h2 className="font-bold text-slate-700 uppercase tracking-wide text-sm mt-2 flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Action Required</Badge> Pending Reviews
         </h2>
         
         {APPROVAL_QUEUE.map((item) => (
            <Card key={item.id} className="border border-slate-200 shadow-sm bg-white overflow-hidden hover:border-slate-300">
               <CardContent className="p-0 sm:flex items-stretch">
                  <div className="p-6 bg-slate-50 border-r border-slate-100 sm:w-56 flex flex-col justify-center">
                     <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-1">{item.id}</p>
                     <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1"><BookOpen className="w-4 h-4 text-slate-400" /> By {item.volunteer}</p>
                  </div>
                  <div className="p-6 flex-1">
                     <div className="flex items-start justify-between">
                        <div>
                           <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">{item.title}</h3>
                           <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> Grades: {item.audience}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {item.duration}</span>
                           </div>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-primary">View Details <ArrowUpRight className="w-4 h-4 ml-1" /></Button>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-6 sm:w-44 flex flex-col gap-2 justify-center border-l border-slate-100 shrink-0">
                     <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm"><Check className="w-4 h-4 mr-1.5" /> Approve</Button>
                     <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"><X className="w-4 h-4 mr-1.5" /> Reject</Button>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
      
      {/* Live active workshops table can go below... */}
      <div className="mt-10 py-10 text-center border-t border-slate-200">
         <p className="text-slate-500">Only showing items needing approval. Active items managed normally.</p>
      </div>
    </div>
  );
}