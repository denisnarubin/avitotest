import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, ToggleButtonGroup, ToggleButton, 
    Stack, Chip, CircularProgress, Alert
} from '@mui/material';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
    ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#4caf50', '#f44336', '#ff9800'];

// Интерфейсы для ответов API
interface ActivityResponse {
    date: string;
    approved: number;
    rejected: number;
    requestChanges: number;
}

interface PieDataItem {
    name: string;
    value: number;
    percent?: number;
    [key: string]: any;
}

interface CategoryDataItem {
    category: string;
    count: number;
}

export default function ModeratorStats() {
    const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [activityData, setActivityData] = useState<ActivityResponse[]>([]);
    const [decisionData, setDecisionData] = useState<PieDataItem[]>([]);
    const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
    const [totalChecked, setTotalChecked] = useState(0);
    const [approvedPercent, setApprovedPercent] = useState(0);
    const [rejectedPercent, setRejectedPercent] = useState(0);
    const [requestChangesPercent, setRequestChangesPercent] = useState(0);
    const [avgTime, setAvgTime] = useState(0);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const params = { period };
                
                const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
                    axios.get('/api/v1/stats/summary', { params }),
                    axios.get('/api/v1/stats/chart/activity', { params }),
                    axios.get('/api/v1/stats/chart/decisions', { params }),
                    axios.get('/api/v1/stats/chart/categories', { params }),
                ]);

                const summary = summaryRes.data;
                const activity = activityRes.data;
                const decisions = decisionsRes.data;
                const categories = categoriesRes.data;

                console.log('Stats data:', { summary, activity, decisions, categories });

                setTotalChecked(summary.totalReviewed || 0);
                setApprovedPercent(summary.approvedPercentage || 0);
                setRejectedPercent(summary.rejectedPercentage || 0);
                setRequestChangesPercent(summary.requestChangesPercentage || 0);
                setAvgTime(summary.averageReviewTime || 0);

                // Форматируем данные активности
                const formattedActivity = activity.map((item: ActivityResponse) => ({
                    date: item.date,
                    day: new Date(item.date).toLocaleDateString('ru-RU', { 
                        day: 'numeric',
                        month: 'short' 
                    }),
                    approved: item.approved || 0,
                    rejected: item.rejected || 0,
                    requestChanges: item.requestChanges || 0,
                    total: (item.approved || 0) + (item.rejected || 0) + (item.requestChanges || 0)
                }));
                setActivityData(formattedActivity);

                // Адаптируем данные решений - бэкенд возвращает проценты
                const baseValue = 100; // Базовое значение для визуализации
                const formattedDecisions: PieDataItem[] = [
                    { 
                        name: 'Одобрено', 
                        value: Math.round((decisions.approved || 0) / 100 * baseValue),
                        percent: decisions.approved || 0
                    },
                    { 
                        name: 'Отклонено', 
                        value: Math.round((decisions.rejected || 0) / 100 * baseValue),
                        percent: decisions.rejected || 0
                    },
                    { 
                        name: 'На доработку', 
                        value: Math.round((decisions.requestChanges || 0) / 100 * baseValue),
                        percent: decisions.requestChanges || 0
                    }
                ].filter(item => item.percent > 0);
                setDecisionData(formattedDecisions);

                // Форматируем данные категорий
                const formattedCategories: CategoryDataItem[] = Object.entries(categories)
                    .map(([category, count]) => ({
                        category: category.length > 10 ? `${category.substring(0, 10)}...` : category,
                        count: count as number
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10);
                setCategoryData(formattedCategories);

            } catch (error: any) {
                console.error('Ошибка загрузки статистики:', error);
                console.error('Error details:', error.response?.data);
                setError(error.response?.data?.message || 'Не удалось загрузить статистику');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [period]);

    // Функция для форматирования метки круговой диаграммы
    const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
        if (!name || percent == null) return null;
        return `${name} ${percent.toFixed(1)}%`;
    };

    if (loading) {
        return (
            <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>Аналитика</Typography>

            <ToggleButtonGroup
                value={period}
                onChange={(_, val) => val && setPeriod(val)}
                exclusive
                sx={{ mb: 3 }}
            >
                <ToggleButton value="today">Сегодня</ToggleButton>
                <ToggleButton value="week">7 дней</ToggleButton>
                <ToggleButton value="month">30 дней</ToggleButton>
            </ToggleButtonGroup>

            {/* Статистические карточки */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                flexWrap="wrap"
                useFlexGap
                mb={4}
            >
                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Проверено объявлений
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {totalChecked}
                        </Typography>
                    </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Одобрено
                        </Typography>
                        <Chip 
                            label={`${approvedPercent.toFixed(1)}%`} 
                            color="success" 
                            variant="outlined"
                        />
                    </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Отклонено
                        </Typography>
                        <Chip 
                            label={`${rejectedPercent.toFixed(1)}%`} 
                            color="error" 
                            variant="outlined"
                        />
                    </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            На доработку
                        </Typography>
                        <Chip 
                            label={`${requestChangesPercent.toFixed(1)}%`} 
                            color="warning" 
                            variant="outlined"
                        />
                    </CardContent>
                </Card>
                
                <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                            Среднее время проверки
                        </Typography>
                        <Typography variant="h6">{avgTime} сек</Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* График активности */}
            {activityData.length > 0 && (
                <Box mb={4}>
                    <Typography variant="h6" gutterBottom>Активность проверок</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="approved" name="Одобрено" fill="#4caf50" />
                            <Bar dataKey="rejected" name="Отклонено" fill="#f44336" />
                            <Bar dataKey="requestChanges" name="На доработку" fill="#ff9800" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {/* Распределение решений */}
            {decisionData.length > 0 && (
                <Box mb={4}>
                    <Typography variant="h6" gutterBottom>Распределение решений</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={decisionData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label={renderCustomLabel}
                                labelLine={false}
                            >
                                {decisionData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number, name: string, props: any) => [
                                    `${props.payload.percent?.toFixed(1)}%`, 
                                    name
                                ]} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {/* Категории объявлений */}
            {categoryData.length > 0 && (
                <Box>
                    <Typography variant="h6" gutterBottom>Топ категорий</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis 
                                type="category" 
                                dataKey="category" 
                                width={80}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip />
                            <Bar dataKey="count" name="Количество" fill="#2196f3" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            )}

            {activityData.length === 0 && decisionData.length === 0 && categoryData.length === 0 && !loading && (
                <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                    <Typography color="textSecondary">
                        Нет данных для выбранного периода
                    </Typography>
                </Box>
            )}
        </Box>
    );
}