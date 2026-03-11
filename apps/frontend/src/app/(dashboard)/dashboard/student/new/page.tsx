"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const SUBJECTS = [
  "Mathematics",
  "Additional Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "English",
  "Bahasa Melayu",
  "Mandarin",
  "Tamil",
  "History",
  "Geography",
  "Economics",
  "Accounting",
  "Business Studies",
  "Computer Science",
  "Information Technology",
  "Literature",
  "Art",
  "Music",
  "Physical Education",
  "Islamic Studies",
  "Moral Studies",
  "Pendidikan Islam",
];

const LOCATIONS = [
  "Online Only",
  "Kuala Lumpur",
  "Petaling Jaya",
  "Subang Jaya",
  "Shah Alam",
  "Bangsar",
  "Damansara",
  "Mont Kiara",
  "Ampang",
  "Cheras",
  "Puchong",
  "Klang",
  "Cyberjaya",
  "Putrajaya",
  "Seremban",
  "Johor Bahru",
  "Penang",
  "Ipoh",
  "Malacca",
  "Kota Kinabalu",
  "Kuching",
  "Other",
];

const CLASS_MODES = [
  { value: "Online", label: "Online Classes" },
  { value: "Offline", label: "In-Person Classes" },
  { value: "Hybrid", label: "Both Online & In-Person" },
  { value: "Flexible", label: "Flexible / Open to Any" },
];

const EDUCATION_LEVELS = [
  "Primary (Year 1-6)",
  "Secondary (Form 1-3)",
  "SPM (Form 4-5)",
  "IGCSE O-Levels",
  "A-Levels",
  "Foundation",
  "Diploma",
  "Degree",
  "Other",
];

const BUDGET_RANGES = [
  { value: "30", label: "RM 30-50/hour" },
  { value: "50", label: "RM 50-70/hour" },
  { value: "70", label: "RM 70-100/hour" },
  { value: "100", label: "RM 100-150/hour" },
  { value: "150", label: "RM 150+/hour" },
  { value: "negotiable", label: "Negotiable" },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    level: "",
    mode: "",
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
        level: form.level || undefined,
        mode: form.mode || undefined,
        budget: form.budget && form.budget !== "negotiable" ? Number(form.budget) : undefined,
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
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select value={form.subject} onValueChange={(v: string) => setForm((f) => ({ ...f, subject: v }))}>
                  <SelectTrigger className="bg-white/5">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Education Level</Label>
                <Select value={form.level} onValueChange={(v: string) => setForm((f) => ({ ...f, level: v }))}>
                  <SelectTrigger className="bg-white/5">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mode">Class Mode</Label>
                <Select value={form.mode} onValueChange={(v: string) => setForm((f) => ({ ...f, mode: v }))}>
                  <SelectTrigger className="bg-white/5">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASS_MODES.map((mode) => (
                      <SelectItem key={mode.value} value={mode.value}>
                        {mode.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={form.location} onValueChange={(v: string) => setForm((f) => ({ ...f, location: v }))}>
                  <SelectTrigger className="bg-white/5">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget Range</Label>
              <Select value={form.budget} onValueChange={(v: string) => setForm((f) => ({ ...f, budget: v }))}>
                <SelectTrigger className="bg-white/5">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_RANGES.map((budget) => (
                    <SelectItem key={budget.value} value={budget.value}>
                      {budget.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your learning goals, preferred schedule, any specific requirements..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={4}
                className="bg-white/5"
              />
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
