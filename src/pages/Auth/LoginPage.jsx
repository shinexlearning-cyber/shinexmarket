import React, { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthLayout } from "./AuthLayout";
import { COLORS } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: LOGIN — POST /auth/login
   ------------------------------------------------------------ */
export function LoginPage({ go }) {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.push("Welcome back!", "success");
      go("home");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Log in to SHINEX" subtitle="Enter your details to continue." go={go} switchLabel="New to SHINEX?" switchCta="Create an account" switchTo="register">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        <div className="relative">
          <Input label="Password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-[38px] text-gray-400">
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={14} />{error}</p>}
        <div className="text-right -mt-2">
          <button type="button" onClick={() => go("forgot")} className="text-sm font-medium" style={{ color: COLORS.primary }}>
            Forgot password?
          </button>
        </div>
        <Button className="w-full !py-3" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </AuthLayout>
  );
}
