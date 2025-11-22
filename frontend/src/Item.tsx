// Item.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';

type ModerationStatus = 'Одобрено' | 'Отклонено' | 'Доработка';

interface ModerationHistory {
  moderator: string;
  date: string;
  status: ModerationStatus;
}

interface SellerInfo {
  name: string;
  yearsOnSite: number;
  adsCount: number;
}

interface ItemModerationViewProps {
  galleryCount: number;
  description: string;
  characteristics: Record<string, string>;
  seller: SellerInfo;
  moderationHistory: ModerationHistory;
  onApprove: () => void;
  onReject: (reason: string, comment?: string) => void;
  onRequestRevision: (reason: string, comment?: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const rejectionReasons = [
  { label: 'Запрещенный товар', value: 'Запрещенный товар' },
  { label: 'Неверная категория', value: 'Неверная категория' },
  { label: 'Некорректное описание', value: 'Некорректное описание' },
  { label: 'Проблемы с фото', value: 'Проблемы с фото' },
  { label: 'Подозрение на мошенничество', value: 'Подозрение на мошенничество' },
];

const ItemModerationView: React.FC<ItemModerationViewProps> = ({
  galleryCount,
  description,
  characteristics,
  seller,
  moderationHistory,
  onApprove,
  onReject,
  onRequestRevision,
  onPrev,
  onNext,
}) => {
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [comment, setComment] = useState('');

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
    setSelectedReasons([]);
    setCustomReason('');
    setComment('');
  };

  const handleOpenRevisionDialog = () => {
    setOpenRevisionDialog(true);
    setSelectedReasons([]);
    setCustomReason('');
    setComment('');
  };

  const handleCloseDialogs = () => {
    setOpenRejectDialog(false);
    setOpenRevisionDialog(false);
    setSelectedReasons([]);
    setCustomReason('');
    setComment('');
  };

  const handleConfirmReject = () => {
    const reasons = [...selectedReasons];
    if (selectedReasons.includes('Другое') && customReason.trim()) {
      reasons.push(customReason.trim());
    }
    const reasonText = reasons.filter(r => r !== 'Другое').join(', ');
    onReject(reasonText, comment);
    handleCloseDialogs();
  };

  const handleConfirmRevision = () => {
    const reasons = [...selectedReasons];
    if (selectedReasons.includes('Другое') && customReason.trim()) {
      reasons.push(customReason.trim());
    }
    const reasonText = reasons.filter(r => r !== 'Другое').join(', ');
    onRequestRevision(reasonText, comment);
    handleCloseDialogs();
  };

  return (
    <Box p={2}>
      {/* Верхний блок */}
      <Box display="flex" gap={2} mt={2} flexWrap="wrap">
        <Box flex={{ xs: '1 1 100%', md: '1 1 33%' }}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1">Галерея ({galleryCount})</Typography>
            <Box
              sx={{
                width: '100%',
                height: 200,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {galleryCount} изображений
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box flex={{ xs: '1 1 100%', md: '1 1 66%' }}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#fffbe6' }}>
            <Typography variant="subtitle1">История модерации:</Typography>
            <Typography variant="body2">Модератор: {moderationHistory.moderator}</Typography>
            <Typography variant="body2">Дата: {moderationHistory.date}</Typography>
            <Typography variant="body2">Статус: {moderationHistory.status}</Typography>
          </Paper>
        </Box>
      </Box>

      {/* Описание и характеристики */}
      <Box mt={3}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1">Полное описание</Typography>
          <Typography variant="body2" mb={2} sx={{ whiteSpace: 'pre-wrap' }}>
            {description}
          </Typography>

          <Divider />

          <Typography variant="subtitle1" mt={2}>
            Характеристики
          </Typography>
          <Table size="small">
            <TableBody>
              {Object.entries(characteristics).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider />

          <Typography variant="subtitle1" mt={2}>
            Продавец
          </Typography>
          <Typography variant="body2">
            {seller.name} | На сайте: {seller.yearsOnSite} {getYearsText(seller.yearsOnSite)}
          </Typography>
          <Typography variant="body2">
            {seller.adsCount} {getAdsCountText(seller.adsCount)}
          </Typography>
        </Paper>
      </Box>

      {/* Кнопки действий */}
      <Stack direction="row" spacing={2} mt={3}>
        <Button variant="contained" color="success" onClick={onApprove}>
          Одобрить
        </Button>
        <Button variant="contained" color="error" onClick={handleOpenRejectDialog}>
          Отклонить
        </Button>
        <Button variant="contained" color="warning" onClick={handleOpenRevisionDialog}>
          Доработка
        </Button>
      </Stack>

      {/* Навигация */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="text">← К списку</Button>
        <Button variant="text" onClick={onPrev}>Пред</Button>
        <Button variant="text" onClick={onNext}>След </Button>
      </Stack>

      {/* Модальное окно отклонения */}
      <Dialog 
        open={openRejectDialog} 
        onClose={handleCloseDialogs} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Отклонение</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Причина:
          </Typography>

          <Stack direction="column" spacing={1}>
            {rejectionReasons.map(reason => (
              <FormControlLabel
                key={reason.value}
                control={
                  <Checkbox
                    checked={selectedReasons.includes(reason.value)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setSelectedReasons(prev =>
                        checked ? [...prev, reason.value] : prev.filter(r => r !== reason.value)
                      );
                    }}
                  />
                }
                label={reason.label}
              />
            ))}

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedReasons.includes('Другое')}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSelectedReasons(prev =>
                      checked ? [...prev, 'Другое'] : prev.filter(r => r !== 'Другое')
                    );
                  }}
                />
              }
              label="Другое"
            />

            {selectedReasons.includes('Другое') && (
              <TextField
                fullWidth
                required
                label="Укажите причину"
                variant="outlined"
                margin="normal"
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
              />
            )}

            <TextField
              fullWidth
              label="Комментарий"
              variant="outlined"
              margin="normal"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Отмена</Button>
          <Button
            onClick={handleConfirmReject}
            variant="contained"
            color="error"
            disabled={
              selectedReasons.length === 0 ||
              (selectedReasons.includes('Другое') && !customReason.trim())
            }
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно доработки */}
      <Dialog 
        open={openRevisionDialog} 
        onClose={handleCloseDialogs} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Запрос доработки</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Причина:
          </Typography>

          <Stack direction="column" spacing={1}>
            {rejectionReasons.map(reason => (
              <FormControlLabel
                key={reason.value}
                control={
                  <Checkbox
                    checked={selectedReasons.includes(reason.value)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setSelectedReasons(prev =>
                        checked ? [...prev, reason.value] : prev.filter(r => r !== reason.value)
                      );
                    }}
                  />
                }
                label={reason.label}
              />
            ))}

            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedReasons.includes('Другое')}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSelectedReasons(prev =>
                      checked ? [...prev, 'Другое'] : prev.filter(r => r !== 'Другое')
                    );
                  }}
                />
              }
              label="Другое"
            />

            {selectedReasons.includes('Другое') && (
              <TextField
                fullWidth
                required
                label="Укажите причину"
                variant="outlined"
                margin="normal"
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
              />
            )}

            <TextField
              fullWidth
              label="Комментарий"
              variant="outlined"
              margin="normal"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs}>Отмена</Button>
          <Button
            onClick={handleConfirmRevision}
            variant="contained"
            color="warning"
            disabled={
              selectedReasons.length === 0 ||
              (selectedReasons.includes('Другое') && !customReason.trim())
            }
          >
            Отправить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

function getYearsText(years: number): string {
  if (years % 10 === 1 && years % 100 !== 11) return 'год';
  if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года';
  return 'лет';
}

function getAdsCountText(count: number): string {
  if (count % 10 === 1 && count % 100 !== 11) return 'объявление';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'объявления';
  return 'объявлений';
}

export default ItemModerationView;