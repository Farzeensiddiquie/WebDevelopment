"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressLink from "../../components/ProgressLink";
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

export default function SignupClient() {
  const { getCurrentScheme } = useTheme();
  const { register } = useUser();
  const { showToast } = useToast();
  const router = useRouter();
  const scheme = getCurrentScheme();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    zipCode: ''
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);

    try {
      // Prepare user data for registration
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        zipCode: formData.zipCode
      };

      const result = await register(userData);
      
      if (result.success) {
        showToast('Registration successful!', 'success');
        router.push('/');
      } else {
        // Show the specific error message from the backend
        const errorMessage = result.error || 'Registration failed';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      // Handle network errors or other unexpected errors
      console.error('Registration error:', error);
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
            Create a new account
          </h2>
          <p className={`mt-2 text-sm ${scheme.textSecondary} text-center`}>
            Join us and start your journey in style!
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${scheme.text}`}>
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="Your full name"
              />
            </div>
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
              <label htmlFor="phone" className={`block text-sm font-medium ${scheme.text}`}>
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="Your phone number"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${scheme.text}`}>
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="••••••••"
              />
            </div>
            {/* Optional Address Field */}
            <div>
              <label htmlFor="address" className={`block text-sm font-medium ${scheme.text}`}>
                Address (optional)
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="Your address (optional)"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className={`block text-sm font-medium ${scheme.text}`}>
                Zip Code (optional)
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border-0 ${scheme.card} py-2 px-4 ${scheme.text} placeholder:${scheme.textSecondary} shadow-sm ring-1 ring-inset ${scheme.border} focus:ring-2 focus:ring-blue-400 transition`}
                placeholder="Your zip code (optional)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-bold rounded-lg ${scheme.accent} hover:opacity-90 ${scheme.text} shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className={`${scheme.textSecondary} text-sm`}>
            Already have an account?<br />
            <ProgressLink href="/login" className={`font-semibold ${scheme.text} hover:underline`}>
              Log in
            </ProgressLink>
          </p>
        </div>
      </div>
    </div>
  );
} 