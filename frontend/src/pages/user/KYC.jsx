// src/pages/user/KYC.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import KYCForm from '../../components/user/KYCForm';
import { useAuthStore } from '../../store/authStore';

export default function KYC() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-xl">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Identity Verification
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Complete your KYC verification to unlock full access to our platform features including property listings and auction participation.
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Enhanced Security</h3>
                            <p className="text-sm text-gray-600">
                                Protect your account and transactions with verified identity
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Full Platform Access</h3>
                            <p className="text-sm text-gray-600">
                                Participate in auctions and post property listings
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Build Trust</h3>
                            <p className="text-sm text-gray-600">
                                Increase credibility with verified badge on your profile
                            </p>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 mb-2">Important Information</h3>
                                <ul className="text-sm text-orange-800 space-y-1">
                                    <li>• Verification typically takes 24-48 hours</li>
                                    <li>• All documents must be clear and readable</li>
                                    <li>• Information must match your ID card exactly</li>
                                    <li>• Your data is encrypted and stored securely</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* KYC Form */}
                    <KYCForm />

                    {/* Help Section */}
                    <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-gray-600 mb-6">
                            If you have any questions about the KYC process, our support team is here to help.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                                Contact Support
                            </button>
                            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                View FAQ
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}