import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Typography,
  Stack,
} from '@mui/material';

interface ModerationDialogsProps {
  openRejectDialog: boolean;
  openRevisionDialog: boolean;
  onCloseRejectDialog: () => void;
  onCloseRevisionDialog: () => void;
  onReject: (reason: string, comment?: string) => void;
  onRequestRevision: (reason: string, comment?: string) => void;
}

const rejectionReasons = [
  { label: 'Запрещенный товар', value: 'Запрещенный товар' },
  { label: 'Неверная категория', value: 'Неверная категория' },
  { label: 'Некорректное описание', value: 'Некорректное описание' },
  { label: 'Проблемы с фото', value: 'Проблемы с фото' },
  { label: 'Подозрение на мошенничество', value: 'Подозрение на мошенничество' },
];

const ModerationDialogs: React.FC<ModerationDialogsProps> = ({
  openRejectDialog,
  openRevisionDialog,
  onCloseRejectDialog,
  onCloseRevisionDialog,
  onReject,
  onRequestRevision,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [comment, setComment] = useState('');

  const handleCloseDialogs = () => {
    onCloseRejectDialog();
    onCloseRevisionDialog();
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

  const renderDialogContent = () => (
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
  );

  return (
    <>

      <Dialog 
        open={openRejectDialog} 
        onClose={handleCloseDialogs} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Отклонение</DialogTitle>
        {renderDialogContent()}
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


      <Dialog 
        open={openRevisionDialog} 
        onClose={handleCloseDialogs} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>Запрос доработки</DialogTitle>
        {renderDialogContent()}
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
    </>
  );
};

export default ModerationDialogs;