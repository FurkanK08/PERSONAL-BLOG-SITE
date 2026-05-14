"use client";

import { useState, useEffect } from "react";
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import styles from "./dashboard.module.css";

interface DailyStat {
    date: string;
    views: number;
    unique: number;
}

interface TopPage {
    path: string;
    count: number;
}

export default function AnalyticsCharts() {
    const [data, setData] = useState<{ daily: DailyStat[], topPages: TopPage[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/analytics/stats")
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "İstatistikler alınamadı");
                }
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.chartLoading}>Grafikler yükleniyor...</div>;
    if (error) return <div className={styles.chartError}>Hata: {error}</div>;
    if (!data) return null;

    return (
        <div className={styles.chartsContainer}>
            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Son 30 Günlük Ziyaretçi Trendi</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={data.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#64748b" 
                                fontSize={12}
                                tickFormatter={(str) => str.split('-').slice(2).join('/')}
                            />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ 
                                    background: '#111827', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                                itemStyle={{ color: '#06b6d4' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="views" 
                                name="Sayfa Görüntüleme"
                                stroke="#06b6d4" 
                                strokeWidth={2}
                                dot={{ fill: '#06b6d4', r: 4 }}
                                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="unique" 
                                name="Tekil Ziyaretçi"
                                stroke="#f97316" 
                                strokeWidth={2}
                                dot={{ fill: '#f97316', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>En Çok Ziyaret Edilen Sayfalar</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data.topPages} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={12} hide />
                            <YAxis 
                                dataKey="path" 
                                type="category" 
                                stroke="#64748b" 
                                fontSize={11}
                                width={120}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ 
                                    background: '#111827', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="count" name="Ziyaret" fill="#06b6d4" radius={[0, 4, 4, 0]}>
                                {data.topPages.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#06b6d4' : '#1e293b'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
