import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useConfig } from "../../contexts/ConfigContext";
import IconButton from "@mui/material/IconButton";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const useStyles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    maxHeight: "80vh",        // <-- constrain height
    overflowY: "auto",        // <-- allow scrolling if content exceeds
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    form: {
      display: "flex",
    flexDirection: "column",
    gap: 2,
    },
  },
};


export default function UserModal({
  open,
  openModal,
  closeModal,
  handleFormSubmit,
  selectedUser,
  user,
}) {
  const { departments = [] } = useConfig();
  const [visibility, setVisibility] = useState(false);
  const fileInputRef = useRef(null);
  const initialFormData = {
    firstName: "",
    lastName: "",
    departmentId: user?.department?._id || "",
    email: "",
    password: "",
    profileImage: null,
    role: "standard",
    file: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [previewImage, setPreviewImage] = useState(null);
  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    if (open) {
      setFormData({
        firstName: selectedUser?.firstName || "",
        lastName: selectedUser?.lastName || "",
        departmentId: selectedUser?.departmentId?._id || "",
        email: selectedUser?.email || "",
        password: "",
        profileImage: selectedUser?.profileImg || null,
        role: selectedUser?.role || "standard",
        file: null,
      });
      setPreviewImage(
        selectedUser?.profileImg
          ? process.env.REACT_APP_CDN_URL + selectedUser.profileImg
          : null
      );
    } else {
      setFormData(initialFormData);
      setPreviewImage(null);
    }
  }, [openModal, selectedUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleFormSubmit({ ...formData });
    closeModal();
  };

  return (
    <div className="box">
      <Modal
        keepMounted
        open={open}
        onClose={() => {
          openModal();
          closeModal();
        }}
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
      >
        <Box sx={useStyles.modal}>
          <Typography id="user-modal-title" variant="h6">
            {selectedUser ? "Edit User" : "Add User"}
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              name="firstName"
              required
              fullWidth
              label="First Name"
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              name="lastName"
              fullWidth
              label="Last Name"
              variant="outlined"
              autoComplete="off"
            />
            <FormControl fullWidth disabled={user.role !== "admin"}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                fullWidth
                labelId="department-label"
                id="department-select"
                required
                name="departmentId"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
                label="Department"
              >
                {departments.map((dep) => (
                  <MenuItem value={dep._id} key={dep._id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={user.role !== "admin"}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                fullWidth
                required
                labelId="role-label"
                id="role-select"
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="standard">Standard</MenuItem>
                <MenuItem value="assetManager">Asset Manager</MenuItem>
                <MenuItem value="globalAssetManager">
                  Global Asset Manager
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              name="email"
              required
              type="email"
              fullWidth
              label="Email"
              variant="outlined"
              autoComplete="off"
            />
            <TextField
              id="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              name="password"
              fullWidth
              label="Password"
              type={visibility ? "text" : "password"}
              autoComplete="off"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setVisibility((prev) => !prev)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {visibility ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                ),
              }}
            />

            <div className="flex justify-center items-center relative my-2 border-2 border-dashed border-gray-300 rounded-lg h-32 ">
              {previewImage !== null ? (
                <img
                  src={previewImage}
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
                  setPreviewImage(null);
                }}
              >
                <CancelOutlinedIcon />
              </IconButton>
            </div>

            <Button
              component="label"
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
            >
              Profile Image
              <VisuallyHiddenInput
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>

            <Button
              variant="outlined"
              type="submit"
              fullWidth
              color="primary"
              style={{ margin: "0.5rem 0rem" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
