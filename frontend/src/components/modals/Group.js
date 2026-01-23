import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import MultiSelect from "../multiSelect";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const useStyles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "400px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "hidden", // Prevent horizontal overflow
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },
  formControl: {
    width: "100%",
    "& .MuiInputBase-root": {
      width: "100%", // Ensure all input bases are full width
    },
  },
  select: {
    width: "100%",
  },
  multiSelect: {},
};

const { useAuth } = require("../../contexts/AuthContext");

export default function GroupModal({
  handleGroupOpen,
  open,
  handleGroupclose,
  departments,
  HandleAddOrEditGroup,
  currGroup,
  playlists,
  devices,
  channels,
}) {
  const { user } = useAuth();
  const initialFormData = {
    name: "",
    hosts: [],
    channels: [],
    departmentId: user.department?._id || "",
    playlistId: "",
    stackedPlaylistId: "",
    description: "",
  };
  const maxLengths = {
    description: 100,
    name: 50,
  };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (currGroup !== null) {
      setFormData({
        name: currGroup.name || "",
        departmentId: currGroup.department?._id || "",
        hosts: currGroup.hosts?.map((i) => i._id) || [],
        playlistId: currGroup.playlistId || "",
        stackedPlaylistId: currGroup.stackedPlaylistId || "",
        channels: currGroup.channels?.map((i) => i._id) || [],
        description: currGroup.description || "",
      });
    } else {
      setFormData({ ...initialFormData });
    }
  }, [currGroup, open]);

  const handleClose = () => {
    handleGroupclose();
    setFormData(initialFormData);
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

  const handleMselectChange = (name, value) => {
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = () => {
    if (currGroup !== null) {
      formData.id = currGroup._id;
    }
    HandleAddOrEditGroup(formData);
    handleClose();
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
          <Typography
            id="keep-mounted-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
            align="center"
          >
            {currGroup !== null ? "Edit Group" : "Add Group"}
          </Typography>
          <Box component="form" sx={useStyles.form}>
            <TextField
              id="name"
              value={formData.name}
              error={formData.name.length === maxLengths.name}
              onChange={handleInputChange}
              name="name"
              size="small"
              fullWidth
              label="Group Name"
              autoComplete="off"
              variant="outlined"
              sx={useStyles.formControl}
            />
            {departments.length > 0 &&
              ["admin", "globalAssetManager"].includes(user.role) && (
                <Box sx={useStyles.formControl}>
                  <InputLabel id="department-label">Department</InputLabel>
                  <Select
                    labelId="department-label"
                    id="department"
                    name="departmentId"
                    fullWidth
                    size="small"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    disabled={
                      !["admin", "globalAssetManager"].includes(user.role)
                    }
                    label="Department"
                    sx={useStyles.select}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: "40vh", // Limit dropdown height to 40% of viewport height
                          // width: 'calc(100% - 32px)', // Account for modal padding
                        },
                      },
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                    }}
                  >
                    {departments.map((dep) => (
                      <MenuItem value={dep._id} key={dep._id}>
                        {dep.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
            {devices.length > 0 && (
              // <Box sx={useStyles.formControl}>
              <MultiSelect
                data={devices}
                selectedItems={currGroup?.hosts}
                handleInputChange={handleMselectChange}
                name={"hosts"}
                open={open}
                size="small"
                fullWidth
                sx={useStyles.multiSelect}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP, // Limit dropdown height to 40% of viewport height
                      // width: '100%', // Account for modal padding
                    },
                  },
                }}
              />
              // </Box>
            )}
            {channels.length > 0 && (
              <Box sx={useStyles.formControl}>
                <MultiSelect
                  data={channels}
                  selectedItems={currGroup?.channels}
                  handleInputChange={handleMselectChange}
                  name={"channels"}
                  open={open}
                  fullWidth
                  sx={useStyles.multiSelect}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "40vh", // Limit dropdown height to 40% of viewport height
                        width: "calc(100% - 32px)", // Account for modal padding
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                />
              </Box>
            )}
            {playlists.length > 0 && (
              <Box sx={useStyles.formControl}>
                <InputLabel id="playlists">Playlist</InputLabel>
                <Select
                  labelId="playlists"
                  id="playlists"
                  name="playlistId"
                  fullWidth
                  size="small"
                  value={formData.playlistId}
                  onChange={handleInputChange}
                  label="Playlist"
                  displayEmpty // 🔑 this enables showing the default option
                  autoComplete="off"
                  // sx={useStyles.select}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Playlist</em>
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
              <Box sx={useStyles.formControl}>
                <InputLabel id="stackedPlaylistId">Stacked Playlist</InputLabel>
                <Select
                  id="stackedPlaylistId"
                  name="stackedPlaylistId"
                  fullWidth
                  size="small"
                  disabled={
                    !["admin", "globalAssetManager"].includes(user.role)
                  }
                  value={formData.stackedPlaylistId}
                  onChange={handleInputChange}
                  displayEmpty // 🔑 this enables showing the default option
                  autoComplete="off"
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
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
              sx={useStyles.formControl}
            />
            <Button
              onClick={handleSubmit}
              variant="outlined"
              fullWidth
              sx={useStyles.formControl}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
