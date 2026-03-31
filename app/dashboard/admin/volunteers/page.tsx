"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileText, Download, MoreHorizontal, CheckCircle, Clock } from "lucide-react";

import { useState, useEffect } from "react";
import { subscribeToCollection } from "@/lib/firestore";
import { where } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "users",
      (data) => {
        setVolunteers(data);
        setLoading(false);
      },
      where("role", "==", "volunteer")
    );
    return () => unsubscribe();
  }, []);

  const filtered = volunteers.filter(v => v.name?.toLowerCase().includes(search.toLowerCase()) || v.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Volunteer Network</h1>
          <p className="text-slate-500 mt-2">Manage all {volunteers.length} mentors enrolled in EduBridge.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm border-t-0 border-x-0 sm:border rounded-none sm:rounded-xl">
         <CardHeader className="p-4 sm:p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="relative w-full max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input placeholder="Search volunteers by name or email..." className="pl-9 bg-white" value={search} onChange={e => setSearch(e.target.value)} />
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                         <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading records... 
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No volunteers found.</td>
                    </tr>
                  ) : (
                    filtered.map((vol) => (
                       <tr key={vol.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="font-bold text-slate-900">{vol.name}</div>
                             <div className="text-xs font-medium text-slate-500 mt-0.5">{vol.email}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                             {vol.subjects ? vol.subjects.join(", ") : (vol.skills ? vol.skills.join(", ") : "N/A")}
                          </td>
                          <td className="px-6 py-4">
                             {vol.status === 'pending' ? (
                               <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                                 <Clock className="w-3 h-3 mr-1" /> Pending Approval
                               </Badge>
                             ) : (
                               <Badge variant={vol.status === 'active' ? 'default' : 'secondary'} className={vol.status === 'active' ? 'bg-emerald-500 text-white hover:bg-emerald-600' : ''}>
                                 {vol.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />} <span className="capitalize">{vol.status || 'Unknown'}</span>
                               </Badge>
                             )}
                          </td>
                          <td className="px-6 py-4">
                             <div className="font-semibold text-slate-900">{vol.impactScore > 0 ? `⭐ ${vol.impactScore}` : 'N/A'}</div>
                             <div className="text-xs text-slate-500 mt-0.5">{vol.sessionsCompleted || 0} Sessions</div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium">{vol.createdAt ? new Date(vol.createdAt).toLocaleDateString() : "N/A"}</td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800">
                                <MoreHorizontal className="w-5 h-5" />
                             </Button>
                          </td>
                       </tr>
                    ))
                  )}
               </tbody>
            </table>
         </CardContent>
         <CardFooter className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
            Showing {filtered.length} entries
            <div className="flex gap-1">
               <Button variant="outline" size="sm" disabled>Previous</Button>
               <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
         </CardFooter>
      </Card>
    </div>
  );
}