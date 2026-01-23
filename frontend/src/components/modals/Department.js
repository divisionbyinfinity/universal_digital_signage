import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const useStyles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  }
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

export default function DepartmentModal({ open, handleModalClose, handleAddOrUpdate, DeptData = null }) {
  const initialFormData = {
    name: '',
    file: null,
    description: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData(initialFormData);
    setImagePreview(null);
    if (DeptData) {
      setFormData({
        name: DeptData.name || '',
        file: null, // Keep file as null initially
        description: DeptData.description || ''
      });
      setImagePreview(
        DeptData?.profileImg
          ? process.env.REACT_APP_CDN_URL + DeptData.profileImg
          : null
      );
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
  }, [DeptData]);

  const handleSubmit = () => {
    const Data = new FormData();
    Data.append('name', formData.name);
    Data.append('description', formData.description);
    if (formData.file) {
      Data.append('file', formData.file);
    }
    
    handleAddOrUpdate(Data, DeptData ? 'update' : 'add');
    handleModalClose();
    setFormData(initialFormData);
    setImagePreview(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setImagePreview(URL.createObjectURL(file));
    }
    event.target.value = null; // Clear the input after selecting the file
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal keepMounted open={open} onClose={handleModalClose}>
      <Box sx={useStyles.modal}>
        <Typography variant="h6">{DeptData ? "Edit Department" : "Add Department"}</Typography>
        <TextField
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          name="name"
          fullWidth
          label="Department Name"
          variant="outlined"
          required
        />
        <TextField
          id="description"
          value={formData.description}
          onChange={handleInputChange}
          name="description"
          fullWidth
          label="Description"
          variant="outlined"
        />
        <div className="flex justify-center items-center relative my-2 border-2 border-dashed border-gray-300 rounded-lg h-32 ">
                      {imagePreview !== null ? (
                        <img
                          src={imagePreview}
                          alt="profile"
                          style={{
                            minWidth: "50px",
                            minHeight: "50px",
                            maxWidth: "100px",
                            maxHeight: "100px",
                          }}
                          className="rounded"
                        />
                      ) : (
                        <p className="text-gray-500">No Image Selected</p>
                      )}
        
                      <IconButton
                        style={{ position: "absolute", top: 0, right: 0 }}
                        onClick={() => {
                          setFormData({ ...formData, file: null });
                          setImagePreview(null);
                        }}
                      >
                        <CancelOutlinedIcon />
                      </IconButton>
                    </div>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload Image
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <Button onClick={handleSubmit} variant="outlined">
          Submit
        </Button>
      </Box>
    </Modal>
  );
}