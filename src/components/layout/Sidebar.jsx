import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  Package, BarChart3, History, Settings, LogOut,
  Wifi, WifiOff, AlertTriangle, ChevronRight
} from 'lucide-react';
import { useOnlineStatus } from '../../hooks';

const NAV = [
  { to: '/', label: 'Products', icon: Package, exact: true },
  { to: '/history', label: 'Stock History', icon: History },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { offlineQueue } = useSelector(s => s.products);
  const isOnline = useOnlineStatus();
  const lowStockCount = useSelector(s => s.products.items.filter(p => p.stock <= p.threshold).length);

  return (
    <aside className="w-60 bg-surface-900 border-r border-surface-800 flex flex-col shrink-0 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-5 border-b border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center shadow shadow-brand-600/40">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm tracking-tight">StockSense</div>
            <div className="font-mono text-[10px] text-slate-500">Inventory System</div>
          </div>
        </div>
      </div>

      {/* Online status */}
      <div className={`mx-3 mt-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
        isOnline ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'
      }`}>
        {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
        {isOnline ? 'Connected' : `Offline${offlineQueue?.length ? ` · ${offlineQueue.length} queued` : ''}`}
      </div>

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="mx-3 mt-2 px-3 py-2 rounded-lg text-xs flex items-center gap-2 bg-warning-500/10 text-warning-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {lowStockCount} low stock alert{lowStockCount > 1 ? 's' : ''}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 mt-3">
        {NAV.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-surface-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-surface-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-brand-200 font-mono">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{user?.role}</div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="text-slate-500 hover:text-danger-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
