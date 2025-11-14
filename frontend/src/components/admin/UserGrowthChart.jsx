// src/components/admin/UserGrowthChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function UserGrowthChart({ data }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tăng trưởng người dùng</h3>
                <p className="text-sm text-gray-600">Người dùng mới và xác thực KYC</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Legend />
                    <Bar
                        dataKey="newUsers"
                        fill="#3b82f6"
                        radius={[8,8,0,0]}
                        name="Người dùng mới"
                    />
                    <Bar
                        dataKey="verified"
                        fill="#10b981"
                        radius={[8,8,0,0]}
                        name="Xác thực KYC"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}