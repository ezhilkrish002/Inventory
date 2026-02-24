import { AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

export function StockBadge({ stock, threshold }) {
  const ratio = threshold > 0 ? stock / threshold : 1;

  if (stock === 0) {
    return <span className="badge-danger flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Out of stock</span>;
  }
  if (stock <= threshold) {
    return <span className="badge-danger flex items-center gap-1"><TrendingDown className="w-3 h-3" />Low stock</span>;
  }
  if (ratio < 2) {
    return <span className="badge-warning">Moderate</span>;
  }
  return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />In stock</span>;
}

export function StockBar({ stock, threshold }) {
  const pct = threshold > 0 ? Math.min(100, (stock / (threshold * 3)) * 100) : 100;
  const color = stock <= 0 ? 'bg-danger-500' : stock <= threshold ? 'bg-warning-500' : 'bg-success-500';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-sm font-mono font-medium ${stock <= threshold ? 'text-danger-400' : 'text-slate-300'}`}>
        {stock}
      </span>
    </div>
  );
}
