import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchProducts, updateStock, updateThreshold, deleteProduct, createProduct,
  setFilter, setPage, setSelectedProduct, realTimeUpdate, clearFlash,
  setOnlineStatus, addToOfflineQueue, clearOfflineQueue, optimisticUpdateStock,
} from '../store/slices/productsSlice';
import { productService } from '../services/productService';

// ─── useProducts ───────────────────────────────────────────────
export function useProducts() {
  const dispatch = useDispatch();
  const { items, total, totalPages, status, error, filters, flashedIds } = useSelector(s => s.products);

  const load = useCallback(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = useCallback((updates) => dispatch(setFilter(updates)), [dispatch]);
  const changePage = useCallback((p) => dispatch(setPage(p)), [dispatch]);

  const markFlashed = useCallback((id) => {
    setTimeout(() => dispatch(clearFlash(id)), 800);
  }, [dispatch]);

  return { products: items, total, totalPages, status, error, filters, flashedIds, updateFilter, changePage, reload: load, markFlashed };
}

// ─── useStockUpdates ────────────────────────────────────────────
export function useStockUpdates() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { isOnline, offlineQueue } = useSelector(s => s.products);

  const handleUpdate = useCallback(async (productId, change, note) => {
    if (change === 0) return;

    const payload = { id: productId, change, note, updatedBy: user?.username || 'unknown' };

    if (!isOnline) {
      dispatch(optimisticUpdateStock({ id: productId, change }));
      dispatch(addToOfflineQueue(payload));
      toast('📦 Update queued – you\'re offline', { icon: '📶' });
      return;
    }

    // Optimistic update
    dispatch(optimisticUpdateStock({ id: productId, change }));

    try {
      const result = await dispatch(updateStock(payload)).unwrap();
      toast.success('Stock updated successfully');
      if (result.stock <= result.threshold) {
        toast(`⚠️ Low stock alert: ${result.name} (${result.stock} remaining)`, {
          duration: 5000,
          style: { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' },
        });
      }
    } catch (err) {
      toast.error(err || 'Failed to update stock');
      // Revert by reloading
      dispatch(fetchProducts());
    }
  }, [dispatch, user, isOnline]);

  const handleThresholdUpdate = useCallback(async (productId, threshold) => {
    try {
      await dispatch(updateThreshold({ id: productId, threshold, updatedBy: user?.username })).unwrap();
      toast.success('Threshold updated');
    } catch (err) {
      toast.error(err || 'Failed to update threshold');
    }
  }, [dispatch, user]);

  const syncOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    toast.loading('Syncing offline changes…', { id: 'sync' });
    let success = 0;
    for (const op of offlineQueue) {
      try {
        await dispatch(updateStock(op)).unwrap();
        success++;
      } catch (e) {
        console.error('Sync failed for', op);
      }
    }
    dispatch(clearOfflineQueue());
    toast.success(`Synced ${success} of ${offlineQueue.length} changes`, { id: 'sync' });
    dispatch(fetchProducts());
  }, [dispatch, offlineQueue]);

  return { handleUpdate, handleThresholdUpdate, syncOfflineQueue, offlineQueueCount: offlineQueue.length };
}

// ─── useOnlineStatus ────────────────────────────────────────────
export function useOnlineStatus() {
  const dispatch = useDispatch();
  const { isOnline } = useSelector(s => s.products);
  const { syncOfflineQueue } = useStockUpdates();

  useEffect(() => {
    const goOnline = () => {
      dispatch(setOnlineStatus(true));
      syncOfflineQueue();
    };
    const goOffline = () => {
      dispatch(setOnlineStatus(false));
      toast('You are offline. Changes will sync when reconnected.', { icon: '📶', duration: 4000 });
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, [dispatch, syncOfflineQueue]);

  return isOnline;
}

// ─── useRealTimePolling ──────────────────────────────────────────
export function useRealTimePolling(intervalMs = 8000) {
  const dispatch = useDispatch();
  const { isOnline } = useSelector(s => s.products);

  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      const updated = productService._simulateRealTimeChange();
      if (updated) {
        dispatch(realTimeUpdate(updated));
        if (updated.stock <= updated.threshold) {
          toast(`⚠️ ${updated.name}: stock dropped to ${updated.stock}`, {
            duration: 4000,
            style: { background: '#7f1d1d', color: '#fca5a5', border: '1px solid #dc2626' },
          });
        }
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [dispatch, isOnline, intervalMs]);
}

// ─── useProductActions ───────────────────────────────────────────
export function useProductActions() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);

  const handleDelete = useCallback(async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success(`${name} deleted`);
    } catch (err) {
      toast.error(err || 'Delete failed');
    }
  }, [dispatch]);

  const handleCreate = useCallback(async (data) => {
    try {
      await dispatch(createProduct({ ...data, updatedBy: user?.username })).unwrap();
      toast.success('Product created successfully');
      return true;
    } catch (err) {
      toast.error(err || 'Failed to create product');
      return false;
    }
  }, [dispatch, user]);

  const selectProduct = useCallback((product) => dispatch(setSelectedProduct(product)), [dispatch]);

  return { handleDelete, handleCreate, selectProduct };
}

// ─── useDebounce ─────────────────────────────────────────────────
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = require('react').useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
