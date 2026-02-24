import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import { Package, Eye, EyeOff, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(login(form));
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid username or password');
    }
    setLoading(false);
  };

  const quickLogin = (username, password) => {
    setForm({ username, password });
  };

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-800/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-950/30 rounded-full blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/30">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">StockSense</h1>
            <p className="text-xs text-slate-500 font-mono">Smart Inventory System</p>
          </div>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl shadow-black/50">
          <h2 className="font-display text-xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-8">Access your inventory dashboard</p>

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
              <input
                className="input"
                placeholder="Enter username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  className="input pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-2.5" disabled={loading}>
              {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : 'Sign In'}
            </button>
          </form>

          {/* Quick login */}
          <div className="mt-6 pt-6 border-t border-surface-700">
            <p className="text-xs text-slate-500 mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3 text-warning-400" />
              Quick login (demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => quickLogin('admin', 'admin123')}
                className="btn-secondary text-xs py-2 justify-center"
              >
                👑 Admin
              </button>
              <button
                onClick={() => quickLogin('staff1', 'staff123')}
                className="btn-secondary text-xs py-2 justify-center"
              >
                👤 Staff
              </button>
            </div>
            <div className="mt-3 p-3 bg-surface-800/50 rounded-lg text-xs text-slate-500 space-y-1 font-mono">
              <div>admin / admin123 → Full access</div>
              <div>staff1 / staff123 → Stock updates only</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
