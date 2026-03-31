"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, PlayCircle, Book, Archive, Lightbulb } from "lucide-react";

const RESOURCES = [
  { id: 1, title: "Algebra Formula Cheat Sheet", type: "PDF", subject: "Math", size: "1.2 MB", icon: FileText, color: "text-blue-500 bg-blue-100" },
  { id: 2, title: "Photosynthesis Animated Guide", type: "Video", subject: "Science", size: "45 MB", icon: PlayCircle, color: "text-red-500 bg-red-100" },
  { id: 3, title: "English Grammar Rules 101", type: "Doc", subject: "English", size: "3.4 MB", icon: Book, color: "text-emerald-500 bg-emerald-100" },
  { id: 4, title: "Mock Test Paper (Previous Year)", type: "Archive", subject: "Mixed", size: "15 MB", icon: Archive, color: "text-purple-500 bg-purple-100" },
  { id: 5, title: "Newton's Laws Flashcards", type: "Web", subject: "Physics", size: "Link", icon: Lightbulb, color: "text-amber-500 bg-amber-100" },
  { id: 6, title: "Trigonometry Basics", type: "PDF", subject: "Math", size: "2.1 MB", icon: FileText, color: "text-blue-500 bg-blue-100" },
];

const CATEGORIES = ["All", "Math", "Science", "English", "Physics", "Mixed"];

export default function StudentResourcesPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = RESOURCES.filter(r => activeTab === "All" || r.subject === activeTab);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resource Library</h1>
          <p className="text-slate-500 mt-2">Study materials, notes, and recordings curated for you.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <Input placeholder="Search resources..." className="pl-9 bg-white" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
         {CATEGORIES.map(cat => (
           <Button
             key={cat}
             variant={activeTab === cat ? "default" : "outline"}
             className={activeTab === cat ? "bg-primary text-white" : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"}
             onClick={() => setActiveTab(cat)}
           >
             {cat}
           </Button>
         ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((res) => {
          const Icon = res.icon;
          return (
            <Card key={res.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${res.color}`}>
                     <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-slate-500 bg-slate-50">{res.type}</Badge>
                </div>
                
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[48px]">
                   {res.title}
                </h3>
                
                <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                   <div className="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-700">{res.subject}</div>
                   <span>•</span>
                   <span>{res.size}</span>
                </div>
                
                <Button variant="secondary" className="w-full mt-5 bg-slate-100 group-hover:bg-primary group-hover:text-white transition-colors">
                   <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
         <div className="text-center py-20 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No resources found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">Check back later or try clearing your search filters to find what you're looking for.</p>
         </div>
      )}
    </div>
  );
}