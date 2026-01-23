import { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import {
  getdepartments,
  getgroups,
  getplaylists,
  login,
  getusers,
  gethosts,
  getchannels,
  gettags,
} from "../../apis/api";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUserData } = useAuth();
  const addAlert = useAlert();
  const {
    setPlaylistsData,
    setDepartmentsData,
    setGroupsData,
    setUsersData,
    setHostsData,
    setChannelsData,
    setTagsData,
    clearLocalStorage,
  } = useConfig();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login("auth/login", email, password);
      clearLocalStorage();

      if (!data.data) {
        // Failed login
        addAlert({ type: data.success ? "success" : "error", message: data.message || "Login failed" });
        return;
      }
      addAlert({ type: "success", message: data.message || "Login successful" });

      // Successful login
      const authenticatedUser = data.data;

      const [playlists, departments, groups, users, hosts, channels, tags] = await Promise.all([
        getplaylists("common/playlists", authenticatedUser.token),
        getdepartments("common/departments", authenticatedUser.token),
        getgroups("common/groups", authenticatedUser.token),
        getusers("admin/users", authenticatedUser.token),
        gethosts("common/hosts", authenticatedUser.token),
        getchannels("common/channels", authenticatedUser.token),
        gettags(authenticatedUser.token),
      ]);
      if (playlists.success) setPlaylistsData(playlists.data);
      if (departments.success) setDepartmentsData(departments.data);
      if (groups.success) setGroupsData(groups.data);
      if (users.success) setUsersData(users.data);
      if (hosts.success) setHostsData(hosts.data);
      if (channels.success) setChannelsData(channels.data);
      console.log("tags=",tags)
      if (tags.success) {
        const newtags = tags.data.map((i) => ({ _id: i, name: i }));
        setTagsData(newtags);
      }

      setUserData(authenticatedUser);
    } catch (error) {
      addAlert({ type: "error", message: error.message });
    }
  };

return (
  <div
    className="simple_body_font flex justify-center items-center"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "100vh",
      background: "var(--gradient-color)",
    }}
  >
    <div
      className="sm:w-2/3 md:w-2/3 lg:w-1/3 mt-[-6rem] py-10 px-10 rounded-3xl shadow-2xl backdrop-blur-xl"
      style={{
        backgroundColor: "var(--bg-color-primary)",
        border: "1px solid var(--button-color-secondary)",
        transform: "scale(1)",
      }}
    >
      {/* Logo & Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col justify-center items-center">
        <img
          className="mx-auto h-40 w-auto drop-shadow-2xl"
          src={`${process.env.REACT_APP_HOST_NAME}logo.svg`}
          alt="Digital Signage"
        />
        <h2
          className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight wh_shadow_text"
          style={{ color: "var(--text-secondary-color)" }}
        >
          Universal Digital Signage
        </h2>
      </div>

      {/* Form */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
              style={{ color: "var(--text-secondary-color)" }}
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                className="block w-full rounded-lg py-2 px-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-color-secondary)",
                  border: "1px solid var(--button-color-secondary)",
                  color: "var(--text-secondary-color)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
              style={{ color: "var(--text-secondary-color)" }}
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={handlePasswordChange}
                className="block w-full rounded-lg py-2 px-3 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition"
                style={{
                  backgroundColor: "var(--bg-color-secondary)",
                  border: "1px solid var(--button-color-secondary)",
                  color: "var(--text-secondary-color)",
                }}
              />
              <style jsx>{`
                input:-webkit-autofill {
                  box-shadow: 0 0 0 30px var(--bg-color-secondary) inset;
                  -webkit-text-fill-color: var(--text-secondary-color);
                  transition: background-color 5000s ease-in-out 0s;
                }
              `}</style>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-xl text-white py-2 text-sm font-semibold shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: "var(--gradient-color)",
                // color: "var(--text-secondary-color)",
              }}
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

}
