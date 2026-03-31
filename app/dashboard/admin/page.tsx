"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileQuestion, Activity, ShieldAlert, GraduationCap, ArrowUpRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ students: 0, volunteers: 0, pendingApps: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const studentQuery = query(collection(db, "users"), where("role", "==", "student"));
        const volQuery = query(collection(db, "users"), where("role", "==", "volunteer"), where("status", "==", "active"));
        const pendingQuery = query(collection(db, "volunteer_applications"), where("status", "==", "pending"));

        const [stSnap, volSnap, appSnap] = await Promise.all([
          getCountFromServer(studentQuery),
          getCountFromServer(volQuery),
          getCountFromServer(pendingQuery)
        ]);

        setStats({
          students: stSnap.data().count,
          volunteers: volSnap.data().count,
          pendingApps: appSnap.data().count,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
           <ShieldCheck className="w-8 h-8 text-primary" /> NGO Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Platform overview, volunteer verification pipeline, and system health.</p>
      </div>

      {/* CORE ALERTS */}
      {stats.pendingApps > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
           <div className="flex items-start sm:items-center gap-3">
             <div className="bg-red-100 p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0">
               <ShieldAlert className="w-5 h-5 text-red-600" />
             </div>
             <div>
               <h3 className="text-red-900 font-bold text-sm">Action Required: {stats.pendingApps} Pending Verification{stats.pendingApps === 1 ? '' : 's'}</h3>
               <p className="text-red-700 text-xs mt-0.5">New mentor applications require your manual review before they can start volunteering.</p>
             </div>
           </div>
           <Link href="/dashboard/admin/applications" className="shrink-0 w-full sm:w-auto">
             <Button variant="outline" size="sm" className="w-full bg-white text-red-700 border-red-200 hover:bg-red-50">Review Now</Button>
           </Link>
        </div>
      )}

      {/* SYSTEM METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
            <GraduationCap className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{loading ? '-' : stats.students}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
              Live from Database
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Volunteers</CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{loading ? '-' : stats.volunteers}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
              Fully Approved
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Apps</CardTitle>
            <FileQuestion className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600">{loading ? '-' : stats.pendingApps}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting ID Verification</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Ongoing Sessions</CardTitle>
            <Activity className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">0</div>
            <p className="text-xs text-slate-500 mt-1">Coming Soon</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Server Logs */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Platform Activity</CardTitle>
            <CardDescription>System events from the last 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "10 min ago", log: "New Volunteer Application submitted (user_8021)" },
                { time: "1 hour ago", log: "Match algorithm successfully paired 14 students." },
                { time: "3 hours ago", log: "User login threshold warning triggered on proxy.ts" },
                { time: "5 hours ago", log: "Database backup completed successfully." }
              ].map((event, i) => (
                <div key={i} className="flex gap-4 items-start text-sm border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                  <span className="text-slate-400 w-20 shrink-0 tabular-nums">{event.time}</span>
                  <span className="font-mono text-slate-700">{event.log}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>NGO Tools</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Link href="/dashboard/admin/applications" className="group">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all flex items-center justify-between">
                   <div>
                     <h4 className="font-bold text-slate-900 group-hover:text-primary">Verification Engine</h4>
                     <p className="text-xs text-slate-500 mt-1">Review injected ID documents and approve pending applications.</p>
                   </div>
                   <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                </div>
             </Link>
             <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between opacity-50 cursor-not-allowed">
                <div>
                  <h4 className="font-bold text-slate-900">Manage Algorithmic Matching</h4>
                  <p className="text-xs text-slate-500 mt-1">Force manual pairs or tweak chronological weighting.</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
