'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import { useTheme } from '../../../context/ThemeContext';
import { useToast } from '../../../context/ToastContext';
import ProgressLink from '../../../components/ProgressLink';

export default function AdminLogin() {
  const { login } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const [formData, setFormData] = useState({
    email: 'admin@ecommerce.com',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        showToast('Admin login successful!', 'success');
        router.push('/admin');
      } else {
        showToast(result.error || 'Login failed', 'error');
      }
    } catch (error) {
      showToast('An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center ${scheme.background} py-12 px-4 sm:px-6 lg:px-8`}>
      {/* Back Arrow */}
      <ProgressLink
        href="/"
        className={`absolute top-4 left-4 ${scheme.text} ${scheme.card} hover:${scheme.hover} p-2 rounded-full shadow-md transition z-50 border ${scheme.border}`}
        aria-label="Go back"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </ProgressLink>

      <div className={`w-full max-w-md space-y-8 ${scheme.card} backdrop-blur-md rounded-2xl shadow-2xl p-10 border ${scheme.border}`}>
        <div className="flex flex-col items-center">
          <div className={`${scheme.accent} rounded-full p-6 mb-4 shadow-lg`} />
          <h2 className={`text-3xl font-extrabold ${scheme.text} text-center tracking-tight drop-shadow-lg`}>
            Admin Login
          </h2>
          <p className={`mt-2 text-sm ${scheme.textSecondary} text-center`}>
            Access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${scheme.text}`}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="admin@ecommerce.com"
              />
            </div>
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${scheme.text}`}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-bold rounded-lg ${scheme.accent} hover:opacity-90 ${scheme.text} shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Signing in...' : 'Admin Login'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className={`${scheme.textSecondary} text-sm`}>
            Admin Credentials:
            <br />
            <span className="font-mono text-xs">
              Email: admin@ecommerce.com
              <br />
              Password: admin123
            </span>
          </p>
        </div>
      </div>
    </div>
  );
} 