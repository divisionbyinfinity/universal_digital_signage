import { useEffect, useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "./modals/Alert";

import { useAuth } from "../contexts/AuthContext";
const navigation = [
    { name: "Home", href: "/home" },
    { name: "Channels", href: "/channels" },
    { name: "Hosts", href: "/hosts" },
    { name: "Groups", href: "/groups" },
    { name: "Gallery", href: "/gallery" },
    {
      name: "Playlists",
      subMenu: [
        { name: "Create Standard Playlist", href: "/playlist/create/standard" },
        { name: "View Playlist", href: "/playlist/viewandedit" },
      ],
    },
    {
      name: "Schedule",
      subMenu: [
        { name: "Create Schedule", href: "/scheduler/create" },
        { name: "View Schedule", href: "/scheduler/viewandedit" },
      ],
    },
    {
      name: "Admin",
      subMenu: [
        { name: "Users", href: "/admin/users" },
        { name: "Departments", href: "/admin/departments" },
      ],
    },
  ];

export default function Navbar({ user: userProp, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, logoutUser: authLogoutUser } = useAuth();
  const user = userProp ?? authUser;
  const logoutUser = onLogout ?? authLogoutUser;
  const [navs] = useState(navigation);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavigation = (item) => {
    navigate(item.href);
    setMobileOpen(false);
  };

  const isAdminVisible = ["admin", "assetManager", "globalAssetManager"].includes(
    user?.role
  );

  const getInitial = () => {
    const source = user?.firstName || user?.email || "U";
    return source.charAt(0).toUpperCase();
  };

  const isRouteActive = (href) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  return (
    <nav className="bg-nav-footer text-nav-footer sticky top-0 z-30 border-b border-white/10 shadow-[0_20px_45px_rgba(15,23,42,0.22)] backdrop-blur-xl">
      <div className="section-shell px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition hover:bg-white/10"
          >
            <img
              className="h-11 w-auto drop-shadow-lg"
              src={`${process.env.REACT_APP_HOST_NAME}logo.svg`}
              alt="Universal Digital Signage"
            />
            <div className="hidden xl:block text-left">
              <div className="text-sm font-semibold tracking-[0.22em] text-white/65 uppercase">
                Operations Console
              </div>
              <div className="text-base font-semibold text-white">Universal Digital Signage</div>
            </div>
          </button>

          <div className="hidden lg:flex flex-1 items-center justify-center gap-1.5 xl:gap-2">
            {navs.map((item) => {
              if (item.name === "Admin" && !isAdminVisible) {
                return null;
              }

              const isParentActive =
                item.subMenu?.some((sub) => location.pathname.startsWith(sub.href)) ||
                isRouteActive(item.href);

              if (item.subMenu) {
                return (
                  <Menu as="div" className="relative" key={item.name}>
                    <Menu.Button
                      className={`inline-flex items-center gap-1.5 xl:gap-2 rounded-full px-3 xl:px-4 py-2 text-xs xl:text-sm font-semibold transition ${
                        isParentActive
                          ? "text-white shadow-[0_14px_30px_rgba(37,99,235,0.35)]"
                          : "border border-white/15 bg-white/5 text-white/88 hover:bg-white/12 hover:text-white"
                      }`}
                      style={isParentActive ? { background: "var(--nav-surface-active)" } : undefined}
                    >
                      {item.name}
                      <ChevronDownIcon className={`h-3.5 w-3.5 xl:h-4 xl:w-4 ${isParentActive ? "text-white/90" : "text-white/80"}`} />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-180"
                      enterFrom="opacity-0 translate-y-2 scale-95"
                      enterTo="opacity-100 translate-y-0 scale-100"
                      leave="transition ease-in duration-140"
                      leaveFrom="opacity-100 translate-y-0 scale-100"
                      leaveTo="opacity-0 translate-y-2 scale-95"
                    >
                      <Menu.Items className="absolute left-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.2)] focus:outline-none">
                        {item.subMenu.map((sub) => (
                          <Menu.Item key={sub.name}>
                            {({ active }) => (
                              <button
                                onClick={() => handleNavigation(sub)}
                                className={`flex w-full items-center rounded-xl px-4 py-3 text-left text-sm transition ${
                                  active || location.pathname === sub.href
                                    ? "bg-slate-100 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                              >
                                {sub.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`navItem ${isRouteActive(item.href) ? "nav-active" : ""}`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden 2xl:flex items-center gap-2.5 rounded-full border border-white/10 bg-white/10 px-3.5 py-1.5 text-sm text-white/84 whitespace-nowrap">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{user?.role || "user"}</span>
            </div>

            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 rounded-full border border-white/12 bg-white/10 pl-1.5 pr-2.5 py-1.5 text-left text-white transition hover:bg-white/16">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-900">
                      {getInitial()}
                    </span>
                  )}
                </span>
                <div className="hidden lg:block max-w-[7.5rem] xl:max-w-[9.5rem] pr-1">
                  <div className="text-xs xl:text-sm font-semibold leading-5 text-white truncate whitespace-nowrap">
                    {user?.firstName || user?.email || "Account"}
                  </div>
                  <div className="text-[11px] xl:text-xs text-white/72 truncate whitespace-nowrap">Signed in</div>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-180"
                enterFrom="opacity-0 translate-y-2 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-140"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-2 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.2)] focus:outline-none">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-900">
                      {user?.firstName || user?.email || "Account"}
                    </div>
                    <div className="text-xs text-slate-500">{user?.role || "User"}</div>
                  </div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/profile")}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                          active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <UserCircleIcon className="h-5 w-5" />
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setShowLogout(true)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                          active ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/15 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl">
          <div className="section-shell flex flex-col gap-2">
            {navs.map((item) => {
              if (item.name === "Admin" && !isAdminVisible) {
                return null;
              }

              if (item.subMenu) {
                return (
                  <div key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between px-2 py-1 text-sm font-semibold text-white/75">
                      <span>{item.name}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 space-y-1">
                      {item.subMenu.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => handleNavigation(sub)}
                          className={`block w-full rounded-xl px-3 py-3 text-left text-sm transition ${
                            location.pathname === sub.href
                              ? "bg-white text-slate-900"
                              : "text-white/75 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isRouteActive(item.href)
                      ? "bg-white text-slate-900"
                      : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/82">
              <div className="font-semibold text-white">{user?.firstName || user?.email || "Account"}</div>
              <div className="mt-1 flex items-center justify-between text-white/65">
                <span>{user?.role || "User"}</span>
                <button
                  onClick={() => setShowLogout(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AlertModal
        open={showLogout}
        handleClose={() => setShowLogout(false)}
        handleMediaDelete={logoutUser}
        title="Logout"
        description="Are you sure you want to logout?"
      />
    </nav>
  );
}
