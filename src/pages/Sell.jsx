import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ImagePlus, X } from 'lucide-react'
import { createProduct } from '../services/products'

export default function Sell() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '' })
  const [images, setImages] = useState([])
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [error, setError] = useState(null)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 8)
    setImages(files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setError(null)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach((img) => fd.append('images', img))

      const product = await createProduct(fd)
      navigate(`/product/${product.id}`)
    } catch (err) {
      setStatus('error')
      setError(err.message || 'Could not publish your listing. Try again.')
    }
  }

  return (
    <div className="mx-auto max-w-lg py-6">
      <h1 className="font-display text-xl font-bold text-ink-900">List a product</h1>
      <p className="mt-1 text-sm text-ink-500">Every SHINEX account can sell — no separate seller signup.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700">Photos</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative h-20 w-20 overflow-hidden rounded-control border border-surface-line">
                <img src={URL.createObjectURL(img)} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {images.length < 8 && (
              <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-control border border-dashed border-surface-line text-ink-400 hover:border-brand-400 hover:text-brand-500">
                <ImagePlus size={18} />
                <span className="text-[10px]">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Title</label>
          <input
            required
            value={form.title}
            onChange={update('title')}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink-700">Price (₦)</label>
            <input
              type="number"
              min="0"
              required
              value={form.price}
              onChange={update('price')}
              className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Category</label>
            <input
              required
              value={form.category}
              onChange={update('category')}
              className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink-700">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={update('description')}
            className="mt-1 w-full rounded-control border border-surface-line px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

        {error && <p className="rounded-control bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-control bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {status === 'submitting' ? 'Publishing…' : 'Publish listing'}
        </button>
      </form>
    </div>
  )
}
