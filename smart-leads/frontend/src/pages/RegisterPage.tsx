import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.name || form.name.length < 2)
      e.name = 'Name must be at least 2 characters';

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email';

    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await authService.register(form);

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.token);

        toast.success('Account created! Welcome aboard.');

        navigate('/dashboard', {
          state: { isNewUser: true },
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 grid w-full max-w-6xl min-h-[600px] overflow-hidden rounded-[32px] shadow-[0_20px_80px_rgba(15,23,42,0.08)] lg:grid-cols-2">

      
        <div className="relative flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-blue-500 text-white">

          <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-md">
              <Sparkles size={15} />
              <span className="text-sm font-medium">
                Smart Leads Platform
              </span>
            </div>

            <h1 className="mt-14 text-5xl font-bold leading-[1.1]">
              Start your
              <br />
              journey today.
            </h1>

            <p className="mt-6 max-w-md text-white/80 text-[15px] leading-7">
              Create your account and unlock a modern CRM experience
              built for speed, clarity, and growth.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">
              <ShieldCheck size={22} className="mb-3" />
              <h3 className="text-sm font-semibold">Secure Setup</h3>
              <p className="mt-1 text-xs text-white/70">
                Your data is protected from day one.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-md">
              <Zap size={22} className="mb-3" />
              <h3 className="text-sm font-semibold">Fast Onboarding</h3>
              <p className="mt-1 text-xs text-white/70">
                Get started in under a minute.
              </p>
            </div>
          </div>
        </div>

      
        <div className="relative flex items-center justify-center px-6 py-10 bg-white">

          <div className="w-full max-w-md">

           
            <div className="mb-10">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100">
                  <Zap className="text-indigo-600" size={25} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create account
                  </h1>
                  <p className="text-sm text-gray-500">
                    Join Smart Leads today
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-8">

              <form onSubmit={handleSubmit} className="space-y-6">

                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={`w-full mt-1 h-11 px-4 rounded-lg border bg-gray-50 outline-none transition
                    ${
                      errors.name
                        ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={`w-full mt-1 h-11 px-4 rounded-lg border bg-gray-50 outline-none transition
                    ${
                      errors.email
                        ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                
                <div>
                  <label className="text-sm text-gray-600">Password</label>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className={`w-full mt-1 h-11 px-4 pr-10 rounded-lg border bg-gray-50 outline-none transition
                      ${
                        errors.password
                          ? 'border-red-300 focus:ring-2 focus:ring-red-100'
                          : 'border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                      }`}
                      placeholder="Min 6 characters"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

               
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

              </form>

            
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-indigo-600 font-medium hover:text-indigo-700 transition"
                >
                  Sign in
                </Link>
              </p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}