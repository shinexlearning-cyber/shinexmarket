import React, { useState, useEffect, useRef } from "react";
import { Plus, MapPin, X, Edit2, AlertCircle, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { PageSpinner } from "../../components/ui/PageSpinner";
import { Select } from "../../components/ui/Select";
import { TextArea } from "../../components/ui/TextArea";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoriesContext";
import { useToast } from "../../context/ToastContext";
import { COLORS, api, money } from "../../services/api";

/* ------------------------------------------------------------
   PAGE: SELL — POST /products (multipart, field "images", max 5)
   category_id must be a real category id from
   GET /products/categories/all.
   ------------------------------------------------------------ */
export function SellPage({ go, params }) {
  const { user } = useAuth();
  const toast = useToast();
  const { categories, status: catStatus } = useCategories();
  const editId = params?.editId || null;
  const [step, setStep] = useState("form"); // "form" | "preview"
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", condition: "used", description: "", location: "" });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);
  const fileRef = useRef(null);

  useEffect(() => {
    if (categories.length && !form.categoryId && !editId) {
      setForm((f) => ({ ...f, categoryId: categories[0].id }));
    }
    
  }, [categories, editId]);

  useEffect(() => {
    if (!editId) return;
    setLoadingExisting(true);
    api(`/products/${editId}`)
      .then(({ data }) => {
        setForm({
          name: data.name || "",
          price: String(data.price ?? ""),
          categoryId: data.category?.id || data.category_id || "",
          condition: data.condition || "used",
          description: data.description || "",
          location: data.location || "",
        });
        setExistingImages(data.images || []);
      })
      .catch((e) => toast.push(e.message, "error"))
      .finally(() => setLoadingExisting(false));
    
  }, [editId]);

  if (!user) {
    return <EmptyState icon={Plus} title="Log in to sell" subtitle="Create an account or log in to list a product on SHINEX." action={<Button onClick={() => go("login")}>Log in</Button>} />;
  }

  if (loadingExisting) return <PageSpinner />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.push("You can upload a maximum of 5 images.", "error");
      return;
    }
    const newOnes = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setImages((imgs) => [...imgs, ...newOnes]);
  };

  const removeImage = (i) => setImages((imgs) => imgs.filter((_, idx) => idx !== i));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price";
    if (!form.categoryId) e.category = "Choose a category";
    if (!editId && images.length === 0) e.images = "Add at least one image";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToPreview = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStep("preview");
    window.scrollTo({ top: 0 });
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("category_id", form.categoryId);
    fd.append("condition", form.condition);
    fd.append("description", form.description);
    fd.append("location", form.location);
    images.forEach((img) => fd.append("images", img.file));
    return fd;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const fd = buildFormData();
      if (editId) {
        const { message } = await api(`/products/${editId}`, { method: "PUT", body: fd, formData: true });
        toast.push(message || "Your listing was updated and sent back for review.", "success");
      } else {
        const { message } = await api("/products", { method: "POST", body: fd, formData: true });
        toast.push(message || "Your listing was submitted for review.", "success");
      }
      go("shop", { username: user.username });
    } catch (e) {
      toast.push(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const categoryName = categories.find((c) => c.id === form.categoryId)?.name;
  const previewImage = images[0]?.url || existingImages[0]?.image_url;
  const morePreviewImages = images.length > 1 ? images.slice(1).map((i) => i.url) : existingImages.slice(1).map((i) => i.image_url);

  if (step === "preview") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Preview your listing</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">This is how buyers will see it once it's approved. Go back to make changes.</p>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="w-full aspect-square bg-gray-50">
            {previewImage ? (
              <img src={previewImage} alt={form.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={48} /></div>
            )}
          </div>
          {morePreviewImages.length > 0 && (
            <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
              {morePreviewImages.map((src, i) => (
                <div key={i} className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-100">
                  <img src={src} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          )}
          <div className="p-5">
            <h2 className="text-xl font-bold text-gray-900">{form.name}</h2>
            <p className="text-2xl font-extrabold mt-1" style={{ color: COLORS.secondary }}>{money(form.price)}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 flex-wrap">
              {categoryName && <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">{categoryName}</span>}
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs capitalize">{form.condition}</span>
              {form.location && <span className="flex items-center gap-1"><MapPin size={13} /> {form.location}</span>}
            </div>
            {form.description && (
              <p className="text-sm text-gray-600 leading-relaxed mt-4 whitespace-pre-line">{form.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
          <AlertCircle size={14} className="shrink-0" />
          {editId
            ? "Saving changes sends this listing back for admin review before it's visible again."
            : "Your listing goes to SHINEX's review queue after posting and won't be publicly visible until it's approved."}
        </div>

        <div className="flex gap-3 mt-5">
          <Button variant="outline" className="flex-1 !bg-white" onClick={() => setStep("form")} disabled={loading}>
            <Edit2 size={15} /> Edit
          </Button>
          <Button className="flex-1" onClick={submit} disabled={loading}>
            {loading ? "Saving..." : editId ? "Confirm & save" : "Confirm & post"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{editId ? "Edit listing" : "Sell something"}</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        {editId ? "Update the details below — changes go back to SHINEX for review." : "List your item and reach buyers on SHINEX."}
      </p>

      <form onSubmit={goToPreview} className="space-y-5 bg-white rounded-2xl border border-gray-100 p-6">
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Photos ({images.length || existingImages.length}/5){editId && images.length === 0 && " — current photos"}
          </span>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="shrink-0 w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-[#14532D] hover:text-[#14532D]"
              >
                <Plus size={18} />
                <span className="text-[10px]">Add photos</span>
              </button>
            )}
            {images.length > 0
              ? images.map((img, i) => (
                  <div key={i} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                    <img src={img.url} className="w-full h-full object-cover" alt="" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/60 rounded-full p-1">
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))
              : existingImages.map((img) => (
                  <div key={img.id} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-100">
                    <img src={img.image_url} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
          </div>
          {editId && images.length === 0 && (
            <p className="text-xs text-gray-400 mt-1.5">Add new photos above to replace the current ones, or leave as is to keep them.</p>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
          {errors.images && <span className="mt-1 block text-xs text-red-500">{errors.images}</span>}
        </div>

        <Input label="Product name" value={form.name} onChange={set("name")} error={errors.name} placeholder="e.g. iPhone 13 Pro Max" />
        <Input label="Price (₦)" type="number" value={form.price} onChange={set("price")} error={errors.price} placeholder="e.g. 350000" />

        <Select label="Category" value={form.categoryId} onChange={set("categoryId")} error={errors.category} disabled={catStatus === "loading"}>
          {catStatus === "loading" && <option value="">Loading categories...</option>}
          {catStatus === "error" && <option value="">Couldn't load categories</option>}
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        <Select label="Condition" value={form.condition} onChange={set("condition")}>
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="refurbished">Refurbished</option>
        </Select>

        <TextArea label="Description" rows={4} value={form.description} onChange={set("description")} placeholder="Condition, features, reason for selling..." />
        <Input label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Ikeja, Lagos" />

        <Button className="w-full !py-3">
          {editId ? "Preview changes" : "Preview listing"}
        </Button>
      </form>
    </div>
  );
}
