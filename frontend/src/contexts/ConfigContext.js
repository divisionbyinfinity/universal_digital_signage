import { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [configData, setConfigData] = useState({
    footer: { text: "", url: "" },
    githubUrl: { text: "", url: "" },
  });

  // Keys for localStorage
  const keys = ['playlists', 'departments', 'groups', 'users', 'hosts', 'channels', 'tags'];

  // Generic state initializer
  const useLocalStorageState = (key) => {
    return useState(() => JSON.parse(localStorage.getItem(key)) || []);
  };

  const [playlists, setPlaylists] = useLocalStorageState('playlists');
  const [departments, setDepartments] = useLocalStorageState('departments');
  const [groups, setGroups] = useLocalStorageState('groups');
  const [users, setUsers] = useLocalStorageState('users');
  const [hosts, setHosts] = useLocalStorageState('hosts');
  const [channels, setChannels] = useLocalStorageState('channels');
  const [tags, setTags] = useLocalStorageState('tags');

  // Update localStorage and state
  const setDataAndPersist = (key, setter) => (data) => {
    localStorage.setItem(key, JSON.stringify(data));
    setter(data);
  };

  const setPlaylistsData = setDataAndPersist('playlists', setPlaylists);
  const setDepartmentsData = setDataAndPersist('departments', setDepartments);
  const setGroupsData = setDataAndPersist('groups', setGroups);
  const setUsersData = setDataAndPersist('users', setUsers);
  const setHostsData = setDataAndPersist('hosts', setHosts);
  const setChannelsData = setDataAndPersist('channels', setChannels);
  const setTagsData = setDataAndPersist('tags', setTags);

  // Clear both localStorage and state
  const clearLocalStorage = () => {
    keys.forEach((key) => localStorage.removeItem(key));
    setPlaylists([]);
    setDepartments([]);
    setGroups([]);
    setUsers([]);
    setHosts([]);
    setChannels([]);
    setTags([]);
  };

  // Cross-tab sync
  useEffect(() => {
    const handleStorage = (event) => {
      if (!event.key || !keys.includes(event.key)) return;
      const updatedValue = JSON.parse(event.newValue) || [];

      switch (event.key) {
        case 'playlists': setPlaylists(updatedValue); break;
        case 'departments': setDepartments(updatedValue); break;
        case 'groups': setGroups(updatedValue); break;
        case 'users': setUsers(updatedValue); break;
        case 'hosts': setHosts(updatedValue); break;
        case 'channels': setChannels(updatedValue); break;
        case 'tags': setTags(updatedValue); break;
        default: break;
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Fetch static config
  useEffect(() => {
    console.log("process.env.",process.env)
    fetch(`${process.env.REACT_APP_HOST_NAME}config.json`)
      .then((response) => response.json())
      .then((data) => setConfigData(data))
      .catch((error) => console.error('Error loading config:', error));
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        configData,
        playlists,
        departments,
        groups,
        users,
        hosts,
        channels,
        tags,
        setPlaylistsData,
        setDepartmentsData,
        setChannelsData,
        setGroupsData,
        setUsersData,
        setHostsData,
        setTagsData,
        clearLocalStorage,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
