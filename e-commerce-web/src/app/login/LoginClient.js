"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressLink from "../../components/ProgressLink";
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

export default function LoginClient() {
  const { getCurrentScheme } = useTheme();
  const { login } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const scheme = getCurrentScheme();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
        showToast('Login successful!', 'success');
        router.push('/');
      } else {
        // Show the specific error message from the backend
        const errorMessage = result.error || 'Login failed';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error('Login error:', error);
      showToast('Network error. Please try again.', 'error');
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
            Sign in to your account
          </h2>
          <p className={`mt-2 text-sm ${scheme.textSecondary} text-center`}>
            Welcome back! Please enter your details.
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
                placeholder="you@email.com"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className={`${scheme.textSecondary} text-sm`}>
            Don&apos;t have an account?
            <br />
            <ProgressLink href="/signup" className={`font-semibold ${scheme.text} hover:underline`}>
              Sign up
            </ProgressLink>
          </p>
        </div>
      </div>
    </div>
  );
} 