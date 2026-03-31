"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter, Download, MoreHorizontal, FileText } from "lucide-react";

// Mock Student Data for Admin
const STUDENTS = [
  { id: "STU-001", name: "Rahul Sharma", grade: "10th Grade", status: "Active", joinedAt: "2026-08-14", completion: "75%", reports: 0 },
  { id: "STU-002", name: "Sneha V.", grade: "9th Grade", status: "Active", joinedAt: "2026-09-02", completion: "92%", reports: 0 },
  { id: "STU-003", name: "Karan D.", grade: "11th Grade", status: "Needs Mentor", joinedAt: "2026-10-21", completion: "0%", reports: 2 },
  { id: "STU-004", name: "Priya Patel", grade: "8th Grade", status: "At-Risk", joinedAt: "2026-05-11", completion: "30%", reports: 5 },
  { id: "STU-005", name: "Ananya S.", grade: "12th Grade", status: "Active", joinedAt: "2026-01-10", completion: "98%", reports: 0 },
  { id: "STU-006", name: "Vikram S.", grade: "6th Grade", status: "Inactive", joinedAt: "2025-11-20", completion: "15%", reports: 12 },
];

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-slate-500 mt-2">Manage all {STUDENTS.length} students enrolled in EduBridge.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
           <Button className="bg-primary hover:bg-primary/90 text-white"><UserPlus className="w-4 h-4 mr-2" /> Add Student</Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm border-t-0 border-x-0 sm:border rounded-none sm:rounded-xl">
         <CardHeader className="p-4 sm:p-6 pb-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div className="relative w-full max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <Input placeholder="Search students by name or ID..." className="pl-9 bg-white" />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="bg-white text-slate-600"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
               <Button variant="outline" size="sm" className="bg-white text-slate-600"><FileText className="w-4 h-4 mr-2" /> Generate Reports</Button>
            </div>
         </CardHeader>
         <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Student Name & ID</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Grade</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Joined Date</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Overall Progress</th>
                     <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {STUDENTS.map((student) => (
                     <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-900">{student.name}</div>
                           <div className="text-xs font-medium text-slate-500 mt-0.5">{student.id}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                        <td className="px-6 py-4">
                           <Badge variant={
                              student.status === 'Active' ? 'default' : 
                              student.status === 'Needs Mentor' ? 'secondary' :
                              student.status === 'At-Risk' ? 'destructive' : 'outline'
                           } className={
                              student.status === 'Active' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                              student.status === 'Needs Mentor' ? 'bg-amber-100 text-amber-800' : ''
                           }>
                              {student.status}
                           </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{student.joinedAt}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <span className="w-8 font-semibold text-slate-700">{student.completion}</span>
                              <div className="w-24 border bg-slate-100 rounded-full h-2 overflow-hidden">
                                 <div className="bg-primary h-full rounded-full" style={{width: student.completion}} />
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800">
                              <MoreHorizontal className="w-5 h-5" />
                           </Button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </CardContent>
         <CardFooter className="bg-slate-50 p-4 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
            Showing 1 to {STUDENTS.length} of {STUDENTS.length} entries
            <div className="flex gap-1">
               <Button variant="outline" size="sm" disabled>Previous</Button>
               <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
         </CardFooter>
      </Card>
    </div>
  );
}