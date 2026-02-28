"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const path = user.role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student";
      router.replace(path);
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost<{ accessToken: string; user: { id: string; email: string; name?: string; role: string } }>(
        "/auth/register",
        { email, password, role, ...(name.trim() && { name: name.trim() }) },
      );
      setAuth(
        { id: res.user.id, email: res.user.email, name: res.user.name, role: res.user.role as "STUDENT" | "TUTOR" | "ADMIN" },
        res.accessToken,
      );
      toast({ title: "Account created!", variant: "success" });
      const redirect = res.user.role === "TUTOR" ? "/dashboard/tutor" : "/dashboard/student";
      router.push(redirect);
    } catch (err) {
      toast({
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <GraduationCap className="h-10 w-10 text-cyan-400" />
          <span className="text-2xl font-bold">TuitionMedia</span>
        </Link>
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Join TuitionMedia as a student or tutor.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={role === "STUDENT" ? "gradient" : "outline"}
                    className="flex-1"
                    onClick={() => setRole("STUDENT")}
                  >
                    Student
                  </Button>
                  <Button
                    type="button"
                    variant={role === "TUTOR" ? "gradient" : "outline"}
                    className="flex-1"
                    onClick={() => setRole("TUTOR")}
                  >
                    Tutor
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
