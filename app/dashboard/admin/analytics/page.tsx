"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Clock, Activity, TrendingUp } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY_DATA = [
  { name: "Jan", users: 400, sessions: 240, amt: 2400 },
  { name: "Feb", users: 600, sessions: 339, amt: 2210 },
  { name: "Mar", users: 1100, sessions: 580, amt: 2290 },
  { name: "Apr", users: 1400, sessions: 790, amt: 2000 },
  { name: "May", users: 2100, sessions: 1300, amt: 2181 },
  { name: "Jun", users: 2350, sessions: 1800, amt: 2500 },
  { name: "Jul", users: 3490, sessions: 2300, amt: 2100 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Platform Analytics</h1>
        <p className="text-slate-500 mt-2">Macro-level insights to monitor growth, engagement, and dropout risks.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <Card className="border-slate-200">
            <CardContent className="p-6">
               <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">Total Users</h3>
                  <Users className="h-4 w-4 text-emerald-500" />
               </div>
               <div className="text-3xl font-bold text-slate-900">5,840</div>
               <p className="text-xs text-emerald-600 font-medium flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs last month</p>
            </CardContent>
         </Card>
         <Card className="border-slate-200">
            <CardContent className="p-6">
               <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">Active Volunteers</h3>
                  <Activity className="h-4 w-4 text-primary" />
               </div>
               <div className="text-3xl font-bold text-slate-900">920</div>
               <p className="text-xs text-emerald-600 font-medium flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" /> +4.2% vs last month</p>
            </CardContent>
         </Card>
         <Card className="border-slate-200">
            <CardContent className="p-6">
               <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">Sessions Total</h3>
                  <BookOpen className="h-4 w-4 text-indigo-500" />
               </div>
               <div className="text-3xl font-bold text-slate-900">12,400</div>
               <p className="text-xs text-emerald-600 font-medium flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" /> +21.1% vs last month</p>
            </CardContent>
         </Card>
         <Card className="border-slate-200">
            <CardContent className="p-6">
               <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium text-slate-500">Hours Taught</h3>
                  <Clock className="h-4 w-4 text-amber-500" />
               </div>
               <div className="text-3xl font-bold text-slate-900">32,150</div>
               <p className="text-xs text-slate-500 mt-1">Total combined platform hours</p>
            </CardContent>
         </Card>
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
         <Card className="border-slate-200 shadow-sm">
            <CardHeader>
               <CardTitle>User Growth Mapping</CardTitle>
               <CardDescription>Number of active students mapping to platform over time.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 pb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                     <YAxis tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                        itemStyle={{fontWeight: 'bold'}}
                     />
                     <Area type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm">
            <CardHeader>
               <CardTitle>Session Engagement</CardTitle>
               <CardDescription>Metrics covering 1-on-1 calls and workshops conducted.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 pb-4">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                     <YAxis tickLine={false} axisLine={false} tick={{fill: '#64748b'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '0.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                     />
                     <Line type="monotone" dataKey="sessions" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}