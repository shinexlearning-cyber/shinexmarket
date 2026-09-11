import React, { useState } from "react";
import { Phone, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { AuthLayout } from "./AuthLayout";

/* ------------------------------------------------------------
   PAGE: REGISTER — POST /auth/register
   ------------------------------------------------------------ */
export function RegisterPage({ go }) {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = "Full name is required";
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(form.username)) e.username = "3+ characters — letters, numbers, underscore only";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone.trim().length < 10) e.phone = "Enter a valid phone number";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        full_name: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.push("Account created! Welcome to SHINEX.", "success");
      go("home");
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join SHINEX to buy and sell with your community." go={go} switchLabel="Already have an account?" switchCta="Log in" switchTo="login">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Full name" value={form.fullName} onChange={set("fullName")} error={errors.fullName} placeholder="e.g. Amaka Obi" />
        <Input label="Username" value={form.username} onChange={set("username")} error={errors.username} placeholder="e.g. amaka_shop" />
        <Input label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} placeholder="you@example.com" />
        <Input label="Phone number" value={form.phone} onChange={set("phone")} error={errors.phone} placeholder="+234..." />
        <div className="relative">
          <Input label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")} error={errors.password} placeholder="At least 8 characters" />
          <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-[38px] text-gray-400">
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        <Input label="Confirm password" type={showPw ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} placeholder="Re-enter your password" />
        <Button className="w-full !py-3 mt-2" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
