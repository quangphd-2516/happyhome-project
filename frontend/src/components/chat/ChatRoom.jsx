// src/components/chat/ChatRoom.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, ArrowLeft, Smile, Paperclip } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { chatService } from '../../services/chatService';
import websocketService from '../../services/websocketService';
import { useAuthStore } from '../../store/authStore';

export default function ChatRoom({ chatId, onBack }) {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const { user } = useAuthStore();
    const currentUserId = user?.id;

    useEffect(() => {
        if (chatId) {
            fetchChat();
            websocketService.joinChat(chatId);

            // Handle new message
            const handleNewMessage = (data) => {
                if (data.chatId === chatId) {
                    setMessages(prev => [...prev, data.message]);
                    if (data.message.senderId !== currentUserId) {
                        chatService.markAsRead(chatId);
                    }
                }
            };

            // Handle typing indicator
            const handleUserTyping = (data) => {
                if (data.chatId === chatId && data.userId !== currentUserId) {
                    setIsTyping(true);
                }
            };

            const handleUserStopTyping = (data) => {
                if (data.chatId === chatId && data.userId !== currentUserId) {
                    setIsTyping(false);
                }
            };

            websocketService.onNewMessage(handleNewMessage);

            if (websocketService.socket) {
                websocketService.socket.on('user_typing', handleUserTyping);
                websocketService.socket.on('user_stop_typing', handleUserStopTyping);
            }

            return () => {
                websocketService.leaveChat(chatId);
                websocketService.off('new_message', handleNewMessage);

                if (websocketService.socket) {
                    websocketService.socket.off('user_typing', handleUserTyping);
                    websocketService.socket.off('user_stop_typing', handleUserStopTyping);
                }
            };
        }
    }, [chatId, currentUserId]);

    // AFTER - Chỉ scroll khi có tin nhắn mới thực sự
    useEffect(() => {
        // Chỉ scroll khi messages thay đổi và không phải lần đầu load
        if (messages.length > 0) {
            // Scroll smooth chỉ khi ở gần cuối
            const container = messagesEndRef.current?.parentElement;
            if (container) {
                const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
                if (isNearBottom) {
                    scrollToBottom();
                }
            }
        }
    }, [messages]);

    const fetchChat = async () => {
        setLoading(true);
        try {
            const response = await chatService.getChatById(chatId);
            setChat(response.chat);
            setMessages(response.messages);
            setLoading(false);
        } catch (error) {
            console.error('Fetch chat error:', error);
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        const messageContent = newMessage;
        setNewMessage('');

        try {
            websocketService.sendMessage(chatId, messageContent);
            // ✅ Scroll sau khi gửi
            setTimeout(() => scrollToBottom(), 100);
        } catch (error) {
            console.error('Send message error:', error);
            setNewMessage(messageContent);
        } finally {
            setSending(false);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (websocketService.socket && websocketService.socket.connected) {
            websocketService.socket.emit('typing', { chatId });
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            if (websocketService.socket && websocketService.socket.connected) {
                websocketService.socket.emit('stop_typing', { chatId });
            }
        }, 1000);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end', // Quan trọng: chỉ scroll trong container
            inline: 'nearest'
        });
    };

    const getOtherParticipant = () => {
        return chat?.participant;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const otherUser = getOtherParticipant();

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm ">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <img
                        src={otherUser?.avatar || 'https://i.pravatar.cc/150'}
                        alt={otherUser?.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                        <h3 className="font-bold text-gray-900">{otherUser?.fullName}</h3>
                        <p className="text-sm text-gray-500">
                            {isTyping ? 'Đang nhập...' : 'Đang hoạt động'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-0">
                <div className="max-w-4xl mx-auto">
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isOwn={message.senderId === currentUserId}
                            sender={message.senderId === currentUserId ? user : otherUser}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-4xl mx-auto ">

                    <button
                        type="button"
                        className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Paperclip className="w-6 h-7 text-gray-600" />
                    </button>

                    <div className="flex-1 relative">
                        <textarea
                            value={newMessage}
                            onChange={handleTyping}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            placeholder="Nhập tin nhắn..."
                            rows={1}
                            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                            style={{ maxHeight: '120px' }}
                        />
                        <button
                            type="button"
                            className="absolute right-3 bottom-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Smile className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-3 bg-primary text-white rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <Send className="w-6 h-6" />
                    </button>

                </form>
            </div>
        </div>
    );
}