"use client";

import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Workshop } from "@/types";
import { where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Video, Clock, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function VolunteerWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      if (!auth.currentUser) return;
      try {
        const docs = await getDocuments<Workshop>("workshops", where("volunteerId", "==", auth.currentUser.uid));
        // simple sort
        docs.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
        setWorkshops(docs);
      } catch (e) {
        console.error("Error fetching workshops:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading workshops...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Workshops</h1>
          <p className="text-slate-500 mt-2">Manage live group classes you are hosting for students.</p>
        </div>
        <Link href="/dashboard/volunteer/create-workshop">
          <Button className="bg-primary text-white shadow-md hover:bg-primary/90 shrink-0">
             <PlusCircle className="mr-2 w-4 h-4" /> Propose New Workshop
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {workshops.map(ws => {
          const dateObj = new Date(ws.scheduledAt);
          const day = dateObj.getDate();
          const month = format(dateObj, "MMM");
          const time = format(dateObj, "h:mm a");
          const isUpcoming = ws.status !== 'completed' && ws.status !== 'cancelled';
          return (
            <Card key={ws.id} className="border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
               <div className="sm:flex">
                  <div className={`sm:w-48 flex flex-col justify-center items-center p-6 border-b sm:border-b-0 sm:border-r border-slate-100 ${isUpcoming ? 'bg-primary/5' : 'bg-slate-50'}`}>
                     <div className="text-4xl font-black text-slate-800 tracking-tighter">{day}</div>
                     <div className="font-bold text-slate-500 uppercase tracking-widest text-xs mt-1">{month}</div>
                  </div>
                  <div className="flex-1 p-6">
                     <div className="flex justify-between items-start mb-2">
                       <Badge variant={isUpcoming ? 'default' : 'secondary'} className={isUpcoming?'bg-primary':''}>{ws.status.replace('_', ' ')}</Badge>
                       <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4"/></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></Button>
                       </div>
                     </div>
                     <h3 className="text-xl font-bold text-slate-900 mb-4">{ws.title}</h3>
                     <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                       <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {time} ({ws.duration})</span>
                       <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {ws.registeredStudents?.length || 0} Registered</span>
                     </div>
                  </div>
                  {isUpcoming && ws.status === 'approved' && (
                    <div className="bg-slate-50 sm:w-40 p-6 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-slate-100">
                       <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-sm" onClick={() => window.open(ws.meetingLink, '_blank')}><Video className="w-4 h-4 mr-2" /> Launch</Button>
                    </div>
                  )}
               </div>
            </Card>
          );
        })}
        {workshops.length === 0 && (
          <div className="p-10 border border-dashed rounded-xl border-slate-300 text-center bg-slate-50">
             <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-slate-700">No workshops proposed</h3>
             <p className="text-slate-500 mt-2 text-sm">Create group classes to reach more students at once.</p>
          </div>
        )}
      </div>
    </div>
  );
}