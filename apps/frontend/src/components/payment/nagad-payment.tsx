"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, ArrowLeft, Shield, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface NagadPaymentProps {
  amount: number;
  onInitiate: (phoneNumber: string) => Promise<{ id: string; demoOtp?: string }>;
  onVerify: (otp: string) => Promise<{ success: boolean; contactUnlocked?: boolean }>;
  onResendOtp: () => Promise<{ demoOtp?: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NagadPayment({
  amount,
  onInitiate,
  onVerify,
  onResendOtp,
  onSuccess,
  onCancel,
}: NagadPaymentProps) {
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const handleInitiate = async () => {
    if (!phoneNumber || !/^01[3-9]\d{8}$/.test(phoneNumber)) {
      setError("Please enter a valid Nagad number (e.g., 01712345678)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onInitiate(phoneNumber);
      if (result.demoOtp) {
        setDemoOtp(result.demoOtp);
      }
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || !/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await onVerify(otp);
      if (result.success) {
        setStep("success");
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await onResendOtp();
      if (result.demoOtp) {
        setDemoOtp(result.demoOtp);
      }
      setError("OTP resent successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md"
      >
        {/* Nagad styled modal */}
        <Card className="overflow-hidden rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="bg-[#F6921E] px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              {step !== "phone" && step !== "success" && (
                <button onClick={() => setStep("phone")} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#F6921E] font-bold text-lg">
                  N
                </div>
                <div>
                  <h2 className="font-bold text-lg">Nagad Payment</h2>
                  <p className="text-sm text-white/80">Demo Mode</p>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {step === "phone" && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 space-y-6"
                >
                  {/* Amount Display */}
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold text-[#F6921E]">৳ {amount}</p>
                    <p className="text-xs text-gray-400 mt-1">Platform Fee</p>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nagad Account Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 h-12 text-lg border-gray-200 focus:border-[#F6921E] focus:ring-[#F6921E]"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter your Nagad mobile number
                    </p>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleInitiate}
                      disabled={loading}
                      className="w-full h-12 bg-[#F6921E] hover:bg-[#D97D0F] text-white font-semibold rounded-xl"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Proceed to Pay"
                      )}
                    </Button>
                    <Button
                      onClick={onCancel}
                      variant="outline"
                      className="w-full h-12 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Secured by Nagad</span>
                  </div>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* OTP Info */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      Enter the OTP sent to
                    </p>
                    <p className="font-semibold text-[#F6921E]">{phoneNumber}</p>
                    {demoOtp && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-xs text-yellow-700">Demo OTP:</p>
                        <p className="text-2xl font-bold text-yellow-800">{demoOtp}</p>
                      </div>
                    )}
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-14 text-center text-2xl tracking-[1em] font-bold border-gray-200 focus:border-[#F6921E] focus:ring-[#F6921E]"
                      maxLength={6}
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleVerify}
                      disabled={loading || otp.length !== 6}
                      className="w-full h-12 bg-[#F6921E] hover:bg-[#D97D0F] text-white font-semibold rounded-xl"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Verify & Pay"
                      )}
                    </Button>
                    <Button
                      onClick={handleResendOtp}
                      variant="ghost"
                      disabled={loading}
                      className="w-full text-[#F6921E] hover:text-[#D97D0F]"
                    >
                      Resend OTP
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
                  >
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-500 mb-4">
                    ৳ {amount} has been paid via Nagad
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700">
                      Contact information has been unlocked
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
