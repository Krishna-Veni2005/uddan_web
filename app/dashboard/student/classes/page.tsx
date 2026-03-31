"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Video, BookOpen, ExternalLink, CalendarDays, ChevronRight } from "lucide-react";

const UPCOMING_CLASSES = [
  { id: 1, subject: "Mathematics", topic: "Algebra: Linear Equations", date: "Today, 4:00 PM", duration: "60 min", tutor: "Rahul S.", mode: "Online", link: "#", status: "upcoming" },
  { id: 2, subject: "Physics", topic: "Kinematics & Motion", date: "Tomorrow, 5:30 PM", duration: "45 min", tutor: "Anita Desai", mode: "Online", link: "#", status: "upcoming" },
];

const PAST_CLASSES = [
  { id: 3, subject: "Mathematics", topic: "Fractions & Decimals Review", date: "Last Monday, 4:00 PM", tutor: "Rahul S.", rating: 5, notes: "Excellent progress made on dividing fractions." },
  { id: 4, subject: "English", topic: "Grammar: Past Tense", date: "Last Wednesday, 6:00 PM", tutor: "Priya P.", rating: 4, notes: "Need slightly more practice on irregular verbs." },
];

export default function MyClassesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Classes</h1>
        <p className="text-slate-500 mt-1">View your schedule, join active sessions, and review past notes.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Main Schedule Column */}
        <div className="md:col-span-2 space-y-8">
          
          <section>
            <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
              <CalendarDays className="w-5 h-5" /> Upcoming Sessions
            </div>
            {UPCOMING_CLASSES.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {UPCOMING_CLASSES.map((session, i) => (
                  <div key={session.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Timeline Dot */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Clock className="w-4 h-4" />
                    </div>
                    {/* Card */}
                    <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] shadow-sm border-slate-200 group-hover:shadow-md transition-shadow">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{session.subject}</Badge>
                          <span className="text-xs font-medium text-slate-500">{session.date}</span>
                        </div>
                        <CardTitle className="text-base mt-2">{session.topic}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                           <Avatar className="w-6 h-6 border border-slate-200"><AvatarFallback className="text-[10px] bg-slate-100">{session.tutor.charAt(0)}</AvatarFallback></Avatar>
                           <span>with <span className="font-semibold">{session.tutor}</span></span>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90 flex gap-2">
                          <Video className="w-4 h-4" /> Join Online Session
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed rounded-xl border-slate-300 bg-slate-50">
                <p className="text-slate-500">No upcoming classes scheduled.</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold mt-12 border-t pt-8">
              <BookOpen className="w-5 h-5 text-slate-400" /> Past Transcripts
            </div>
            <div className="space-y-4">
              {PAST_CLASSES.map(past => (
                <Card key={past.id} className="border-slate-200 shadow-none hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                     <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                       <span className="font-bold text-slate-400">{past.rating}/5</span>
                     </div>
                     <div className="flex-1 min-w-0 text-center sm:text-left">
                       <h4 className="font-bold text-slate-900 truncate">{past.topic}</h4>
                       <p className="text-xs text-slate-500 mt-1">{past.date} • {past.tutor}</p>
                       <p className="text-sm text-slate-600 mt-2 truncate">"{past.notes}"</p>
                     </div>
                     <Button variant="ghost" size="sm" className="shrink-0 text-primary">
                       Review <ChevronRight className="w-4 h-4 ml-1" />
                     </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary to-accent border-0 text-white shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg opacity-90">Learning Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black">12 Days</div>
              <p className="text-sm opacity-80 mt-1">You're in the top 10% of active students this week! Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-slate-600">
                <Calendar className="w-4 h-4 mr-2" /> Request Reschedule
              </Button>
              <Button variant="outline" className="w-full justify-start text-slate-600">
                <ExternalLink className="w-4 h-4 mr-2" /> View Course Material
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
