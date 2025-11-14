// src/pages/property/MyProperties.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package, TrendingUp, DollarSign } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { useAuthStore } from '../../store/authStore';
import { propertyService } from '../../services/propertyService';

export default function MyProperties() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, published, draft, sold

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchProperties();
    }, [isAuthenticated]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getMyProperties();
            setProperties(response.data);
            setLoading(false);


        } catch (error) {
            console.error('Fetch properties error:', error);
            setProperties([]); // Gán mảng rỗng nếu lỗi

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa bất động sản này không?')) return;

        try {
            await propertyService.delete(id);
            setProperties(properties.filter(p => p.id !== id));
            alert('Xóa bất động sản thành công');
        } catch (error) {
            console.error('Delete error:', error);
            alert('Xóa bất động sản thất bại');
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            PUBLISHED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã đăng' },
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ duyệt' },
            DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Nháp' },
            SOLD: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã bán' },
        };
        const { bg, text, label } = config[status] || config.DRAFT;
        return (
            <span className={`px-3 py-1 ${bg} ${text} text-xs font-semibold rounded-full`}>
                {label}
            </span>
        );
    };

    const stats = {
        total: properties.length,
        published: properties.filter(p => p.status === 'PUBLISHED').length,
        totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    };

    const filteredProperties = filter === 'all'
        ? properties
        : properties.filter(p => p.status.toLowerCase() === filter);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bất động sản của tôi</h1>
                        <p className="text-gray-600">Quản lý các tin đăng bất động sản của bạn</p>
                    </div>
                    <button
                        onClick={() => navigate('/properties/create')}
                        className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm bất động sản mới
                    </button>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Package className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.total}</span>
                        </div>
                        <p className="text-blue-100">Tổng số bất động sản</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.published}</span>
                        </div>
                        <p className="text-green-100">Đã đăng</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Eye className="w-8 h-8" />
                            <span className="text-3xl font-bold">{stats.totalViews}</span>
                        </div>
                        <p className="text-purple-100">Tổng lượt xem</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                    <div className="flex gap-2 overflow-x-auto">
                        {['all', 'published', 'pending', 'draft', 'sold'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === status
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {{
                                    all: 'Tất cả',
                                    published: 'Đã đăng',
                                    pending: 'Chờ duyệt',
                                    draft: 'Nháp',
                                    sold: 'Đã bán'
                                }[status]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Properties List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-xl text-gray-600 mb-2">Chưa có bất động sản nào</p>
                        <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo tin đăng đầu tiên</p>
                        <button
                            onClick={() => navigate('/properties/create')}
                            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors font-medium inline-flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Đăng bất động sản
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProperties.map(property => (
                            <div
                                key={property.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Image */}
                                    <div className="md:w-64 h-48 md:h-auto">
                                        <img
                                            src={property.thumbnail || (Array.isArray(property.images) ? property.images[0] : undefined) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
                                                    {getStatusBadge(property.status)}
                                                </div>
                                                <p className="text-gray-600">{property.address}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Giá</p>
                                                <p className="text-lg font-bold text-primary">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(property.price)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Diện tích</p>
                                                <p className="text-lg font-semibold text-gray-900">{property.area} m²</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Lượt xem</p>
                                                <p className="text-lg font-semibold text-gray-900">{property.views}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Loại hình</p>
                                                <p className="text-lg font-semibold text-gray-900">{property.type}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/properties/${property.id}`)}
                                                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Xem chi tiết
                                            </button>
                                            <button
                                                onClick={() => navigate(`/properties/${property.id}/edit`)}
                                                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Chỉnh sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property.id)}
                                                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}