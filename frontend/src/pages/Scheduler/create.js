import { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SensorsIcon from "@mui/icons-material/Sensors";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { useNavigate } from "react-router-dom";
import {
  getdepartments,
  getplaylists,
  gethosts,
  createschedule,
  getchannels,
  getgroups,
  getMinschedulers,
} from "../../apis/api";
import CustomTimeline from "../../components/Timeline";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

const targetOptions = [
  {
    value: "hostId",
    label: "Host",
    description: "Send a schedule to one physical display host.",
    icon: <SensorsIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: "channelId",
    label: "Channel",
    description: "Apply playback timing to one published channel.",
    icon: <ViewTimelineIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: "groupId",
    label: "Group",
    description: "Schedule one playlist across a whole device group.",
    icon: <ApartmentIcon sx={{ fontSize: 18 }} />,
  },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
};

const formatDateTimeLocal = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const CreateSchedule = () => {
  const { user } = useAuth();
  const addAlert = useAlert();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [targetType, setTartgetType] = useState("hostId");
  const [timeLineSchedules, setTimeLineSchedules] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      frequency: "daily",
      startTime: "",
      endTime: "",
      hostId: "",
      channelId: "",
      groupId: "",
      playlistId: "",
      departmentId: user?.department?._id || "",
      description: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.name?.trim()) errors.name = "Schedule name is required";
      if (!values.departmentId) errors.departmentId = "Department is required";
      if (!values.playlistId) errors.playlistId = "Playlist is required";
      if (!values.startTime) errors.startTime = "Start time is required";
      if (!values.endTime) errors.endTime = "End time is required";

      if (values.startTime && values.endTime) {
        const start = new Date(values.startTime);
        const end = new Date(values.endTime);
        if (end <= start) {
          errors.endTime = "End time must be after start time";
        }
      }

      if (targetType === "hostId" && !values.hostId) {
        errors.hostId = "Host is required";
      }
      if (targetType === "channelId" && !values.channelId) {
        errors.channelId = "Channel is required";
      }
      if (targetType === "groupId" && !values.groupId) {
        errors.groupId = "Group is required";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        addAlert({ type: "warning", message: "Creating the schedule..." });

        const payload = {
          ...values,
          hostId: targetType === "hostId" ? values.hostId : "",
          channelId: targetType === "channelId" ? values.channelId : "",
          groupId: targetType === "groupId" ? values.groupId : "",
        };

        const res = await createschedule(
          "common/schedules/create",
          payload,
          user.token
        );

        if (res) {
          addAlert({
            type: res.success ? "success" : "warning",
            message: res.message,
          });

          if (res.success) {
            navigate("/scheduler/viewandedit");
          }
        }
      } catch (error) {
        console.error("Error creating schedule:", error);
        addAlert({ type: "error", message: "Error creating schedule" });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const activeTargetOption = targetOptions.find((option) => option.value === targetType);

  const activeTargetValue = formik.values[targetType];

  const handleFetchMinschdules = async (device) => {
    try {
      const query = `?${targetType}=${device}`;
      const data = await getMinschedulers(query, user.token);
      setTimeLineSchedules(data.data || []);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setTimeLineSchedules([]);
    }
  };

  const getDepartments = useCallback(async () => {
    try {
      const data = await getdepartments("common/departments/", user.token);
      if (data.data) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [user.token]);

  const getGroups = useCallback(async () => {
    try {
      const data = await getgroups("common/groups/", user.token);
      if (data.data) {
        setGroups(data.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  }, [user.token]);

  const getPlaylists = useCallback(async () => {
    try {
      const data = await getplaylists("common/playlists/", user.token);
      if (data.data) {
        setPlaylists(data.data);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }, [user.token]);

  const getHosts = useCallback(async () => {
    try {
      const data = await gethosts("common/hosts/", user.token);
      if (data.data) {
        setHosts(data.data);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
    }
  }, [user.token]);

  const getChannels = useCallback(async () => {
    try {
      const data = await getchannels("common/channels/", user.token);
      if (data.data) {
        setChannels(data.data);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  }, [user.token]);

  useEffect(() => {
    if (activeTargetValue) {
      handleFetchMinschdules(activeTargetValue);
    } else {
      setTimeLineSchedules([]);
    }
  }, [formik.values.hostId, formik.values.channelId, formik.values.groupId, targetType]);

  useEffect(() => {
    if (formik.values.departmentId) return;

    const userDepartmentId = user?.department?._id;
    if (userDepartmentId && departments.some((dep) => dep._id === userDepartmentId)) {
      formik.setFieldValue("departmentId", userDepartmentId, false);
      return;
    }

    if (departments.length > 0) {
      formik.setFieldValue("departmentId", departments[0]._id, false);
    }
  }, [departments, user?.department?._id]);

  useEffect(() => {
    getDepartments();
    getPlaylists();
    getHosts();
    getChannels();
    getGroups();
  }, []);

  const currentTargetList =
    targetType === "hostId" ? hosts : targetType === "channelId" ? channels : groups;

  const selectedTarget = currentTargetList.find((item) => item._id === activeTargetValue);
  const selectedPlaylist = playlists.find((playlist) => playlist._id === formik.values.playlistId);

  return (
    <div className="enterprise-page-shell page-backdrop">
      <div className="enterprise-list-body">
        <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_24rem]">
            <div className="enterprise-surface-strong overflow-hidden">
              <div className="border-b border-slate-200/80 px-6 py-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl space-y-4">
                    <span className="status-badge">Schedule creation</span>
                    <h1 className="text-4xl font-semibold text-slate-950 md:text-5xl">
                      Build a polished playback window before you publish it.
                    </h1>
                    <p className="max-w-2xl text-base text-slate-600">
                      Choose the playlist, timing window, and target surface in one cleaner workflow with live context for existing schedule usage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[32rem]">
                    <div className="metric-card">
                      <div className="metric-value">{playlists.length}</div>
                      <div className="metric-label">Available playlists</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{hosts.length + channels.length + groups.length}</div>
                      <div className="metric-label">Targets available</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-value">{timeLineSchedules.length}</div>
                      <div className="metric-label">Existing schedule markers</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <form onSubmit={formik.handleSubmit} className="space-y-8">
                  <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Basic details
                        </div>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                          Name the schedule and choose the content source.
                        </h2>
                      </div>
                      <Chip
                        icon={<PlaylistPlayIcon />}
                        label={selectedPlaylist?.name || "No playlist selected"}
                        sx={{
                          maxWidth: "100%",
                          backgroundColor: "rgba(37,99,235,0.10)",
                          color: "#1d4ed8",
                          fontWeight: 700,
                          "& .MuiChip-icon": { color: "#1d4ed8" },
                        }}
                      />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <TextField
                        label="Schedule Name"
                        fullWidth
                        name="name"
                        value={formik.values.name}
                        onChange={(e) => formik.setFieldValue("name", e.target.value.slice(0, 20))}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.name && formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={fieldSx}
                      />

                      <FormControl
                        fullWidth
                        error={Boolean(formik.touched.departmentId && formik.errors.departmentId)}
                        sx={fieldSx}
                      >
                        <InputLabel id="department-label">Department</InputLabel>
                        <Select
                          labelId="department-label"
                          name="departmentId"
                          value={formik.values.departmentId}
                          label="Department"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {departments.map((dep) => (
                            <MenuItem value={dep._id} key={dep._id}>
                              {dep.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl
                        fullWidth
                        error={Boolean(formik.touched.playlistId && formik.errors.playlistId)}
                        sx={fieldSx}
                      >
                        <InputLabel id="playlist-label">Playlist</InputLabel>
                        <Select
                          labelId="playlist-label"
                          name="playlistId"
                          value={formik.values.playlistId}
                          label="Playlist"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {playlists.map((playlist) => (
                            <MenuItem value={playlist._id} key={playlist._id}>
                              {playlist.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Description"
                        fullWidth
                        name="description"
                        multiline
                        minRows={4}
                        value={formik.values.description}
                        error={Boolean(formik.touched.description && formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                        onChange={(e) =>
                          formik.setFieldValue("description", e.target.value.slice(0, 100))
                        }
                        onBlur={formik.handleBlur}
                        sx={{ ...fieldSx, gridColumn: "1 / -1" }}
                      />
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
                    <div className="mb-5">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Target surface
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                        Decide where this schedule should run.
                      </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      {targetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setTartgetType(option.value);
                            formik.setFieldValue("hostId", "", false);
                            formik.setFieldValue("channelId", "", false);
                            formik.setFieldValue("groupId", "", false);
                            setTimeLineSchedules([]);
                          }}
                          className={`rounded-[24px] border p-4 text-left transition ${
                            targetType === option.value
                              ? "border-blue-500 bg-blue-50 shadow-[0_16px_40px_rgba(37,99,235,0.14)]"
                              : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${
                                targetType === option.value
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-900 text-white"
                              }`}
                            >
                              {option.icon}
                            </span>
                            {option.label}
                          </div>
                          <p className="mt-3 mb-0 text-sm leading-6 text-slate-600">
                            {option.description}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <FormControl
                        fullWidth
                        error={Boolean(formik.touched[targetType] && formik.errors[targetType])}
                        sx={fieldSx}
                      >
                        <InputLabel id="target-value-label">{activeTargetOption?.label}</InputLabel>
                        <Select
                          labelId="target-value-label"
                          name={targetType}
                          value={activeTargetValue}
                          label={activeTargetOption?.label}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        >
                          {currentTargetList.map((item) => (
                            <MenuItem value={item._id} key={item._id}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/85 p-4">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Selected target
                        </div>
                        <div className="mt-2 text-lg font-semibold text-slate-950">
                          {selectedTarget?.name || `Choose a ${activeTargetOption?.label?.toLowerCase()}`}
                        </div>
                        <p className="mt-2 mb-0 text-sm text-slate-600">
                          Existing schedules for this selection will appear in the side panel so you can avoid conflicts before submitting.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(248,250,252,0.96),rgba(239,246,255,0.9))] p-5 sm:p-6">
                    <div className="mb-5">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Playback window
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                        Set when the playlist should start and stop.
                      </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <TextField
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        name="startTime"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.startTime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.startTime && formik.errors.startTime)}
                        helperText={formik.touched.startTime && formik.errors.startTime}
                        sx={fieldSx}
                      />
                      <TextField
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        name="endTime"
                        InputLabelProps={{ shrink: true }}
                        value={formik.values.endTime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.endTime && formik.errors.endTime)}
                        helperText={formik.touched.endTime && formik.errors.endTime}
                        sx={fieldSx}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
                    <div className="text-sm text-slate-500">
                      The schedule is created only after the timing window and target pass validation.
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outlined"
                        sx={{ borderRadius: "999px", px: 3 }}
                        onClick={() => navigate("/scheduler/viewandedit")}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{ background: "var(--gradient-color)", borderRadius: "999px", px: 3 }}
                      >
                        {isSubmitting ? "Creating..." : "Create Schedule"}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="enterprise-surface-strong overflow-hidden">
                <div className="border-b border-slate-200/80 px-5 py-5">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <EventAvailableIcon sx={{ fontSize: 20 }} />
                    </span>
                    <div>
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Live summary
                      </div>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                        Schedule snapshot
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="metric-card">
                    <div className="metric-label">Schedule name</div>
                    <div className="mt-2 text-lg font-semibold text-slate-950">
                      {formik.values.name || "Untitled schedule"}
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Playlist</div>
                    <div className="mt-2 text-lg font-semibold text-slate-950">
                      {selectedPlaylist?.name || "Not selected"}
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-label">Target</div>
                    <div className="mt-2 text-lg font-semibold text-slate-950">
                      {selectedTarget?.name || activeTargetOption?.label || "-"}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/85 p-4">
                    <div className="metric-label">Window</div>
                    <div className="mt-2 space-y-2 text-sm text-slate-700">
                      <div>Start: {formatDateTimeLocal(formik.values.startTime)}</div>
                      <div>End: {formatDateTimeLocal(formik.values.endTime)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="enterprise-surface-strong overflow-hidden">
                <div className="border-b border-slate-200/80 px-5 py-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Existing activity
                      </div>
                      <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                        Target timeline
                      </h2>
                    </div>
                    <Chip
                      label={`${timeLineSchedules.length} items`}
                      size="small"
                      sx={{
                        backgroundColor: "rgba(15,118,110,0.12)",
                        color: "#0f766e",
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>

                <div className="p-5">
                  {timeLineSchedules?.length > 0 ? (
                    <div className="max-h-[38rem] overflow-auto">
                      <CustomTimeline data={timeLineSchedules} />
                    </div>
                  ) : (
                    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center">
                      <div className="text-base font-semibold text-slate-900">
                        No existing schedule markers yet
                      </div>
                      <p className="mt-2 mb-0 text-sm text-slate-600">
                        Select a {activeTargetOption?.label?.toLowerCase()} to inspect its current scheduled activity before creating a new window.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSchedule;
