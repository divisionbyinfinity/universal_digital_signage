import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useEffect } from "react";

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

export default function ChannelModal({
  handleChannelOpen,
  open,
  handleChannelclose,
  HandleAddOrEditChannel,
  currChannel,
  departments,
  playlists,
  user,
}) {
  const maxLengths = {
    description: 100,
    name: 30,
  };
  const initialFormData = {
    name: "",
    departmentId: "",
    playlistId: "",
    description: "",
    stackedPlaylistId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  useEffect(() => {
    if (currChannel !== null) {
      setFormData({
        name: currChannel.name || "",
        departmentId: currChannel.department?._id || "",
        playlistId: currChannel.playlistId || "",
        description: currChannel.description || "",
        stackedPlaylistId: currChannel.stackedPlaylistId || "",
      });
    } else {
      setFormData({
        ...initialFormData,
        departmentId: user.department?._id || "",
      });
    }
  }, [currChannel]);
  const handleClose = () => {
    handleChannelclose();
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
    if (currChannel !== null) {
      formData.id = currChannel._id;
    }
    HandleAddOrEditChannel(formData);
    // Close the modal
    handleClose();
  };

  return (
    <div className="box">
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="channel-modal-title"
        aria-describedby="channel-modal-description"
      >
        <Box sx={useStyles.modal}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {currChannel !== null ? "Edit Channel" : "Add Channel"}
          </Typography>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
          >
            <TextField
              id="name"
              size="small"
              value={formData.name}
              onChange={handleInputChange}
              name="name"
              autoComplete="off"
              fullWidth
              error={formData.name.length === maxLengths.name}
              label="Channel Name"
              variant="outlined"
            />
          </Box>
          {departments.length > 0 &&
            ["admin", "globalAssetManager"].includes(user.role) && (
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
              <InputLabel id="playlists-label">Playlist</InputLabel>
              <Select
                labelId="playlists-label"
                id="playlists"
                name="playlistId"
                size="small"
                fullWidth
                value={formData.playlistId || ""} // default to empty string
                onChange={handleInputChange}
                label="Playlist"
                displayEmpty // 🔑 this enables showing the default option
                autoComplete="off"
              >
                <MenuItem value="">
                  <em>Select Playlist</em> {/* default placeholder-like item */}
                </MenuItem>
                {playlists.map((playlist) => (
                  <MenuItem value={playlist._id} key={playlist._id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {playlists.length > 0 && (
            <Box className="m-2 w-full">
              <InputLabel id="stackedPlaylists">Stacked Playlist</InputLabel>
              <Select
                labelId="stackedPlaylists"
                id="stackedPlaylists"
                name="stackedPlaylistId"
                disabled={
                  !["admin", "globalAssetManager"].includes(user.role) &&
                  !(
                    user.department._id == currChannel?.department?._id &&
                    user.role == "assetManager"
                  )
                }
                size="small"
                fullWidth
                value={formData.stackedPlaylistId} // <-- fallback to empty string
                onChange={handleInputChange}
                label="Stacked Playlist"
                displayEmpty // 🔑 this enables showing the default option
                autoComplete="off"
              >
                <MenuItem value="">
                  <em>Select Stacked Playlist</em>
                </MenuItem>
                {playlists.map((playlist) => (
                  <MenuItem value={playlist._id} key={playlist._id}>
                    {playlist.name}
                  </MenuItem>
                ))}
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
          <div className="m-2">
            <Button onClick={handleSubmit} variant="outlined" color="primary">
              Submit
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
