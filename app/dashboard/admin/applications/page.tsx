"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ShieldCheck, Mail, Phone, BookOpen, Clock, FileText, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { subscribeToCollection, updateDocument } from "@/lib/firestore";
import { where } from "firebase/firestore";

export default function VerificationEnginePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToCollection(
      "volunteer_applications",
      (data) => {
        setApps(data);
        setLoading(false);
      },
      where("status", "==", "pending")
    );
    return () => unsubscribe();
  }, []);

  const handleAction = async (appId: string, uid: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await updateDocument("volunteer_applications", appId, { status: "approved" });
        await updateDocument("users", uid, { status: "active", approvedAt: new Date().toISOString() });
        toast.success(`Application Approved! Mentor Dashboard Unlocked.`, { duration: 4000 });
      } else {
        await updateDocument("volunteer_applications", appId, { status: "rejected" });
        await updateDocument("users", uid, { status: "rejected" });
        toast.error(`Application Rejected.`, { duration: 4000 });
      }
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  const filtered = apps.filter(app => app.personalInfo?.fullName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Verification Engine <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-0">{apps.length} Pending</Badge>
          </h1>
          <p className="text-slate-500 mt-1">Review ID documents and approve new mentor applications securely.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search names..." className="pl-9 bg-white" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" className="shrink-0"><Filter className="w-4 h-4" /></Button>
        </div>
      </div>

      {loading ? (
        <Card className="border-dashed shadow-none bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading pending applications...</p>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed shadow-none bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">Inbox Zero</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              All applications have been successfully verified or no search results matched.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filtered.map(app => (
            <Card key={app.id} className="shadow-sm border-slate-200 overflow-hidden">
               {/* Quick Info Header */}
               <div className="bg-slate-50/80 border-b border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg shadow-sm border border-primary/20 shrink-0">
                      {app.personalInfo?.fullName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {app.personalInfo?.fullName || "Unknown"} 
                        <Badge variant="outline" className="text-xs bg-white text-slate-600 capitalize">{app.qualification?.status || "Unknown"}</Badge>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{app.id} • Submitted {new Date(app.submittedAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto">
                    <Button onClick={() => handleAction(app.id, app.uid, "reject")} variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 sm:flex-auto">
                      <XCircle className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                    <Button onClick={() => handleAction(app.id, app.uid, "approve")} className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-auto">
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve Trust
                    </Button>
                 </div>
               </div>

               {/* Application Data Matrix */}
               <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Column 1: Verification & Contact */}
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><ShieldCheck className="w-4 h-4 text-slate-400" /> Identity Data</h4>
                     <ul className="space-y-3 text-sm">
                       <li className="flex gap-2">
                         <Mail className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> <span className="text-slate-700 truncate">{app.personalInfo?.email}</span>
                       </li>
                       <li className="flex gap-2">
                         <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> <span className="text-slate-700">{app.personalInfo?.mobile}</span>
                       </li>
                       <li className="flex flex-col gap-1.5 mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                         <span className="text-xs font-bold text-amber-800">Provided ID Document:</span>
                         <a href="#" className="flex items-center gap-1 text-primary hover:underline font-medium break-all">
                           <FileText className="w-3.5 h-3.5" /> {app.verification?.idProof || app.verification?.idUploaded || "N/A"}
                         </a>
                       </li>
                     </ul>
                  </div>

                  {/* Column 2: Qualifications */}
                  <div className="space-y-4 md:border-l border-slate-100 md:pl-8">
                     <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><BookOpen className="w-4 h-4 text-slate-400" /> Academics</h4>
                     <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Highest Degree</p>
                          <p className="text-sm font-semibold text-slate-900 mt-0.5">{app.qualification?.highestQualification}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mt-2">Target Subjects & Skills</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {(app.academic?.subjects || app.skills?.skills || []).map((s: string) => <Badge key={s} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">{s}</Badge>)}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mt-2">Target Grades / Format</p>
                          <p className="text-sm text-slate-700 mt-0.5">{(app.academic?.grades || []).join(", ")} {app.skills?.format || ""}</p>
                        </div>
                     </div>
                  </div>

                  {/* Column 3: Logistics */}
                  <div className="space-y-4 md:border-l border-slate-100 md:pl-8">
                     <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b pb-2"><Clock className="w-4 h-4 text-slate-400" /> Availability</h4>
                     <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Pledged Hours / Week</p>
                          <p className="text-2xl font-black text-slate-900 mt-0.5">{app.availability?.hoursPerWeek}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mt-2">Delivery Mode</p>
                          <Badge variant="outline" className="mt-1 uppercase tracking-widest text-[10px]">{app.availability?.mode}</Badge>
                          {app.availability?.locality && <p className="text-xs text-slate-600 mt-1">{app.availability.locality}</p>}
                        </div>
                     </div>
                  </div>

               </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
