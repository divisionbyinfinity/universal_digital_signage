import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
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
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [navs,setNavs]=useState(navigation);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  

  const handleNavigation = (item) => {
    navigate(item.href);
    setMobileOpen(false); // close menu on nav
  };

  return (
    <nav className="bg-nav-footer text-nav-footer shadow-md sticky top-0 z-20">
      <div className=" px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-12 w-auto"
              src={`${process.env.REACT_APP_HOST_NAME}logo.svg`}
              alt="Universal Digital Signage"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center md:ml-16">
            {navs.map((item) => {
              if(item.name==="Admin" && ["admin","assetManager","globalAssetManager"].includes(user.role)===false){
                return null;
              }
              // Check if parent should be active
              const isParentActive =
                item.subMenu?.some((sub) =>
                  location.pathname.startsWith(sub.href)
                ) || location.pathname === item.href;

              return item.subMenu ? (
                <Menu as="div" className="relative" key={item.name}>
                  <Menu.Button
                    className={`text-white font-medium px-3 py-2 flex items-center hover:text-sky-400 transition-colors ${
                      isParentActive ? "border-b-2 border-sky-400" : ""
                    }`}
                  >
                    {item.name} <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      {item.subMenu.map((sub) => (
                        <Menu.Item key={sub.name}>
                          {({ active }) => (
                            <button
                              onClick={() => handleNavigation(sub)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active || location.pathname === sub.href
                                  ? "bg-sky-100 text-gray-900"
                                  : "text-gray-700"
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
              ) : (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`text-white font-medium px-3 py-2 hover:text-sky-400 transition-colors ${
                    location.pathname === item.href
                      ? "border-b-2 border-sky-400"
                      : ""
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white focus:outline-none"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
          {/* Profile Menu */}
          {/* Profile Menu */}
          <Menu as="div" className="ml-auto relative">
            <Menu.Button className="flex items-center rounded-full bg-sky-600 text-white h-10 w-10 justify-center font-bold">
              {user.profileImage === "" || !user.profileImage ? (
                user.firstName.charAt(0).toUpperCase()
              ) : (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => navigate("/profile")}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-sky-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      Profile
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setShowLogout(true)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        active ? "bg-sky-100 text-gray-900" : "text-gray-700"
                      }`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800 text-white px-4 pb-4 space-y-2">
          {navs.map((item) =>
            item.subMenu ? (
              <div key={item.name}>
                <div className="flex items-center justify-between py-2">
                  <span className="font-medium text-white">{item.name}</span>
                  <ChevronDownIcon className="h-4 w-4 text-gray-300" />
                </div>
                <div className="pl-4 space-y-1">
                  {item.subMenu.map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => handleNavigation(sub)}
                      className="block w-full text-left px-2 py-1 text-sm text-gray-300 hover:text-sky-400"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`block px-2 py-2 font-medium ${
                  location.pathname === item.href
                    ? "text-sky-400"
                    : "text-gray-200 hover:text-sky-400"
                }`}
              >
                {item.name}
              </button>
            )
          )}
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
