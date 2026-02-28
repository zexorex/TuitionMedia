"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet } from "@/lib/api";

type Application = {
  id: string;
  coverLetter: string;
  status: string;
  request: {
    id: string;
    title: string;
    subject: string;
    status: string;
    student: { user: { email: string } };
  };
};

export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Application[]>("/applications/my")
      .then(setApplications)
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/20 text-amber-400",
    ACCEPTED: "bg-emerald-500/20 text-emerald-400",
    REJECTED: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="mt-1 text-muted-foreground">Track your applications to tuition requests.</p>
      </motion.div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="h-32 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-16 text-center"
        >
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-xl font-semibold">No applications yet</h3>
          <p className="mt-2 text-muted-foreground">Apply to tuition requests from the Job Board.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{app.request.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {app.request.subject} • {app.request.student.user.email}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status] ?? "bg-muted"}`}
                  >
                    {app.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{app.coverLetter}</p>
                  {app.status === "ACCEPTED" && (
                    <p className="mt-2 text-sm text-emerald-400">
                      ✓ Request is now IN_PROGRESS. Contact the student to start.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
