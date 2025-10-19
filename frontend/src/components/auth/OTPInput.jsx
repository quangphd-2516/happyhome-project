// src/components/auth/OTPInput.jsx
import { useRef, useEffect } from 'react';

export default function OTPInput({ value, onChange, length = 6 }) {
    const inputRefs = useRef([]);

    useEffect(() => {
        // Focus vào ô đầu tiên khi component mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const val = e.target.value;

        // Chỉ cho phép nhập số
        if (val && !/^\d$/.test(val)) {
            return;
        }

        // Cập nhật giá trị
        const newValue = value.split('');
        newValue[index] = val;
        onChange(newValue.join(''));

        // Auto focus sang ô tiếp theo
        if (val && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Backspace: xóa và quay lại ô trước
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
            const newValue = value.split('');
            newValue[index] = '';
            onChange(newValue.join(''));
        }

        // Arrow keys navigation
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, length);

        // Chỉ cho phép paste số
        if (!/^\d+$/.test(pasteData)) {
            return;
        }

        onChange(pasteData.padEnd(length, ''));

        // Focus vào ô cuối cùng có giá trị
        const nextEmptyIndex = Math.min(pasteData.length, length - 1);
        inputRefs.current[nextEmptyIndex]?.focus();
    };

    return (
        <div className="flex gap-3 justify-center">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all bg-gray-50"
                />
            ))}
        </div>
    );
}