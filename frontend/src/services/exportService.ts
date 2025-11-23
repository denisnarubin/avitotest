
import { format } from 'date-fns';
import { formatAverageTime } from '../utils/formatters';

export interface ExportData {
  period: string;
  totalReviewed: number;
  approved: number;
  rejected: number;
  requestChanges: number;
  averageTime: number;
  activityData: ActivityData[];
  categoryData: CategoryData[];
}

export interface ActivityData {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
  total: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export const exportToCSV = (data: ExportData, filename: string = 'статистика') => {
  const headers = [
    'Период',
    'Всего проверено',
    'Одобрено',
    'Отклонено',
    'На доработку',
    'Среднее время проверки'
  ];

  const mainData = [
    data.period,
    data.totalReviewed.toString(),
    data.approved.toString(),
    data.rejected.toString(),
    data.requestChanges.toString(),
    formatAverageTime(data.averageTime)
  ];

  let csvContent = '';


  csvContent += '\uFEFF';


  csvContent += 'ОСНОВНЫЕ МЕТРИКИ\n';
  csvContent += headers.join(';') + '\n';
  csvContent += mainData.join(';') + '\n\n';


  if (data.activityData && data.activityData.length > 0) {
    csvContent += 'АКТИВНОСТЬ ПО ДНЯМ\n';
    csvContent += 'Дата;Одобрено;Отклонено;На доработку;Всего\n';
    data.activityData.forEach(item => {

      const excelDate = format(new Date(item.date), 'yyyy-MM-dd');
      csvContent += [
        excelDate,
        item.approved.toString(),
        item.rejected.toString(),
        item.requestChanges.toString(),
        item.total.toString()
      ].join(';') + '\n';
    });
    csvContent += '\n';
  }


  if (data.categoryData && data.categoryData.length > 0) {
    csvContent += 'ТОП КАТЕГОРИЙ\n';
    csvContent += 'Категория;Количество\n';
    data.categoryData.forEach(item => {
      csvContent += [
        `"${item.category.replace(/"/g, '""')}"`,
        item.count.toString()
      ].join(';') + '\n';
    });
    csvContent += '\n';
  }


  csvContent += 'СВОДКА\n';
  csvContent += `Процент одобренных;${((data.approved / data.totalReviewed) * 100 || 0).toFixed(1)}%\n`;
  csvContent += `Процент отклоненных;${((data.rejected / data.totalReviewed) * 100 || 0).toFixed(1)}%\n`;
  csvContent += `Процент на доработку;${((data.requestChanges / data.totalReviewed) * 100 || 0).toFixed(1)}%\n`;
  

  const generatedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  csvContent += `Дата формирования;${generatedDate}\n`;

  const blob = new Blob([csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const generatePDFData = (data: ExportData) => {
  const calculatedData = {
    period: data.period,
    totalReviewed: data.totalReviewed,
    approved: data.approved,
    rejected: data.rejected,
    requestChanges: data.requestChanges,
    averageTime: data.averageTime,
    approvedPercentage: data.totalReviewed > 0 ? (data.approved / data.totalReviewed) * 100 : 0,
    rejectedPercentage: data.totalReviewed > 0 ? (data.rejected / data.totalReviewed) * 100 : 0,
    requestChangesPercentage: data.totalReviewed > 0 ? (data.requestChanges / data.totalReviewed) * 100 : 0,
    

    activityData: data.activityData.map(item => ({
      ...item,
      date: format(new Date(item.date), 'yyyy-MM-dd')
    })),
    
    categoryData: data.categoryData || [],
    generatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    efficiency: data.totalReviewed > 0 ? Math.round(data.totalReviewed / (data.averageTime / 60)) : 0
  };

  return calculatedData;
};

export const exportToPDF = async (data: ExportData, filename: string = 'статистика') => {
  try {
    const pdfData = generatePDFData(data);
    

    const advancedCSV = createAdvancedCSV(pdfData);
    const blob = new Blob([advancedCSV], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_подробный_отчет_${format(new Date(), 'yyyy-MM-dd')}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    return true;
  } catch (error) {
    console.error('Ошибка при экспорте в PDF:', error);
    throw error;
  }
};

const createAdvancedCSV = (data: any) => {
  let csvContent = '\uFEFF';
  
  csvContent += 'ОТЧЕТ ПО МОДЕРАЦИИ ОБЪЯВЛЕНИЙ\n\n';
  
  csvContent += 'ОСНОВНЫЕ ПОКАЗАТЕЛИ\n';
  csvContent += 'Период;' + data.period + '\n';
  csvContent += 'Всего проверено;' + data.totalReviewed + '\n';
  csvContent += 'Одобрено;' + data.approved + '\n';
  csvContent += 'Отклонено;' + data.rejected + '\n';
  csvContent += 'На доработку;' + data.requestChanges + '\n';
  csvContent += 'Среднее время проверки;' + formatAverageTime(data.averageTime) + '\n';
  csvContent += 'Процент одобренных;' + data.approvedPercentage.toFixed(1) + '%\n';
  csvContent += 'Процент отклоненных;' + data.rejectedPercentage.toFixed(1) + '%\n';
  csvContent += 'Процент на доработку;' + data.requestChangesPercentage.toFixed(1) + '%\n\n';
  
  if (data.activityData.length > 0) {
    csvContent += 'АКТИВНОСТЬ ПО ДНЯм\n';
    csvContent += 'Дата;Одобрено;Отклонено;На доработку;Всего;Процент одобренных\n';
    data.activityData.forEach((item: any) => {
      const dayApprovedPercent = item.total > 0 ? (item.approved / item.total * 100) : 0;

      const excelDate = format(new Date(item.date), 'yyyy-MM-dd');
      csvContent += [
        excelDate,
        item.approved,
        item.rejected,
        item.requestChanges,
        item.total,
        dayApprovedPercent.toFixed(1) + '%'
      ].join(';') + '\n';
    });
    csvContent += '\n';
  }
  
  if (data.categoryData.length > 0) {
    csvContent += 'РАСПРЕДЕЛЕНИЕ ПО КАТЕГОРИЯМ\n';
    csvContent += 'Категория;Количество;Процент\n';
    const totalCategories = data.categoryData.reduce((sum: number, item: any) => sum + item.count, 0);
    
    data.categoryData.forEach((item: any) => {
      const categoryPercent = totalCategories > 0 ? (item.count / totalCategories * 100) : 0;
      csvContent += [
        `"${item.category}"`,
        item.count,
        categoryPercent.toFixed(1) + '%'
      ].join(';') + '\n';
    });
    csvContent += '\n';
  }
  
  csvContent += 'СЛУЖЕБНАЯ ИНФОРМАЦИЯ\n';

  const generatedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  csvContent += 'Дата формирования отчета;' + generatedDate + '\n';
  csvContent += 'Эффективность (объявлений/час);' + data.efficiency + '\n';
  
  return csvContent;
};

export const getPeriodText = (period: string): string => {
  switch (period) {
    case 'today': return 'сегодня';
    case 'week': return '7_дней';
    case 'month': return '30_дней';
    default: return period;
  }
};