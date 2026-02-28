"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Briefcase,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const studentNav = [
  { href: "/dashboard/student", label: "My Requests", icon: BookOpen },
  { href: "/dashboard/student/new", label: "New Request", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

const tutorNav = [
  { href: "/dashboard/tutor", label: "Job Board", icon: Briefcase },
  { href: "/dashboard/tutor/applications", label: "My Applications", icon: BookOpen },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  const nav = user.role === "STUDENT" ? studentNav : tutorNav;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col glass-card border-r border-white/10">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-cyan-400" />
            <span className="font-bold">TuitionMedia</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {nav.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                  pathname === item.href ||
                  (item.href === "/dashboard/student" &&
                    pathname.startsWith("/dashboard/student/") &&
                    pathname !== "/dashboard/student/new")
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </div>
                <div className="flex min-w-0 flex-col items-start">
                  <span className="truncate text-sm font-medium">{user.name ?? user.email}</span>
                  {user.name && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                <User className="mr-2 h-4 w-4" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <main className="relative ml-64 flex-1 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
