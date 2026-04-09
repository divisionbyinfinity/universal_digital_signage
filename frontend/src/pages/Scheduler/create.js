import { useEffect, useState, useCallback } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
} from "@mui/material";
import { getschedulers } from "../../apis/api";
import CustomTimeline from "../../components/Timeline";
import {
  getdepartments,
  getplaylists,
  gethosts,
  createschedule,
  getchannels,
  getgroups,
  getMinschedulers,
} from "../../apis/api";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
const CreateSchedule = () => {
  const { user } = useAuth();
  const addAlert = useAlert();
  const [departments, setDepartments] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [groups, setGroups] = useState([]);
  const [schedulers, setSchedulers] = useState([]);
  const [targetType, setTartgetType] = useState("hostId");
  const [timeLineSchedules, setTimeLineSchedules] = useState([]);

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
        addAlert({ type: "warning", message: "Creating the Schedule..." });

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
            window.location.href = `${process.env.REACT_APP_HOST_NAME}scheduler/viewandedit`;
          }
        }
      } catch (error) {
        console.error("Error adding host:", error);
        addAlert({ type: "error", message: "Error adding host" });
      }
    },
  });
  const handleFetchMinschdules = async (device) => {
    try {
      const query = `?${targetType}=${device}`;
      const data = await getMinschedulers(query, user.token);
      setTimeLineSchedules(data.data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
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
      console.error("Error fetching Playlists:", error);
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
      console.error("Error fetching hosts:", error);
    }
  }, [user.token]);

  const fetchSchedulers = useCallback(async () => {
    const data = await getschedulers("common/schedules/", user.token);
    if (data.success) {
      setSchedulers(data.data);
    }
  }, [user.token]);
  useEffect(() => {
    if (formik.values[targetType]) {
      handleFetchMinschdules(formik.values[targetType]);
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
    fetchSchedulers();
  }, []);
  return (
    <div className="flex">
      <div className="m-4 px-4 w-full h-full">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Schedule Name"
              fullWidth
              name="name"
              value={formik.values.name}
              onChange={(e) => formik.setFieldValue("name", e.target.value.slice(0, 20))}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.name && formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              color="success"
            />
          </Grid>
          {/* <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="frequency-label" color="success">
              Frequency
            </InputLabel>
            <Select
              labelId="frequency-label"
              value={schedule.frequency}
              label="Frequency"
              onChange={(e) => handleInputChange("frequency", e.target.value)}
              color="success"
            >
              <MenuItem value="daily" color="success">
                Daily
              </MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}

          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="departmentId"
                value={formik.values.departmentId}
                label="Department"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.departmentId && formik.errors.departmentId)}
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
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="playlist-label">Playlist</InputLabel>
              <Select
                labelId="playlist-label"
                name="playlistId"
                value={formik.values.playlistId}
                label="Playlist"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.touched.playlistId && formik.errors.playlistId)}
              >
                {playlists.map((playlist) => {
                  return (
                    <MenuItem value={playlist._id} key={playlist._id}>
                      {playlist.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="TargetType">Select Target</InputLabel>
              <Select
                labelId="TargetType"
                value={targetType}
                label="TargetType"
                onChange={(e) => {
                  const nextType = e.target.value;
                  setTartgetType(nextType);
                  formik.setFieldValue("hostId", "", false);
                  formik.setFieldValue("channelId", "", false);
                  formik.setFieldValue("groupId", "", false);
                }}
              >
                <MenuItem value="hostId">Host</MenuItem>
                <MenuItem value="channelId">Channel</MenuItem>
                <MenuItem value="groupId">Group</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {targetType == "hostId" && (
            <Grid item xs={12}>
              <FormControl fullWidth color="success">
                <InputLabel id="hosts-label">Host</InputLabel>
                <Select
                  labelId="hosts-label"
                  name="hostId"
                  value={formik.values.hostId}
                  label="Host ID"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.hostId && formik.errors.hostId)}
                >
                  {hosts.map((host) => {
                    return (
                      <MenuItem value={host._id} key={host._id}>
                        {host.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
          {targetType === "channelId" && (
            <Grid item xs={12}>
              <FormControl fullWidth color="success">
                <InputLabel id="channels-label" color="success">
                  Channel
                </InputLabel>
                <Select
                  labelId="channels-label"
                  name="channelId"
                  value={formik.values.channelId}
                  label="Channel ID"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.channelId && formik.errors.channelId)}
                >
                  {channels.map((chanl) => {
                    return (
                      <MenuItem value={chanl._id} key={chanl._id}>
                        {chanl.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
          {targetType === "groupId" && (
            <Grid item xs={12}>
              <FormControl fullWidth color="success">
                <InputLabel id="groups-label">Group</InputLabel>
                <Select
                  labelId="groups-label"
                  name="groupId"
                  value={formik.values.groupId}
                  label="Group ID"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.touched.groupId && formik.errors.groupId)}
                >
                  {groups.map((grup) => {
                    return (
                      <MenuItem value={grup._id} key={grup._id}>
                        {grup.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              name="startTime"
              color="success"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.startTime && formik.errors.startTime)}
              helperText={formik.touched.startTime && formik.errors.startTime}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              name="endTime"
              color="success"
              InputLabelProps={{
                shrink: true,
              }}
              value={formik.values.endTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={Boolean(formik.touched.endTime && formik.errors.endTime)}
              helperText={formik.touched.endTime && formik.errors.endTime}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              name="description"
              color="success"
              multiline
              maxRows={4}
              value={formik.values.description}
              error={Boolean(formik.touched.description && formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              onChange={(e) => formik.setFieldValue("description", e.target.value.slice(0, 100))}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={formik.handleSubmit}
              variant="outlined"
              sx={{ color: "var(--button-color-secondary)" }}
              className="flex start"
            >
              Create Schedule
            </Button>
          </Grid>
        </Grid>
      </div>
      {timeLineSchedules?.length > 0 && (
        <div className="basis-1/2">
          <CustomTimeline data={timeLineSchedules} />
        </div>
      )}

    </div>
  );
};

export default CreateSchedule;
