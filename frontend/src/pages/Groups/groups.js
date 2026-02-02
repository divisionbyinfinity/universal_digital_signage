import React, { useState, useEffect } from "react";
import GroupModal from "../../components/modals/Group";

import {
  addgroup,
  editgroup,
  getplaylists,
  getdepartments,
  gethosts,
  deletegroup,
  getgroups,
} from "../../apis/api";
import AlertModal from "../../components/modals/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Pagination from "../../components/pagination";

import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DeviceType } from "../../enums";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import GetStarted from "../../components/feedback/GetStarted";
Row.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdBy: PropTypes.object.isRequired,
    hosts: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        hostUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
    channels: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        channelUrl: PropTypes.string.isRequired,
      })
    ).isRequired,
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
export default function Groups() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currGroup, setCurrGroup] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const handleGroupOpen = () => {
    setShowGroupModal(true);
  };
  const handleGroupclose = () => {
    setShowGroupModal(false);
    setCurrGroup(null);
  };
  const [playlists, setPlaylists] = useState([]);
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [channels, setChannels] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const handleCurrPage = (page) => {
    setCurrentPage(page);
  };
  const handleCurgroupSelect = (data) => {
    setShowGroupModal(true);
    setCurrGroup(data);
  };
  const getDepartments = async () => {
    try {
      setIsLoading(true);
      const data = await getdepartments("common/departments/", user.token);
      if (data.data) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const getPlaylists = async () => {
    try {
      setIsLoading(true);
      const data = await getplaylists("common/playlists/", user.token);
      if (data.data) {
        setPlaylists(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupsFetch = async () => {
    try {
      setIsLoading(true);
      const data = await getgroups("common/groups/", user.token);
      //console log data
      if (!data.success) {
        addAlert({
          type: "warning",
          message: data.message || "failed to fetch groups",
        });
      }
      if (data.data) {
        setGroups(data.data);
        const totpages = data.totalPages ? data.totalPages : 0; // Replace with the actual total pages from the API response
        const currPage = data.currentPage ? data.currentPage : 1; // Replace with the current page from your state or props
        setCurrentPage(currPage);
        setTotalPages(totpages);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error fetching hosts" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDevicesFetch = async () => {
    try {
      setIsLoading(true);
      const data = await gethosts("common/hosts/", user.token);
      if (data.data) {
        setDevices(data.data);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error fetching hosts" });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChannelsFetch = async () => {
    try {
      setIsLoading(true);
      const data = await gethosts("common/channels/", user.token);
      if (data.data) {
        setChannels(data.data);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error fetching channels" });
    } finally {
      setIsLoading(false);
    }
  };

  const HandleAddOrEditGroup = async (groupObj) => {
    console.log(groupObj);
    try {
      setIsLoading(true);
      let edit = false;
      let msg = "Creating the group...";
      if ("id" in groupObj) {
        msg = "Updating the group ...";
        edit = true;
      }
      addAlert({ type: "info", message: msg });
      const data = edit
        ? await editgroup(
            `common/groups/edit/${groupObj.id}`,
            user.token,
            groupObj
          )
        : await addgroup("common/groups/create", user.token, groupObj);
      if (data) {
        addAlert({
          type: data.success ? "success" : "warning",
          message: data.message,
        });
      }
      await handleGroupsFetch();
    } catch (error) {
      console.error("Error adding group:", error);
      addAlert({ type: "error", message: "Error adding group" });
    } finally {
      setIsLoading(false);
    }
  };
  const initialFetch = async () => {
    try {
      handleDevicesFetch();
      handleChannelsFetch();
      getDepartments();
      getPlaylists();
      handleGroupsFetch();
    } catch (error) {
      console.error("Error fetching data:", error);
      addAlert({ type: "error", message: "Error fetching data" });
    }
  };

  useEffect(() => {
    initialFetch();
  }, []);
  const handleGroupDelete = async () => {
    setShowDelete(false);
    const res = await deletegroup("common/groups", user.token, currGroup._id);
    if (res) {
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      setCurrGroup(null);
      if (res.success) {
        handleGroupsFetch();
      }
    }
  };
  const showDeleteModal = (group) => {
    setShowDelete(true);
    setCurrGroup(group);
  };
  useEffect(() => {
    handleDevicesFetch();
  }, [currentPage]);
  if (groups.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={handleGroupsFetch}
          >
            Refresh
          </Button>
          <GroupModal
            handleGroupOpen={handleGroupOpen}
            open={showGroupModal}
            handleGroupclose={handleGroupclose}
            departments={departments}
            HandleAddOrEditGroup={HandleAddOrEditGroup}
            currGroup={currGroup}
            playlists={playlists}
            devices={devices}
            channels={channels}
          />
        </div>

        <GetStarted
          Title="No Groups Yet? Organize Your Hosts and Channels!"
          Description="Groups allow you to combine hosts, channels, or both for streamlined management and content distribution across multiple devices. Whether you're organizing digital signs, kiosks, or playlists, groups make it easier to control everything from one place. It looks like you haven’t created any groups yet—get started by setting up your first group to simplify your content management!"
          callback={handleGroupOpen}
        />
        {/* Loading State */}
      {isLoading && (
        <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
          <CircularProgress />
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Groups Library
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => setShowGroupModal(true)}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create Group
          </Button>
          <Button
            variant="outlined"
            onClick={handleGroupsFetch}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 font-semibold  text-gray-700 border-b py-2 pr-6 px-4  m-2">
        <div>Group Name</div>
        <div>Created At</div>
        <div>Created By</div>
        <div>Department</div>
        <div className="text-right pr-8">Action</div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
          <CircularProgress />
        </div>
      )}

      {/* Accordion-style Group List */}
      <div className="flex-grow overflow-y-auto px-4">
        {groups.map((row) => (
          <Accordion
            key={row._id}
            className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionSummary  sx={{padding:'0px 0px 0px 1rem'}} expandIcon={<ExpandMoreIcon />}>
              <div className="grid grid-cols-5 w-full items-center">
                <div>{row.name}</div>
                <div>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </div>
                <div>{row.createdBy?.email || "-"}</div>
                <div>{row.department?.name || "-"}</div>
                <div className="flex justify-end gap-2">
                  <Button
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => handleCurgroupSelect(row)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => showDeleteModal(row)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails  className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
                <div className="col-span-2 border-b pb-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Group Details
                  </h3>
                </div>

                <div>
                  <b>Group Name</b>
                </div>
                <div>{row.name || "-"}</div>

                <div>
                  <b>Created By</b>
                </div>
                <div>{row.createdBy?.email || "-"}</div>

                <div>
                  <b>Created At</b>
                </div>
                <div>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </div>

                <div>
                  <b>Department</b>
                </div>
                <div>{row.department?.name || "-"}</div>

                <div className="col-span-2 border-t pt-2 mt-2">
                  <b>Description</b>
                  <p className="mt-1 text-gray-600 text-sm">
                    {row.description || "-"}
                  </p>
                </div>

                {/* Devices */}
                <div className="col-span-2 border-t pt-2 mt-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-1">
                    Device Details
                  </h4>
                  <div className="bg-white rounded-lg shadow-inner p-2">
                    {row.hosts?.length ? (
                      <table className="w-full text-sm text-left">
                        <thead className="border-b font-medium">
                          <tr>
                            <th className="py-1">Host Name</th>
                            <th className="py-1">Host Type</th>
                            <th className="py-1">Host URL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.hosts.map((host) => (
                            <tr
                              key={host._id}
                              className="border-b last:border-none"
                            >
                              <td className="py-1">{host.name}</td>
                              <td className="py-1">{DeviceType[host.type]}</td>
                              <td className="py-1 text-blue-600">
                                <a
                                  href={host.hostUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {host.hostUrl}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No devices assigned.
                      </p>
                    )}
                  </div>
                </div>

                {/* Channels */}
                <div className="col-span-2 border-t pt-2 mt-2">
                  <h4 className="text-md font-semibold text-gray-800 mb-1">
                    Channel Details
                  </h4>
                  <div className="bg-white rounded-lg shadow-inner p-2">
                    {row.channels?.length ? (
                      <table className="w-full text-sm text-left">
                        <thead className="border-b font-medium">
                          <tr>
                            <th className="py-1">Channel Name</th>
                            <th className="py-1">Channel URL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.channels.map((ch) => (
                            <tr
                              key={ch._id}
                              className="border-b last:border-none"
                            >
                              <td className="py-1">{ch.name}</td>
                              <td className="py-1 text-blue-600">
                                <a
                                  href={ch.channelUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {ch.channelUrl}
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No channels assigned.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Pagination pinned bottom */}
      <div className="sticky bottom-0  border-t border-gray-200 flex justify-center">
        <Pagination
          totalPages={totalPages === 0 || totalPages === 1 ? 1 : totalPages}
          currentPage={currentPage}
          handleCurrPage={handleCurrPage}
        />
      </div>

      {/* Delete Modal */}
      <AlertModal
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setCurrGroup(null);
        }}
        handleMediaDelete={handleGroupDelete}
        title="Delete Group"
        description="Confirm to delete this group permanently"
      />

      {/* Group Modal */}
      <GroupModal
        handleGroupOpen={handleGroupOpen}
        open={showGroupModal}
        handleGroupclose={handleGroupclose}
        departments={departments}
        HandleAddOrEditGroup={HandleAddOrEditGroup}
        currGroup={currGroup}
        playlists={playlists}
        devices={devices}
        channels={channels}
      />
    </div>
  );
}

function Row(props) {
  const { row, showDeleteModal, handleCurgroupSelect } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <h3>{row?.name}</h3>
        </TableCell>
        <TableCell align="left">
          <h3>
            {row?.createdAt ? new Date(row?.createdAt).toLocaleString() : "-"}
          </h3>
        </TableCell>
        <TableCell align="left">
          <h3>{row?.createdBy?.email}</h3>
        </TableCell>
        <TableCell align="left">
          <h3>{row?.department?.name}</h3>
        </TableCell>
        <TableCell align="left">
          <EditIcon
            onClick={() => {
              handleCurgroupSelect(row);
            }}
          />
        </TableCell>
        <TableCell align="left">
          <DeleteIcon
            style={{ cursor: "pointer" }}
            onClick={() => showDeleteModal(row)}
          />
        </TableCell>
      </TableRow>
      <TableRow style={{ paddingLeft: 10 }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ margin: 2, paddingLeft: 14 }}
          >
            <Box sx={{ marginX: 1, display: "flex" }}>
              <h2>Scheduler Description:</h2>
              <div className="mt-1 pl-2">{row?.description}</div>
            </Box>
            <Box sx={{ margin: 1 }}>
              <h2>Device Details</h2>
              <Table size="small" aria-label="purchases" sx={{}}>
                <TableHead>
                  <TableRow>
                    <TableCell>Host Name</TableCell>
                    <TableCell>Host Type</TableCell>
                    <TableCell align="left">Host Url</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.hosts?.map((host) => {
                    return (
                      <TableRow key={host?._id}>
                        <TableCell component="th" scope="row">
                          {host?.name}
                        </TableCell>
                        <TableCell>{DeviceType[host?.type]}</TableCell>
                        <TableCell align="left" className="cursor-pointer">
                          {
                            <a href={host?.hostUrl} target="_blank">
                              {host?.hostUrl}
                            </a>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <h2>Channels Details</h2>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Channel Name</TableCell>
                    <TableCell align="left">Channel Url</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.channels?.map((channel) => {
                    return (
                      <TableRow key={channel?._id}>
                        <TableCell component="th" scope="row">
                          {channel?.name}
                        </TableCell>
                        <TableCell align="left" className="cursor-pointer">
                          {
                            <a href={channel?.channelUrl} target="_blank">
                              {channel?.channelUrl}
                            </a>
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              {/* <p>
                               
               <div className='rounded w-1/5 text-gray-700 bold text-md gap-6'>
               Lock Group     
                  <Switch  
                  // disabled={!["admin","assetManager"].includes(user.role)}
                  //  checked={channel.lock}  
                  //  onChange={()=>{lockChannel(channel)}} 
                          //  style={{color:group.lock?'red':'lightblue'}}
                           />
                  </div>
              </p> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
