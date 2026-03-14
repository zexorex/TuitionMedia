"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, ArrowLeft, Shield, CheckCircle, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface NagadPaymentProps {
  amount: number;
  onInitiate: (phoneNumber: string, method: "NAGAD") => Promise<{ id: string }>;
  onVerify: (otp: string) => Promise<{ success: boolean; contactUnlocked?: boolean }>;
  onResendOtp: () => Promise<{}>;
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

  const handleInitiate = async () => {
    if (!phoneNumber || !/^01[3-9]\d{8}$/.test(phoneNumber)) {
      setError("Please enter a valid Nagad number (e.g., 01712345678)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onInitiate(phoneNumber, "NAGAD");
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
      await onResendOtp();
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
        <Card className="overflow-hidden rounded-2xl shadow-2xl border-0">
          {/* Header */}
          <div className="bg-[#E2136E] px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              {step !== "phone" && step !== "success" && (
                <button onClick={() => setStep("phone")} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#E2136E] font-bold text-lg">
                  N
                </div>
                <div>
                  <h2 className="font-bold text-lg">Nagad Payment</h2>
                  <p className="text-sm text-white/80">Secure Payment</p>
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
                  <div className="bg-gradient-to-r from-[#E2136E]/10 to-[#E2136E]/5 rounded-xl p-6 text-center border border-[#E2136E]/20">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Payment Amount</p>
                    <p className="text-4xl font-bold text-[#E2136E]">৳ {amount}</p>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-500">
                      <Lock className="h-3 w-3" />
                      <span>Secure Transaction</span>
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Nagad Account Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 h-12 text-lg border-gray-200 focus:border-[#E2136E] focus:ring-[#E2136E] rounded-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Enter your Nagad registered mobile number
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleInitiate}
                      disabled={loading}
                      className="w-full h-12 bg-[#E2136E] hover:bg-[#C0105E] text-white font-semibold rounded-lg shadow-lg"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Proceed to Payment"
                      )}
                    </Button>
                    <Button
                      onClick={onCancel}
                      variant="outline"
                      className="w-full h-12 rounded-lg border-gray-200"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg py-3">
                    <Shield className="h-4 w-4" />
                    <span>Secured by Nagad 256-bit encryption</span>
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
                    <div className="mx-auto w-16 h-16 bg-[#E2136E]/10 rounded-full flex items-center justify-center mb-4">
                      <Phone className="h-8 w-8 text-[#E2136E]" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      Enter the 6-digit OTP sent to
                    </p>
                    <p className="font-bold text-lg text-[#E2136E] mt-1">{phoneNumber}</p>
                  </div>

                  {/* OTP Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 text-center block">
                      Enter OTP Code
                    </label>
                    <Input
                      type="text"
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="h-14 text-center text-2xl tracking-[0.5em] font-bold border-2 border-gray-200 focus:border-[#E2136E] focus:ring-[#E2136E] rounded-lg"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500 text-center">
                      Enter the 6-digit code from your Nagad app
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600 text-center">{error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleVerify}
                      disabled={loading || otp.length !== 6}
                      className="w-full h-12 bg-[#E2136E] hover:bg-[#C0105E] text-white font-semibold rounded-lg shadow-lg"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Verify & Complete Payment"
                      )}
                    </Button>
                    <Button
                      onClick={handleResendOtp}
                      variant="ghost"
                      disabled={loading}
                      className="w-full text-[#E2136E] hover:text-[#C0105E] font-medium"
                    >
                      Resend OTP Code
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
                  <p className="text-gray-600 mb-4">
                    ৳ {amount} has been successfully paid
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Contact information has been unlocked
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
