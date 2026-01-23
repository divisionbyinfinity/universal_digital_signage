import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ColorPicker from '../../../components/ColorPicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
function PlaylistCssModal({open,handleInputChange,handleClose,style,handleSubmit}) {

  return (
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
          >
        <DialogTitle>Playlist Css</DialogTitle>
        <DialogContent className='text-center'>
            <FormControl sx={{mt:2,minHeight:200,width:'100%',display:'flex',flexDirection:'col',gap:2}}>
                <ColorPicker
                label="Background Color"
                value={style.bgColor}
                name="bgColor"
                handleChange={handleInputChange}
              />
              <TextField type='text' label='Padding X axis' value={style.paddingX} name='paddingX' onChange={handleInputChange} />
              <TextField type='text' label='Padding Y axis' value={style.paddingY} name='paddingY' onChange={handleInputChange} />
              <TextField type='text' label='Gap' value={style.topGap} name='topGap' onChange={handleInputChange} />

              
            </FormControl>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

export default PlaylistCssModal