"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Loader2, BookOpen, Presentation, CheckCircle2 } from "lucide-react";
import { generateLessonPlan, generateWorkshopOutline } from "@/lib/claude";
import toast from "react-hot-toast";

export default function AIToolsPage() {
  const [lessonGrade, setLessonGrade] = useState("8");
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonResult, setLessonResult] = useState("");

  const [workshopSkill, setWorkshopSkill] = useState("");
  const [workshopAudience, setWorkshopAudience] = useState("Grade 6-8");
  const [workshopLoading, setWorkshopLoading] = useState(false);
  const [workshopResult, setWorkshopResult] = useState("");

  const [copiedContext, setCopiedContext] = useState<string | null>(null);

  const copyToClipboard = async (text: string, context: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedContext(context);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedContext(null), 2000);
    } catch (err) {
      toast.error("Failed to copy text.");
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTopic.trim() || lessonLoading) return;
    
    setLessonLoading(true);
    setLessonResult("");
    try {
      const result = await generateLessonPlan(lessonGrade, lessonTopic);
      setLessonResult(result);
    } catch (error) {
      toast.error("Failed to generate lesson plan");
    } finally {
      setLessonLoading(false);
    }
  };

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshopSkill.trim() || workshopLoading) return;
    
    setWorkshopLoading(true);
    setWorkshopResult("");
    try {
      const result = await generateWorkshopOutline(workshopSkill, workshopAudience);
      setWorkshopResult(result);
    } catch (error) {
      toast.error("Failed to generate workshop outline");
    } finally {
      setWorkshopLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Teaching Tools</h1>
        <p className="text-slate-500 mt-1">Supercharge your preparation with Claude AI. Instantly generate structured lesson plans and workshop outlines.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Lesson Plan Generator */}
        <Card className="shadow-sm border-slate-200 bg-white flex flex-col h-full">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100 rounded-t-xl pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900">Lesson Plan Generator</CardTitle>
                <CardDescription>Creates a 45-minute structured session.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
            <form onSubmit={handleCreateLesson} className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Target Grade</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value={lessonGrade}
                    onChange={(e) => setLessonGrade(e.target.value)}
                  >
                    {[5,6,7,8,9,10,11,12].map(g => <option key={g} value={g.toString()}>Grade {g}</option>)}
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject or Topic</label>
                  <Input 
                    placeholder="e.g. Gravity and Mass" 
                    value={lessonTopic}
                    onChange={(e) => setLessonTopic(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={lessonLoading || !lessonTopic.trim()}>
                {lessonLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : "Generate Lesson Plan"}
              </Button>
            </form>

            <div className="mt-2 flex-1 relative bg-slate-50 rounded-xl border border-slate-100 p-4 min-h-[300px]">
              {lessonLoading ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Crafting perfect timeline...</span>
                </div>
              ) : lessonResult ? (
                <div className="h-full">
                  <div className="flex justify-end mb-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(lessonResult, "lesson")} className="h-8 text-xs bg-white text-slate-600 shadow-sm">
                      {copiedContext === "lesson" ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>}
                    </Button>
                  </div>
                  <div className="prose prose-sm prose-slate max-w-none max-h-[400px] overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap">
                    {lessonResult}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  Your generated lesson plan will appear here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Workshop Outline Generator */}
        <Card className="shadow-sm border-slate-200 bg-white flex flex-col h-full">
          <CardHeader className="bg-purple-50/50 border-b border-purple-100 rounded-t-xl pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg text-slate-900">Workshop Outline</CardTitle>
                <CardDescription>Creates a hands-on skill workshop plan.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col">
             <form onSubmit={handleCreateWorkshop} className="space-y-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Audience</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={workshopAudience}
                    onChange={(e) => setWorkshopAudience(e.target.value)}
                  >
                    <option value="Grade 1-5">Grade 1-5</option>
                    <option value="Grade 6-8">Grade 6-8</option>
                    <option value="Grade 9-10">Grade 9-10</option>
                    <option value="College/Intermediate">Inter/College</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Skill or Concept</label>
                  <Input 
                    placeholder="e.g. Basic HTML/CSS" 
                    value={workshopSkill}
                    onChange={(e) => setWorkshopSkill(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={workshopLoading || !workshopSkill.trim()}>
                {workshopLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : "Generate Workshop Outline"}
              </Button>
            </form>

            <div className="mt-2 flex-1 relative bg-slate-50 rounded-xl border border-slate-100 p-4 min-h-[300px]">
              {workshopLoading ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                  <span className="text-sm font-medium">Designing activities...</span>
                </div>
              ) : workshopResult ? (
                <div className="h-full">
                  <div className="flex justify-end mb-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(workshopResult, "workshop")} className="h-8 text-xs bg-white text-slate-600 shadow-sm">
                      {copiedContext === "workshop" ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-green-500" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>}
                    </Button>
                  </div>
                  <div className="prose prose-sm prose-slate max-w-none max-h-[400px] overflow-y-auto pr-2 custom-scrollbar whitespace-pre-wrap">
                    {workshopResult}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  Your workshop outline will appear here.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}