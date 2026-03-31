"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Star, Award, BookOpen, Flame, Medal, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function StudentPortfolioPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Learning Portfolio</h1>
        <p className="text-slate-500 mt-2">Track your progress, achievements, and mastering of concepts.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
         <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-md">
            <CardContent className="p-6">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                 <Flame className="w-6 h-6 text-white" />
               </div>
               <p className="text-indigo-100 font-medium">Study Streak</p>
               <h3 className="text-4xl font-black mt-1">14 Days</h3>
            </CardContent>
         </Card>
         
         <Card className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-md">
            <CardContent className="p-6">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                 <BookOpen className="w-6 h-6 text-white" />
               </div>
               <p className="text-teal-100 font-medium">Assigments Completed</p>
               <h3 className="text-4xl font-black mt-1">28</h3>
            </CardContent>
         </Card>
         
         <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white border-0 shadow-md">
            <CardContent className="p-6">
               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                 <Target className="w-6 h-6 text-white" />
               </div>
               <p className="text-orange-100 font-medium">Current Grade</p>
               <h3 className="text-4xl font-black mt-1">A-</h3>
            </CardContent>
         </Card>
         
         <Card className="bg-white border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10" />
            <CardContent className="p-6">
               <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                 <Trophy className="w-6 h-6 text-primary" />
               </div>
               <p className="text-slate-500 font-medium">Xp Earned</p>
               <h3 className="text-4xl font-black text-slate-800 mt-1">3,450</h3>
            </CardContent>
         </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Subject Mastery */}
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Subject Mastery</CardTitle>
               <CardDescription>Your proficiency across enrolled subjects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-semibold text-slate-700">Mathematics</span>
                     <span className="text-sm font-bold text-primary">85%</span>
                  </div>
                  <Progress value={85} className="h-2.5 bg-slate-100" />
               </div>
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-semibold text-slate-700">Physics</span>
                     <span className="text-sm font-bold text-emerald-500">72%</span>
                  </div>
                  <Progress value={72} className="h-2.5 bg-emerald-100" /> {/* Should ideally customize color per bar but skipping raw tailwind class injection into shadcn standard progress for brevity unless requested */}
               </div>
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="font-semibold text-slate-700">English Literature</span>
                     <span className="text-sm font-bold text-slate-800">92%</span>
                  </div>
                  <Progress value={92} className="h-2.5 bg-slate-100" />
               </div>
            </CardContent>
         </Card>
         
         {/* Achievements */}
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" /> Recent Achievements</CardTitle>
               <CardDescription>Badges earned during your platform journey.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid gap-3">
               <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                     <Medal className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800">Math Wizard</h4>
                     <p className="text-xs text-slate-500">Scored &gt; 90% in 3 consecutive quizzes.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                     <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800">Punctual Learner</h4>
                     <p className="text-xs text-slate-500">Attended 10 classes exactly on time.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                     <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-800">Top Performer</h4>
                     <p className="text-xs text-slate-500">Top 5% score in October Assessment.</p>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}