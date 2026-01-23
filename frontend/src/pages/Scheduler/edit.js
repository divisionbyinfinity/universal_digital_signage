
import  { useEffect, useState,useCallback } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Grid } from '@mui/material';
import {  useParams } from 'react-router-dom';


import {getdepartments,getplaylists,gethosts,editschedule,getchannels,getschedulers,getgroups} from '../../apis/api'
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';
const EditSchedule = () => {
  const { user } = useAuth();
  const addAlert = useAlert();
    const { Id } = useParams();
  const [departments, setDepartments] = useState([]);
  const [playlists,setPlaylists]=useState([])
  const [hosts,setHosts]=useState([])
  const [channels,setChannels]=useState([])
  const [groups,setGroups]=useState([])
  const [targetType, setTartgetType] = useState("");

  const [schedule, setSchedule] = useState({
    name: '',
    frequency: 'daily',
    startTime: '',
    endTime: '',
    deviceId: '',
    channelId:'',
    playlistId:'',
    groupId:'',
    departmentId:'',
    description:'',
  });

  // const handleInputChange = (field, value) => {
  //   setSchedule((prevSchedule) => ({
  //     ...prevSchedule,
  //     [field]: value,
  //   }));
  // };
  const handleInputChange = (name,value) => {
    const maxLengths = {
      name: 20,
      description: 100,
    };
    const maxLength = maxLengths[name] || Infinity;
    if (value.length <= maxLength) {
      setSchedule((prevSchedule)=>({
        ...prevSchedule,
        [name]: value,
      }));
    }
  };
  const getDepartments = useCallback(async () => {
    try {
      const data = await getdepartments('common/departments/', user.token);
      if (data.data) {
        setDepartments(data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  },[user.token])
  const handleSchedulers =useCallback(async () => {
    try {
      const res = await getschedulers('common/schedules/'+Id, user.token);
      const formatDateTimeLocal = (datetime) => {
        return datetime ? new Date(datetime).toISOString().slice(0, 16) : '';
      };
      if (res.success) {
        const newdata = {
          name: res.data.name,
          startTime: formatDateTimeLocal(res.data.startTime),
          endTime: formatDateTimeLocal(res.data.endTime),
          frequency: res.data.frequency,
          deviceId: res.data.device,
          playlistId: res.data.playlistId,
          departmentId: res.data.department,
          groupId: res.data.group,
          channelId: res.data.channel,
          description: res.data.description || '',
        };
        setTartgetType(res.data.device ? "hostId" : res.data.channel ? "channelId" : "groupId");
        setSchedule({...newdata});

      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  },[user.token])
  const getPlaylists=useCallback(async ()=>{
    try {
      const data = await getplaylists('common/playlists/', user.token);
      if (data.data) {
        setPlaylists(data.data);
      }
    } catch (error) {
      console.error('Error fetching Playlists:', error);
    }
  
  },[user.token]) 

  const getHosts=useCallback(async ()=>{
    try {
      const data = await gethosts('common/hosts/', user.token);
      if (data.data) {
        setHosts(data.data);
      }
    } catch (error) {
      console.error('Error fetching hosts:', error);
    }
  
  },[user.token]) 

  const getChannels=useCallback(async ()=>{
    try {
      const data = await getchannels('common/channels/', user.token);
      if (data.data) {
        setChannels(data.data);
      }
    } catch (error) {
      console.error('Error fetching hosts:', error);
    }
  
  },  [user.token]) 
  
const getGroups=useCallback(async ()=>{
    try {
      const data = await getgroups('common/groups/', user.token);
      if (data.data) {
        setGroups(data.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  
  },  [user.token])
  const handleSubmit = async () => {
    try{
    addAlert({ type: 'warning', message: 'Creating the Host...' });

    // Handle the submission logic here
    const res=await editschedule('common/schedules/edit/'+Id,schedule,user.token)
    if (res) {
      addAlert({ type: res.success ? 'success' : 'warning', message: res.message });
    }
  } catch (error) {
    console.error('Error adding host:', error);
    addAlert({ type: 'error', message: 'Error adding host' });
  }

  };

  useEffect(()=>{
    getDepartments()
    getPlaylists()
    getHosts()
    getChannels()
    handleSchedulers()
    getGroups()
  },[])
  return (
    <div className="m-4 px-4">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Schedule Name"
            fullWidth
            value={schedule.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={schedule.name.length>=20}

          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="frequency-label">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              value={schedule.frequency}
              label="Frequency"
              onChange={(e) => handleInputChange('frequency', e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              value={schedule.departmentId}
              label="Department"
              onChange={(e) => handleInputChange('departmentId', e.target.value)}
            >
              {departments.map(dep=>{
                  return(
                  <MenuItem value={dep._id} key={dep._id}>{dep.name}</MenuItem>
                  )
                })}
            </Select>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
                <InputLabel id="playlist-label">Playlist</InputLabel>
                <Select
                  labelId="playlist-label"
                  value={schedule.playlistId}
                  label="Playlist"
                  onChange={(e) => handleInputChange('playlistId', e.target.value)}
               > 
              {playlists.map(playlist=>{
                  return(
                  <MenuItem value={playlist._id} key={playlist._id}>{playlist.name}</MenuItem>
                  )
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
              disabled
              onChange={(e) => setTartgetType(e.target.value)}>
                
              <MenuItem value="hostId">Host</MenuItem>
              <MenuItem value="channelId">Channel</MenuItem>
              <MenuItem value="groupId">Group</MenuItem>
            </Select>
          </FormControl>
        </Grid>
         {targetType == "hostId" && (
          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="hosts-label">Host</InputLabel>
              <Select
                labelId="hosts-label"
                value={schedule.deviceId}
                disabled
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
          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="channels-label" color="success">
                Channel
              </InputLabel>
              <Select
                labelId="channels-label"
                value={schedule.channelId}
                label="Channel ID"
                disabled
                onChange={(e) => handleInputChange("channelId", e.target.value)}
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
          <Grid item xs={6}>
            <FormControl fullWidth color="success">
              <InputLabel id="groups-label">Group</InputLabel>
              <Select
                labelId="groups-label"
                value={schedule.groupId}
                label="Group ID"
                disabled
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
        {/* <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel id="hosts-label">Host</InputLabel>
            <Select
              labelId="hosts-label"
              value={schedule.deviceId}
              label="Host ID"
              onChange={(e) => handleInputChange('deviceId', e.target.value)}
              >
              {hosts.map(host=>{
                  return(
                  <MenuItem value={host._id} key={host._id}>{host.name}</MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel id="channels-label">Channel</InputLabel>
            <Select
              labelId="channels-label"
              value={schedule.channelId}
              label="Channel ID"
              onChange={(e) => handleInputChange('channelId', e.target.value)}
              >
              {channels.map(chanl=>{
                  return(
                  <MenuItem value={chanl._id} key={chanl._id}>{chanl.name}</MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
            <InputLabel id="groups-label">GROUP</InputLabel>
            <Select
              labelId="groups-label"
              value={schedule.groupId}
              label="Group ID"
              disabled
              onChange={(e) => handleInputChange('groupId', e.target.value)}
              >
              {groups.map(grup=>{
                  return(
                  <MenuItem value={grup._id} key={grup._id}>{grup.name}</MenuItem>
                  )
                })}
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={6}>
          <TextField
            label="Start Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 minutes
            }}
            value={schedule.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Time"
            type="datetime-local"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 minutes
            }}
            value={schedule.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
          />
        </Grid>
        
        
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            maxRows={4}
            value={schedule.description}
            error={schedule.description.length>=100}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
        <Button onClick={handleSubmit} variant="outlined" color="success" className='flex start'>
            Create Schedule
          </Button>
        </Grid>
      </Grid>

    </div>
  );
};

export default EditSchedule;
