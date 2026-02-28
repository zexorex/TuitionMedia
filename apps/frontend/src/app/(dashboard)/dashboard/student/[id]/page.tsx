"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

type Application = {
  id: string;
  message: string;
  status: string;
  tutor: { email: string; name: string | null };
};

type TuitionRequest = {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: string;
  budget: string | null;
  location: string | null;
  createdAt: string;
  applications: Application[];
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  IN_PROGRESS: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  CLOSED: "bg-white/10 text-muted-foreground border-white/10",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;
  const [request, setRequest] = useState<TuitionRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  function refresh() {
    return apiGet<TuitionRequest>(`/tuition-requests/${requestId}`).then(setRequest);
  }

  useEffect(() => {
    apiGet<TuitionRequest>(`/tuition-requests/${requestId}`)
      .then(setRequest)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [requestId]);

  async function accept(applicationId: string) {
    setAccepting(applicationId);
    try {
      await apiPost(`/applications/${applicationId}/accept`, {});
      toast({ title: "Application accepted!", variant: "success" });
      await refresh();
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Could not accept",
        variant: "destructive",
      });
    } finally {
      setAccepting(null);
    }
  }

  async function reject(applicationId: string) {
    setRejecting(applicationId);
    try {
      await apiPost(`/applications/${applicationId}/reject`, {});
      toast({ title: "Application rejected" });
      await refresh();
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Could not reject",
        variant: "destructive",
      });
    } finally {
      setRejecting(null);
    }
  }

  async function closeRequest() {
    setClosing(true);
    try {
      await apiDelete(`/tuition-requests/${requestId}/close`);
      toast({ title: "Request closed" });
      await refresh();
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Could not close request",
        variant: "destructive",
      });
    } finally {
      setClosing(false);
    }
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

  if (notFound || !request) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center"
      >
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Request not found</h2>
        <p className="text-muted-foreground">This request may have been removed or doesn't exist.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/student")}>
          Back to My Requests
        </Button>
      </motion.div>
    );
  }

  const pendingApps = request.applications.filter((a) => a.status === "PENDING");
  const acceptedApp = request.applications.find((a) => a.status === "ACCEPTED");
  const isOpen = request.status === "OPEN";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <Button variant="ghost" className="mb-6 -ml-2" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Request card */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl">{request.title}</CardTitle>
            {isOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={closeRequest}
                disabled={closing}
                className="shrink-0 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                {closing ? "Closing..." : "Close Request"}
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
              {request.subject}
            </span>
            <span className={`rounded-full border px-3 py-1 text-sm ${STATUS_COLORS[request.status] ?? "bg-white/10 text-muted-foreground"}`}>
              {request.status.replace("_", " ")}
            </span>
            {request.budget && (
              <span className="text-sm text-muted-foreground">${request.budget}/hr</span>
            )}
            {request.location && (
              <span className="text-sm text-muted-foreground">📍 {request.location}</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{request.description}</p>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-semibold">
        Applications ({request.applications.length})
      </h2>

      {/* Accepted application */}
      {acceptedApp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4"
        >
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
              <div className="flex-1">
                <CardTitle className="text-lg">Accepted</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {acceptedApp.tutor.name ?? acceptedApp.tutor.email}
                  {acceptedApp.tutor.name && (
                    <span className="ml-1 text-xs">({acceptedApp.tutor.email})</span>
                  )}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{acceptedApp.message}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Pending applications */}
      {pendingApps.length > 0 && isOpen && (
        <div className="space-y-4">
          {pendingApps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {app.tutor.name ?? app.tutor.email}
                    </CardTitle>
                    {app.tutor.name && (
                      <p className="text-xs text-muted-foreground">{app.tutor.email}</p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground">{app.message}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => accept(app.id)}
                      disabled={!!accepting || !!rejecting}
                    >
                      {accepting === app.id ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => reject(app.id)}
                      disabled={!!accepting || !!rejecting}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      {rejecting === app.id ? "Rejecting..." : (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </span>
                      )}
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {request.applications.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No applications yet. Share your request to attract tutors.</p>
        </Card>
      )}

      {!isOpen && pendingApps.length === 0 && !acceptedApp && (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">This request is {request.status.toLowerCase().replace("_", " ")}.</p>
        </Card>
      )}
    </motion.div>
  );
}
