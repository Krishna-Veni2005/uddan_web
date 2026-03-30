"use client";

import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { User, Student } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Award, Search, Calendar } from "lucide-react";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentProfile() {
      if (!auth.currentUser) return;
      try {
        const doc = await getDocument<Student>("students", auth.currentUser.uid);
        if (doc) setStudent(doc);
      } catch (e) {
        console.error("Error fetching student profile", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStudentProfile();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-slate-500 animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {student?.name?.split(' ')[0] || "Student"}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Ready to continue your learning journey today?</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm">
            <Trophy className="w-4 h-4" /> {student?.streak || 0} Day Streak
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
            <Award className="w-4 h-4" /> {student?.progressScore || 0} XP
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions / Stats */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">0</div>
            <p className="text-xs text-muted-foreground">No sessions scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{student?.subjects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active learning paths</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Find a Tutor</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <button className="w-full mt-2 py-2 px-4 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors">
              Browse Volunteers
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>
              Recent tasks sent by your volunteer mentors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-8 w-8 text-slate-400" />
                <h3 className="font-semibold text-slate-700">All caught up!</h3>
                <p className="text-sm text-slate-500">You don't have any pending assignments right now.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recommended Matches</CardTitle>
            <CardDescription>
              AI-suggested volunteers for your specific curiosities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student?.curiosities && student.curiosities.length > 0 ? (
                <div className="text-sm text-slate-500 italic">Finding matches based on: {student.curiosities.join(", ")}</div>
              ) : null}
              
              <div className="flex flex-col gap-3">
                {/* Placeholder Matches */}
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        V{i}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">Volunteer Alumnus</p>
                        <p className="text-xs text-slate-500">Excels in Science, English</p>
                      </div>
                    </div>
                    <button className="text-sm text-primary font-medium hover:underline">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
