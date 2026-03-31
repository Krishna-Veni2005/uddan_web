"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Search, Filter, Plus, FileText, Video, ImageIcon, 
  Languages, Star, Share2, ArrowRight, PlayCircle, Trophy, ThumbsUp
} from "lucide-react";
import toast from "react-hot-toast";

// Dummy Platform Resources
const PLATFORM_RESOURCES = [
  { id: "1", title: "NCERT Grade 8 Science Ch-4", type: "PDF", subject: "Science", grade: "8", difficulty: "Complex" },
  { id: "2", title: "Advanced Algebra Fundamentals", type: "Video", subject: "Math", grade: "9-10", difficulty: "Complex" },
  { id: "3", title: "Grammar: Tenses Overview", type: "Guide", subject: "English", grade: "6-8", difficulty: "Medium" }
];

export default function ResourceStudioPage() {
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedRef, setSelectedRef] = useState<any>(null);
  
  // Create Form State
  const [createType, setCreateType] = useState<"notes" | "video" | "image" | "vernacular">("notes");
  const [contentTitle, setContentTitle] = useState("");
  const [contentText, setContentText] = useState("");

  const handleUseReference = (ref: any) => {
    setSelectedRef(ref);
    setActiveTab("create");
    setContentTitle(`Simplified: ${ref.title}`);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim()) {
      toast.error("Please add a title");
      return;
    }
    toast.success("Successfully published to Student Resources!");
    setSelectedRef(null);
    setContentTitle("");
    setContentText("");
    setActiveTab("my-content");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600" /> Resource Studio
          </h1>
          <p className="text-slate-500 mt-1">Transform complex educational material into simple, accessible content for students.</p>
        </div>
        <div className="bg-white px-4 py-2 flex items-center gap-3 rounded-full border border-slate-200 shadow-sm">
           <Trophy className="w-5 h-5 text-amber-500" />
           <div className="text-sm">
             <span className="font-semibold text-slate-800">450</span>
             <span className="text-slate-500 ml-1">Contribution Score</span>
           </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-white border border-slate-200 p-1 mb-6 rounded-xl h-auto">
          <TabsTrigger value="browse" className="py-2.5 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Browse</TabsTrigger>
          <TabsTrigger value="create" className="py-2.5 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">Create</TabsTrigger>
          <TabsTrigger value="my-content" className="py-2.5 rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700">My Content</TabsTrigger>
        </TabsList>

        {/* TIER 1: BROWSE PLATFORM RESOURCES */}
        <TabsContent value="browse" className="animate-in fade-in duration-300">
          <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search complex platform materials by topic..." className="pl-10 bg-slate-50 border-transparent focus-visible:bg-white" />
            </div>
            <Button variant="outline" className="shrink-0"><Filter className="w-4 h-4 mr-2" /> Filters</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_RESOURCES.map(res => (
              <Card key={res.id} className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="bg-slate-50">{res.type}</Badge>
                    <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-100">{res.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{res.title}</CardTitle>
                  <CardDescription>Grade {res.grade} • {res.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    Official curriculum material. Often too dense for struggling students. Needs simplification.
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex gap-2">
                  <Button variant="outline" className="w-full text-xs h-9 bg-slate-50" onClick={() => window.open("#", "_blank")}>
                    <PlayCircle className="w-4 h-4 mr-2" /> View Original
                  </Button>
                  <Button className="w-full text-xs h-9 bg-indigo-600 hover:bg-indigo-700" onClick={() => handleUseReference(res)}>
                    Use as Reference <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TIER 2: CREATE CONTENT */}
        <TabsContent value="create" className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-6">
              <Card className="border-0 shadow-lg ring-1 ring-slate-200">
                <CardHeader className="border-b border-slate-100 bg-white rounded-t-xl">
                  <CardTitle>Draft Simplified Content</CardTitle>
                  <CardDescription>Break down complex topics into bite-sized, easy to understand pieces.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5 bg-slate-50/30">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-fit">
                    {[
                      { id: "notes", icon: FileText, label: "Easy Notes" },
                      { id: "vernacular", icon: Languages, label: "Vernacular Text" },
                      { id: "video", icon: Video, label: "Short Video" },
                      { id: "image", icon: ImageIcon, label: "Visual Guide" }
                    ].map(t => (
                      <button 
                        key={t.id}
                        type="button"
                        onClick={() => setCreateType(t.id as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${createType === t.id ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        <t.icon className="w-4 h-4" /> {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-800">Content Title</label>
                    <Input placeholder="E.g., Photosynthesis explained like a recipe..." value={contentTitle} onChange={e => setContentTitle(e.target.value)} className="bg-white" />
                  </div>

                  {createType === "notes" || createType === "vernacular" ? (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-800">
                        {createType === "vernacular" ? "Explanation in Local Language" : "Simplified Notes"}
                      </label>
                      <Textarea 
                        placeholder="Write your explanation here. Keep sentences short, use analogies, and avoid jargon..." 
                        className="min-h-[250px] bg-white resize-y" 
                        value={contentText}
                        onChange={e => setContentText(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-white">
                       <Plus className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                       <p className="font-medium text-slate-700">Upload {createType === "video" ? "MP4 Video" : "PNG/JPG Image"}</p>
                       <p className="text-xs text-slate-500 mt-1">Max file size: {createType === "video" ? "50MB" : "5MB"}</p>
                       <Button variant="outline" className="mt-4">Select File</Button>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button onClick={handlePublish} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
                      <Share2 className="w-4 h-4 mr-2" /> Publish to Student App
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1 space-y-6">
              {selectedRef ? (
                <Card className="border-indigo-100 bg-indigo-50/30">
                  <CardHeader>
                    <CardTitle className="text-indigo-900 text-base">Referencing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white p-3 rounded-lg border border-indigo-100 text-sm">
                      <span className="font-semibold block mb-1 text-slate-800">{selectedRef.title}</span>
                      <span className="text-slate-500">{selectedRef.subject} • Grade {selectedRef.grade}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-3 text-indigo-600 h-8 px-2" onClick={() => setSelectedRef(null)}>
                      Remove Reference
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed shadow-none">
                  <CardContent className="py-8 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm">Browse platform resources to link your content to the official curriculum.</p>
                    <Button variant="link" onClick={() => setActiveTab("browse")}>Browse Now</Button>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-slate-800">Tagging</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Subject</label>
                    <select className="w-full flex h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>Science</option><option>Math</option></select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Grade Level</label>
                    <select className="w-full flex h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>Grade 8</option></select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Language</label>
                    <select className="w-full flex h-9 rounded-md border border-slate-200 bg-white px-3 text-sm"><option>English</option><option>Hindi</option><option>Telugu</option></select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TIER 3: MY CONTENT */}
        <TabsContent value="my-content" className="animate-in fade-in duration-300">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dummy created content */}
            {[1, 2].map(i => (
              <Card key={i} className="shadow-sm border-slate-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">Easy Notes</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">Simplified: Force and Pressure</CardTitle>
                  <CardDescription>Grade 8 • Science • English</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4 text-green-600" /> 42 Helpful</div>
                      <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-500" /> 4.8 / 5</div>
                   </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between border-t border-slate-100 mt-4 pt-4">
                  <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">Edit content</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}