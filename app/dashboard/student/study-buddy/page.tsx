"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User as UserIcon, Loader2 } from "lucide-react";
import { aiStudyBuddyChat } from "@/lib/claude";
import { useAppStore } from "@/store/useAppStore";
import toast from "react-hot-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function StudyBuddyPage() {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI Study Buddy. Ask me anything and I'll explain it simply 😊",
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fallbacks if user not loaded yet
  const grade = currentUser?.grade || "8";
  const language = currentUser?.language || "English";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // In a real app we might pass the full chat history, but the API wrapper currently takes a single prompt.
      // We'll pass the latest prompt with context.
      const chatContext = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join("\n");
      const fullPrompt = `Context:\n${chatContext}\n\nUser: ${userMsg.content}`;
      
      const responseText = await aiStudyBuddyChat(grade, language, fullPrompt);

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      toast.error("Study Buddy is taking a nap right now. Try again later!");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" /> AI Study Buddy
        </h1>
        <p className="text-slate-500 mt-1">Stuck on a problem? Get instant, simple explanations tailored to your grade.</p>
      </div>

      <Card className="flex-1 flex flex-col shadow-md overflow-hidden bg-white/50 border-slate-200">
        <CardContent className="flex-1 p-0 flex flex-col relative overflow-hidden">
          <ScrollArea className="flex-1 p-6" style={{ height: 'calc(100vh - 16rem)' }}>
            <div className="space-y-6 pb-20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    msg.role === "user" 
                      ? "bg-primary text-white border-primary" 
                      : "bg-orange-100 text-orange-600 border-orange-200"
                  }`}>
                    {msg.role === "user" ? <UserIcon className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white border border-slate-200 shadow-sm rounded-tl-none text-slate-800"
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
              {["Explain Photosynthesis 🌿", "How do fractions work? ➗", "Give me a math riddle 🤓"].map((q) => (
                <button 
                  key={q} 
                  onClick={() => suggestQuestion(q)}
                  className="whitespace-nowrap px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-medium transition-colors border border-slate-200"
                >
                  {q}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSend} className="flex gap-2">
              <Input 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything..." 
                className="flex-1 bg-slate-50 border-slate-200 rounded-full px-6 focus-visible:ring-primary"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="rounded-full shrink-0 h-10 w-10 bg-primary shadow-sm hover:bg-primary/90" disabled={isLoading || !inputMessage.trim()}>
                <Send className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}