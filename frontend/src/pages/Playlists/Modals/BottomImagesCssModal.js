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
import CustomSelect from '../../../components/forms/CustomSelect'

export default function BottomImagesCssModal({open,handleInputChange,handleCssChange,handleClose,style,slide,handleSubmit}) {

  return (
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
          >
        <DialogTitle>Playlist Css</DialogTitle>
        <DialogContent className='text-center'>
            <FormControl sx={{mt:2,minHeight:200,width:'100%',display:'flex',flexDirection:'col',gap:2}}>
                {/* <ColorPicker
                label="Background Color"
                value={style.bottomActiveShadow}
                name="bottomActiveShadow"
                handleChange={handleCssChange}
              /> */}
              <ColorPicker
                label="Background Color"
                value={style.bottomImgbgColor}
                name="bottomImgbgColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Active Border Color"
                value={style.bottomImgActiveBorder}
                name="bottomImgActiveBorder"
                handleChange={handleCssChange}
              />
                <CustomSelect
                inputName={"bottomImageAlign"}
                labelText={"caption Align"} 
                selectedValue={style.bottomImageAlign}
                items={[
                  {_id: 'left', name: 'Left'},
                  {_id: 'center', name: 'Center'},
                  {_id: 'right', name: 'Right'}
                ]}
                onChange={handleCssChange}
              />
            </FormControl>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

