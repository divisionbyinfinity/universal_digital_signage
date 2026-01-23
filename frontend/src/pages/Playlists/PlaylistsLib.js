import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Divider,
  Typography,
} from "@mui/material";
import Pagination from "../../components/pagination";
import AlertModal from "../../components/modals/Alert";
import { disablePlaylist } from "../../apis/api";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Loading from "../../components/Loading";
import { deletePlaylist, getplaylists, getplaylistbyid } from "../../apis/api";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { PlaylistType } from "../../enums";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { getCurrentPage, customSort } from "../../helper/helper";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import GetStarted from "../../components/feedback/GetStarted";
import RefreshIcon from "@mui/icons-material/Refresh";
import CustomSelect from "../../components/forms/CustomSelect";
import { useAlert } from "../../contexts/AlertContext";

export default function PlaylistLibrary() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { playlists, setPlaylistsData, departments } = useConfig();
  const [filter, setFilter] = useState({
    department: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currPlaylist, setCurrPlaylist] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const filterData = useCallback(() => {
    let data = playlists;
    if (filter.department !== "all") {
      data = data.filter((item) => item.department?._id === filter.department);
    }
    return data;
  }, [filter, playlists]);
  const currentPageData = getCurrentPage(filterData(), currentPage);

  useEffect(() => {
    setCurrentPage(1);
    if (filterData().length < 10 && filterData().length > 0) {
      setTotalPages(1);
    } else {
      let totPages =
        parseInt(filterData().length / 10) +
        (parseInt(filterData().length % 10) ? 1 : 0);
      setTotalPages(totPages);
    }
  }, [filterData]);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const data = await getplaylists("common/playlists", user.token);
      if (data.success) {
        setPlaylistsData(data.data);
      }
    } catch (error) {
      addAlert({ type: "error", message: "Error fetching playlists" });
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleCurrPage = (page) => {
    setCurrentPage(page);
  };
  const handlePlaylistEdit = async (id, type) => {
    if (type == 3) {
      navigate(`/playlist/kiosk/edit/${id}`);
    } else {
      navigate(`/playlist/edit/${id}`);
    }
  };
  const handleSlideEdit = async (id, type) => {
    if (type !== 3) {
      navigate(`/playlist/accordian/${id}`);
    }
  };
  const handlePlaylistClone = async (id, type) => {
    if (type == 3) {
      navigate(`/playlist/kiosk/clone/${id}`);
    } else {
      navigate(`/playlist/clone/${id}`);
    }
  };
  const lockPlaylist = async (playlist) => {
    try {
      setIsLoading(true);
      const data = await disablePlaylist(
        "admin/playlists",
        user.token,
        playlist._id,
        { lock: !playlist.lock }
      );
      if (data.success) {
        fetchPlaylists();
      }
      addAlert({
        type: data?.success ? "success" : "warning",
        message: data?.message,
      });
    } catch (error) {
      addAlert({ type: "error", message: "Error updating playlist" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistDelete = async () => {
    try {
      setShowDelete(false);
      setIsLoading(true);
      const res = await deletePlaylist(
        "common/playlists/",
        user.token,
        currPlaylist
      );
      if (res) {
        addAlert({
          type: res.success ? "success" : "warning",
          message: res.message,
        });
        if (res.success) {
          fetchPlaylists();
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  if (playlists.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Tooltip title="Refresh">
            <Button
              variant="outlined"
              sx={{ color: "var(--button-color-secondary)" }}
              className="flex start"
              onClick={fetchPlaylists}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
        <GetStarted
          Title="No Playlists Yet? Create Your First Playlist!"
          Description="Playlists are the core of your digital signage solution, connecting hosts and channels to deliver content across all devices. Whether you're managing displays, kiosks, or digital signs, playlists ensure your content is shown on demand. It looks like you don’t have any playlists yet—start creating one to bring your digital signage to life!"
          callback={() => {
            navigate("/playlist/create/standard");
          }}
        />
      </div>
    );
  }

  const disableinteraction = (playlist) => {
    if (user.role === "standard" && user._id !== playlist.createdBy)
      return true;
    if (
      user.role === "assetManager" &&
      user.department?._id !== playlist.department?._id
    )
      return true;
    if (playlist.lock) return true;
    return false;
  };

  return (
    <div className="relative h-full flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Playlists Library
        </Typography>
        <div className="flex gap-2">
          <CustomSelect
            inputName="department"
            labelText="Departments"
            selectedValue={filter.department}
            items={[{ name: "All Departments", _id: "all" }, ...departments]}
            onChange={(e) =>
              setFilter({ ...filter, department: e.target.value })
            }
          />
          <Tooltip title="Refresh">
            <Button
              variant="outlined"
              onClick={fetchPlaylists}
              sx={{ color: "var(--button-color-secondary)" }}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 font-semibold text-gray-700 border-b py-2 pr-6 px-4  m-2">
        <div>Name</div>
        <div>Department</div>
        <div>Created At</div>
        <div className="col-span-2 text-right pr-8">Actions</div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
          <CircularProgress />
        </div>
      )}

      {/* Accordion List */}
      <div className="flex-grow overflow-y-auto px-4">
        {currentPageData.length > 0 ? (
          currentPageData.map((playlist) => (
            <Accordion
              key={playlist._id}
              className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <AccordionSummary sx={{padding:'0px 0px 0px 1rem'}} expandIcon={<ExpandMoreIcon />}>
                <div className="grid grid-cols-5 w-full">
                  <div>{playlist?.name}</div>
                  <div>{playlist?.department?.name || "-"}</div>
                  <div>
                    {playlist.createdAt
                      ? new Date(playlist.createdAt).toLocaleString()
                      : "-"}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Tooltip title="Edit">
                      <Button
                        disabled={disableinteraction(playlist)}
                        sx={{ color: "var(--button-color-secondary)" }}
                        onClick={() => {
                          if (!playlist.lock)
                            handlePlaylistEdit(playlist._id, playlist.type);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <Button
                        disabled={disableinteraction(playlist)}
                        sx={{ color: "var(--button-color-secondary)" }}
                        onClick={() => {
                          if (!playlist.lock) {
                            setCurrPlaylist(playlist._id);
                            setShowDelete(true);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>

                    {playlist.type !== 3 && (
                      <Tooltip title="Clone">
                        <Button
                          disabled={disableinteraction(playlist)}
                          sx={{ color: "var(--button-color-secondary)" }}
                          onClick={() => {
                            if (!playlist.lock)
                              handlePlaylistClone(playlist._id, playlist.type);
                          }}
                        >
                          <FileCopyIcon />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </AccordionSummary>

              <AccordionDetails className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
                  <div className="col-span-2 border-b pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Playlist Details
                    </h3>
                  </div>

                  <div>
                    <b>Name</b>
                  </div>
                  <div>{playlist.name || "-"}</div>

                  <div>
                    <b>Lock Playlist</b>
                  </div>
                  <div>
                    <Switch
                      disabled={
                        ![
                          "admin",
                          "assetManager",
                          "globalAssetManager",
                        ].includes(user.role)
                      }
                      checked={playlist.lock}
                      onChange={() => lockPlaylist(playlist)}
                      sx={{
                        color: playlist.lock ? "red" : "lightblue",
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#1976d2",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#1976d2",
                          },
                      }}
                    />
                  </div>

                  <div>
                    <b>Playlist Type</b>
                  </div>
                  <div>{PlaylistType[playlist.type] || "-"}</div>

                  <div>
                    <b>Department</b>
                  </div>
                  <div>{playlist.department?.name || "-"}</div>

                  <div>
                    <b>Playlist URL</b>
                  </div>
                  <div>
                    {playlist.playlistUrl ? (
                      <a
                        href={playlist.playlistUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {playlist.playlistUrl}
                      </a>
                    ) : (
                      "-"
                    )}
                  </div>

                  <div>
                    <b>Created At</b>
                  </div>
                  <div>
                    {playlist.createdAt
                      ? new Date(playlist.createdAt).toLocaleString()
                      : "-"}
                  </div>

                  <div>
                    <b>Last Updated</b>
                  </div>
                  <div>
                    {playlist.updatedAt
                      ? new Date(playlist.updatedAt).toLocaleString()
                      : "-"}
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Typography className="text-center text-gray-500 mt-8">
            No playlists found
          </Typography>
        )}
      </div>

      {/* Pagination pinned bottom */}
      <div className="sticky bottom-0  mt-auto flex justify-center">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleCurrPage={handleCurrPage}
          disabled={false}
        />
      </div>

      {/* Delete Modal */}
      <AlertModal
        open={showDelete}
        handleClose={() => setShowDelete(false)}
        handleMediaDelete={handlePlaylistDelete}
        title="Delete Playlist"
        description="Confirm to delete this playlist permanently"
      />
    </div>
  );
}
