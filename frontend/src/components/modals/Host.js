import React, { useEffect, useState, useRef } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

const useStyles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    // height: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  form: {
    display: "flex",
    gap: 2,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
};

export default function HostModal({
  handleHostOpen,
  open,
  handleHostclose,
  departments,
  HandleAddOrEditHost,
  currHost,
  playlists,
  user,
}) {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const initialFormData = {
    name: "",
    isTouchScreen: "",
    type: 1,
    departmentId: "",
    playlistId: "",
    stackedPlaylistId: "",
    description: "",
  };
  const maxLengths = {
    description: 100,
    name: 30,
  };
  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (currHost !== null) {
      setFormData({
        name: currHost.name || "",
        isTouchScreen: currHost.isTouchScreen,
        type: currHost.type || "",
        departmentId: currHost.department?._id || "",
        playlistId: currHost.playlistId || "",
        stackedPlaylistId: currHost.stackedPlaylistId || "",
        description: currHost.description || "",
      });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [currHost]);
  const handleClose = () => {
    handleHostclose();
    setFormData(initialFormData); // Reset the form data when closing the modal
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    const maxLength = maxLengths[name] || Infinity;
    if (value.length <= maxLength) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    // Send the formData object to your API
    // handleFormSubmit(formData);
    if (file) {
      HandleAddOrEditHost(file);
    } else {
      if (currHost !== null) {
        formData.id = currHost._id;
      }
      HandleAddOrEditHost(null, { ...formData });
      // Close the modal
    }
    handleClose();
  };
  // Function to handle the button click and open the file input dialog
  const handleFileInputOpen = () => {
    fileInputRef.current.click();
  };
  // Function to handle the file change event
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <div className="box flex-start">
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="user-modal-title"
        aria-describedby="user-modal-description"
      >
        <Box sx={useStyles.modal}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {currHost !== null ? "Edit Host" : "Add Host"}
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <TextField
              id="name"
              value={formData.name}
              error={formData.name.length === maxLengths.name}
              onChange={handleInputChange}
              required
              name="name"
              fullWidth
              size="small"
              autoComplete="off"
              label="Host Name"
              variant="outlined"
            />
          </Box>
          <Box className="m-2 w-full">
            <InputLabel id="demo-simple-select-autowidth-label">
              Screen Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              name="isTouchScreen"
              fullWidth
              size="small"
              value={formData.isTouchScreen}
              onChange={handleInputChange}
              label="Screen Type"
              autoComplete="off"
            >
              <MenuItem value="true">Touch</MenuItem>
              <MenuItem value="false">No Touch</MenuItem>
            </Select>
          </Box>
          <Box className="m-2 w-full">
            <InputLabel id="demo-simple-select-autowidth-label">
              Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              name="type"
              fullWidth
              size="small"
              value={formData.type}
              autoComplete="off"
              onChange={handleInputChange}
              label="type"
            >
              <MenuItem value={1}>Digital Sign</MenuItem>
              <MenuItem value={2}>Kiosk</MenuItem>
            </Select>
          </Box>
          {departments.length > 0 &&
            ["admin", "globalAssetManager"].includes("admin") && (
              <Box className="m-2 w-full">
                <InputLabel id="demo-simple-select-autowidth-label">
                  Department
                </InputLabel>
                <Select
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  name="departmentId"
                  fullWidth
                  size="small"
                  autoComplete="off"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  label="departmentId"
                >
                  {departments.map((dep) => {
                    return (
                      <MenuItem value={dep._id} key={dep._id}>
                        {dep.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            )}
          {playlists.length > 0 && (
            <Box className="m-2 w-full">
              <InputLabel id="playlists">Playlist</InputLabel>
              <Select
                labelId="playlists"
                id="playlists"
                name="playlistId"
                size="small"
                fullWidth
                value={formData.playlistId}
                onChange={handleInputChange}
                label="departmentId"
                displayEmpty // 🔑 this enables showing the default option
                autoComplete="off"
              >
                <MenuItem value="">
                  <em>Select Playlist</em> {/* default placeholder-like item */}
                </MenuItem>
                {playlists.map((playlist) => {
                  return (
                    <MenuItem value={playlist._id} key={playlist._id}>
                      {playlist.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          )}
          {playlists.length > 0 && (
            <Box className="m-2 w-full">
              <InputLabel id="playlists">Stacked Playlist</InputLabel>
              <Select
                labelId="stackedPlaylists"
                id="stackedPlaylists"
                name="stackedPlaylistId"
                disabled={
                  !["admin", "globalAssetManager"].includes(user.role) &&
                  !(
                    user.department._id == currHost?.department?._id &&
                    user.role == "assetManager"
                  )
                }
                size="small"
                fullWidth
                value={formData.stackedPlaylistId}
                onChange={handleInputChange}
                label="departmentId"
                displayEmpty // 🔑 this enables showing the default option
                autoComplete="off"
              >
                <MenuItem value="">
                  <em>Select Stacked Playlist</em>
                </MenuItem>
                {playlists.map((playlist) => {
                  return (
                    <MenuItem value={playlist._id} key={playlist._id}>
                      {playlist.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          )}

          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <TextField
              id="description"
              label="Description"
              multiline
              maxRows={4}
              name="description"
              fullWidth
              autoComplete="off"
              value={formData.description}
              onChange={handleInputChange}
              error={formData.description.length === maxLengths.description}
            />
          </Box>

          <div>
            {currHost == null && (
              <Box className="w-full flex flex-col gap-4 justify-center items-center">
                <h2>OR</h2>

                <Button variant="outlined" onClick={handleFileInputOpen}>
                  Bulk Upload
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  //only accept the xlsx file
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
                {file !== null && <h2>{file.name}</h2>}
              </Box>
            )}
          </div>
          <div className="m-2">
            <Button
              onClick={handleSubmit}
              variant="outlined"
              disabled={formData.name.length === 0}
            >
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
