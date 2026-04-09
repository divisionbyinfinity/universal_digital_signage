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
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
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
    <Box className="page-backdrop" sx={{ minHeight: '100%', py: 2.5, px: { xs: 1, md: 2 } }}>
      <Box
        sx={{
          maxWidth: 980,
          mx: 'auto',
          borderRadius: 4,
          border: '1px solid rgba(148, 163, 184, 0.32)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.9) 100%)',
          boxShadow: '0 24px 55px rgba(15, 23, 42, 0.12)',
          p: { xs: 2, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'var(--font-family-heading)', fontWeight: 700, color: '#0f172a' }}>
              My Profile
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Manage account identity, security, and profile details.
            </Typography>
          </Box>
          <Button variant='contained' color='primary' disabled={enableEdit} onClick={() => { setEnableEidt(true); }}>
            Edit Profile
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 1.25, mb: 3 }}>
          <Box
            sx={{
              width: 132,
              height: 132,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(59, 130, 246, 0.24)',
              boxShadow: '0 12px 28px rgba(15, 23, 42, 0.14)',
              background: '#e2e8f0',
            }}
          >
            {(userData.file || user.profileImage) ? (
              <img
                src={userData.file == null ? user.profileImage : URL.createObjectURL(userData.file)}
                alt='profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <MyAvatar
                name1={user.firstName}
                name2={user.lastName}
                imageUrl={user.profileImage}
                sx={{ width: '100%', height: '100%', fontSize: '3rem' }}
              />
            )}
          </Box>
          <Chip label={userData.role || 'standard'} color="primary" size="small" sx={{ textTransform: 'capitalize' }} />
          {enableEdit && (
            <Button component="label" size='small' startIcon={<EditIcon />}>
              Change Photo
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            id="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
            fullWidth
            size="small"
            name="firstName"
            label="First Name"
            variant="outlined"
            InputProps={{ readOnly: !enableEdit }}
          />
          <TextField
            id="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
            fullWidth
            size="small"
            name="lastName"
            label="Last Name"
            variant="outlined"
            InputProps={{ readOnly: !enableEdit }}
          />
          <TextField
            id="email"
            value={userData.email}
            onChange={handleInputChange}
            name="email"
            fullWidth
            size="small"
            label="Email"
            variant="outlined"
            InputProps={{ readOnly: !enableEdit }}
          />
          <TextField
            id="departmentName"
            value={userData.departmentName}
            onChange={handleInputChange}
            name="departmentName"
            fullWidth
            size="small"
            label="Department"
            variant='outlined'
            InputProps={{ readOnly: true }}
          />
          <TextField
            id="role"
            value={userData.role}
            onChange={handleInputChange}
            name="role"
            fullWidth
            size="small"
            label="Role"
            variant="outlined"
            InputProps={{ readOnly: true }}
          />
          <TextField
            id="password"
            value={userData.password}
            onChange={handleInputChange}
            name="password"
            fullWidth
            size="small"
            label="Password"
            type={visibility ? "text" : "password"}
            autoComplete="off"
            variant='outlined'
            disabled={!enableEdit}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setVisibility(prev => !prev)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              ),
            }}
          />
        </Box>

        <TextField
          id="bio"
          value={userData.bio}
          onChange={handleInputChange}
          name="bio"
          fullWidth
          size="small"
          label="User Bio"
          variant='outlined'
          multiline
          rows={3}
          sx={{ mt: 2 }}
          InputProps={{ readOnly: !enableEdit }}
        />

        {enableEdit && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: 2.5 }}>
            <Button variant="outlined" onClick={() => { setEnableEidt(false); }} size="medium">
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit} size="medium">
              Save Changes
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
