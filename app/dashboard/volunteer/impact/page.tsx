"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartHandshake, BookOpen, Clock, TrendingUp, Users, Trophy, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const IMPACT_DATA = [
  { month: "Jan", hours: 15, students: 2 },
  { month: "Feb", hours: 22, students: 3 },
  { month: "Mar", hours: 18, students: 3 },
  { month: "Apr", hours: 28, students: 4 },
  { month: "May", hours: 35, students: 5 },
  { month: "Jun", hours: 30, students: 5 },
];

export default function VolunteerImpactPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Impact</h1>
        <p className="text-slate-500 mt-2">See the difference you are making in students' lives across India.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-slate-200 shadow-sm border-t-4 border-t-primary">
           <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                 <p className="font-semibold text-slate-500 text-sm tracking-wide uppercase">Hours Mentored</p>
                 <Clock className="w-5 h-5 text-primary" />
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">148</p>
              <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +12% this month</p>
           </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
           <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                 <p className="font-semibold text-slate-500 text-sm tracking-wide uppercase">Students Helped</p>
                 <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">12</p>
              <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> +3 this month</p>
           </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
           <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                 <p className="font-semibold text-slate-500 text-sm tracking-wide uppercase">Workshops Hosted</p>
                 <BookOpen className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-4xl font-black text-slate-800 tracking-tight">4</p>
              <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1">Average 25 attendees</p>
           </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm border-t-4 border-t-amber-500 bg-gradient-to-br from-white to-amber-50/30">
           <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                 <p className="font-semibold text-amber-600 text-sm tracking-wide uppercase">Volunteer Rank</p>
                 <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-800 tracking-tight mt-1 flex items-baseline gap-1">Gold <span className="text-xl font-bold text-slate-400">Tier</span></p>
              <p className="text-xs font-medium text-amber-700 mt-2 flex items-center gap-1">Top 15% of mentors</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
         <Card className="lg:col-span-2 shadow-sm border-slate-200">
            <CardHeader>
               <CardTitle>Mentoring Activity</CardTitle>
               <CardDescription>Hours dedicated over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 pb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={IMPACT_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                     <Tooltip 
                        cursor={{fill: '#F1F5F9'}}
                        contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                     />
                     <Bar dataKey="hours" name="Hours" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="shadow-sm border-slate-200">
            <CardHeader>
               <CardTitle>Milestones</CardTitle>
               <CardDescription>Unlock rewards based on hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 -z-10" />
                  
                  <div className="flex gap-4 mb-6 relative">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm">
                        <HeartHandshake className="w-4 h-4 text-emerald-600" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">50 Hours <Badge className="bg-emerald-500 font-medium py-0 h-5">Achieved</Badge></h4>
                        <p className="text-sm text-slate-500 mt-1">First Official Certificate Issued</p>
                     </div>
                  </div>

                  <div className="flex gap-4 mb-6 relative">
                     <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center shrink-0 shadow-sm">
                        <Trophy className="w-4 h-4 text-primary" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">100 Hours <Badge className="bg-primary font-medium py-0 h-5">Achieved</Badge></h4>
                        <p className="text-sm text-slate-500 mt-1">LinkedIn Recommendation Letter</p>
                     </div>
                  </div>

                  <div className="flex gap-4 relative">
                     <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center shrink-0 shadow-sm">
                        <Star className="w-4 h-4 text-slate-400" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-700">200 Hours</h4>
                        <p className="text-sm text-slate-500 mt-1">NGO Excellence Award (52 hours left)</p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}