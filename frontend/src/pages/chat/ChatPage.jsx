import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ChatList from '../../components/chat/ChatList';
import ChatRoom from '../../components/chat/ChatRoom';
import websocketService from '../../services/websocketService';
import { useAuthStore } from '../../store/authStore';

export default function ChatPage() {
    // ✅ THAY ĐỔI 1: Lấy chatId từ URL
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    // ✅ THAY ĐỔI 2: Initialize với id từ URL
    const [selectedChatId, setSelectedChatId] = useState(id || null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    // ✅ THAY ĐỔI 3: Kiểm tra authentication
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/chats${id ? `/${id}` : ''}` } });
            return;
        }

        const token = localStorage.getItem('token');
        if (token) {
            websocketService.connect(token);
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isAuthenticated, navigate, id]);

    // ✅ THAY ĐỔI 4: Sync selectedChatId với URL param
    useEffect(() => {
        if (id) {
            setSelectedChatId(id);
        }
    }, [id]);

    // ✅ THAY ĐỔI 5: Update URL khi select chat
    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        navigate(`/chats/${chatId}`, { replace: true });
    };

    // ✅ THAY ĐỔI 6: Back về chat list
    const handleBack = () => {
        setSelectedChatId(null);
        navigate('/chats', { replace: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden " style={{ height: 'calc(100vh - 200px)' }}>
                    <div className="grid lg:grid-cols-3 h-full">
                        {/* Chat List */}
                        <div className={`lg:col-span-1 border-r border-gray-200 flex flex-col h-full ${isMobile && selectedChatId ? 'hidden' : 'block'}`}>
                            <ChatList
                                onSelectChat={handleSelectChat}
                                selectedChatId={selectedChatId}
                            />
                        </div>

                        {/* Chat Room */}
                        <div className={`lg:col-span-2 flex flex-col h-full ${isMobile && !selectedChatId ? 'hidden' : 'block'}`}>
                            {selectedChatId ? (
                                <ChatRoom
                                    chatId={selectedChatId}
                                    onBack={handleBack}
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary-light/20 rounded-full flex items-center justify-center mb-6">
                                        <MessageCircle className="w-12 h-12 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        Select a conversation
                                    </h3>
                                    <p className="text-gray-600 max-w-md">
                                        Choose a conversation from the list to start chatting with property owners and sellers
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}