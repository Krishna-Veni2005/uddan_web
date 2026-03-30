"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, MoreVertical, Calendar, Mail, Phone, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy Data
const MOCK_STUDENTS = [
  { id: "S-101", name: "Rahul Sharma", grade: "10th Grade", primarySubject: "Mathematics", nextSession: "Tomorrow, 4:00 PM", status: "on-track", progress: 75 },
  { id: "S-102", name: "Priya Patel", grade: "8th Grade", primarySubject: "Science", nextSession: "Friday, 5:30 PM", status: "needs-attention", progress: 40 },
  { id: "S-103", name: "Amit Kumar", grade: "12th Grade", primarySubject: "English", nextSession: "Saturday, 10:00 AM", status: "on-track", progress: 90 },
];

export default function MyStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.primarySubject.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Students</h1>
        <p className="text-slate-500 mt-1">Manage all your active mentorships and upcoming lesson plans.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search students by name or subject..." 
            className="pl-9 bg-white" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="shrink-0 bg-primary">Schedule New Session</Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No students found</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-1">
              Your search didn't match any active students. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(student => (
            <Card key={student.id} className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-3 flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{student.name}</CardTitle>
                    <CardDescription className="text-xs">{student.grade} • {student.primarySubject}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="-mt-2 -mr-2 h-8 w-8 text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Curriculum Progress</span>
                    <span className="font-medium text-slate-900">{student.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 border border-slate-200">
                    <div 
                      className={`h-1.5 rounded-full ${student.status === 'needs-attention' ? 'bg-amber-500' : 'bg-primary'}`} 
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-md">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> 
                    <span className="font-semibold text-slate-900">Next Session:</span> {student.nextSession}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex gap-2">
                <Button variant="outline" className="w-full text-xs h-8">
                  <Mail className="w-3.5 h-3.5 mr-1" /> Message
                </Button>
                <Button variant="outline" className="w-full text-xs h-8">
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Profile
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
