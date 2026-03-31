"use client";

import { useEffect, useState } from "react";
import { getDocuments } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Session, Student } from "@/types";
import { where, documentId } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Clock, CalendarDays, MoreVertical } from "lucide-react";
import { format } from "date-fns";

export default function VolunteerSessionsPage() {
  const [sessions, setSessions] = useState<(Session & { studentName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      if (!auth.currentUser) return;
      try {
        const docs = await getDocuments<Session>("sessions", where("volunteerId", "==", auth.currentUser.uid));
        docs.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
        
        // Fetch student names
        const studentIds = [...new Set(docs.map(s => s.studentId))];
        let studentMap: Record<string, string> = {};
        
        if (studentIds.length > 0) {
           const studentDocs = await getDocuments<Student>("users", where(documentId(), "in", studentIds.slice(0, 30)));
           studentDocs.forEach(s => { studentMap[s.uid] = s.name; });
        }
        
        const merged = docs.map(d => ({ ...d, studentName: studentMap[d.studentId] || 'Student' }));
        setSessions(merged);
      } catch (e) {
        console.error("Error fetching sessions:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sessions</h1>
          <p className="text-slate-500 mt-2">Manage 1-on-1 tutoring sessions with your assigned students.</p>
        </div>
        <Button className="font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm">
           <PlusCircle className="mr-2 w-4 h-4" /> Schedule Session
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-2">
         <div className="md:col-span-2 space-y-4">
            <h2 className="font-bold text-slate-800 text-lg">Upcoming & Past Sessions</h2>
            {sessions.map(session => {
               const dateObj = new Date(session.scheduledAt);
               const dateStr = format(dateObj, "MMM dd, yyyy");
               const timeStr = format(dateObj, "h:mm a");
               const isToday = new Date().toDateString() === dateObj.toDateString();
               const displayDate = isToday ? 'Today' : dateStr;
               
               return (
               <Card key={session.id} className="border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                  <CardContent className="p-0 flex items-stretch">
                     <div className={`p-4 flex flex-col items-center justify-center border-r border-slate-100 min-w-[100px] ${isToday ? 'bg-primary/10 text-primary' : 'bg-slate-50 text-slate-600'}`}>
                        <CalendarDays className="w-5 h-5 mb-1" />
                        <span className="text-sm font-bold tracking-tight text-center">{displayDate}</span>
                     </div>
                     <div className="p-4 flex-1 flex justify-between items-center">
                        <div>
                           <h3 className="font-bold text-slate-900 text-base">{session.subject} {session.type}</h3>
                           <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5" /> {timeStr} • with {session.studentName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <Badge variant={session.status === 'completed' ? 'secondary' : 'default'} className={session.status === 'scheduled' ? 'bg-emerald-500 hover:bg-emerald-500 text-white' : ''}>{session.status}</Badge>
                           <Button variant="ghost" size="icon" className="text-slate-400"><MoreVertical className="w-5 h-5" /></Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )})}
            {sessions.length === 0 && (
               <div className="p-10 border border-dashed rounded-xl border-slate-300 text-center bg-slate-50 mt-4">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700">No sessions scheduled</h3>
                  <p className="text-slate-500 mt-2 text-sm">Click the top button to schedule a 1-on-1 class with one of your assigned students.</p>
               </div>
            )}
         </div>
         
         <div className="md:col-span-1">
            <Card className="bg-slate-50 border-slate-200 shadow-sm sticky top-6">
               <CardHeader className="pb-3">
                  <CardTitle className="text-base text-slate-800">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start bg-white"><CalendarDays className="w-4 h-4 mr-2 text-slate-400" /> Sync with Google Calendar</Button>
                  <Button variant="outline" className="w-full justify-start bg-white text-slate-600"><PlusCircle className="w-4 h-4 mr-2 text-slate-400" /> Log external session</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}