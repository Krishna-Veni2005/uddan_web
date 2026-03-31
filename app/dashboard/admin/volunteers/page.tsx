"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileText, Download, MoreHorizontal, CheckCircle, Clock } from "lucide-react";

const VOLUNTEERS = [
  { id: "VOL-001", name: "Rahul M.", subject: "Math, English", status: "Active", joinedAt: "2025-06-12", rating: 4.8, hours: 145 },
  { id: "VOL-002", name: "Karan D.", subject: "Physics", status: "Pending", joinedAt: "2026-10-29", rating: 0, hours: 0 },
  { id: "VOL-003", name: "Pooja Kumar", subject: "History", status: "Active", joinedAt: "2026-03-05", rating: 4.9, hours: 62 },
  { id: "VOL-004", name: "Vikram P.", subject: "Science", status: "Active", joinedAt: "2026-01-11", rating: 4.6, hours: 80 },
  { id: "VOL-005", name: "Sneha V.", subject: "Math", status: "Inactive", joinedAt: "2025-08-22", rating: 4.2, hours: 10 },
];

export default function AdminVolunteersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Volunteer Network</h1>
          <p className="text-slate-500 mt-2">Manage all {VOLUNTEERS.length} mentors enrolled in EduBridge.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm border-t-0 border-x-0 sm:border rounded-none sm:rounded-xl">
         <CardHeader className="p-4 sm:p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="relative w-full max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input placeholder="Search volunteers by name or ID..." className="pl-9 bg-white" />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="bg-white text-slate-600"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
               <Button variant="outline" size="sm" className="bg-white text-slate-600"><FileText className="w-4 h-4 mr-2" /> Reports</Button>
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Volunteer Name & ID</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Subject Expertise</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Rating & Hours</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Joined Date</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {VOLUNTEERS.map((vol) => (
                     <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{vol.name}</div>
                           <div className="text-xs font-medium text-slate-500 mt-0.5">{vol.id}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{vol.subject}</td>
                        <td className="px-6 py-4">
                           {vol.status === 'Pending' ? (
                             <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                               <Clock className="w-3 h-3 mr-1" /> Pending Approval
                             </Badge>
                           ) : (
                             <Badge variant={vol.status === 'Active' ? 'default' : 'secondary'} className={vol.status === 'Active' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}>
                               {vol.status === 'Active' && <CheckCircle className="w-3 h-3 mr-1" />} {vol.status}
                             </Badge>
                           )}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-semibold text-slate-900">{vol.rating > 0 ? `⭐ ${vol.rating}` : 'N/A'}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{vol.hours} Hours Logged</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{vol.joinedAt}</td>
                        <td className="px-6 py-4 text-right">
                           {vol.status === 'Pending' && (
                             <Button size="sm" className="mr-2 bg-emerald-600 hover:bg-emerald-700">Approve</Button>
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
            Showing 1 to {VOLUNTEERS.length} of {VOLUNTEERS.length} entries
            <div className="flex gap-1">
               <Button variant="outline" size="sm" disabled>Previous</Button>
               <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
         </CardFooter>
      </Card>
    </div>
  );
}