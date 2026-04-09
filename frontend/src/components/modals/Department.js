import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EnterpriseModal from './EnterpriseModal';

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
    <EnterpriseModal
      open={open}
      onClose={handleModalClose}
      title={DeptData ? "Edit Department" : "Add Department"}
      maxWidth="sm"
      actions={
        <>
          <Button color="primary" onClick={handleModalClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          id="name"
          size="small"
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
          size="small"
          value={formData.description}
          onChange={handleInputChange}
          name="description"
          fullWidth
          label="Description"
          variant="outlined"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            minHeight: 128,
            width: "100%",
          }}
        >
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
        </Box>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} fullWidth>
          Upload Image
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
      </Box>
    </EnterpriseModal>
  );
}