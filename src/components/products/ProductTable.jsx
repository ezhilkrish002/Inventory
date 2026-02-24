import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ArrowUp, ArrowDown, ArrowUpDown, Trash2, Edit3 } from 'lucide-react';
import { StockBadge, StockBar } from '../common/StockBadge';
import { ProductTableSkeleton } from '../common/Skeleton';
import { ROLES } from '../../utils/mockData';
import { format, formatDistanceToNow } from 'date-fns';

function SortHeader({ label, field, currentSort, currentOrder, onSort }) {
  const active = currentSort === field;
  const Icon = active ? (currentOrder === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        <Icon className={`w-3 h-3 ${active ? 'text-brand-400' : 'opacity-40'}`} />
      </span>
    </th>
  );
}

export default function ProductTable({ onSelect, onDelete, flashedIds, onMarkFlashed, filters, onSort }) {
  const { items: products, status } = useSelector(s => s.products);
  const { user } = useSelector(s => s.auth);
  const isAdmin = user?.role === ROLES.ADMIN;
  const rowRefs = useRef({});

  // Trigger flash animation on updated rows
  useEffect(() => {
    flashedIds.forEach(id => {
      const el = rowRefs.current[id];
      if (el) {
        el.classList.remove('table-row-flash');
        void el.offsetWidth; // reflow
        el.classList.add('table-row-flash');
        onMarkFlashed(id);
      }
    });
  }, [flashedIds, onMarkFlashed]);

  const handleSort = (field) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onSort({ sortBy: field, sortOrder: newOrder });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-950/50 sticky top-0">
          <tr className="border-b border-surface-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
            <SortHeader label="Stock" field="stock" currentSort={filters.sortBy} currentOrder={filters.sortOrder} onSort={handleSort} />
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
            <SortHeader label="Updated" field="lastUpdated" currentSort={filters.sortBy} currentOrder={filters.sortOrder} onSort={handleSort} />
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-800">
          {status === 'loading' ? (
            <ProductTableSkeleton rows={8} />
          ) : products.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-16 text-center text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl opacity-30">📦</div>
                  <div className="font-medium">No products found</div>
                  <div className="text-sm">Try adjusting your filters</div>
                </div>
              </td>
            </tr>
          ) : products.map(product => {
            const isLow = product.stock <= product.threshold;
            return (
              <tr
                key={product.id}
                ref={el => rowRefs.current[product.id] = el}
                className={`transition-colors hover:bg-surface-800/50 cursor-pointer ${isLow ? 'bg-danger-950/20' : ''}`}
                onClick={() => onSelect(product)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-white text-sm">{product.name}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">{product.sku}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="badge-neutral text-xs">{product.category}</span>
                </td>
                <td className="px-4 py-3 min-w-[140px]">
                  <StockBar stock={product.stock} threshold={product.threshold} />
                  <div className="text-[10px] text-slate-600 font-mono mt-0.5">threshold: {product.threshold}</div>
                </td>
                <td className="px-4 py-3">
                  <StockBadge stock={product.stock} threshold={product.threshold} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-300 font-mono">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  <div>{formatDistanceToNow(new Date(product.lastUpdated), { addSuffix: true })}</div>
                  <div className="text-slate-600 mt-0.5">by {product.updatedBy}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onSelect(product)}
                      className="btn-ghost p-1.5 text-slate-400 hover:text-brand-400"
                      title="Update stock"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => onDelete(product.id, product.name)}
                        className="btn-ghost p-1.5 text-slate-400 hover:text-danger-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
