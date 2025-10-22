// src/pages/property/CreateProperty.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PropertyForm from '../../components/property/PropertyForm';
import { useAuthStore } from '../../store/authStore';

export default function CreateProperty() {
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
                            <PlusCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            List Your Property
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Fill in the details below to create your property listing. All fields marked with * are required.
                        </p>
                    </div>

                    {/* Form */}
                    <PropertyForm mode="create" />
                </div>
            </main>

            <Footer />
        </div>
    );
}