"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Award, Star, BookOpen, ExternalLink, GraduationCap, MapPin } from "lucide-react";

const ASSIGNED_TUTORS = [
  { id: 1, name: "Dr. Vikram P.", subject: "Physics", rating: 4.9, sessions: 12, location: "Delhi Univ", topics: ["Kinematics", "Optics"] },
  { id: 2, name: "Sneha V.", subject: "Math", rating: 4.8, sessions: 8, location: "IIT Bombay", topics: ["Algebra", "Trigonometry"] }
];

const SESSION_HISTORY = [
  { date: "Oct 12, 5:00 PM", duration: "60 min", topic: "Quadratic Equations", tutor: "Sneha V.", status: "Completed" },
  { date: "Oct 10, 4:30 PM", duration: "45 min", topic: "Intro to Motion", tutor: "Dr. Vikram P.", status: "Completed" },
  { date: "Oct 05, 5:00 PM", duration: "60 min", topic: "Polynomials", tutor: "Sneha V.", status: "Completed" },
]

export default function StudentSessionsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Tutoring Sessions</h1>
        <p className="text-slate-500 mt-2">Manage your 1-on-1 sessions and connect with your assigned mentors.</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Award className="text-primary" /> Active Mentors</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ASSIGNED_TUTORS.map((tutor) => (
            <Card key={tutor.id} className="border-slate-200 shadow-sm flex flex-col">
              <CardContent className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl font-bold">
                       {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{tutor.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {tutor.location}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {tutor.rating}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <BookOpen className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-600">Mentoring in <strong className="text-slate-900">{tutor.subject}</strong></span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-600 font-medium">Focus: {tutor.topics.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex gap-2">
                 <Button className="w-full bg-primary hover:bg-primary/90">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                 </Button>
                 <Button variant="outline" className="w-full hover:bg-slate-100">
                    Request Session
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-bold text-slate-800">Session History</h2>
           <Button variant="ghost" size="sm" className="text-primary">Download Log</Button>
        </div>
        <div className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                    <th className="p-4 font-semibold text-slate-700">Date & Time</th>
                    <th className="p-4 font-semibold text-slate-700">Tutor</th>
                    <th className="p-4 font-semibold text-slate-700">Topic</th>
                    <th className="p-4 font-semibold text-slate-700">Duration</th>
                    <th className="p-4 font-semibold text-slate-700">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {SESSION_HISTORY.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="p-4 text-slate-900 font-medium">{row.date}</td>
                       <td className="p-4 text-slate-600">{row.tutor}</td>
                       <td className="p-4 text-slate-700">{row.topic}</td>
                       <td className="p-4 text-slate-500">{row.duration}</td>
                       <td className="p-4">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">{row.status}</Badge>
                       </td>
                    </tr>
                 ))}
                 {SESSION_HISTORY.length === 0 && (
                    <tr>
                       <td colSpan={5} className="p-8 text-center text-slate-500">No past sessions found.</td>
                    </tr>
                 )}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}