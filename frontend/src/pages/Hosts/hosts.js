import React, { useState, useEffect } from "react";
import HostModal from "../../components/modals/Host";
import {
  addhost,
  edithost,
  gethosts,
  deleteHost,
  disbalehost,
  bulkUploadHost,
} from "../../apis/api";
import { DeviceType } from "../../enums";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AlertModal from "../../components/modals/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../components/pagination";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";
import { getCurrentPage } from "../../helper/helper";
import GetStarted from "../../components/feedback/GetStarted";

export default function HostsPage() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, hosts, setHostsData, playlists } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currHost, setCurrHost] = useState(null);
  const [showHostModal, setShowHostModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const currentPageData = getCurrentPage(hosts, currentPage);

  const handleCurrPage = (page) => setCurrentPage(page);

  const handleHostOpen = () => setShowHostModal(true);
  const handleHostclose = () => {
    setShowHostModal(false);
    setCurrHost(null);
  };

  const lockHost = async (id) => {
    try {
      const hostToUpdate = hosts.find((h) => h._id === id);
      if (!hostToUpdate) return;

      const data = await disbalehost("admin/devices", user.token, id, {
        lock: !hostToUpdate.lock,
      });
      if (data.success) handleDevicesFetch();

      addAlert({
        type: data.success ? "success" : "warning",
        message: data.message,
      });
    } catch (error) {
      console.error("Error updating host lock:", error);
      addAlert({ type: "error", message: "Error updating host lock status" });
    }
  };

  const handleDevicesFetch = async () => {
    try {
      setIsLoading(true);
      const data = await gethosts("common/hosts/", user.token);
      if (data.success) {
        setHostsData(data.data);
      } else {
        addAlert({
          type: "warning",
          message: data.message || "Failed to fetch hosts",
        });
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error fetching hosts" });
    } finally {
      setIsLoading(false);  
    }
  };

  const HandleAddOrEditHost = async (bulkUploadFile, hostObj) => {
    try {
      setIsLoading(true);
      let data = null;

      if (bulkUploadFile) {
        const formData = new FormData();
        formData.append("file", bulkUploadFile);
        data = await bulkUploadHost(
          "common/hosts/register/bulk",
          user.token,
          formData
        );
      } else {
        const edit = "id" in hostObj;
        data = edit
          ? await edithost("common/hosts/edit", user.token, hostObj)
          : await addhost("common/hosts/register", user.token, hostObj);
      }
      if (data)
        addAlert({
          type: data.success ? "success" : "warning",
          message: data.message,
        });

      setCurrHost(null);
      await handleDevicesFetch();
    } catch (error) {
      console.error("Error adding/editing host:", error);
      addAlert({ type: "error", message: "Error adding/editing host" });
      setCurrHost(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pages = Math.ceil((hosts?.length || 0) / 10);
    setTotalPages(pages);
    setCurrentPage(1);
  }, [hosts]);

  const handleHostDelete = async () => {
    try {
      setShowDelete(false);
      const res = await deleteHost("common/hosts/", user.token, currHost._id);
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      handleDevicesFetch();
    } catch {
      addAlert({ type: "error", message: "Error deleting host" });
    } finally {
      setCurrHost(null);
    }
  };

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

  if (hosts.length === 0) {
    return (
      <div className="p-4 page-backdrop">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={handleDevicesFetch}
          >
            Refresh
          </Button>
          <HostModal
        open={showHostModal}
        handleHostOpen={handleHostOpen}
        handleHostclose={handleHostclose}
        departments={departments}
        playlists={playlists}
        currHost={currHost}
        HandleAddOrEditHost={HandleAddOrEditHost}
        user={user}
      />
        </div>
        <GetStarted
          Title="No Hosts Yet? Set Up Your Devices Now!"
          Description="Hosts are the physical devices that display your playlists across screens. Get started by adding your first host to connect and manage your displays efficiently."
          callback={handleHostOpen}
        />
      </div>
    );
  }

  return (
    <div className="enterprise-page-shell page-backdrop">
      {/* Header */}
      <div className="enterprise-page-header">
        <Typography variant="h5" className="font-semibold text-slate-900">
          Hosts Library
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => setShowHostModal(true)}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create Host
          </Button>
          <Button
            variant="outlined"
            onClick={handleDevicesFetch}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="enterprise-table-header grid-cols-5">
        <div>Name</div>
        <div>Type</div>
        <div>Screen Type</div>
        <div>Department</div>
        <div className="text-right pr-8">Edit</div>
      </div>

      {/* Accordion List */}
      {
        isLoading==true && <>
        {/* add a backdrip with loading spinner */}
          <div className="w-full h-full bg-white/45 backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10 rounded-2xl">
            <CircularProgress />
          </div>
        </>
      }
      <div className="enterprise-list-body px-2 sm:px-3">
        {currentPageData.map((host) => (
          <Accordion
            key={host._id}
            className="my-2 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionSummary  sx={{padding:'0px 0px 0px 1rem'}} expandIcon={<ExpandMoreIcon />}>
              <div className="grid grid-cols-5 w-full">
                <div >{host.name}</div>
                <div>{DeviceType[host.type]}</div>
                <div>{host.isTouchScreen ? "Touch Screen" : "No Touch"}</div>
                <div>{host.department?.name || "-"}</div>
                <div className="flex justify-end">
                  <Button
                    disabled={disableinteraction(host)}
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => {
                      setCurrHost(host);
                      setShowHostModal(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    disabled={disableinteraction(host)}
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => {
                      setCurrHost(host);
                      setShowDelete(true);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails className="bg-slate-50/90 rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-y-3 text-slate-700 text-sm">
                <div className="col-span-2 border-b border-slate-200 pb-2 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Host Details
                  </h3>
                </div>

                <div>
                  <b>Name</b>
                </div>
                <div>{host.name || "-"}</div>

                <div>
                  <b>Lock Host</b>
                </div>
                <div>
                  <Switch
                    disabled={
                      !["admin", "assetManager", "globalAssetManager"].includes(
                        user.role
                      )
                    }
                    checked={host.lock}
                    onChange={() => lockHost(host._id)}
                    sx={{
                      color: host.lock ? "red" : "lightblue",
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#1976d2",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        { backgroundColor: "#1976d2" },
                    }}
                  />
                </div>

                <div>
                  <b>Host Type</b>
                </div>
                <div>{DeviceType[host.type] || "-"}</div>

                <div>
                  <b>Department</b>
                </div>
                <div>{host.department?.name || "-"}</div>

                <div>
                  <b>Host URL</b>
                </div>
                <div>
                  {host.hostUrl ? (
                    <a
                      href={host.hostUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {host.hostUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </div>

                <div>
                  <b>Playlist URL</b>
                </div>
                <div>
                  {host.playlistUrl ? (
                    <a
                      href={host.playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {host.playlistUrl}
                    </a>
                  ) : (
                    "Unassigned"
                  )}
                </div>

                {host.stackedUrl && (
                  <>
                    <div>
                      <b>Stacked Playlist URL</b>
                    </div>
                    <div>
                      <a
                        href={host.stackedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {host.stackedUrl}
                      </a>
                    </div>
                  </>
                )}

                <div>
                  <b>Created By</b>
                </div>
                <div>
                  {host.createdBy
                    ? `${host.createdBy.firstName} ${host.createdBy.lastName}`
                    : "-"}
                </div>

                <div>
                  <b>Created At</b>
                </div>
                <div>
                  {host.createdAt
                    ? new Date(host.createdAt).toLocaleString()
                    : "-"}
                </div>

                <div>
                  <b>Last Updated</b>
                </div>
                <div>
                  {host.updatedAt
                    ? new Date(host.updatedAt).toLocaleString()
                    : "-"}
                </div>

                <div className="col-span-2 border-t pt-2 mt-2">
                  <b>Description</b>
                  <p className="mt-1 text-slate-600 text-sm">
                    {host.description || "-"}
                  </p>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Pagination pinned bottom */}
      {totalPages > 1 && (
        <div className="enterprise-pagination-bar">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={handleCurrPage}
            disabled={false}
          />
        </div>
      )}

      {/* Delete modal */}
      <AlertModal
        open={showDelete}
        handleClose={() => setShowDelete(false)}
        handleMediaDelete={handleHostDelete}
        title="Delete Host"
        description="Confirm to delete this host permanently"
      />
      <HostModal
        open={showHostModal}
        handleHostOpen={handleHostOpen}
        handleHostclose={handleHostclose}
        departments={departments}
        playlists={playlists}
        currHost={currHost}
        HandleAddOrEditHost={HandleAddOrEditHost}
        user={user}
      />
    </div>
  );
}
