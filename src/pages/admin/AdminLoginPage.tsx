import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PawIcon } from '../../components/common/PawIcon';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@petmate.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = login(email, password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setErrorMsg('Invalid login credentials. Please use the demo credentials provided below.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@petmate.com');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <PawIcon size={38} color="#F4770B" />
          <span className="text-3xl font-extrabold text-[#14532D] tracking-tight">
            Petmate
          </span>
        </Link>
        <h2 className="text-2xl font-black text-[#171717] tracking-tight">
          Admin Portal Login
        </h2>
        <p className="mt-1 text-xs text-[#666666]">
          Manage products, blog stories, image gallery, and customer inquiries.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-[#F0EAE1]">
          {errorMsg && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@petmate.com"
                  className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#14532D] hover:bg-[#26752C] text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Dashboard</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="mt-6 pt-6 border-t border-gray-100 bg-[#FFF9F0] p-4 rounded-2xl border border-[#F0EAE1] text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#14532D]">Demo Access Credentials</span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-bold text-[#F4770B] hover:underline"
              >
                Auto-Fill
              </button>
            </div>
            <div className="text-gray-600 space-y-0.5">
              <div>Email: <strong className="text-[#171717]">admin@petmate.com</strong></div>
              <div>Password: <strong className="text-[#171717]">admin123</strong></div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#666666] hover:text-[#14532D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Petmate Store</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
