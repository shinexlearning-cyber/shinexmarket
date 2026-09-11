import React, { useState, useEffect, useCallback } from "react";
import { Heart, MapPin, MessageCircle, ChevronLeft, Flag, ShoppingBag, Share2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ErrorState } from "../../components/ui/ErrorState";
import { Modal } from "../../components/ui/Modal";
import { PageSpinner } from "../../components/ui/PageSpinner";
import { Select } from "../../components/ui/Select";
import { TextArea } from "../../components/ui/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api, money } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: PRODUCT DETAIL — GET /products/:id
   ------------------------------------------------------------ */
export function ProductDetailPage({ params, go, favoriteProductIds, toggleFavorite }) {
  const toast = useToast();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [activeImg, setActiveImg] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reporting, setReporting] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const { data } = await api(`/products/${params.id}`, { auth: false });
      setProduct(data);
      setStatus("ready");
    } catch (e) {
      setStatus("error");
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === "loading") return <PageSpinner />;
  if (status === "error" || !product) return <ErrorState message="This listing may have been removed." onRetry={load} />;

  const images = (product.images && product.images.length
    ? [...product.images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0)).map((i) => i.image_url)
    : []);
  const isFav = favoriteProductIds.has(product.id);

  const whatsappNumber = (product.seller?.whatsapp || "").replace(/[^0-9]/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in "${product.name}" on SHINEX.`)}`
    : null;

  const submitReport = async () => {
    if (!reportReason) {
      toast.push("Choose a reason for this report.", "error");
      return;
    }
    setReporting(true);
    try {
      await api(`/reports`, { method: "POST", body: { target_product_id: product.id, reason: reportReason, description: reportDescription } });
      toast.push("Report submitted. Thank you for helping keep SHINEX safe.", "success");
      setReportOpen(false);
      setReportReason("");
      setReportDescription("");
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setReporting(false);
    }
  };

  const shareProduct = async () => {
    const shareText = `${product.name} — ${money(product.price)} on SHINEX`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: shareText, url: window.location.href });
      } catch (e) {
        /* user cancelled — no-op */
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText} — ${window.location.href}`);
        toast.push("Link copied to clipboard", "success");
      } catch (e) {
        toast.push("Couldn't copy link", "error");
      }
    }
  };

  const isOwnProduct = user && product.seller?.id === user.id;


  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={48} /></div>
            )}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <button onClick={() => go("home")} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                <ChevronLeft size={18} className="text-gray-700" />
              </button>
              <div className="flex gap-2">
                <button onClick={shareProduct} className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm" aria-label="Share">
                  <Share2 size={16} className="text-gray-700" />
                </button>
                <button
                  onClick={() => (user ? toggleFavorite(product.id, "product") : go("login"))}
                  className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                  aria-label="Favorite"
                >
                  <Heart size={16} fill={isFav ? "#EF4444" : "none"} color={isFav ? "#EF4444" : "#374151"} />
                </button>
              </div>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2"
                  style={{ borderColor: i === activeImg ? COLORS.primary : "transparent" }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-2xl font-extrabold" style={{ color: COLORS.secondary }}>{money(product.price)}</p>
            <span className="text-xs font-semibold" style={{ color: product.is_sold ? "#9CA3AF" : COLORS.secondary }}>
              {product.is_sold ? "Sold" : "In stock"}
            </span>
          </div>
          {product.location && (
            <p className="flex items-center gap-1 mt-1.5 text-sm text-gray-500"><MapPin size={14} /> {product.location}</p>
          )}

          <button
            onClick={() => product.seller?.username && go("shop", { username: product.seller.username })}
            className="flex items-center gap-3 mt-5 p-3 rounded-xl border border-gray-100 w-full hover:bg-gray-50"
          >
            <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
              {product.seller?.avatar_url ? (
                <img src={product.seller.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-sm font-bold" style={{ color: COLORS.primary }}>
                  {(product.seller?.shop_name || product.seller?.username || "U").slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">{product.seller?.shop_name || product.seller?.username || "Seller"}</p>
              <p className="text-xs text-gray-400 truncate">@{product.seller?.username || "unknown"}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border shrink-0" style={{ color: COLORS.primary, borderColor: COLORS.primary }}>
              View shop
            </span>
          </button>

          {(product.category?.name || product.condition) && (
            <div className="mt-4 rounded-xl border border-gray-100 divide-y divide-gray-50 text-sm">
              {product.category?.name && (
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-gray-400">Category</span>
                  <span className="text-gray-800 font-medium">{product.category.name}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-gray-400">Condition</span>
                  <span className="text-gray-800 font-medium capitalize">{product.condition}</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-5">
            <h3 className="font-semibold text-gray-800 mb-1.5 text-sm">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description || "No description provided."}</p>
          </div>

          <div className="flex gap-3 mt-6">

          </div>

          <div className="flex gap-3 mt-3">
            {whatsappHref ? (
              <Button as="a" href={whatsappHref} target="_blank" rel="noreferrer" variant="secondary" className="flex-1">
                <MessageCircle size={16} /> Chat with seller
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" disabled>
                <MessageCircle size={16} /> No WhatsApp number
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => (user ? toggleFavorite(product.id, "product") : go("login"))}
              className="flex-1 !bg-white"
            >
              <Heart size={16} fill={isFav ? "#EF4444" : "none"} color={isFav ? "#EF4444" : COLORS.primary} />
              {isFav ? "Saved" : "Add to favorites"}
            </Button>
          </div>
          <button
            onClick={() => (user ? setReportOpen(true) : go("login"))}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 mt-3"
          >
            <Flag size={13} /> Report this listing
          </button>
        </div>
      </div>

      {reportOpen && (
        <Modal onClose={() => setReportOpen(false)} title="Report this listing">
          <Select label="Reason" value={reportReason} onChange={(e) => setReportReason(e.target.value)}>
            <option value="">Select a reason</option>
            <option value="Spam">Spam</option>
            <option value="Scam or fraud">Scam or fraud</option>
            <option value="Counterfeit item">Counterfeit item</option>
            <option value="Inappropriate content">Inappropriate content</option>
            <option value="Other">Other</option>
          </Select>
          <div className="mt-4">
            <TextArea
              label="Additional details (optional)"
              rows={4}
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Describe the issue..."
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1 !bg-white" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button className="flex-1" onClick={submitReport} disabled={reporting || !reportReason}>
              {reporting ? "Submitting..." : "Submit report"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
