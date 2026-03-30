"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BookOpen, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Users, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
};

const studentLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard/student", icon: LayoutDashboard },
  { name: "My Classes", href: "/dashboard/student/classes", icon: BookOpen },
  { name: "My Tutors", href: "/dashboard/student/tutors", icon: Users },
  { name: "Messages", href: "/dashboard/student/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/student/settings", icon: Settings },
];

const volunteerLinks: SidebarLink[] = [
  { name: "Dashboard", href: "/dashboard/volunteer", icon: LayoutDashboard },
  { name: "My Students", href: "/dashboard/volunteer/students", icon: Users },
  { name: "Requests", href: "/dashboard/volunteer/requests", icon: BookOpen },
  { name: "Messages", href: "/dashboard/volunteer/messages", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/volunteer/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Determine role from cookies on mount
    const currentRole = Cookies.get("edubridge_role");
    if (currentRole) {
      setRole(currentRole);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Cookies.remove("edubridge_token");
      Cookies.remove("edubridge_role");
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const navLinks = role === "volunteer" ? volunteerLinks : studentLinks;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <span>EduBridge</span>
          </Link>
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className={`mr-3 h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 opacity-70" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-semibold text-slate-900 truncate ml-4">Dashboard</span>
          <div className="w-6"></div> {/* Spacer for centering */}
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
