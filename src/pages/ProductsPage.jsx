import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Search, Filter, Plus, RefreshCw, AlertTriangle, Download } from 'lucide-react';
import { useProducts, useProductActions, useRealTimePolling, useDebounce } from '../hooks';
import ProductTable from '../components/products/ProductTable';
import StockPanel from '../components/stock/StockPanel';
import CreateProductModal from '../components/products/CreateProductModal';
import Pagination from '../components/common/Pagination';
import { CATEGORIES, ROLES } from '../utils/mockData';

export default function ProductsPage() {
  const { products, total, totalPages, status, error, filters, flashedIds, updateFilter, changePage, reload, markFlashed } = useProducts();
  const { handleDelete, handleCreate, selectProduct } = useProductActions();
  const { user } = useSelector(s => s.auth);
  const { selectedProduct } = useSelector(s => s.products);
  const isAdmin = user?.role === ROLES.ADMIN;

  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 400);

  useRealTimePolling(8000);

  useEffect(() => {
    updateFilter({ search: debouncedSearch });
  }, [debouncedSearch]);

  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Stock', 'Threshold', 'Price', 'Warehouse', 'Last Updated'];
    const rows = products.map(p => [p.sku, p.name, p.category, p.stock, p.threshold, p.price, p.warehouse, p.lastUpdated]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const lowStockCount = products.filter(p => p.stock <= p.threshold).length;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface-950/95 backdrop-blur-md border-b border-surface-800 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Products</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {total} products · {lowStockCount > 0 && <span className="text-danger-400">{lowStockCount} low stock</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="btn-secondary">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button onClick={reload} className="btn-secondary">
              <RefreshCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
            </button>
            {isAdmin && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input pl-9"
              placeholder="Search products or SKU…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          <select
            className="input w-auto min-w-36"
            value={filters.category}
            onChange={e => updateFilter({ category: e.target.value })}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <button
            onClick={() => updateFilter({ lowStock: !filters.lowStock })}
            className={`btn ${filters.lowStock ? 'bg-danger-600/20 text-danger-400 border border-danger-600/30 hover:bg-danger-600/30' : 'btn-secondary'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            Low Stock Only
          </button>
        </div>
      </div>

      {/* Error state */}
      {status === 'failed' && error && (
        <div className="mx-6 mt-4 p-4 bg-danger-950/50 border border-danger-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-danger-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
          <button onClick={reload} className="btn-secondary text-xs">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="card mx-6 my-4">
        <ProductTable
          onSelect={selectProduct}
          onDelete={handleDelete}
          flashedIds={flashedIds}
          onMarkFlashed={markFlashed}
          filters={filters}
          onSort={updateFilter}
        />
        <Pagination
          page={filters.page}
          totalPages={totalPages}
          total={total}
          limit={filters.limit}
          onPage={changePage}
        />
      </div>

      {/* Stock panel */}
      {selectedProduct && (
        <StockPanel product={selectedProduct} onClose={() => selectProduct(null)} />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateProductModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
