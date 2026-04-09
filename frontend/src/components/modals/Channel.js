import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import { useEffect } from "react";
import EnterpriseModal from "./EnterpriseModal";

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
      <EnterpriseModal
        open={open}
        onClose={handleClose}
        title={currChannel !== null ? "Edit Channel" : "Add Channel"}
        maxWidth="sm"
        actions={
          <>
            <Button color="primary" onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
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
          {departments.length > 0 &&
            ["admin", "globalAssetManager"].includes(user.role) && (
              <FormControl size="small" fullWidth>
                <InputLabel id="channel-department-label">Department</InputLabel>
                <Select
                  labelId="channel-department-label"
                  id="channel-department"
                  name="departmentId"
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
              <InputLabel id="channel-playlists-label">Playlist</InputLabel>
              <Select
                labelId="channel-playlists-label"
                id="channel-playlists"
                name="playlistId"
                value={formData.playlistId || ""} // default to empty string
                onChange={handleInputChange}
                label="Playlist"
                autoComplete="off"
              >
                <MenuItem value="">None</MenuItem>
                {playlists.map((playlist) => (
                  <MenuItem value={playlist._id} key={playlist._id}>
                    {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {playlists.length > 0 && (
            <FormControl size="small" fullWidth>
              <InputLabel id="channel-stacked-playlists-label">Stacked Playlist</InputLabel>
              <Select
                labelId="channel-stacked-playlists-label"
                id="channel-stacked-playlists"
                name="stackedPlaylistId"
                disabled={
                  !["admin", "globalAssetManager"].includes(user.role) &&
                  !(
                    user.department._id == currChannel?.department?._id &&
                    user.role == "assetManager"
                  )
                }
                value={formData.stackedPlaylistId} // <-- fallback to empty string
                onChange={handleInputChange}
                label="Stacked Playlist"
                autoComplete="off"
              >
                <MenuItem value="">None</MenuItem>
                {playlists.map((playlist) => (
                  <MenuItem value={playlist._id} key={playlist._id}>
                    {playlist.name}
                  </MenuItem>
                ))}
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
        </Box>
      </EnterpriseModal>
    </div>
  );
}
