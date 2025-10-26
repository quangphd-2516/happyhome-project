// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm() {
    const navigate = useNavigate();
    const { setUser, setToken } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            });
            const user = response.user;
            // Lưu token và user vào store + localStorage
            setToken(response.tokens.access.token);
            setUser(response.user);

            // Redirect về trang chủ
            // After successful login in auth component
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        console.log(`Login with ${provider}`);
        // TODO: Implement OAuth
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-900 rounded-3xl p-12">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back
                </h1>
                <p className="text-gray-400">
                    Login to your Acme Inc account
                </p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <p className="text-sm text-red-300 text-center">{error}</p>
                </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="m@example.com"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label htmlFor="password" className="text-sm font-medium text-white">
                            Password
                        </label>
                        <a href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Forgot your password?
                        </a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        'Login'
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-900 text-gray-400">Or continue with</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Apple */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('Apple')}
                        className="flex items-center justify-center py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                    </button>

                    {/* Google */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('Google')}
                        className="flex items-center justify-center py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                    </button>

                    {/* Meta */}
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('Meta')}
                        className="flex items-center justify-center py-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z" />
                        </svg>
                    </button>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <a href="/register" className="text-white font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </form>
        </div>
    );
}