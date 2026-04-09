import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import EnterpriseModal from "./EnterpriseModal";

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
      <EnterpriseModal
        open={open}
        onClose={handleClose}
        title={currHost !== null ? "Edit Host" : "Add Host"}
        maxWidth="sm"
        actions={
          <>
            <Button color="primary" onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={formData.name.trim().length === 0}
            >
              Submit
            </Button>
          </>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
          <FormControl size="small" fullWidth>
            <InputLabel id="host-screen-type-label">Screen Type</InputLabel>
            <Select
              labelId="host-screen-type-label"
              id="host-screen-type"
              name="isTouchScreen"
              value={formData.isTouchScreen}
              onChange={handleInputChange}
              label="Screen Type"
              autoComplete="off"
            >
              <MenuItem value="true">Touch</MenuItem>
              <MenuItem value="false">No Touch</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel id="host-type-label">Type</InputLabel>
            <Select
              labelId="host-type-label"
              id="host-type"
              name="type"
              value={formData.type}
              autoComplete="off"
              onChange={handleInputChange}
              label="Type"
            >
              <MenuItem value={1}>Digital Sign</MenuItem>
              <MenuItem value={2}>Kiosk</MenuItem>
            </Select>
          </FormControl>
          {departments.length > 0 &&
            ["admin", "globalAssetManager"].includes("admin") && (
              <FormControl size="small" fullWidth>
                <InputLabel id="host-department-label">Department</InputLabel>
                <Select
                  labelId="host-department-label"
                  id="host-department"
                  name="departmentId"
                  autoComplete="off"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  label="Department"
                >
                  {departments.map((dep) => {
                    return (
                      <MenuItem value={dep._id} key={dep._id}>
                        {dep.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          {playlists.length > 0 && (
              <FormControl size="small" fullWidth>
              <InputLabel id="host-playlists-label">Playlist</InputLabel>
              <Select
                labelId="host-playlists-label"
                id="host-playlists"
                name="playlistId"
                value={formData.playlistId}
                onChange={handleInputChange}
                label="Playlist"
                autoComplete="off"
              >
                  <MenuItem value="">None</MenuItem>
                {playlists.map((playlist) => {
                  return (
                    <MenuItem value={playlist._id} key={playlist._id}>
                      {playlist.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
          {playlists.length > 0 && (
            <FormControl size="small" fullWidth>
              <InputLabel id="host-stacked-playlists-label">Stacked Playlist</InputLabel>
              <Select
                labelId="host-stacked-playlists-label"
                id="host-stacked-playlists"
                name="stackedPlaylistId"
                disabled={
                  !["admin", "globalAssetManager"].includes(user.role) &&
                  !(
                    user.department._id == currHost?.department?._id &&
                    user.role == "assetManager"
                  )
                }
                value={formData.stackedPlaylistId}
                onChange={handleInputChange}
                label="Stacked Playlist"
                autoComplete="off"
              >
                <MenuItem value="">None</MenuItem>
                {playlists.map((playlist) => {
                  return (
                    <MenuItem value={playlist._id} key={playlist._id}>
                      {playlist.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}

          <TextField
            id="description"
            label="Description"
            size="small"
            multiline
            maxRows={4}
            name="description"
            fullWidth
            autoComplete="off"
            value={formData.description}
            onChange={handleInputChange}
            error={formData.description.length === maxLengths.description}
          />

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
        </Box>
      </EnterpriseModal>
    </div>
  );
}
