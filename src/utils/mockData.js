// Mock product data
export const CATEGORIES = ['Electronics', 'Apparel', 'Food & Beverage', 'Tools', 'Office Supplies', 'Healthcare'];

export const WAREHOUSES = ['Warehouse A – Chennai', 'Warehouse B – Mumbai', 'Warehouse C – Delhi'];

let productIdCounter = 13;

export const generateMockProducts = () => [
  { id: '1', name: 'USB-C Hub 7-Port', sku: 'ELEC-001', category: 'Electronics', stock: 4, threshold: 10, price: 2499, warehouse: 'Warehouse A – Chennai', lastUpdated: new Date(Date.now() - 3600000).toISOString(), updatedBy: 'admin' },
  { id: '2', name: 'Mechanical Keyboard', sku: 'ELEC-002', category: 'Electronics', stock: 23, threshold: 5, price: 8999, warehouse: 'Warehouse A – Chennai', lastUpdated: new Date(Date.now() - 7200000).toISOString(), updatedBy: 'staff1' },
  { id: '3', name: 'Wireless Mouse Pro', sku: 'ELEC-003', category: 'Electronics', stock: 3, threshold: 8, price: 3499, warehouse: 'Warehouse B – Mumbai', lastUpdated: new Date(Date.now() - 1800000).toISOString(), updatedBy: 'admin' },
  { id: '4', name: 'Office Chair Ergonomic', sku: 'OFFC-001', category: 'Office Supplies', stock: 7, threshold: 3, price: 24999, warehouse: 'Warehouse A – Chennai', lastUpdated: new Date(Date.now() - 86400000).toISOString(), updatedBy: 'staff2' },
  { id: '5', name: 'Paracetamol 500mg (Pack of 10)', sku: 'HLTH-001', category: 'Healthcare', stock: 2, threshold: 20, price: 49, warehouse: 'Warehouse C – Delhi', lastUpdated: new Date(Date.now() - 600000).toISOString(), updatedBy: 'staff1' },
  { id: '6', name: 'Blue Denim Jacket', sku: 'APRL-001', category: 'Apparel', stock: 15, threshold: 5, price: 2199, warehouse: 'Warehouse B – Mumbai', lastUpdated: new Date(Date.now() - 172800000).toISOString(), updatedBy: 'admin' },
  { id: '7', name: '4K Monitor 27"', sku: 'ELEC-004', category: 'Electronics', stock: 1, threshold: 3, price: 42999, warehouse: 'Warehouse A – Chennai', lastUpdated: new Date(Date.now() - 900000).toISOString(), updatedBy: 'admin' },
  { id: '8', name: 'Screwdriver Set (12pc)', sku: 'TOOL-001', category: 'Tools', stock: 30, threshold: 5, price: 799, warehouse: 'Warehouse C – Delhi', lastUpdated: new Date(Date.now() - 259200000).toISOString(), updatedBy: 'staff2' },
  { id: '9', name: 'Instant Coffee 200g', sku: 'FOOD-001', category: 'Food & Beverage', stock: 6, threshold: 15, price: 349, warehouse: 'Warehouse B – Mumbai', lastUpdated: new Date(Date.now() - 43200000).toISOString(), updatedBy: 'staff1' },
  { id: '10', name: 'HDMI Cable 2m', sku: 'ELEC-005', category: 'Electronics', stock: 50, threshold: 10, price: 599, warehouse: 'Warehouse A – Chennai', lastUpdated: new Date(Date.now() - 7200000).toISOString(), updatedBy: 'staff1' },
  { id: '11', name: 'Laptop Stand Aluminium', sku: 'OFFC-002', category: 'Office Supplies', stock: 9, threshold: 4, price: 3999, warehouse: 'Warehouse C – Delhi', lastUpdated: new Date(Date.now() - 3600000).toISOString(), updatedBy: 'admin' },
  { id: '12', name: 'Hand Sanitizer 500ml', sku: 'HLTH-002', category: 'Healthcare', stock: 45, threshold: 25, price: 199, warehouse: 'Warehouse B – Mumbai', lastUpdated: new Date(Date.now() - 21600000).toISOString(), updatedBy: 'staff2' },
];

export const generateMockHistory = (productId) => {
  const users = ['admin', 'staff1', 'staff2'];
  const notes = ['Restocked from supplier', 'Manual adjustment', 'Sold to customer', 'Returned item', 'Damaged stock removal', 'Inventory audit'];
  const history = [];
  let stock = 50;
  
  for (let i = 0; i < 20; i++) {
    const change = Math.floor(Math.random() * 20) - 10;
    const newStock = Math.max(0, stock + change);
    history.push({
      id: `${productId}-hist-${i}`,
      productId,
      previousStock: stock,
      newStock,
      change: newStock - stock,
      user: users[Math.floor(Math.random() * users.length)],
      note: notes[Math.floor(Math.random() * notes.length)],
      timestamp: new Date(Date.now() - i * 86400000 * Math.random() * 3).toISOString(),
    });
    stock = newStock;
  }
  
  return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const ROLES = { ADMIN: 'admin', STAFF: 'staff' };

export const USERS = [
  { id: '1', name: 'Krish', username: 'admin', password: 'admin123', role: ROLES.ADMIN, avatar: 'KR' },
  { id: '2', name: 'Ezhil', username: 'staff1', password: 'staff123', role: ROLES.STAFF, avatar: 'EZ' },
  { id: '3', name: 'Kicha', username: 'staff2', password: 'staff456', role: ROLES.STAFF, avatar: 'KA' },
];

export const nextProductId = () => String(productIdCounter++);
