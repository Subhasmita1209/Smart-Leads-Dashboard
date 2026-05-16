import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Zap,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.email) {
      e.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email';
    }

    if (!form.password) {
      e.password = 'Password is required';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await authService.login(form);

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);

        toast.success(`Welcome back, ${res.data.user.name}!`);

        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-8"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eef2ff 45%, #f5f3ff 100%)',
      }}
    >
      {/* Background Blurs */}
      <div className="absolute top-[-120px] left-[-120px] h-[320px] w-[320px] rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-violet-200/40 blur-3xl" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-black/5 bg-white/40 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl lg:grid-cols-2">
        {/* LEFT SECTION */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
          {/* Soft Glow */}
          <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/60 px-4 py-2 backdrop-blur-xl shadow-sm">
              <Sparkles size={15} className="text-indigo-600" />

              <span className="text-sm font-medium text-slate-700 tracking-wide">
                Smart Leads Platform
              </span>
            </div>

            <div className="mt-14">
              <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
                Manage leads
                <br />
                with confidence.
              </h1>

              <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-600">
                A modern CRM experience designed to simplify workflows,
                organize clients, and help your business scale efficiently.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-black/5 bg-white/50 p-5 backdrop-blur-xl shadow-sm">
              <ShieldCheck
                className="mb-3 text-indigo-600"
                size={22}
              />

              <h3 className="text-sm font-semibold text-slate-800">
                Secure Access
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Authentication with enterprise-grade protection.
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/50 p-5 backdrop-blur-xl shadow-sm">
              <Zap className="mb-3 text-violet-600" size={22} />

              <h3 className="text-sm font-semibold text-slate-800">
                Faster Workflow
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Designed for productivity and smooth performance.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-16"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.58), rgba(248,250,252,0.78))',
          }}
        >
          {/* Soft Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />

          <div className="relative z-10 w-full max-w-md">
            {/* Logo + Heading */}
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-200">
                  <Zap className="text-white" size={25} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Welcome back
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Sign in to continue
                  </p>
                </div>
              </div>
            </div>

            {/* LOGIN CARD */}
            <div
              className="rounded-[28px] border border-black/5 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.72), rgba(255,255,255,0.52))',
              }}
            >
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-6"
              >
                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className={`h-12 w-full rounded-xl border bg-black/[0.02] px-4 text-sm outline-none transition-all duration-300
                    ${
                      errors.email
                        ? 'border-red-300 focus:ring-4 focus:ring-red-200'
                        : 'border-black/10 hover:border-black/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password: e.target.value,
                        })
                      }
                      className={`h-12 w-full rounded-xl border bg-black/[0.02] px-4 pr-12 text-sm outline-none transition-all duration-300
                      ${
                        errors.password
                          ? 'border-red-300 focus:ring-4 focus:ring-red-200'
                          : 'border-black/10 hover:border-black/20 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* REMEMBER */}
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-500">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />

                    Remember me
                  </label>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 font-semibold text-white shadow-lg shadow-indigo-200 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <span className="relative flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* FOOTER */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-indigo-600 transition-colors hover:text-violet-600"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>

            {/* BOTTOM TEXT */}
            <p className="mt-8 text-center text-xs text-slate-400">
              Crafted for modern workflow management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}