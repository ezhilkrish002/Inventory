import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    return await productService.getProducts(params);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createProduct = createAsyncThunk('products/create', async (data, { rejectWithValue }) => {
  try {
    return await productService.createProduct(data);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateStock = createAsyncThunk('products/updateStock', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    return await productService.updateStock(id, payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateThreshold = createAsyncThunk('products/updateThreshold', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    return await productService.updateThreshold(id, payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await productService.deleteProduct(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    totalPages: 0,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    filters: {
      page: 1,
      limit: 10,
      search: '',
      category: '',
      lowStock: false,
      sortBy: 'name',
      sortOrder: 'asc',
    },
    selectedProduct: null,
    flashedIds: [], // IDs that were recently updated (for animation)
    offlineQueue: [],
    isOnline: navigator.onLine,
  },
  reducers: {
    setFilter(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    realTimeUpdate(state, action) {
      const updated = action.payload;
      const idx = state.items.findIndex(p => p.id === updated.id);
      if (idx !== -1) {
        state.items[idx] = updated;
        if (!state.flashedIds.includes(updated.id)) {
          state.flashedIds.push(updated.id);
        }
      }
    },
    clearFlash(state, action) {
      state.flashedIds = state.flashedIds.filter(id => id !== action.payload);
    },
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
    },
    addToOfflineQueue(state, action) {
      state.offlineQueue.push(action.payload);
    },
    clearOfflineQueue(state) {
      state.offlineQueue = [];
    },
    optimisticUpdateStock(state, action) {
      const { id, change } = action.payload;
      const idx = state.items.findIndex(p => p.id === id);
      if (idx !== -1) {
        const newStock = Math.max(0, state.items[idx].stock + change);
        state.items[idx] = { ...state.items[idx], stock: newStock };
        if (state.selectedProduct?.id === id) {
          state.selectedProduct = { ...state.selectedProduct, stock: newStock };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex(p => p.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
        if (state.selectedProduct?.id === updated.id) state.selectedProduct = updated;
        if (!state.flashedIds.includes(updated.id)) state.flashedIds.push(updated.id);
      })
      .addCase(updateThreshold.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.items.findIndex(p => p.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
        if (state.selectedProduct?.id === updated.id) state.selectedProduct = updated;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
        state.total -= 1;
        if (state.selectedProduct?.id === action.payload) state.selectedProduct = null;
      });
  },
});

export const {
  setFilter, setPage, setSelectedProduct, realTimeUpdate, clearFlash,
  setOnlineStatus, addToOfflineQueue, clearOfflineQueue, optimisticUpdateStock,
} = productsSlice.actions;

export default productsSlice.reducer;
