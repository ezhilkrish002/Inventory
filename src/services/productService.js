import { generateMockProducts, generateMockHistory, nextProductId } from '../utils/mockData';

// Simulated API delay
const delay = (ms = 600) => new Promise(res => setTimeout(res, ms));

// In-memory store (simulates backend)
let products = generateMockProducts();
const historyStore = {};

const simulateError = () => Math.random() < 0.05; // 5% error rate

export const productService = {
  async getProducts({ page = 1, limit = 10, search = '', category = '', lowStock = false, sortBy = 'name', sortOrder = 'asc' } = {}) {
    await delay();
    if (simulateError()) throw new Error('Failed to fetch products. Please try again.');

    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (lowStock) {
      filtered = filtered.filter(p => p.stock <= p.threshold);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'lastUpdated') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      const order = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'desc' ? -order : order;
    });

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { products: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getProduct(id) {
    await delay(300);
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  async createProduct(data) {
    await delay();
    if (simulateError()) throw new Error('Failed to create product.');
    const product = {
      id: nextProductId(),
      ...data,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin',
    };
    products.unshift(product);
    return product;
  },

  async updateStock(id, { change, note, updatedBy }) {
    await delay(400);
    if (simulateError()) throw new Error('Failed to update stock.');
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');

    const product = products[idx];
    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + change);

    products[idx] = {
      ...product,
      stock: newStock,
      lastUpdated: new Date().toISOString(),
      updatedBy,
    };

    // Record history
    if (!historyStore[id]) historyStore[id] = generateMockHistory(id);
    historyStore[id].unshift({
      id: `${id}-hist-${Date.now()}`,
      productId: id,
      previousStock,
      newStock,
      change: newStock - previousStock,
      user: updatedBy,
      note: note || 'Manual update',
      timestamp: new Date().toISOString(),
    });

    return products[idx];
  },

  async updateThreshold(id, { threshold, updatedBy }) {
    await delay(400);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    products[idx] = { ...products[idx], threshold, lastUpdated: new Date().toISOString(), updatedBy };
    return products[idx];
  },

  async deleteProduct(id) {
    await delay();
    if (simulateError()) throw new Error('Failed to delete product.');
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    products.splice(idx, 1);
    return { success: true };
  },

  async getHistory(productId, { page = 1, limit = 10, startDate, endDate } = {}) {
    await delay();
    if (!historyStore[productId]) historyStore[productId] = generateMockHistory(productId);
    let history = [...historyStore[productId]];
    if (startDate) history = history.filter(h => new Date(h.timestamp) >= new Date(startDate));
    if (endDate) history = history.filter(h => new Date(h.timestamp) <= new Date(endDate));
    const total = history.length;
    return { history: history.slice((page - 1) * limit, page * limit), total, totalPages: Math.ceil(total / limit) };
  },

  // Expose internal state for polling simulation
  _getAll() { return products; },
  _simulateRealTimeChange() {
    if (products.length === 0) return null;
    const idx = Math.floor(Math.random() * products.length);
    const change = Math.floor(Math.random() * 10) - 4;
    const product = products[idx];
    const newStock = Math.max(0, product.stock + change);
    products[idx] = { ...product, stock: newStock, lastUpdated: new Date().toISOString() };
    return products[idx];
  }
};
