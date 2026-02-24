import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { CATEGORIES, WAREHOUSES } from '../../utils/mockData';

const DEFAULT = { name: '', sku: '', category: CATEGORIES[0], stock: 0, threshold: 5, price: 0, warehouse: WAREHOUSES[0] };

export default function CreateProductModal({ onClose, onCreate }) {
  const [form, setForm] = useState(DEFAULT);
  const [loading, setLoading] = useState(false);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await onCreate({ ...form, stock: Number(form.stock), threshold: Number(form.threshold), price: Number(form.price) });
    setLoading(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative card w-full max-w-lg shadow-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-surface-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600/20 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-brand-400" />
            </div>
            <h2 className="font-display font-bold text-white">Create Product</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Product Name</label>
              <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. USB-C Hub" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">SKU</label>
              <input className="input font-mono" required value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="ELEC-006" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Initial Stock</label>
              <input className="input" type="number" min="0" required value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Low Stock Threshold</label>
              <input className="input" type="number" min="1" required value={form.threshold} onChange={e => set('threshold', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Price (₹)</label>
              <input className="input" type="number" min="0" step="0.01" required value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Warehouse</label>
              <select className="input" value={form.warehouse} onChange={e => set('warehouse', e.target.value)}>
                {WAREHOUSES.map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
