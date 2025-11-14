// src/components/chat/ChatMessage.jsx
import { Check, CheckCheck } from 'lucide-react';

export default function ChatMessage({ message, isOwn, sender }) {
    const formatTime = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));
    };

    const formatDate = (date) => {
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        } else {
            return messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        }
    };

    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`flex gap-3 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isOwn && sender && (
                    <img
                        src={sender.avatar || 'https://i.pravatar.cc/150'}
                        alt={sender.fullName}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                )}

                {/* Message Bubble */}
                <div>
                    {!isOwn && sender && (
                        <p className="text-xs text-gray-600 mb-1 px-1">{sender.fullName}</p>
                    )}

                    <div
                        className={`rounded-2xl px-4 py-2.5 ${isOwn
                                ? 'bg-gradient-to-r from-primary to-primary-light text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                            }`}
                    >
                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
                            {message.content}
                        </p>
                    </div>

                    {/* Time & Status */}
                    <div
                        className={`flex items-center gap-1 mt-1 px-1 ${isOwn ? 'justify-end' : 'justify-start'
                            }`}
                    >
                        <span className="text-[11px] text-gray-500">
                            {formatTime(message.createdAt)}
                        </span>
                        {isOwn && (
                            <span>
                                {message.isRead ? (
                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                ) : (
                                    <Check className="w-3.5 h-3.5 text-gray-400" />
                                )}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}