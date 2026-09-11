import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: CONTACT / ABOUT / PRIVACY / TERMS
   POST /contact requires name, email, subject, message (10+ chars)
   ------------------------------------------------------------ */
export function ContactPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [myMessages, setMyMessages] = useState([]);
  useEffect(() => { if (user) api("/contact/my").then(r => setMyMessages(r.data || [])).catch(() => {}); }, [user]);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.message.trim().length < 10) {
      toast.push("Please fill in every field (message needs at least 10 characters).", "error");
      return;
    }
    setLoading(true);
    try {
      const subject = form.subject.trim() || "General Inquiry";
      await api("/contact", { method: "POST", body: { ...form, subject }, auth: false });
      toast.push("Message sent — we'll get back to you soon.", "success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Contact us</h1>
      <p className="text-gray-500 mt-2 max-w-lg">Questions, feedback, or a listing issue — reach out and our team will respond within one business day.</p>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "shinexlearning@gmail.com" },
            { icon: Phone, label: "Phone", value: "+234 706 757 4479" },
            { icon: MessageCircle, label: "WhatsApp", value: "+234 802 505 2852" },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${COLORS.primary}14` }}>
                <c.icon size={18} style={{ color: COLORS.primary }} />
              </div>
              <div>
                <p className="text-xs text-gray-400">{c.label}</p>
                <p className="font-medium text-sm text-gray-800">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
          <Input label="Subject" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="What's this about?" />
          <TextArea label="Message" rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="How can we help?" />
          <Button className="w-full !py-3" disabled={loading}>{loading ? "Sending..." : "Send message"}</Button>
          </form>
          {user && <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900">My support messages</h2>
            <div className="mt-3 space-y-3">
              {!myMessages.length ? <p className="text-sm text-gray-500">Your submitted support messages and replies will appear here.</p> : myMessages.map(m => <div key={m.id} className="rounded-xl bg-gray-50 p-3"><p className="font-semibold text-sm">{m.subject}</p><p className="text-sm text-gray-600 mt-1">{m.message}</p>{(m.replies||[]).map(r => <div key={r.id} className="mt-2 rounded-lg bg-green-50 border border-green-100 p-2"><p className="text-xs font-semibold text-green-700">SHINEX Support</p><p className="text-sm text-gray-700">{r.message}</p></div>)}</div>)}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}
