import React, { useState } from 'react';
import { Button, Stack, useMediaQuery } from '@mui/material';
import ModerationDialogs from './ModerationDialogs';

interface ModerationActionsProps {
  onApprove: () => void;
  onReject: (reason: string, comment?: string) => void;
  onRequestRevision: (reason: string, comment?: string) => void;
}

const ModerationActions: React.FC<ModerationActionsProps> = ({
  onApprove,
  onReject,
  onRequestRevision,
}) => {
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  const isSmallMobile = useMediaQuery('(max-width:400px)');

  const handleApprove = () => {
    if (window.confirm('Вы уверены, что хотите одобрить это объявление?')) {
      onApprove();
    }
  };

  return (
    <>
      <Stack 
        direction={isSmallMobile ? "column" : "row"} 
        spacing={2} 
        mt={4} 
        justifyContent="center"
        alignItems="center"
      >
        <Button 
          variant="contained" 
          color="success" 
          size={isMobile ? "medium" : "large"}
          onClick={handleApprove}
          fullWidth={isSmallMobile}
          sx={{ 
            minWidth: isSmallMobile ? 'auto' : 140,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          Одобрить
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          size={isMobile ? "medium" : "large"}
          onClick={() => setOpenRejectDialog(true)}
          fullWidth={isSmallMobile}
          sx={{ 
            minWidth: isSmallMobile ? 'auto' : 140,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          Отклонить
        </Button>
        <Button 
          variant="contained" 
          color="warning" 
          size={isMobile ? "medium" : "large"}
          onClick={() => setOpenRevisionDialog(true)}
          fullWidth={isSmallMobile}
          sx={{ 
            minWidth: isSmallMobile ? 'auto' : 180,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          Доработка
        </Button>
      </Stack>

      <ModerationDialogs
        openRejectDialog={openRejectDialog}
        openRevisionDialog={openRevisionDialog}
        onCloseRejectDialog={() => setOpenRejectDialog(false)}
        onCloseRevisionDialog={() => setOpenRevisionDialog(false)}
        onReject={onReject}
        onRequestRevision={onRequestRevision}
      />
    </>
  );
};

export default ModerationActions;