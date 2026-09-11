import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, X, Megaphone } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Input } from "../../components/ui/Input";
import { Skeleton } from "../../components/ui/Skeleton";
import { TextArea } from "../../components/ui/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api, money } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: ADVERTISE — GET /advertisements/pricing, POST /advertisements,
   then POST /advertisements/:id/pay to get the Paystack authorization_url.
   ------------------------------------------------------------ */
export function AdvertisePage({ go }) {
  const { user } = useAuth();
  const toast = useToast();
  const [plans, setPlans] = useState([]);
  const [plansStatus, setPlansStatus] = useState("loading");
  const [planId, setPlanId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const loadPricing = useCallback(async () => {
    setPlansStatus("loading");
    try {
      const { data } = await api("/advertisements/pricing", { auth: false });
      setPlans(data || []);
      if (data && data.length) setPlanId(data[0].id);
      setPlansStatus("ready");
    } catch (e) {
      setPlansStatus("error");
    }
  }, []);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  if (!user) {
    return <EmptyState icon={Megaphone} title="Log in to advertise" subtitle="Promote your listing to more buyers on SHINEX." action={<Button onClick={() => go("login")}>Log in</Button>} />;
  }

  const selectedPlan = plans.find((p) => p.id === planId);

  const submit = async () => {
    if (!title.trim()) {
      toast.push("Add a title for your ad.", "error");
      return;
    }
    if (!image) {
      toast.push("An advertisement image is required.", "error");
      return;
    }
    if (!planId) {
      toast.push("Choose a duration.", "error");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("duration_id", planId);
      fd.append("image", image.file);
      const created = await api("/advertisements", { method: "POST", body: fd, formData: true });
      const adId = created.data.advertisement.id;
      const payment = await api(`/advertisements/${adId}/pay`, { method: "POST" });
      if (payment.data?.authorization_url) {
        toast.push("Redirecting to Paystack...", "info");
        window.location.href = payment.data.authorization_url;
      } else {
        toast.push("Advertisement created — awaiting payment confirmation.", "success");
        go("home");
      }
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Advertise on SHINEX</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">Get your listing seen by more buyers with a featured spot on the home page.</p>

      {plansStatus === "loading" && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      )}
      {plansStatus === "error" && <ErrorState message="Couldn't load advertising plans." onRetry={loadPricing} />}
      {plansStatus === "ready" && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlanId(p.id)}
              className="rounded-2xl border-2 p-4 text-left transition-colors bg-white"
              style={{ borderColor: planId === p.id ? COLORS.primary : "#E5E7EB" }}
            >
              <p className="font-semibold text-gray-800">{p.duration_days} Day{p.duration_days > 1 ? "s" : ""}</p>
              <p className="text-lg font-extrabold mt-1" style={{ color: COLORS.secondary }}>{money(p.price)}</p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <Input label="Ad title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekend discount on all shoes" />
        <TextArea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you promoting?" />
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">Ad image</span>
          {image ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-100">
              <img src={image.url} className="w-full h-full object-cover" alt="" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
                <X size={13} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#14532D] hover:text-[#14532D]"
            >
              <Camera size={22} /> <span className="text-xs">Upload image</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && setImage({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) })} />
        </div>

        {selectedPlan && (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-sm text-gray-600">Total for {selectedPlan.duration_days} day{selectedPlan.duration_days > 1 ? "s" : ""}</span>
            <span className="font-bold" style={{ color: COLORS.primary }}>{money(selectedPlan.price)}</span>
          </div>
        )}

        <Button variant="secondary" className="w-full !py-3" onClick={submit} disabled={loading || !selectedPlan}>
          {loading ? "Processing..." : selectedPlan ? `Pay with Paystack — ${money(selectedPlan.price)}` : "Pay with Paystack"}
        </Button>
      </div>
    </div>
  );
}
