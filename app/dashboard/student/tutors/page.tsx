"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Award, Star, BookOpen, ExternalLink, GraduationCap, MapPin } from "lucide-react";

const ASSIGNED_TUTORS = [
  { 
    id: "T-892", 
    name: "Rahul Sharma", 
    role: "Mathematics Mentor", 
    university: "Indian Institute of Technology, Bombay", 
    location: "Mumbai, Maharashtra",
    bio: "Hi! I'm a 3rd year Computer Science major. I absolutely love breaking down complex algebra into highly visual pieces. I've been teaching middle schoolers for 2 years and believe anyone can be a math genius with the right pacing.",
    rating: 4.9, 
    sessionsHeld: 42,
    subjects: ["Mathematics", "Physics"],
    status: "online"
  },
  { 
    id: "T-893", 
    name: "Priya Patel", 
    role: "English & Literature Mentor", 
    university: "Delhi University", 
    location: "Delhi",
    bio: "Current Master's student focusing on modern literature. I focus heavily on reading comprehension and grammar mechanics using fun, interactive short stories. Let's make reading your favorite hobby!",
    rating: 4.7, 
    sessionsHeld: 18,
    subjects: ["English", "History"],
    status: "offline"
  }
];

export default function MyTutorsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Mentors</h1>
          <p className="text-slate-500 mt-1">Get to know the college volunteers dedicated to helping you succeed.</p>
        </div>
        <Button variant="outline" className="shrink-0 bg-white">Request New Mentor</Button>
      </div>

      <div className="grid gap-8">
        {ASSIGNED_TUTORS.map((tutor) => (
          <Card key={tutor.id} className="overflow-hidden shadow-sm border-slate-200">
            {/* Top color bar */}
            <div className="h-4 w-full bg-gradient-to-r from-primary to-blue-400"></div>
            
            <div className="p-6 sm:p-8 sm:flex gap-8 items-start">
              {/* Profile Block */}
              <div className="flex flex-col items-center sm:items-start shrink-0 mb-6 sm:mb-0">
                <div className="relative">
                  <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-md">
                    <AvatarFallback className="bg-slate-100 text-3xl font-bold text-slate-400">
                      {tutor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {tutor.status === "online" && (
                    <span className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></span>
                  )}
                </div>
                
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button variant="outline" className="w-full text-slate-600">
                    <ExternalLink className="w-4 h-4 mr-2" /> Shared Files
                  </Button>
                </div>
              </div>

              {/* Detailed Core Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{tutor.name}</h2>
                    <p className="font-medium text-primary flex items-center gap-1.5 mt-1">
                      <Award className="w-4 h-4" /> {tutor.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                     <div className="flex items-center gap-1">
                       <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
                       <span className="font-bold text-slate-900">{tutor.rating}</span>
                     </div>
                     <div className="w-px h-6 bg-slate-200"></div>
                     <div className="text-sm font-medium text-slate-600">
                       {tutor.sessionsHeld} Sessions
                     </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 mt-4">
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {tutor.university}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {tutor.location}</span>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">About Your Mentor</h4>
                    <p className="text-sm leading-relaxed text-slate-600">
                      "{tutor.bio}"
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Target Subects</h4>
                    <div className="flex flex-wrap gap-2">
                       {tutor.subjects.map(s => (
                         <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md">
                           <BookOpen className="w-3 h-3 mr-1.5" /> {s}
                         </Badge>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
