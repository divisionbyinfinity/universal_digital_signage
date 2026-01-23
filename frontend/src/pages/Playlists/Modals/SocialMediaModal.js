import React, { useState } from 'react'
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


export default function SocialMediaModal({open,handleClose,icons,handleSubmit}) {

    const [name,setName]=useState('other')
    const [link,setLink]=useState('')
  return (
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
          >
        <DialogTitle>Add Social Media Link</DialogTitle>
        <DialogContent className='text-center'>
            <FormControl sx={{mt:2,minHeight:200,width:'100%',display:'flex',flexDirection:'col',gap:2}}>
            <CustomSelect
                labelText={"Social Media Icon"} 
                selectedValue={name} 
                items={[
                    {_id:'linkedIn',name:'LinkedIn'},
                  {_id: 'facebook', name: 'Facebook'},
                  {_id: 'instagram', name: 'Instagram'},
                  {_id: 'XIcon', name: 'XIcon'},
                    {_id: 'youtube', name: 'YouTube'},
                ]}
                onChange={(e)=>{setName(e.target.value)}}
              />
              <TextField type='text' label='Link' value={link} name='link'   onChange={(e)=>{setLink(e.target.value)}} />
              {/* <TextField type='text' label='Gap' value={slide.captionGap} name='captionGap' onChange={handleInputChange} /> */}

            </FormControl>
        <Button variant='contained' onClick={()=>{handleSubmit({name,link})}}>Submit</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
  )
}

