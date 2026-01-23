import { useEffect, useState, useCallback } from "react";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getschedulers, deleteScheduler } from "../../apis/api";
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
  const [device, setDevice] = useState(null);
  const [timeLineSchedules, setTimeLineSchedules] = useState([]);
  //to store selected playlist id
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [schedule, setSchedule] = useState({
    name: "",
    frequency: "daily",
    startTime: "",
    endTime: "",
    deviceId: "",
    hostId: "",
    channelId: "",
    groupId: "",
    playlistId: "",
    departmentId: "",
    description: "",
  });

  const handleInputChange = (name, value) => {
    const maxLengths = {
      name: 20,
      description: 100,
    };
    const maxLength = maxLengths[name] || Infinity;
    if (value.length <= maxLength) {
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [name]: value,
      }));
    }
  };
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
  const handleSubmit = async () => {
    try {
      const targetValue = schedule[targetType];
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        groupId: targetType === "groupId" ? targetValue : "",
        channelId: targetType === "channelId" ? targetValue : "",
        hostId: targetType === "hostId" ? targetValue : "",
      }));
      addAlert({ type: "warning", message: "Creating the Schedule..." });
      // Handle the submission logic here
      const res = await createschedule(
        "common/schedules/create",
        schedule,
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
  };
  useEffect(() => {
    if (schedule[targetType]) {
      handleFetchMinschdules(schedule[targetType]);
    }
  }, [schedule]);
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
              value={schedule.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={schedule.name.length >= 20}
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
                value={schedule.departmentId}
                label="Department"
                onChange={(e) =>
                  handleInputChange("departmentId", e.target.value)
                }
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
                value={schedule.playlistId}
                label="Playlist"
                onChange={(e) =>
                  handleInputChange("playlistId", e.target.value)
                }
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
                onChange={(e) => setTartgetType(e.target.value)}
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
                  value={schedule.hostId}
                  label="Host ID"
                  onChange={(e) => handleInputChange("hostId", e.target.value)}
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
                  value={schedule.channelId}
                  label="Channel ID"
                  onChange={(e) =>
                    handleInputChange("channelId", e.target.value)
                  }
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
                  value={schedule.groupId}
                  label="Group ID"
                  onChange={(e) => handleInputChange("groupId", e.target.value)}
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
              color="success"
              InputLabelProps={{
                shrink: true,
              }}
              value={schedule.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              fullWidth
              color="success"
              InputLabelProps={{
                shrink: true,
              }}
              value={schedule.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              color="success"
              multiline
              maxRows={4}
              value={schedule.description}
              error={schedule.description.length >= 100}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleSubmit}
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
