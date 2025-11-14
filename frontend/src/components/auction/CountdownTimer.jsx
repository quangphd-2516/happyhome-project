// src/components/auction/CountdownTimer.jsx
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CountdownTimer({ endTime, onEnd }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endTime) - new Date();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.expired && onEnd) {
                onEnd();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onEnd]);

    if (timeLeft.expired) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold">
                <Clock className="w-5 h-5" />
                <span>Phiên đã kết thúc</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary animate-pulse" />
            <div className="flex gap-2">
                {timeLeft.days > 0 && (
                    <div className="text-center">
                        <div className="px-3 py-2 bg-primary text-white rounded-lg font-bold text-lg">
                            {String(timeLeft.days).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Ngày</div>
                    </div>
                )}
                <div className="text-center">
                    <div className="px-3 py-2 bg-primary text-white rounded-lg font-bold text-lg">
                        {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Giờ</div>
                </div>
                <div className="text-center">
                    <div className="px-3 py-2 bg-primary text-white rounded-lg font-bold text-lg">
                        {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Phút</div>
                </div>
                <div className="text-center">
                    <div className="px-3 py-2 bg-red-500 text-white rounded-lg font-bold text-lg animate-pulse">
                        {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Giây</div>
                </div>
            </div>
        </div>
    );
}