# 📦 StockSense – Smart Inventory System

A production-grade React + Tailwind CSS + Redux Toolkit inventory management dashboard.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Demo Credentials

| Role  | Username | Password  | Access |
|-------|----------|-----------|--------|
| Admin | `admin`  | `admin123` | Full access (create, delete, threshold) |
| Staff | `staff1` | `staff123` | Stock updates only |
| Staff | `staff2` | `staff456` | Stock updates only |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/          # Reusable UI (Skeleton, Pagination, StockBadge)
│   ├── layout/          # Sidebar navigation
│   ├── products/        # ProductTable, CreateProductModal
│   └── stock/           # StockPanel (side drawer)
├── hooks/               # Custom hooks (useProducts, useStockUpdates, etc.)
├── pages/               # ProductsPage, HistoryPage, LoginPage
├── services/            # productService.js (API layer)
├── store/
│   ├── slices/          # authSlice, productsSlice (Redux Toolkit)
│   └── index.js         # Store configuration
└── utils/               # mockData.js, constants
```

---

## ✨ Features Implemented

### Core Features
- ✅ **Product List** – paginated, searchable, filterable by category
- ✅ **Low Stock Filter** – highlight + filter products below threshold
- ✅ **Sort** – by stock quantity and last updated time
- ✅ **Stock Update Panel** – slide-in drawer with +/- controls, quick amounts, notes
- ✅ **Optimistic UI** – instant visual update before API response
- ✅ **Stock validation** – prevents negative stock
- ✅ **Stock History** – timeline with date range filter and pagination
- ✅ **Role-Based Access** – Admin vs Staff UI differences
- ✅ **Real-Time Polling** – every 8s, with flash animation on updated rows
- ✅ **Offline Mode** – detects offline status, queues updates, syncs on reconnect
- ✅ **Error Handling** – toast notifications, retry buttons, skeleton loaders
- ✅ **CSV Export** – download current product list as CSV

### Tech Stack
- **React 18** – component-based UI
- **Redux Toolkit** – state management (auth + products slices)
- **React Router v6** – client-side navigation
- **Tailwind CSS** – utility-first styling with dark theme
- **Axios** – HTTP client (service layer)
- **react-hot-toast** – toast notifications
- **date-fns** – date formatting
- **lucide-react** – icons

### State Architecture
- **Server state** → `productsSlice` with `createAsyncThunk`
- **UI state** → Redux reducers (filters, selection, flash IDs)
- **Real-time** → polling via `useRealTimePolling` custom hook
- **Offline queue** → Redux `offlineQueue` array, synced on reconnect

### Custom Hooks
| Hook | Purpose |
|------|---------|
| `useProducts` | Fetch, filter, sort products |
| `useStockUpdates` | Handle stock mutations + offline queuing |
| `useRealTimePolling` | Simulate WebSocket with polling |
| `useOnlineStatus` | Network status + sync trigger |
| `useProductActions` | Delete, create, select products |
| `useDebounce` | Debounce search input (400ms) |

---

