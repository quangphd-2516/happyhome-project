// src/pages/auth/VerifyOTP.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OTPInput from '../../components/auth/OTPInput';
import { authService } from '../../services/authService';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Lấy email từ localStorage
        const verifyEmail = localStorage.getItem('verifyEmail');
        if (!verifyEmail) {
            // Nếu không có email, redirect về trang register
            navigate('/register');
            return;
        }
        setEmail(verifyEmail);
    }, [navigate]);

    // Countdown timer cho resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleVerify = async () => {
        // Validate OTP
        if (otp.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Gọi API verify OTP
            const response = await authService.verifyOTP({
                email,
                otp
            });

            console.log('Verify OTP success:', response);

            // Lưu token và user info
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            // Xóa email verify
            localStorage.removeItem('verifyEmail');

            // Chuyển đến trang chủ hoặc dashboard
            navigate('/');

        } catch (error) {
            console.error('Verify OTP error:', error);

            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Invalid OTP code. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        setIsResending(true);
        setError('');

        try {
            await authService.resendOTP(email);

            // Reset timer
            setResendTimer(60);
            setCanResend(false);
            setOtp(''); // Clear OTP input

            console.log('OTP resent successfully');

        } catch (error) {
            console.error('Resend OTP error:', error);
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-8 md:p-12 max-w-md w-full">
                {/* Title */}
                <h1 className="text-3xl font-bold text-white text-center mb-3">
                    Enter verification code
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-center mb-8">
                    We sent a 6-digit code to your email.
                </p>

                {/* OTP Input */}
                <OTPInput value={otp} onChange={setOtp} length={6} />

                {/* Helper Text */}
                <p className="text-gray-400 text-center mt-6 mb-8">
                    Enter the 6-digit code sent to your email.
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg">
                        <p className="text-sm text-red-300 text-center">{error}</p>
                    </div>
                )}

                {/* Verify Button */}
                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-white text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        'Verify'
                    )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                    <span className="text-gray-400">Didn't receive the code? </span>
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-white font-medium hover:underline disabled:opacity-50"
                        >
                            {isResending ? 'Sending...' : 'Resend'}
                        </button>
                    ) : (
                        <span className="text-gray-500">
                            Resend in {resendTimer}s
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}