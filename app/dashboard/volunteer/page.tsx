"use client";

import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { User, Volunteer } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Users, Clock, FileText, Settings, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VolunteerDashboardPage() {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!auth.currentUser) return;
      try {
        const doc = await getDocument<Volunteer>("volunteers", auth.currentUser.uid);
        if (doc) setVolunteer(doc);
      } catch (e) {
        console.error("Error fetching volunteer profile", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
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
                <div className="text-2xl font-bold text-slate-900">0</div>
                <p className="text-xs text-muted-foreground mt-1">Total volunteer hours</p>
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
                {volunteer?.studentsAssigned && volunteer.studentsAssigned.length > 0 ? (
                  <div className="space-y-4">
                     <p className="text-sm text-slate-500">You have {volunteer.studentsAssigned.length} assigned students.</p>
                     {/* Student cards would generate here */}
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
                 <div className="space-y-3">
                   {[1, 2].map(i => (
                     <div key={i} className="p-3 border border-slate-200 rounded-md bg-white">
                       <div className="flex justify-between items-start mb-2">
                         <div>
                           <p className="font-semibold text-sm">Class 8 Student</p>
                           <p className="text-xs text-slate-500">Needs help with Mathematics</p>
                         </div>
                         <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">95% Match</span>
                       </div>
                       <div className="flex gap-2 mt-3">
                         <Button size="sm" className="w-full text-xs h-7">Accept</Button>
                         <Button size="sm" variant="outline" className="w-full text-xs h-7">Ignore</Button>
                       </div>
                     </div>
                   ))}
                 </div>
              </CardContent>
              <CardFooter className="pt-0">
                 <Button variant="ghost" className="w-full text-xs text-primary">View all requests</Button>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
