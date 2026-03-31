"use client";

import { useState } from "react";
import { Search, Send, FileImage, Paperclip, MoreVertical, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MENTOR_CONTACTS = [
  { id: 1, name: "Rahul Sharma", role: "Math Mentor", lastMsg: "Yes absolutely! I've uploaded the practice worksheet...", time: "10:30 AM", unread: 1 },
  { id: 2, name: "Priya Patel", role: "English Mentor", lastMsg: "See you next Wednesday!", time: "Monday", unread: 0 },
  { id: 3, name: "Platform Admin", role: "Support", lastMsg: "Welcome to EduBridge! If you need help, reply here.", time: "1 Week Ago", unread: 0 },
];

export default function StudentMessagesPage() {
  const [activeChat, setActiveChat] = useState(MENTOR_CONTACTS[0]);

  return (
    <div className="h-[calc(100vh-8rem)] flex items-stretch border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm shadow-slate-200/50">
      
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 flex-shrink-0 hidden md:flex">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-900 mb-4">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Search assigned mentors..." className="pl-9 bg-slate-50 border-transparent focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 focus-visible:bg-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {MENTOR_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setActiveChat(contact)}
              className={`flex items-start gap-3 p-4 cursor-pointer border-b border-slate-100 transition-colors ${activeChat.id === contact.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-slate-100'}`}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className={activeChat.id === contact.id ? 'bg-primary text-primary-foreground' : 'bg-slate-200 text-slate-600'}>
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <p className="text-sm font-semibold text-slate-900 truncate">{contact.name}</p>
                  <span className="text-[10px] text-slate-500 shrink-0">{contact.time}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
                  {contact.unread > 0 && (
                     <span className="w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                       {contact.unread}
                     </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 z-10 w-full relative">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground">{activeChat.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-bold text-slate-900">{activeChat.name}</p>
              <p className="text-[11px] text-slate-500 font-medium">{activeChat.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 hover:bg-primary/10">
               <Phone className="w-5 h-5" />
             </Button>
             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
               <MoreVertical className="w-5 h-5" />
             </Button>
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 pb-24">
           {/* Outgoing */}
           <div className="flex items-start gap-3 max-w-[80%] self-end ml-auto flex-row-reverse border-primary">
              <Avatar className="h-8 w-8 shrink-0 mt-1 hidden">
                <AvatarFallback className="bg-primary text-xs">Me</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-sm shadow-sm">
                  <p className="text-sm">Good morning! Are we still on for our 4 PM math session?</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 mr-1 block text-right">10:28 AM • Read</span>
              </div>
           </div>

           {/* Incoming */}
           <div className="flex items-start gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8 shrink-0 mt-1">
                <AvatarFallback className="bg-slate-200 text-xs text-slate-600">{activeChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm flex flex-col items-start">
                  <p className="text-sm text-slate-700 self-start">{activeChat.lastMsg}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 ml-1">10:30 AM</span>
              </div>
           </div>
        </div>

        {/* Chat Input */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2">
           <Button variant="ghost" size="icon" className="shrink-0 text-slate-400 hover:text-primary hover:bg-primary/10 mr-1">
             <FileImage className="w-5 h-5" />
           </Button>
           <input 
             type="text" 
             placeholder={`Reply to ${activeChat.name}...`} 
             className="flex-1 h-10 px-4 rounded-full bg-slate-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm"
           />
           <Button size="icon" className="shrink-0 rounded-full bg-primary hover:bg-primary/90 h-10 w-10 shadow-md transition-transform hover:scale-105 active:scale-95">
             <Send className="w-4 h-4 ml-0.5" />
           </Button>
        </div>
      </div>
    </div>
  );
}
