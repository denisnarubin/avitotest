// ModeratorStats.tsx
import { useEffect, useState } from 'react';
import {
  Box, Typography, ToggleButtonGroup, ToggleButton, Alert, CircularProgress,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { ActivityResponse, PieDataItem, CategoryDataItem } from '../../../types';
import StatsCards from './StatsCards';
import { useApi } from '../../../hooks/useApi';
import ExportButtons from '../ExportButtons/ExportButtons';
import type { ExportData } from '../../../services/exportService';
import { getPeriodText } from '../../../services/exportService';

const COLORS = ['#4caf50', '#f44336', '#ff9800'];

interface SummaryResponse {
  totalReviewed: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

interface DecisionsResponse {
  approved: number;
  rejected: number;
  requestChanges: number;
}

interface CategoriesResponse {
  [category: string]: number;
}

interface FormattedActivityData {
  date: string;
  day: string;
  approved: number;
  rejected: number;
  requestChanges: number;
  total: number;
}

export default function ModeratorStats() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const { callApi, loading, error } = useApi();

  const [activityData, setActivityData] = useState<FormattedActivityData[]>([]);
  const [decisionData, setDecisionData] = useState<PieDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryDataItem[]>([]);
  const [totalChecked, setTotalChecked] = useState(0);
  const [approvedPercent, setApprovedPercent] = useState(0);
  const [rejectedPercent, setRejectedPercent] = useState(0);
  const [requestChangesPercent, setRequestChangesPercent] = useState(0);
  const [avgTime, setAvgTime] = useState(0);

  const [hasData, setHasData] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = { period };
        
        const [summaryRes, activityRes, decisionsRes, categoriesRes] = await Promise.all([
          callApi<SummaryResponse>('/api/v1/stats/summary', { params }),
          callApi<ActivityResponse[]>('/api/v1/stats/chart/activity', { params }),
          callApi<DecisionsResponse>('/api/v1/stats/chart/decisions', { params }),
          callApi<CategoriesResponse>('/api/v1/stats/chart/categories', { params }),
        ]);

        const summary = summaryRes;
        const activity = activityRes || [];
        const decisions = decisionsRes || { approved: 0, rejected: 0, requestChanges: 0 };
        const categories = categoriesRes || {};

        setTotalChecked(summary.totalReviewed || 0);
        setApprovedPercent(summary.approvedPercentage || 0);
        setRejectedPercent(summary.rejectedPercentage || 0);
        setRequestChangesPercent(summary.requestChangesPercentage || 0);
        setAvgTime(summary.averageReviewTime || 0);


        const formattedActivity: FormattedActivityData[] = activity.map((item: ActivityResponse) => ({
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


        const totalDecisions = (decisions.approved || 0) + (decisions.rejected || 0) + (decisions.requestChanges || 0);
        
        const formattedDecisions: PieDataItem[] = [
          { 
            name: 'Одобрено', 
            value: totalDecisions > 0 ? Math.round((decisions.approved || 0) / totalDecisions * 100) : 0,
            percent: totalDecisions > 0 ? (decisions.approved || 0) / totalDecisions * 100 : 0
          },
          { 
            name: 'Отклонено', 
            value: totalDecisions > 0 ? Math.round((decisions.rejected || 0) / totalDecisions * 100) : 0,
            percent: totalDecisions > 0 ? (decisions.rejected || 0) / totalDecisions * 100 : 0
          },
          { 
            name: 'На доработку', 
            value: totalDecisions > 0 ? Math.round((decisions.requestChanges || 0) / totalDecisions * 100) : 0,
            percent: totalDecisions > 0 ? (decisions.requestChanges || 0) / totalDecisions * 100 : 0
          }
        ].filter(item => item.percent > 0);
        
        setDecisionData(formattedDecisions);


        const formattedCategories: CategoryDataItem[] = Object.entries(categories)
          .map(([category, count]) => ({
            category: category.length > 10 ? `${category.substring(0, 10)}...` : category,
            count: count as number
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        setCategoryData(formattedCategories);


        const exportData: ExportData = {
          period: getPeriodText(period),
          totalReviewed: summary.totalReviewed || 0,
          approved: decisions.approved || 0,
          rejected: decisions.rejected || 0,
          requestChanges: decisions.requestChanges || 0,
          averageTime: summary.averageReviewTime || 0,
          activityData: formattedActivity,
          categoryData: formattedCategories
        };

        setExportData(exportData);


        const hasAnyData = 
          (summary.totalReviewed > 0) ||
          (formattedActivity.length > 0 && formattedActivity.some(item => item.total > 0)) ||
          (formattedDecisions.length > 0) ||
          (formattedCategories.length > 0);
        
        setHasData(hasAnyData);

      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        setActivityData([]);
        setDecisionData([]);
        setCategoryData([]);
        setHasData(false);
        setExportData(null);
      }
    };

    fetchStats();
  }, [period, callApi]);

  const renderCustomLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!name || percent == null || isNaN(percent)) return null;
    return `${name} ${percent.toFixed(1)}%`;
  };

  const formatTooltip = (value: number, name: string, props: any) => {
    const percent = props.payload?.percent;
    if (percent !== undefined && !isNaN(percent)) {
      return [`${percent.toFixed(1)}%`, name];
    }
    return [`${value}%`, name];
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/list');
    }
  };

  const shouldShowCharts = hasData || totalChecked > 0;

  if (loading) {
    return (
      <Box 
        p={3} 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        flexDirection="column"
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Загрузка статистики...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} minHeight="60vh" display="flex" flexDirection="column" justifyContent="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          sx={{ alignSelf: 'flex-start' }}
        >
          Назад
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3} minHeight="100vh" bgcolor="background.default">

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Аналитика
        </Typography>
        <Button 
          variant="outlined" 
          onClick={handleBack}
          sx={{ minWidth: 120 }}
        >
          Назад
        </Button>
      </Box>

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


      {(totalChecked > 0 || hasData) && (
        <StatsCards
          totalChecked={totalChecked}
          approvedPercent={approvedPercent}
          rejectedPercent={rejectedPercent}
          requestChangesPercent={requestChangesPercent}
          avgTime={avgTime}
        />
      )}


      {!shouldShowCharts && !loading && (
        <Box 
          display="flex" 
          flexDirection="column" 
          justifyContent="center" 
          alignItems="center" 
          height={300}
          border="1px dashed #ccc"
          borderRadius={2}
          bgcolor="#fafafa"
          mb={4}
        >
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Нет данных за выбранный период
          </Typography>
          <Typography variant="body2" color="textSecondary" textAlign="center" mb={2}>
            Статистика за "{period === 'today' ? 'сегодня' : period === 'week' ? '7 дней' : '30 дней'}" отсутствует
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => setPeriod('week')}
          >
            Показать за 7 дней
          </Button>
        </Box>
      )}


      {activityData.length > 0 && activityData.some(item => item.total > 0) && (
        <Box mb={4} minHeight={350}>
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


      {decisionData.length > 0 && (
        <Box mb={4} minHeight={350}>
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}


      {categoryData.length > 0 && (
        <Box mb={4} minHeight={350}>
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


      {exportData && (
        <ExportButtons 
          exportData={exportData}
          disabled={!hasData}
        />
      )}
    </Box>
  );
}