import { useState, useEffect } from "react";
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
import { ShieldCheckIcon, Squares2X2Icon, DeviceTabletIcon } from "@heroicons/react/24/outline";

const loginHighlights = [
  "Secure access for operations teams and administrators",
  "Centralized content, device, and playlist management",
  "Designed for large screen deployments and multi-site control",
];

const trustSignals = [
  { label: "Screens connected", value: "24/7" },
  { label: "Control surface", value: "Centralized" },
  { label: "Deployment mode", value: "Enterprise" },
];

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await login("auth/login", email, password);
      clearLocalStorage();

      if (!data.data) {
        addAlert({ type: data.success ? "success" : "error", message: data.message || "Login failed" });
        return;
      }

      addAlert({ type: "success", message: data.message || "Login successful" });

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
      if (tags.success) {
        const newTags = tags.data.map((item) => ({ _id: item, name: item }));
        setTagsData(newTags);
      }

      setUserData(authenticatedUser);
    } catch (error) {
      addAlert({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(29,78,216,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(15,118,110,0.2),transparent_30%),linear-gradient(135deg,#081126_0%,#0b1b37_45%,#0d3a4a_100%)] text-white">
      <div className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_18%)]" />
        <div className="relative grid min-h-[calc(100vh-3rem)] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden lg:block">
            <div className="max-w-2xl space-y-8">
              <span className="status-badge border-white/15 bg-white/10 text-white/90">
                Enterprise signage platform
              </span>
              <div className="space-y-5">
                <h1 className="text-5xl font-semibold leading-[0.95] text-white xl:text-6xl">
                  One control plane for every screen you run.
                </h1>
                <p className="max-w-xl text-lg text-white/72">
                  Sign in to manage playlist delivery, monitor devices, and keep distributed content aligned across your signage estate.
                </p>
              </div>

              <div className="grid gap-3">
                {loginHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-4 backdrop-blur-xl"
                  >
                    <ShieldCheckIcon className="h-5 w-5 text-emerald-300" />
                    <span className="text-sm font-medium text-white/85">{item}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {trustSignals.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/7 p-5 backdrop-blur-xl">
                    <div className="text-2xl font-semibold text-white">{item.value}</div>
                    <div className="mt-1 text-sm text-white/62">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="enterprise-surface-strong overflow-hidden bg-white/95 text-slate-900 shadow-[0_30px_80px_rgba(8,15,33,0.38)]">
              <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-3">
                  <img
                    className="h-14 w-auto drop-shadow-md"
                    src={`${process.env.REACT_APP_HOST_NAME}logo.svg`}
                    alt="Digital Signage"
                  />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Secure sign in
                    </div>
                    <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                      Universal Digital Signage
                    </h2>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 py-7 sm:px-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="metric-card">
                    <DeviceTabletIcon className="h-5 w-5 text-sky-600" />
                    <div className="metric-value mt-2 text-2xl">Screens</div>
                    <div className="metric-label">Keep deployments synchronized</div>
                  </div>
                  <div className="metric-card">
                    <Squares2X2Icon className="h-5 w-5 text-teal-600" />
                    <div className="metric-value mt-2 text-2xl">Content</div>
                    <div className="metric-label">Centralized playlist management</div>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="enterprise-input"
                      placeholder="name@company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="enterprise-input"
                      placeholder="Enter your password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary flex w-full items-center justify-center text-sm"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  This workspace uses token-based session management and background sync to keep devices and playlists aligned after login.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}