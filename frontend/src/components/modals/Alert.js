import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import EnterpriseModal from './EnterpriseModal';

export default function AlertModal({handleMediaDelete,open,handleClose,title,description}) {

  return (
    <React.Fragment>
      <EnterpriseModal
        open={open}
        onClose={handleClose}
        title={title || 'Delete Item'}
        maxWidth="xs"
        actions={
          <>
            <Button color="primary" onClick={handleClose}>Cancel</Button>
            <Button onClick={() => { handleMediaDelete(); handleClose(); }} color="error" autoFocus>
              Confirm
            </Button>
          </>
        }
      >
        <Typography sx={{ color: '#475569' }}>
          {description}
        </Typography>
      </EnterpriseModal>
    </React.Fragment>
  );
}