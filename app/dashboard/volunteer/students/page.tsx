"use client";

import { useEffect, useState } from "react";
import { getDocument, getDocuments } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { Volunteer, Student } from "@/types";
import { documentId, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin, CheckCircle2, UserCircle, Star, MessageSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function VolunteerStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      if (!auth.currentUser) return;
      try {
        const doc = await getDocument<Volunteer>("users", auth.currentUser.uid);
        if (doc && doc.studentsAssigned && doc.studentsAssigned.length > 0) {
           const studentDocs = await getDocuments<Student>(
             "users", 
             where("role", "==", "student"),
             where(documentId(), "in", doc.studentsAssigned)
           );
           setStudents(studentDocs);
        }
      } catch (e) {
        console.error("Error fetching students:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading students...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Students</h1>
        <p className="text-slate-500 mt-2">Manage the students assigned to you and track their progress.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {students.map((student) => (
          <Card key={student.uid} className="border-slate-200 shadow-sm hover:border-primary/20 transition-colors">
            <CardHeader className="pb-4">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xl uppercase">
                        {student.name ? student.name.charAt(0) : <UserCircle className="w-8 h-8" />}
                     </div>
                     <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1.5 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                           <GraduationCap Icon={false} /> {student.grade || 'N/A'} • <MapPin className="w-3.5 h-3.5 ml-1" /> {student.learningPace || 'N/A'}
                        </CardDescription>
                     </div>
                  </div>
                  <Badge variant={student.status === "on-track" ? "default" : "destructive"} className={student.status === "on-track" ? "bg-emerald-500" : ""}>
                     {student.status || "unassigned"}
                  </Badge>
               </div>
            </CardHeader>
            <CardContent>
               <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Subjects</h4>
                     <p className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5 line-clamp-1 h-[28px]"><BookOpen className="w-4 h-4 text-primary shrink-0" />{student.subjects?.join(', ') || 'Various'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sessions</h4>
                     <p className="text-lg font-bold text-slate-800 flex items-center justify-center gap-1.5 h-[28px]"><CheckCircle2 className="w-4 h-4 text-primary" />{student.streak || 0} Streak</p>
                  </div>
               </div>

               <div className="mb-6">
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-semibold text-slate-700 text-sm">Course Completion</span>
                     <span className="text-sm font-bold text-slate-900">{student.progressScore || 0}%</span>
                  </div>
                  <Progress value={student.progressScore || 0} className="h-2" />
               </div>

               <div className="flex gap-3 mt-4">
                 <Button className="w-full bg-primary hover:bg-primary/90"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
                 <Button variant="outline" className="w-full">Log Session</Button>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {students.length === 0 && (
         <div className="p-10 border border-dashed rounded-xl border-slate-300 text-center bg-slate-50">
            <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No students assigned yet</h3>
            <p className="text-slate-500 mt-2">Wait for an admin to match you with a student request!</p>
         </div>
      )}
    </div>
  );
}

// Helper icon
function GraduationCap({Icon}:{Icon:boolean}) { return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }