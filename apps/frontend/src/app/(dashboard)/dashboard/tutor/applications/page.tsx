"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, CreditCard, Phone, Mail, Lock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector";

type Application = {
  id: string;
  coverLetter: string;
  status: string;
  request: {
    id: string;
    title: string;
    subjects: string[];
    status: string;
    division: string | null;
    area: string | null;
    contact_unlocked: boolean;
    student: { email: string; name: string | null; phone: string | null };
  };
};

export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentApplicationId, setPaymentApplicationId] = useState<string | null>(null);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
  const [confirmingApp, setConfirmingApp] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await apiGet<Application[]>("/applications/my");
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      if (error instanceof Error && error.message.includes("401")) {
        toast({
          title: "Authentication required", 
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      }
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const initiateTutorConfirm = async (applicationId: string) => {
    setConfirmingApp(applicationId);
    try {
      const result = await apiPost<{
        requiresPayment?: boolean;
        amount?: number;
        applicationId?: string;
        alreadyPaid?: boolean;
        message?: string;
      }>(`/applications/${applicationId}/tutor-confirm`, {});
      
      if (result.alreadyPaid) {
        toast({ title: "Contact information unlocked!", variant: "success" });
        await fetchApplications();
      } else if (result.requiresPayment) {
        setPaymentApplicationId(applicationId);
        setShowPayment(true);
      }
    } catch (err) {
      toast({
        title: "Failed",
        description: err instanceof Error ? err.message : "Could not proceed",
        variant: "destructive",
      });
    } finally {
      setConfirmingApp(null);
    }
  };

  const handleInitiatePayment = async (phoneNumber: string) => {
    if (!paymentApplicationId) throw new Error("No application selected");
    const result = await apiPost<{ id: string; demoOtp?: string }>(
      `/payments/tutor/initiate`,
      { applicationId: paymentApplicationId, phoneNumber }
    );
    setCurrentPaymentId(result.id);
    return result;
  };

  const handleVerifyPayment = async (otp: string) => {
    if (!currentPaymentId) throw new Error("No payment in progress");
    const result = await apiPost<{ success: boolean; contactUnlocked?: boolean }>(
      `/payments/${currentPaymentId}/verify`,
      { otp }
    );
    return result;
  };

  const handleResendOtp = async () => {
    if (!currentPaymentId) throw new Error("No payment in progress");
    return apiPost<{ demoOtp?: string }>(`/payments/${currentPaymentId}/resend-otp`, {});
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setCurrentPaymentId(null);
    setPaymentApplicationId(null);
    toast({ title: "Payment successful! Contact information unlocked.", variant: "success" });
    await fetchApplications();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setCurrentPaymentId(null);
    setPaymentApplicationId(null);
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-500/20 text-amber-400",
    ACCEPTED: "bg-emerald-500/20 text-emerald-400",
    REJECTED: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      {/* Payment Modal */}
      {showPayment && (
        <PaymentMethodSelector
          amount={500}
          onInitiate={handleInitiatePayment}
          onVerify={handleVerifyPayment}
          onResendOtp={handleResendOtp}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          userType="tutor"
        />
      )}

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
                      {app.request.subjects?.join(", ") ?? "N/A"} • {app.request.student.name ?? app.request.student.email}
                    </p>
                    {app.request.division && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📍 {app.request.division}{app.request.area ? `, ${app.request.area}` : ""}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[app.status] ?? "bg-muted"}`}
                  >
                    {app.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{app.coverLetter}</p>
                  
                  {app.status === "ACCEPTED" && (
                    <div className="border-t border-white/10 pt-4">
                      {app.request.contact_unlocked ? (
                        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                          <div className="flex items-center gap-2 text-green-400 mb-3">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Contact Information Unlocked</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{app.request.student.email}</span>
                            </div>
                            {app.request.student.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{app.request.student.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                                <Lock className="h-4 w-4" />
                                <span className="text-sm font-medium">Contact info locked</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Pay ৳500 platform fee to unlock student&apos;s contact details
                              </p>
                            </div>
                            <Button
                              variant="gradient"
                              size="sm"
                              onClick={() => initiateTutorConfirm(app.id)}
                              disabled={confirmingApp === app.id}
                              className="gap-1"
                            >
                              {confirmingApp === app.id ? (
                                "Processing..."
                              ) : (
                                <>
                                  <CreditCard className="h-3.5 w-3.5" />
                                  Pay ৳500
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {app.status === "PENDING" && (
                    <p className="text-xs text-muted-foreground">
                      Waiting for student to review your application
                    </p>
                  )}
                  
                  {app.status === "REJECTED" && (
                    <p className="text-xs text-red-400">
                      This application was not selected
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
