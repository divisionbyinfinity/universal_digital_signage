import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import AlertModal from '../../components/modals/Alert';

import { getschedulers, deleteScheduler } from "../../apis/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Divider,
  Tooltip,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DeviceType } from "../../enums";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import GetStarted from "../../components/feedback/GetStarted";
import { useConfig } from "../../contexts/ConfigContext";

export default function Scheduler() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const [schedules, setSchedules] = useState([]);

  const [showDelete, setShowDelete] = useState(false);
  const [isLoading,setIsLoading]= useState(false)
  const [deleteId, setDeleteId] = useState(null);
  const handleScheduleEdit = (id) => {
    navigate("/Scheduler/edit/" + id);
  };
  const navigate = useNavigate();

  const fetchSchedulers = async () => {
    setIsLoading(true);
    try {
      const data = await getschedulers("common/schedules/", user.token);
      if (data.success) {
        setSchedules(data.data);
      }
      if (!data.success) {
        addAlert({ type: "warning", message: data.message || "Failed to fetch schedules" });
      }
    } catch (err) {
      addAlert({ type: "error", message: "Error fetching schedulers" });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSchedulerDelete = async () => {
    try {
      console.log("deleting", deleteId);
      const res = await deleteScheduler("common/schedules", user.token, deleteId);
      if (res) {
        addAlert({
          type: res.success ? "success" : "warning",
          message: res.message,
        });
        if (res.success) {
          fetchSchedulers();
        }
        setShowDelete(false);
        setDeleteId(null);
      }
    } catch {
      addAlert({ type: "error", message: "Error deleting scheduler" });
    }
  };
React.useEffect(() => {
    fetchSchedulers();
  }, []);
  if (isLoading) {
  return <CircularProgress />;
}
 if (!schedules || schedules.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Tooltip title="Refresh">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={fetchSchedulers}
          >
            Refresh
          </Button>
          </Tooltip>
        </div>
        <GetStarted
          Title="No Schedulers Yet? Set Up Your Content Schedule!"
          Description="Schedulers define when and how often your content is displayed across devices, channels, or groups. They automate the playback of playlists, ensuring your digital signage content runs according to your predefined schedule. It looks like you haven’t created any schedulers yet—start by setting one up to automate your content delivery effortlessly!"
          callback={() => {
            navigate("/scheduler/create");
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="relative h-full flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg shadow-sm">
        <Typography variant="h5" className="font-semibold text-gray-800">
          Schedules
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => navigate("/scheduler/create")}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create Schedule
          </Button>
          <Button
            variant="outlined"
            onClick={fetchSchedulers}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-6 font-semibold text-gray-700 border-b py-2 pr-6 px-4  m-2">
        <div>Schedule Name</div>
        <div>Frequency</div>
        <div>Time</div>
        <div>Created At</div>
        <div>Created By</div>
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
        {schedules.map((row) => (
          <Accordion
            key={row._id}
            className=" rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionSummary sx={{padding:'0px 0px 0px 1rem'}} expandIcon={<ExpandMoreIcon />}>
              <div className="grid grid-cols-6 w-full ">
                <div >{row.name}</div>
                <div>{row.frequency}</div>
                <div>{new Date(row?.startTime)
              .toISOString()
              .replace("T", " ")
              .slice(0, 16)} - {new Date(row?.endTime)
              .toISOString()
              .replace("T", " ")
              .slice(0, 16)}</div>

                <div>
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleString()
                    : "-"}
                </div>
                <div>{row.createdBy?.email || "-"}</div>
                <div className="flex gap-2 justify-end">
                  <Button
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => handleScheduleEdit(row._id)}
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => {setDeleteId(row._id);setShowDelete(true)}}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
                <div className="col-span-2 border-b pb-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Schedule Details
                  </h3>
                </div>

                <div>
                  <b>Schedule Name</b>
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
                    {row.device?  
                      <table className="w-full text-sm text-left">
                        <thead className="border-b font-medium">
                          <tr>
                            <th className="py-1">Host Name</th>
                            <th className="py-1">Host Type</th>
                            <th className="py-1">Host URL</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr
                              key={row.device._id}
                              className="border-b last:border-none"
                            >
                              <td className="py-1">{row.device.name}</td>
                              <td className="py-1">{DeviceType[row.device.type]}</td>
                              <td className="py-1 text-blue-600">
                                <a
                                  href={row.device.hostUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {row.device.hostUrl}
                                </a>
                              </td>
                            </tr>
                        </tbody>
                      </table>
                     : (
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
                    {row.channel ? (
                      <table className="w-full text-sm text-left">
                        <thead className="border-b font-medium">
                          <tr>
                            <th className="py-1">Channel Name</th>
                            <th className="py-1">Channel URL</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr
                              key={row.channel._id}
                              className="border-b last:border-none"
                            >
                              <td className="py-1">{row.channel.name}</td>
                              <td className="py-1 text-blue-600">
                                <a
                                  href={row.channel.channelUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="hover:underline"
                                >
                                  {row.channel.channelUrl}
                                </a>
                              </td>
                            </tr>
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

      <AlertModal open={showDelete} handleClose={()=>{setShowDelete(false)}} handleMediaDelete={handleSchedulerDelete} title='Delete Schedule' description='Confirm to delete this scheduler permanently' />

    </div>
  );
}

const DeviceTable = ({ device, open }) => {
  if (device === undefined) return null;
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            border: "none",
            paddingLeft: "15rem",
          }}
          colSpan={12}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="m-2">
              <Table size="small" aria-label="devices">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <h2>Host Name</h2>
                    </TableCell>
                    <TableCell align="left">
                      <h2>Host Type</h2>
                    </TableCell>
                    <TableCell align="left">
                      <h2>Host Url </h2>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={device?._id} style={{ border: "None" }}>
                    <TableCell component="th" scope="row">
                      <h4>{device?.name}</h4>
                    </TableCell>
                    <TableCell>
                      <h4>{DeviceType[device?.type]}</h4>
                    </TableCell>
                    <TableCell align="left">
                      <h4>{device?.hostUrl}</h4>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
const ChannelTable = ({ channel, open }) => {
  if (channel === undefined) return null;
  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: "15rem",
            border: "none",
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="m-2">
              <Table size="small" aria-label="channels">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <h2>Channel Name</h2>
                    </TableCell>
                    <TableCell align="left">
                      <h2>Channel Url </h2>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={channel?._id} style={{ border: "None" }}>
                    <TableCell component="th" scope="row">
                      <h4>{channel?.name}</h4>
                    </TableCell>
                    <TableCell align="left">
                      <h4>{channel?.channelUrl}</h4>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
const GroupTable = ({ group, open }) => {
  if (group === undefined) return null;
  return (
    <>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: "15rem",
            border: "none",
          }}
          colSpan={7}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Table size="small" aria-label="groups">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <h2>Group Name </h2>
                    </TableCell>
                    <TableCell align="left">
                      <h2>No Of Hosts </h2>
                    </TableCell>
                    <TableCell align="left">
                      <h2>No of Channels</h2>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={group?._id} style={{ border: "None" }}>
                    <TableCell component="th" scope="row">
                      <h4>{group?.name}</h4>
                    </TableCell>
                    <TableCell>
                      <h4>{group?.hosts?.length}</h4>
                    </TableCell>
                    <TableCell align="left">
                      <h4>{group?.channels?.length}</h4>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
