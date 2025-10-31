// src/components/chat/ChatList.jsx
import { useState, useEffect } from 'react';
import { Search, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { chatService } from '../../services/chatService';

export default function ChatList({ onSelectChat, selectedChatId }) {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showMenu, setShowMenu] = useState(null);

    // Mock data for development
    const mockChats = [
        {
            id: '1',
            participants: [
                { user: { id: '1', fullName: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=1' } },
                { user: { id: '2', fullName: 'You', avatar: 'https://i.pravatar.cc/150?img=10' } }
            ],
            messages: [
                {
                    id: '1',
                    content: 'Hi, I\'m interested in your property',
                    senderId: '1',
                    createdAt: new Date(),
                    isRead: false
                }
            ],
            updatedAt: new Date(),
            unreadCount: 2
        },
        {
            id: '2',
            participants: [
                { user: { id: '3', fullName: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=2' } },
                { user: { id: '2', fullName: 'You', avatar: 'https://i.pravatar.cc/150?img=10' } }
            ],
            messages: [
                {
                    id: '2',
                    content: 'Is the property still available?',
                    senderId: '3',
                    createdAt: new Date(Date.now() - 3600000),
                    isRead: true
                }
            ],
            updatedAt: new Date(Date.now() - 3600000),
            unreadCount: 0
        },
        {
            id: '3',
            participants: [
                { user: { id: '4', fullName: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?img=3' } },
                { user: { id: '2', fullName: 'You', avatar: 'https://i.pravatar.cc/150?img=10' } }
            ],
            messages: [
                {
                    id: '3',
                    content: 'Thank you for the information!',
                    senderId: '2',
                    createdAt: new Date(Date.now() - 86400000),
                    isRead: true
                }
            ],
            updatedAt: new Date(Date.now() - 86400000),
            unreadCount: 0
        },
    ];

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        setLoading(true);
        try {
            const response = await chatService.getChats();
            setChats(response.data);
            setLoading(false);
            // Using mock data
            /*setTimeout(() => {
                setChats(mockChats);
                setLoading(false);
            }, 500);*/
        } catch (error) {
            console.error('Fetch chats error:', error);
            setChats(mockChats);
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            fetchChats();
            return;
        }

        try {
            const response = await chatService.searchChats(query);
            setChats(response.data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const handleDeleteChat = async (chatId, e) => {
        e.stopPropagation();
        try {
            await chatService.deleteChat(chatId);
            setChats(chats.filter(chat => chat.id !== chatId));
            setShowMenu(null);
        } catch (error) {
            console.error('Delete chat error:', error);
        }
    };

    const getOtherParticipant = (chat) => {
        // Assuming current user id is '2' for mock data
        return chat.participant;
    };

    const getLastMessage = (chat) => {
        if (!chat.lastMessage) return 'No messages yet';
        const content = chat.lastMessage.content;
        return content.length > 50
            ? content.substring(0, 50) + '...'
            : content;
    };
    const formatTime = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const diffMs = today - messageDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                        <p className="text-sm text-gray-500">
                            Start chatting with property owners and sellers
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => {
                            const otherUser = getOtherParticipant(chat);
                            const lastMessage = getLastMessage(chat);
                            const isSelected = chat.id === selectedChatId;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat.id)}
                                    className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative ${isSelected ? 'bg-primary/5 border-l-4 border-primary' : ''
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={otherUser?.avatar || 'https://i.pravatar.cc/150'}
                                            alt={otherUser?.fullName}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        {chat.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {chat.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {otherUser?.fullName}
                                            </h3>
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                {formatTime(chat.updatedAt)}
                                            </span>
                                        </div>
                                        <p
                                            className={`text-sm truncate ${chat.unreadCount > 0
                                                ? 'text-gray-900 font-medium'
                                                : 'text-gray-600'
                                                }`}
                                        >
                                            {lastMessage}
                                        </p>
                                    </div>

                                    {/* Menu */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(showMenu === chat.id ? null : chat.id);
                                        }}
                                        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>

                                    {/* Delete Menu */}
                                    {showMenu === chat.id && (
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                            <button
                                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}