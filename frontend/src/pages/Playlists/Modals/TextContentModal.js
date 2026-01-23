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

function TextContentModal({open,handleCssChange,handleClose,style,handleSubmit}) {
  return (
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
          >
        <DialogTitle>Text Content Css</DialogTitle>
        <DialogContent className='text-center'>
            <FormControl sx={{mt:2,minHeight:200,width:'100%',display:'flex',flexDirection:'col',gap:2}}>
                <ColorPicker
                label="Background Color"
                value={style.textContentBgColor}
                name="textContentBgColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Heading Box Shadow Color"
                value={style.headingBoxShadowColor}
                name="headingBoxShadowColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Heading Font Color"
                value={style.headingTextColor}
                name="headingTextColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Sub Heading Color"
                value={style.subtitleTextColor}
                name="subtitleTextColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Bullet Color"
                value={style.bulletTextColor}
                name="bulletTextColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Text Area Font Color"
                value={style.paragraphTextColor}
                name="paragraphTextColor"
                handleChange={handleCssChange}
              />
              <ColorPicker
                label="Icon Color"
                value={style.iconsColor}
                name="iconsColor"
                handleChange={handleCssChange}
              />
              <TextField type='text' label='Text Gap' value={style.textContGap} name='textContGap' onChange={handleCssChange} />
              <TextField type='text' label='Bullet Gap' value={style.bulletGap} name='bulletGap' onChange={handleCssChange} />


              <TextField type='text' label='Heading Font Size' value={style.headingFontSize} name='headingFontSize' onChange={handleCssChange} />
              <TextField type='text' label='Sub Heading Font Size' value={style.subHeadingFontSize} name='subHeadingFontSize' onChange={handleCssChange} />
              <TextField type='text' label='Bullet Font Size' value={style.bulletFontSize} name='bulletFontSize' onChange={handleCssChange} />
              <CustomSelect
                inputName={"iconSize"}
                labelText={"Icon Size"} 
                selectedValue={style.iconSize} 
                items={[
                  {_id: 'large', name: 'Large'},
                  {_id: 'medium', name: 'Medium'},
                  {_id: 'small', name: 'Small'}
                ]}
                onChange={handleCssChange}
              />

              <TextField type='text' label='Text Area Font Size' value={style.paragraphFontSize} name='paragraphFontSize' onChange={handleCssChange} />

            </FormControl>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

export default TextContentModal