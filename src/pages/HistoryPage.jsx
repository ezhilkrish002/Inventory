import { useState, useEffect, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { History, ArrowUp, ArrowDown, Calendar, User, Search } from 'lucide-react';
import { productService } from '../services/productService';
import { format, formatDistanceToNow } from 'date-fns';
import Pagination from '../components/common/Pagination';
import { SkeletonCard } from '../components/common/Skeleton';

function HistoryRow({ entry }) {
  const isIncrease = entry.change > 0;
  return (
    <div className="flex items-start gap-4 py-4 border-b border-surface-800 last:border-0">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
        isIncrease ? 'bg-success-500/20 text-success-400' : 'bg-danger-500/20 text-danger-400'
      }`}>
        {isIncrease ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className={`text-sm font-bold font-mono ${isIncrease ? 'text-success-400' : 'text-danger-400'}`}>
            {isIncrease ? '+' : ''}{entry.change} units
          </span>
          <span className="text-xs text-slate-500 font-mono shrink-0">
            {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{entry.note}</div>
        <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{entry.user}</span>
          <span>{entry.previousStock} → {entry.newStock}</span>
          <span className="font-mono">{format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}</span>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { items: products } = useSelector(s => s.products);
  const [selectedId, setSelectedId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const result = await productService.getHistory(selectedId, { page, limit: 10, startDate, endDate });
      setHistory(result.history);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [selectedId, page, startDate, endDate]);

  useEffect(() => {
    setPage(1);
  }, [selectedId, startDate, endDate]);

  const selectedProduct = products.find(p => p.id === selectedId);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-md border-b border-surface-800 px-6 py-4">
        <h1 className="font-display text-2xl font-bold text-white tracking-tight mb-1">Stock History</h1>
        <p className="text-sm text-slate-500">Track all stock movements per product</p>
      </div>

      <div className="p-6 space-y-4">
        {/* Filters */}
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Select Product</label>
              <select className="input" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">— Choose a product —</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">From Date</label>
              <input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">To Date</label>
              <input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Empty state */}
        {!selectedId && (
          <div className="card p-16 text-center">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Select a product to view its stock history</p>
          </div>
        )}

        {/* History list */}
        {selectedId && (
          <div className="card">
            <div className="px-5 py-3 border-b border-surface-800 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-white">{selectedProduct?.name}</h2>
                <p className="text-xs text-slate-500 font-mono">{total} total movements</p>
              </div>
              <span className="badge-neutral font-mono text-xs">{selectedProduct?.sku}</span>
            </div>

            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }, (_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p>No history found for this date range</p>
              </div>
            ) : (
              <div className="px-5">
                {history.map(entry => <HistoryRow key={entry.id} entry={entry} />)}
              </div>
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={10}
              onPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
