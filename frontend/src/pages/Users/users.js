import React, { useState, useCallback, useEffect } from "react";
import MyLists from "./MyLists";
import UserModal from "../../components/modals/User";
import GetStarted from "../../components/feedback/GetStarted";
import { registerUser, editUser, deleteUser } from "../../apis/api";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import { Button, Typography, CircularProgress } from "@mui/material";
export default function UsersPage() {
  const { user } = useAuth();
  const { departments, users, setUsersData } = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const addAlert = useAlert();
  const [userEdit, setUserEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const resetState = () => {
    setUserEdit(null);
    setShowModal(false);
  };
  useEffect(() => {
    if (!["admin", "assetManager", "globalAssetManager"].includes(user.role)) {
      navigate("/notFound");
    }
  });

  const buildFormData = (data, existingUser = null) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });
    if (existingUser?._id) formData.append("_id", existingUser._id);
    return formData;
  };

  const handleUserCreate = async (data) => {
    try {
      setIsLoading(true);
      const formData = buildFormData(data, userEdit);
      const endpoint = userEdit ? "admin/users/edit" : "admin/users/register";
      const apiFn = userEdit ? editUser : registerUser;

      const response = await apiFn(endpoint, user.token, formData);
      resetState();

      if (Array.isArray(response.errors)) {
        response.errors.forEach((err) =>
          addAlert({
            type: response.success ? "success" : "error",
            message: `${err.param} ${err.msg}`,
          })
        );
      } else {
        addAlert({
          type: response.success ? "success" : "error",
          message: response.message,
        });
      }

      handleUsersFetch();
    } catch (error) {
      resetState();
      addAlert({
        type: "error",
        message: error.message || "Internal server error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsersFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}admin/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.data) setUsersData(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      addAlert({ type: "error", message: "Failed to fetch users" });
    } finally {
      setIsLoading(false);
    }
  }, [user.token, setUsersData]);

  const handleUserEdit = (selectedUser) => {
    setUserEdit(selectedUser);
    setShowModal(true);
  };

  const handleUserDelete = async (id) => {
    try {
      setIsLoading(true);
      const data = await deleteUser("/admin/users", user.token, id);
      addAlert({
        type: data.success ? "success" : "warning",
        message: data.message,
      });
      if (data.success) handleUsersFetch();
    } catch (error) {
      addAlert({ type: "error", message: "Failed to delete user" });
    } finally {
      setIsLoading(false);
    }
  };
  if (users.length <= 1) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={handleUsersFetch}
          >
            Refresh
          </Button>
          <UserModal
            open={showModal}
            openModal={() => setShowModal(true)}
            closeModal={resetState}
            handleFormSubmit={handleUserCreate}
            selectedUser={userEdit}
            user={user}
            departments={departments}
          />
        </div>
        <GetStarted
          Title="No Users Yet? Add Your Team Members!"
          Description="Users are the individuals who can access and manage your content system. Add your first user to assign roles, manage permissions, and collaborate effectively."
          callback={() => {
            setShowModal(true);
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
          {" "}
          Users
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => setShowModal(true)}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create User
          </Button>
          <Button
            variant="outlined"
            onClick={handleUsersFetch}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>

      <UserModal
        open={showModal}
        openModal={() => setShowModal(true)}
        closeModal={resetState}
        handleFormSubmit={handleUserCreate}
        selectedUser={userEdit}
        user={user}
        departments={departments}
      />
      {/* Accordion List */}
      {isLoading == true && (
        <>
          {/* add a backdrip with loading spinner */}
          <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
            <CircularProgress />
          </div>
        </>
      )}
      <MyLists
        usersList={users}
        handleUserEdit={handleUserEdit}
        handleUserDelete={handleUserDelete}
      />
    </div>
  );
}
