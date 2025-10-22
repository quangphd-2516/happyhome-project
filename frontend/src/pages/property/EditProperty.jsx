// src/pages/property/EditProperty.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import PropertyForm from '../../components/property/PropertyForm';
import { useAuthStore } from '../../store/authStore';
import { propertyService } from '../../services/propertyService';

export default function EditProperty() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchProperty();
    }, [isAuthenticated, id]);

    const fetchProperty = async () => {
        try {
            const response = await propertyService.getById(id);
            setProperty(response.data);
        } catch (error) {
            console.error('Fetch property error:', error);
            alert('Failed to load property');
            navigate('/my-properties');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-6 shadow-xl">
                            <Edit className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Edit Property
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Update your property listing details
                        </p>
                    </div>

                    {/* Form */}
                    {property && <PropertyForm initialData={property} mode="edit" />}
                </div>
            </main>

            <Footer />
        </div>
    );
}