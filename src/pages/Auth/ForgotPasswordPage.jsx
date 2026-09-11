import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../context/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { COLORS, api } from "../../services/api";

export function ForgotPasswordPage({ go }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api("/auth/forgot-password", { method: "POST", body: { email }, auth: false });
      setSent(true);
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll send a reset link to your email." go={go} switchLabel="Remembered it?" switchCta="Back to login" switchTo="login">
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle size={36} className="mx-auto mb-3" style={{ color: COLORS.secondary }} />
          <p className="text-sm text-gray-600">If an account exists for {email}, a reset link is on its way.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Button className="w-full !py-3" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
