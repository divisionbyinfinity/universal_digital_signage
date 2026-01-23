import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import MyAvatar from '../../components/Avatar';
import { editUser } from '../../apis/api';
import { useAuth } from '../../contexts/AuthContext';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAlert } from '../../contexts/AlertContext';
export default function UserModal() {
  const { user, logoutUser } = useAuth();
  const [enableEdit,setEnableEidt]=useState(false)
  const [visibility, setVisibility] = useState(false);
  const addAlert = useAlert();

  const initialFormData = {
    firstName: '',
    lastName: '',
    departmentName: '',
    departmentId: user?.department?._id || "",
    email: '',
    password: '',
    profileImage: null,
    file: null,
    bio: '',          // NEW
    role: 'standard'
  };
  
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const [userData, setUserData] = useState(initialFormData);
  useEffect(()=>{
      if(user && user._id){
        const editUser = {
          firstName: user.firstName,
          lastName: user.lastName,
          departmentName: user.department?.name,
          departmentId: user.department?._id, // NEW
          email: user.email,
          password: user.password,
          profileImage: null,
          role: user.role,
          file: null,
          bio: user.bio || ''
        };
        
        setUserData({...editUser})
      }
  },[user,enableEdit])

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    setUserData({
      ...userData,
      file: event.target.files[0],
    });
  };

  const handleSubmit = async () => {
    const Data = new FormData();
    Data.append('_id', user._id);
    Data.append('firstName', userData.firstName);
    Data.append('lastName', userData.lastName);
    Data.append('email', userData.email);
    Data.append('role', userData.role);
    Data.append('bio', userData.bio);
    Data.append('password', userData.password);
    Data.append('departmentId', userData.departmentId);
  
    if (userData.file) {
      Data.append('file', userData.file);
    }
  
    const data=await editUser('common/profile/edit',user.token,Data)
    if (Array.isArray(data.errors)) {
      data.errors.forEach((message) => {
        addAlert({ type: data.success ? 'success' : 'error', message: message.param+' '+message.msg });
      });
      } else {
        logoutUser()
        addAlert({ type: data.success ? 'success' : 'error', message: data.message });
      }
      setEnableEidt(false);
  };
  

  return (
    <div className='flex  flex-col items-center w-full my-4 h-full'>
        <div className='flex flex-row  w-1/2 '>
          <Button variant='contained' color='primary' disabled={enableEdit} onClick={()=>{setEnableEidt(true)}}>Edit</Button>
        </div>
        <Box sx={{margin:2, width:'50%'}}>
         <div className='flex gap-2 my-8 justify-center flex-col items-center '>
         <div className='w-40 h-40 rounded-full '>
  {(userData.file || user.profileImage) ? (
    <img
      src={userData.file == null ? user.profileImage : URL.createObjectURL(userData.file)}
      alt='profile'
      className='w-full h-full object-cover'
    />
  ) : (
    // <div className='rounded-full pl-10 '>
      <MyAvatar 
        name1={user.firstName} 
        name2={user.lastName} 
        imageUrl={user.profileImage}
        sx={{ width: '100%', height: '100%' , fontSize: '5rem'}}
      />
    // </div>
  )}
</div>       
          {enableEdit && <Button component="label" size='small' startIcon={<EditIcon />}>
              Edit 
              <VisuallyHiddenInput type="file" onChange={handleFileChange}/>
            </Button>}
          </div>
          <div className='flex gap-4 my-8 '>
            <TextField
              id="firstName"
              className='border-radius'
              value={userData.firstName}
              onChange={handleInputChange}
              fullWidth
              name="firstName"
              label="First Name"
              variant="filled"
              InputProps={{
            readOnly: !enableEdit,
          }}
            />
            <TextField
              id="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
              fullWidth
              name="lastName"
              label="Last Name"
              variant="filled"
              InputProps={{
            readOnly: !enableEdit,
          }}
            />
            </div>
            <div className='flex gap-4 my-8 '>
            <TextField
              id="role"
              value={userData.role}
              onChange={handleInputChange}
              name="role"
              fullWidth
              label="role"
              variant="filled"
              InputProps={{
            readOnly: true,
          }}/>
            
            <TextField
              id="email"
              value={userData.email}
              onChange={handleInputChange}
              name="email"
              fullWidth
              label="Email"
              variant="filled"
              InputProps={{
                readOnly: !enableEdit,
              }}
            />
            
            </div>
            <div className='flex gap-4 my-8 '>
            <TextField
            className='w-full'
              id="password"
              value={userData.password}
              onChange={handleInputChange}
              name="password"
              fullWidth
              label="password"
              type={visibility?"text":"password"}
              autoComplete="off"
              variant='filled'
              disabled={!enableEdit}
              InputProps={{
                endAdornment: <IconButton
                aria-label="toggle password visibility"
                onClick={() => setVisibility(prev=>!prev)} // Handle your click event here
                onMouseDown={(e) => e.preventDefault()} // Prevents focus on input
                edge="end"
              >
                {visibility?<VisibilityIcon />:<VisibilityOffIcon />}
              </IconButton>,
              }}
            />
              </div>
          <div className='flex gap-4 my-8 '>
          <TextField
              id="departmentName"
              value={userData.departmentName}
              onChange={handleInputChange}
              name="departmentName"
              fullWidth
              label="Department Name"
              variant='filled'
              disabled
              InputProps={{
            readOnly:true
          }}
            />
            <TextField
              id="bio"
              value={userData.bio}
              onChange={handleInputChange}
              name="bio"
              fullWidth
              label="User Bio"
              variant='filled'
              InputProps={{
                readOnly: !enableEdit,
              }}
            />
          </div>
            {enableEdit &&<div className='flex justify-between'>
            <Button className='' variant="contained" onClick={()=>{setEnableEidt(false)}} size="medium">
              cancel
            </Button>
            <Button className='' variant="contained" color="primary" onClick={handleSubmit} size="medium">
              Submit
            </Button>
            </div>}
            {/* <MyAvatar name1={userData.firstName} name2={userData.lastName} imageUrl={userData.file == null ? user.profileImage : URL.createObjectURL(userData.file)} /> */}
            
        </Box>

    </div>
  );
}
