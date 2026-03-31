"use client";

import { useEffect, useState } from "react";
import { getDocument, getDocuments } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { User, Volunteer, Student } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Clock, FileText, Settings, BadgeCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentId, where } from "firebase/firestore";

export default function VolunteerDashboardPage() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!auth.currentUser) return;
      try {
        const doc = await getDocument<Volunteer>("users", auth.currentUser.uid);
        if (doc) {
           setVolunteer(doc);
           
           if (doc.studentsAssigned && doc.studentsAssigned.length > 0) {
              // Fetch students
              const studentDocs = await getDocuments<Student>(
                "users", 
                where("role", "==", "student"),
                where(documentId(), "in", doc.studentsAssigned)
              );
              setStudents(studentDocs);
           }
        }
      } catch (e) {
        console.error("Error fetching volunteer dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {volunteer?.name?.split(' ')[0] || "Mentor"}!
          </h1>
          <p className="text-slate-500 mt-1">Ready to make a difference today?</p>
        </div>
        <div className="flex items-center gap-3">
          {volunteer?.status === "active" ? (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
               <BadgeCheck className="w-4 h-4" /> Active Mentor
             </span>
          ) : (
             <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
               <Clock className="w-4 h-4" /> Pending Verification
             </span>
          )}
        </div>
      </div>

      {volunteer?.status === "inactive" ? (
        <Card className="shadow-sm border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Application Under Review
            </CardTitle>
            <CardDescription className="text-amber-700">
              Your mentor application is currently being verified by the EduBridge admin team. 
              This usually takes 24-48 hours. Once verified, you will be able to start accepting student requests here!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Quick Stats */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Students</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{volunteer?.studentsAssigned?.length || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Total assigned students</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Hours Taught</CardTitle>
                <Clock className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{volunteer?.sessionsCompleted || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Total sessions completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main section spanning 2 cols */}
            <Card className="col-span-1 lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>My Students</CardTitle>
                <CardDescription>
                  Manage your currently assigned students and upcoming sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500">You have {students.length} assigned students.</p>
                     <div className="grid gap-4 sm:grid-cols-2">
                        {students.map(student => (
                           <div key={student.uid} className="flex flex-col border border-slate-200 rounded-lg p-4 bg-white shadow-sm">
                              <div className="flex items-center gap-3 mb-3">
                                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {student.name.charAt(0)}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{student.name}</p>
                                    <p className="text-xs text-slate-500 truncate flex items-center gap-1"><GraduationCap className="w-3 h-3"/> Grade {student.grade}</p>
                                 </div>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 mb-2 line-clamp-1">Subjects: <span className="text-slate-500 font-normal">{student.subjects?.join(', ') || 'Various'}</span></p>
                              <Button size="sm" variant="secondary" className="w-full mt-auto">View Profile</Button>
                           </div>
                        ))}
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50/80 rounded-lg border border-dashed border-slate-300">
                    <Users className="w-10 h-10 text-slate-400 mb-3" />
                    <h3 className="font-semibold text-slate-700">No students assigned yet</h3>
                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                      Once your profile matches with a student requiring help in your selected subjects ({volunteer?.subjects?.join(", ") || "various"}), they will appear here.
                    </p>
                    <Button className="mt-4" variant="outline" onClick={() => {}}>Browse Open Requests</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Side section spanning 1 col */}
            <Card className="col-span-1 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Match Requests</CardTitle>
                <CardDescription>
                  Students waiting for a mentor
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col items-center justify-center p-6 text-center border overflow-hidden rounded-lg bg-slate-50 border-slate-200">
                    <div className="text-sm text-slate-500">No match requests right now. Your schedule is clear!</div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
