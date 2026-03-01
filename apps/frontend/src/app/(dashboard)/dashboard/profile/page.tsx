"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Save, User, BookOpen, GraduationCap, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import { apiGet, apiPut } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type UserProfile = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  is_verified: boolean;
  created_at: string;
};

type TutorProfile = {
  bio: string | null;
  subjects: string[];
  hourly_rate: string;
  education: string | null;
  location: string | null;
  experience: number;
  is_verified: boolean;
  average_rating: string | null;
  total_reviews: number;
  total_students: number;
};

type StudentProfile = {
  grade: string | null;
  school: string | null;
  subjects: string[];
  goals: string | null;
  location: string | null;
};

function SubjectTag({ subject, onRemove }: { subject: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
      {subject}
      <button onClick={onRemove} className="ml-1 hover:text-red-400 transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [_studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Basic info form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Tutor form state
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [education, setEducation] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [subjectInput, setSubjectInput] = useState("");

  // Student form state
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [goals, setGoals] = useState("");
  const [studentLocation, setStudentLocation] = useState("");
  const [studentSubjects, setStudentSubjects] = useState<string[]>([]);
  const [studentSubjectInput, setStudentSubjectInput] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const me = await apiGet<UserProfile>("/auth/me");
        setProfile(me);
        setName(me.name ?? "");
        setPhone(me.phone ?? "");

        if (me.role === "TUTOR") {
          const tp = await apiGet<TutorProfile>("/auth/tutor-profile").catch(() => null);
          if (tp) {
            setTutorProfile(tp);
            setBio(tp.bio ?? "");
            setHourlyRate(tp.hourly_rate ? String(tp.hourly_rate) : "");
            setEducation(tp.education ?? "");
            setLocation(tp.location ?? "");
            setExperience(tp.experience ? String(tp.experience) : "");
            setSubjects(tp.subjects ?? []);
          }
        } else if (me.role === "STUDENT") {
          const sp = await apiGet<StudentProfile>("/auth/student-profile").catch(() => null);
          if (sp) {
            setStudentProfile(sp);
            setGrade(sp.grade ?? "");
            setSchool(sp.school ?? "");
            setGoals(sp.goals ?? "");
            setStudentLocation(sp.location ?? "");
            setStudentSubjects(sp.subjects ?? []);
          }
        }
      } catch {
        toast({ title: "Failed to load profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function saveBasicInfo() {
    setSaving(true);
    try {
      const updated = await apiPut<UserProfile>("/auth/profile", {
        ...(name.trim() && { name: name.trim() }),
        ...(phone.trim() && { phone: phone.trim() }),
      });
      setProfile(updated);
      if (user && token) {
        setAuth({ ...user, name: updated.name }, token);
      }
      toast({ title: "Profile updated!", variant: "success" });
    } catch (err) {
      toast({ title: "Failed to save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function saveTutorProfile() {
    setSaving(true);
    try {
      const updated = await apiPut<TutorProfile>("/auth/tutor-profile", {
        bio: bio.trim() || undefined,
        subjects,
        hourly_rate: hourlyRate ? Number(hourlyRate) : undefined,
        education: education.trim() || undefined,
        location: location.trim() || undefined,
        experience: experience ? Number(experience) : undefined,
      });
      setTutorProfile(updated);
      toast({ title: "Tutor profile saved!", variant: "success" });
    } catch (err) {
      toast({ title: "Failed to save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function saveStudentProfile() {
    setSaving(true);
    try {
      const updated = await apiPut<StudentProfile>("/auth/student-profile", {
        grade: grade.trim() || undefined,
        school: school.trim() || undefined,
        subjects: studentSubjects,
        goals: goals.trim() || undefined,
        location: studentLocation.trim() || undefined,
      });
      setStudentProfile(updated);
      toast({ title: "Student profile saved!", variant: "success" });
    } catch (err) {
      toast({ title: "Failed to save", description: err instanceof Error ? err.message : undefined, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function addSubject(subj: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) {
    const trimmed = subj.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account information and profile details.</p>
      </div>

      {/* Account info */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-400" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+60 12 345 6789"
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email ?? ""} disabled className="bg-white/5 border-white/10 opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">{profile?.role}</span>
              {profile?.is_verified && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">✓ Verified</span>
              )}
            </div>
            <Button variant="gradient" onClick={saveBasicInfo} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tutor profile */}
      {profile?.role === "TUTOR" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-cyan-400" />
              Tutor Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tutorProfile && (
              <div className="flex flex-wrap gap-4 rounded-lg bg-white/5 p-3 text-sm">
                <span className="text-muted-foreground">⭐ {tutorProfile.average_rating ?? "No rating"}</span>
                <span className="text-muted-foreground">{tutorProfile.total_reviews} reviews</span>
                <span className="text-muted-foreground">{tutorProfile.total_students} students</span>
                {tutorProfile.is_verified && <span className="text-emerald-400">✓ Verified Tutor</span>}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about yourself, your teaching style, and experience..."
                rows={4}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="e.g. 30"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min={0}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 3"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. BSc Mathematics, UM"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kuala Lumpur"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subjects You Teach</Label>
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {subjects.map((s) => (
                  <SubjectTag key={s} subject={s} onRemove={() => setSubjects(subjects.filter((x) => x !== s))} />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubject(subjectInput, subjects, setSubjects, setSubjectInput); }}}
                  placeholder="Add a subject (press Enter)"
                  className="bg-white/5 border-white/10"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => addSubject(subjectInput, subjects, setSubjects, setSubjectInput)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="gradient" onClick={saveTutorProfile} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Tutor Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student profile */}
      {profile?.role === "STUDENT" && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade / Level</Label>
                <Input
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Form 5, SPM"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School / Institution</Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="e.g. SMK Petaling Jaya"
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="studentLocation">Location</Label>
                <Input
                  id="studentLocation"
                  value={studentLocation}
                  onChange={(e) => setStudentLocation(e.target.value)}
                  placeholder="e.g. Petaling Jaya, Selangor"
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Learning Goals</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="What do you want to achieve? e.g. Improve SPM Mathematics to A+..."
                rows={3}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Subjects I Need Help With</Label>
              <div className="flex flex-wrap gap-2 min-h-[36px]">
                {studentSubjects.map((s) => (
                  <SubjectTag key={s} subject={s} onRemove={() => setStudentSubjects(studentSubjects.filter((x) => x !== s))} />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={studentSubjectInput}
                  onChange={(e) => setStudentSubjectInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSubject(studentSubjectInput, studentSubjects, setStudentSubjects, setStudentSubjectInput); }}}
                  placeholder="Add a subject (press Enter)"
                  className="bg-white/5 border-white/10"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => addSubject(studentSubjectInput, studentSubjects, setStudentSubjects, setStudentSubjectInput)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="gradient" onClick={saveStudentProfile} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Student Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
