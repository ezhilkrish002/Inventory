import { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, Plus, Minus, Save, Sliders, Package, MapPin, Tag, DollarSign } from 'lucide-react';
import { useStockUpdates } from '../../hooks';
import { StockBadge, StockBar } from '../common/StockBadge';
import { ROLES } from '../../utils/mockData';
import { format } from 'date-fns';

export default function StockPanel({ product, onClose }) {
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === ROLES.ADMIN;
  const { handleUpdate, handleThresholdUpdate } = useStockUpdates();

  const [change, setChange] = useState(0);
  const [note, setNote] = useState('');
  const [threshold, setThreshold] = useState(product.threshold);
  const [saving, setSaving] = useState(false);

  const preview = Math.max(0, product.stock + change);
  const isNeg = product.stock + change < 0;

  const handleApply = async () => {
    if (change === 0) return;
    setSaving(true);
    await handleUpdate(product.id, change, note);
    setSaving(false);
    setChange(0);
    setNote('');
  };

  const handleThresholdSave = async () => {
    setSaving(true);
    await handleThresholdUpdate(product.id, Number(threshold));
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md bg-surface-900 border-l border-surface-800 h-full overflow-y-auto animate-slide-in shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-900 border-b border-surface-800 p-5 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display font-bold text-white text-lg leading-tight">{product.name}</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{product.sku}</p>
            </div>
            <button onClick={onClose} className="btn-ghost p-1.5 mt-0.5"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Product info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Tag, label: 'Category', value: product.category },
              { icon: MapPin, label: 'Warehouse', value: product.warehouse.split('–')[0].trim() },
              { icon: DollarSign, label: 'Price', value: `₹${product.price.toLocaleString()}` },
              { icon: Package, label: 'Last Updated', value: format(new Date(product.lastUpdated), 'MMM d, HH:mm') },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-surface-800/50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Icon className="w-3 h-3" />
                  {label}
                </div>
                <div className="text-sm text-white font-medium">{value}</div>
              </div>
            ))}
          </div>

          {/* Stock overview */}
          <div className="card p-4 border-brand-600/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">Current Stock</span>
              <StockBadge stock={product.stock} threshold={product.threshold} />
            </div>
            <StockBar stock={product.stock} threshold={product.threshold} />
            <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
              <span>Threshold: {product.threshold}</span>
              <span>Updated by: {product.updatedBy}</span>
            </div>
          </div>

          {/* Stock update */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-400" />
              Update Stock
            </h3>

            {/* Change controls */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setChange(c => c - 1)}
                disabled={product.stock + change <= 0}
                className="w-10 h-10 rounded-lg bg-danger-600/20 border border-danger-600/30 text-danger-400 flex items-center justify-center hover:bg-danger-600/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center">
                <div className="text-2xl font-display font-bold text-white font-mono">
                  {change > 0 ? '+' : ''}{change}
                </div>
                <div className={`text-xs font-mono ${isNeg ? 'text-danger-400' : 'text-slate-500'}`}>
                  Preview: {preview} units
                  {isNeg && ' (will clamp to 0)'}
                </div>
              </div>
              <button
                onClick={() => setChange(c => c + 1)}
                className="w-10 h-10 rounded-lg bg-success-600/20 border border-success-600/30 text-success-400 flex items-center justify-center hover:bg-success-600/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[-10, -5, +5, +10].map(n => (
                <button
                  key={n}
                  onClick={() => setChange(c => {
                    const next = c + n;
                    return product.stock + next < 0 ? -product.stock : next;
                  })}
                  className={`btn text-xs py-1.5 justify-center ${n < 0 ? 'btn-secondary text-danger-400 border-danger-600/30 hover:bg-danger-900/30' : 'btn-secondary text-success-400 border-success-600/30 hover:bg-success-900/30'}`}
                >
                  {n > 0 ? '+' : ''}{n}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Note (optional)</label>
              <textarea
                className="input resize-none h-20"
                placeholder="e.g. Received shipment from supplier…"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>

            <button
              onClick={handleApply}
              disabled={change === 0 || saving}
              className="btn-primary w-full justify-center"
            >
              {saving
                ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                : <><Save className="w-4 h-4" />Apply Change</>
              }
            </button>
          </div>

          {/* Threshold (admin only) */}
          {isAdmin && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" />
                Low Stock Threshold
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={threshold}
                  onChange={e => setThreshold(e.target.value)}
                />
                <button onClick={handleThresholdSave} disabled={saving} className="btn-secondary shrink-0">
                  Save
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">Alert triggers when stock falls at or below this value</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
