import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Divider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Pagination from "../../components/pagination";
import AlertModal from "../../components/modals/Alert";
import ChannelModal from "../../components/modals/Channel";
import GetStarted from "../../components/feedback/GetStarted";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deletechannel,
  getchannels,
  disbalehost,
  editchannel,
  addchannels,
} from "../../apis/api";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
const { useConfig } = require("../../contexts/ConfigContext");

export default function PlaylistLibrary() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { playlists, departments, channels, setChannelsData } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  
  const [currChannel, setCurrChannel] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [open, setOpen] = useState(false);

  const handleCurrPage = (page) => setCurrentPage(page);
  const handleChannelOpen = () => setOpen(true);
  const handleChannelClose = () => {
    setOpen(false);
    setCurrChannel(null);
  };

  const fetchChannels = useCallback(async () => {
    try{

      setIsLoading(true);
      const data = await getchannels(`common/channels`, user.token);
      if (data.success) {
        setChannelsData(data.data);
      } else {
        
        addAlert({
          type: "warning",
          message: data.message || "Error fetching channels",
        });
      }
    } catch (error) {
      addAlert({
        type: "error",
        message: "Error fetching channels",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user.token]);

  const lockChannel = async (channel) => {
    try {
      const data = await disbalehost(
        "admin/channels",
        user.token,
        channel._id,
        { lock: !channel.lock }
      );
      if (data.success) fetchChannels();
      addAlert({
        type: data.success ? "success" : "warning",
        message: data.message,
      });
    } catch (error) {
      addAlert({ type: "error", message: "Error updating hosts" });
    }
  };

  const handleChannelDelete = async () => {
    setIsLoading(true);
    const data = await deletechannel(
      "common/channels/",
      user.token,
      currChannel._id
    );
    setIsLoading(false);
    setShowDelete(false);
    setCurrChannel(null);
    fetchChannels();
    addAlert({
      type: data.success ? "success" : "warning",
      message: data.message,
    });
  };
const HandleAddOrEditChannel = async (channelObj) => {
  try {
    setIsLoading(true);
    let edit = false;
    if ('id' in channelObj) { edit = true; }
    const response = edit ? await editchannel('common/channels/edit', user.token, channelObj) : await addchannels('common/channels/register', user.token, channelObj);

    if (response && typeof response === 'object') {
      addAlert({ type: response.success ? 'success' : 'warning', message: response.message });
      await fetchChannels(); 
    } else if (response && typeof response === 'string') {
      try {
        const data = JSON.parse(response);
        addAlert({ type: data.success ? 'success' : 'warning', message: data.message });
        await fetchChannels();
      } catch (jsonError) {
        addAlert({ type: 'error', message: 'Invalid response format. Could not parse JSON.' });
      }
    } else {
      addAlert({ type: 'error', message: 'Unexpected response format from the server.' });
    }
  } catch (error) {
    console.error('Error adding or editing channel:', error);
    addAlert({ type: 'error', message: 'Error adding or editing channel.' });
  }
  finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    const totpages = Math.ceil(channels?.length / 10 || 0);
    setTotalPages(totpages);
    setCurrentPage(1);
  }, [channels]);

  const disableinteraction = (item) => {
    if (user.role === "standard" && user._id !== item.createdBy) return true;
    if (
      user.role === "assetManager" &&
      user.department?._id !== item.department?._id
    )
      return true;
    if (item.lock) return true;
    return false;
  };

  if (channels.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={fetchChannels}
          >
            Refresh
          </Button>
          <ChannelModal
          open={open}
          user={user}
          HandleAddOrEditChannel={HandleAddOrEditChannel}
          handleChannelOpen={handleChannelOpen}
          handleChannelclose={handleChannelClose}
          departments={departments}
          playlists={playlists}
          currChannel={currChannel}
        />
        </div>
        <GetStarted
          Title="No Channels Yet? Get Started Now!"
          Description="Channels allow you to link devices with playlists..."
          callback={() => setOpen(true)}
        />
        
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Channel Library
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create Channel
          </Button>
          <Button
            variant="outlined"
            onClick={fetchChannels}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 font-semibold text-gray-700 border-b py-2 pr-6 px-4  m-2">
        <span>Name</span>
        <span>Created At</span>
        <span>Department</span>
        <span className="text-right pr-8">Actions</span>
      </div>
    {
            isLoading==true && <>
            {/* add a backdrip with loading spinner */}
              <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
                <CircularProgress />
              </div>
            </>
          }
      {/* Channel List */}
      <div className="flex-grow overflow-y-auto px-4">
        {channels.map((channel) => (
          <Accordion
            key={channel._id}
            className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionSummary sx={{padding:'0px 0px 0px 1rem'}} expandIcon={<ExpandMoreIcon />}>
              <div className="grid grid-cols-4 w-full">
                <span>{channel.name}</span>
                <span>
                  {channel.createdAt
                    ? new Date(channel.createdAt).toLocaleString()
                    : "-"}
                </span>
                <span>{channel.department?.name || "-"}</span>
                <div className="flex justify-end gap-2">
                  <Button
                    size="small"
                    sx={{ color: "var(--button-color-secondary)" }}
                    disabled={disableinteraction(channel)}
                    onClick={() => {
                      setCurrChannel(channel);
                      setOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "var(--button-color-secondary)" }}
                    disabled={disableinteraction(channel)}
                    onClick={() => {
                      setShowDelete(true);
                      setCurrChannel(channel);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
                <div className="col-span-2 border-b pb-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Channel Details
                  </h3>
                </div>

                <div>
                  <b>Name</b>
                </div>
                <div>{channel.name || "-"}</div>

                <div>
                  <b>Lock Channel</b>
                </div>
                <div>
                  <Switch
                    disabled={
                      !["admin", "assetManager", "globalAssetManager"].includes(
                        user.role
                      )
                    }
                    checked={channel.lock}
                    onChange={() => lockChannel(channel)}
                    sx={{
                      color: channel.lock ? "red" : "lightblue",
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#1976d2",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { backgroundColor: "#1976d2" },
                    }}
                  />
                </div>

                <div>
                  <b>Department</b>
                </div>
                <div>{channel.department?.name || "-"}</div>

                <div>
                  <b>Channel URL</b>
                </div>
                <div>
                  {channel.channelUrl ? (
                    <a
                      href={channel.channelUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {channel.channelUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>

                <div>
                  <b>Playlist URL</b>
                </div>
                <div>
                  {channel.playlistUrl ? (
                    <a
                      href={channel.playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {channel.playlistUrl}
                    </a>
                  ) : (
                    "Unassigned"
                  )}
                </div>

                {channel.stackedUrl && (
                  <>
                    <div>
                      <b>Stacked Playlist URL</b>
                    </div>
                    <div>
                      <a
                        href={channel.stackedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {channel.stackedUrl}
                      </a>
                    </div>
                  </>
                )}

                <div>
                  <b>Created By</b>
                </div>
                <div>
                  {channel.createdBy
                    ? `${channel.createdBy.firstName} ${channel.createdBy.lastName}`
                    : "-"}
                </div>

                <div>
                  <b>Created At</b>
                </div>
                <div>
                  {channel.createdAt
                    ? new Date(channel.createdAt).toLocaleString()
                    : "-"}
                </div>

                <div>
                  <b>Last Updated</b>
                </div>
                <div>
                  {channel.updatedAt
                    ? new Date(channel.updatedAt).toLocaleString()
                    : "-"}
                </div>

                <div className="col-span-2 border-t pt-2 mt-2">
                  <b>Description</b>
                  <p className="mt-1 text-gray-600 text-sm">
                    {channel.description || "-"}
                  </p>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Pagination at Bottom */}
      <div className="sticky bottom-0  mt-auto flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleCurrPage={handleCurrPage}
        />
      </div>

      {/* Modals */}
      <ChannelModal
        open={open}
        user={user}
        handleChannelOpen={handleChannelOpen}
        handleChannelclose={handleChannelClose}
        HandleAddOrEditChannel={HandleAddOrEditChannel}
        departments={departments}
        playlists={playlists}
        currChannel={currChannel}
      />
      <AlertModal
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setCurrChannel(null);
        }}
        handleMediaDelete={handleChannelDelete}
        title="Delete Channel"
        description="Confirm to delete this channel permanently"
      />
    </div>
  );
}
