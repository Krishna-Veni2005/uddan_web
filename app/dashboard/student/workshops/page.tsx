"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, BookOpen, ExternalLink, CalendarDays, ChevronRight } from "lucide-react";

const UPCOMING_CLASSES = [
  { id: 1, title: "Algebra Fundamentals", tutor: "Sneha V.", date: "Today, 5:00 PM", duration: "1h 30m", attendees: 12, topic: "Math", isLive: true },
  { id: 2, title: "English Communicative Skills", tutor: "Rahul M.", date: "Tomorrow, 4:00 PM", duration: "1h 00m", attendees: 8, topic: "English", isLive: false },
  { id: 3, title: "Introduction to Motion", tutor: "Karan D.", date: "Thurs, 6:00 PM", duration: "1h 30m", attendees: 15, topic: "Physics", isLive: false },
  { id: 4, title: "Civics: The Constitution", tutor: "Vikram P.", date: "Fri, 5:30 PM", duration: "1h", attendees: 20, topic: "Social Studies", isLive: false }
];

export default function StudentWorkshopsPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Live Classes</h1>
        <p className="text-slate-500 mt-2">Join interactive group sessions hosted by expert volunteers.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {UPCOMING_CLASSES.map((cls) => (
          <Card key={cls.id} className={`overflow-hidden transition-all duration-300 ${cls.isLive ? 'border-primary ring-1 ring-primary/20 shadow-md transform -translate-y-1' : 'hover:border-slate-300'}`}>
            {cls.isLive && (
              <div className="bg-primary px-4 py-1.5 flex items-center justify-between text-white text-xs font-semibold tracking-wide">
                <span className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" /> LIVE NOW
                </span>
                <span>{cls.attendees} Joining</span>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={cls.isLive ? "default" : "secondary"}>{cls.topic}</Badge>
                {!cls.isLive && <Badge variant="outline" className="text-slate-500">{cls.attendees} Registered</Badge>}
              </div>
              <CardTitle className="text-lg leading-tight">{cls.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1 text-slate-600">
                <BookOpen className="w-3.5 h-3.5" /> Instructor: {cls.tutor}
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <span className="font-medium">{cls.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{cls.duration}</span>
                  </div>
               </div>
               
               {cls.isLive ? (
                 <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
                   <Video className="w-4 h-4 mr-2" /> Join Session
                 </Button>
               ) : (
                 <Button variant="outline" className="w-full text-slate-700 font-medium group hover:bg-slate-50">
                   Register <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400 group-hover:text-primary transition-colors" />
                 </Button>
               )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Browse Recording section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
               <Video className="text-slate-400" /> Past Recordings
            </h2>
            <Button variant="ghost" className="text-primary hover:bg-primary/5">View All <ChevronRight className="w-4 h-4 ml-1" /></Button>
         </div>
         
         <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="group cursor-pointer">
                 <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden relative mb-3 border border-slate-200 group-hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                       <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md">45:20</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                          <div className="w-4 h-4 border-y-8 border-y-transparent border-l-[12px] border-l-primary ml-1" />
                       </div>
                    </div>
                 </div>
                 <h4 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">Chemistry: Atomic Structure</h4>
                 <p className="text-xs text-slate-500 mt-1">Uploaded 2 days ago</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}