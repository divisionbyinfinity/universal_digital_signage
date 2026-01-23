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

export default function SlideImgCssModal({open,handleInputChange,handleCssChange,handleClose,style,slide,handleSubmit}) {

  return (
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
          >
        <DialogTitle>Playlist Css</DialogTitle>
        <DialogContent className='text-center'>
            <FormControl sx={{mt:2,minHeight:200,width:'100%',display:'flex',flexDirection:'col',gap:2}}>
            <CustomSelect
                inputName={"captionAlign"}
                labelText={"caption Align"} 
                selectedValue={style.captionAlign} 
                items={[
                  {_id: 'left', name: 'Left'},
                  {_id: 'center', name: 'Center'},
                  {_id: 'right', name: 'Right'}
                ]}
                onChange={handleCssChange}
              />
                <ColorPicker
                label="Background Color"
                value={style.imgContbgColor}
                name="imgContbgColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Slide Number Background Color"
                value={style.slideNobgColor}
                name="slideNobgColor"
                handleChange={handleCssChange}
                />
                <ColorPicker
                label="Slide Number Text Color"
                value={style.slideNoTextColor}
                name="slideNoTextColor"
                handleChange={handleCssChange}
                />
                
              <TextField type='text' label='Caption' value={slide.caption} name='caption' onChange={handleInputChange} />
              <TextField type='text' label='Caption Color' value={style.captionTextColor} name='captionTextColor' onChange={handleCssChange} />
              <TextField type='text' label='Caption Font Size' value={style.captionFontSize} name='captionFontSize' onChange={handleCssChange} />
              <TextField type='text' label='Border Color' value={style.captionBorderColor} name='captionBorderColor' onChange={handleCssChange} />
              <TextField type='text' label='Border Radius' value={style.captionBorderRadius} name='captionBorderRadius' onChange={handleCssChange} />

              {/* <TextField type='text' label='Gap' value={slide.captionGap} name='captionGap' onChange={handleInputChange} /> */}

            </FormControl>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

