"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    budget: "",
    location: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost<{ id: string }>("/tuition-requests", {
        title: form.title,
        description: form.description,
        subject: form.subject,
        budget: form.budget ? Number(form.budget) : undefined,
        location: form.location || undefined,
      });
      toast({ title: "Request posted!", variant: "success" });
      router.push(`/dashboard/student/${res.id}`);
    } catch (err) {
      toast({
        title: "Failed to post",
        description: err instanceof Error ? err.message : "Invalid data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <h1 className="text-3xl font-bold">Post a Tuition Request</h1>
      <p className="mt-1 text-muted-foreground">Describe what you need and tutors will apply.</p>

      <Card className="mt-8 glass-card">
        <CardHeader>
          <CardTitle>New Request</CardTitle>
          <CardDescription>Fill in the details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g. Math tutoring for Grade 10"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Mathematics, Physics"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
                className="bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your learning goals, schedule, etc."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={4}
                className="bg-white/5"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="e.g. 50"
                  value={form.budget}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                  className="bg-white/5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g. Online, NYC"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="bg-white/5"
                />
              </div>
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? "Posting..." : "Post Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
