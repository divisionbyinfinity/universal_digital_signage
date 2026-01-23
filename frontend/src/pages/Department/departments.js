import { useState, useEffect } from "react";
import {
  getdepartments,
  adddepartment,
  deletedepartment,
  deleteHost,
} from "../../apis/api";
import { useNavigate } from "react-router-dom";
import GetStarted from "../../components/feedback/GetStarted";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";

import MyAvatar from "../../components/Avatar";
import DepartmentModal from "../../components/modals/Department";
import AlertModal from "../../components/modals/Alert";
import { useAlert } from "../../contexts/AlertContext";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { DeviceType } from "../../enums";

export default function Departments() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, setDepartmentsData } = useConfig();
  const [isLoading,setIsLoading]= useState(false)
  const [currHost, setCurrHost] = useState(null);
  const [currDept, setCurrDept] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()
  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setIsLoading(true)
      const data = await getdepartments("common/departments", user.token);
      if (data.success) setDepartmentsData(data.data);
      else
        addAlert({
          type: "warning",
          message: data.message || "Failed to fetch departments",
        });
    } catch {
      addAlert({ type: "error", message: "Error fetching departments" });
    }
    finally{
      setIsLoading(false)
    }
  };

  // Handle department delete
  const handleDeptDelete = async () => {
    setShowDelete(false);
    try {
      setIsLoading(true)
      const res = await deletedepartment(
        "common/departments/",
        user.token,
        currDept._id
      );
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      if (res.success) fetchDepartments();
    } catch {
      addAlert({ type: "error", message: "Error deleting department" });
    }
    finally{
      setIsLoading(false)
    }
  };

  // Handle host delete
  const handleHostDelete = async () => {
    setShowDelete(false);
    try {
      setIsLoading(true)
      const res = await deleteHost("common/hosts/", user.token, currHost);
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      if (res.success) fetchDepartments();
    } catch {
      addAlert({ type: "error", message: "Error deleting host" });
    }
    finally{
      setIsLoading(false)
    }
  };

  // Add or update department
  const handleAddOrUpdate = async (dataObj, status = "add") => {
    setCurrDept(null);
    setIsLoading(true)
    const apiPath = status === "update" ? currDept._id : "create";
    try {
      const res = await adddepartment(
        "common/departments/" + apiPath,
        user.token,
        dataObj
      );
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      fetchDepartments();
    } catch {
      addAlert({ type: "error", message: "Error saving department" });
    }
    finally{
      setIsLoading(false)
    }
  };
  useEffect(() => {
    if (!["admin", "assetManager", "globalAssetManager"].includes(user.role)) {
      navigate("/notFound");
    }
  });
  if (departments.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={fetchDepartments}
          >
            Refresh
          </Button>
          <DepartmentModal
            open={showModal}
            DeptData={currDept}
            handleAddOrUpdate={handleAddOrUpdate}
            handleModalClose={() => setShowModal(false)}
          />
        </div>
        <GetStarted
          Title="No Departments Yet? Create One to Get Organized!"
          Description="Departments help you group users, hosts, and content under a unified structure. Create your first department to manage access, schedules, and playlists more efficiently."
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
          Departments
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="contained"
            onClick={() => setShowModal(true)}
            sx={{ background: "var(--button-color-secondary)" }}
          >
            Create Department
          </Button>
          <Button
            variant="outlined"
            onClick={fetchDepartments}
            sx={{ color: "var(--button-color-secondary)" }}
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Accordion List */}
      {isLoading == true && (
        <>
          {/* add a backdrip with loading spinner */}
          <div className="w-full h-full backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10">
            <CircularProgress />
          </div>
        </>
      )}

      <DepartmentModal
        open={showModal}
        DeptData={currDept}
        handleAddOrUpdate={handleAddOrUpdate}
        handleModalClose={() => setShowModal(false)}
      />

{/* Department List */}
<div className="flex-grow overflow-y-auto px-4">
  {departments.map((dep) => (
    <Accordion
      key={dep._id}
      className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Accordion Header */}
      <AccordionSummary sx={{ padding: '0px 0px 0px 1rem' }} expandIcon={<ExpandMoreIcon />}>
        <div className="grid grid-cols-4 w-full items-center">
          {/* Department name + avatar */}
          <div className="flex items-center gap-2">
            <MyAvatar
              name1={dep.name}
              imageUrl={process.env.REACT_APP_CDN_URL + dep.profileImg}
            />
            <span className="font-semibold text-gray-800 truncate">{dep.name}</span>
          </div>

          {/* Created At */}
          <span>
            {dep.createdAt
              ? new Date(dep.createdAt).toLocaleString()
              : '-'}
          </span>

          {/* Created By */}
          <span>
            {dep.createdBy?.email || '-'}
          </span>

          {/* Edit/Delete buttons */}
          <div className="flex justify-end gap-2">
            <Button
              size="small"
              sx={{ color: 'var(--button-color-secondary)' }}
              onClick={() => {
                setCurrDept(dep);
                setShowModal(true);
              }}
            >
              <EditIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              sx={{ color: 'var(--button-color-secondary)' }}
              onClick={() => {
                setCurrDept(dep);
                setShowDelete(true);
              }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          </div>
        </div>
      </AccordionSummary>

      {/* Accordion Details */}
      <AccordionDetails className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">

          {/* Section header */}
          <div className="col-span-2 border-b pb-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">Department Details</h3>
          </div>

          <div><b>Name</b></div>
          <div>{dep.name || '-'}</div>

          <div><b>Description</b></div>
          <div>{dep.description || '-'}</div>

          <div><b>Created By</b></div>
          <div>{dep.createdBy?.email || '-'}</div>

          <div><b>Created At</b></div>
          <div>
            {dep.createdAt ? new Date(dep.createdAt).toLocaleString() : '-'}
          </div>

          <div className="col-span-2 border-t pt-3 mt-3">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Hosts under this Department</h3>

            {/* Hosts Table */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b font-semibold text-gray-700">
                  <th className="text-left py-2 w-1/5">Host Name</th>
                  <th className="text-left py-2 w-1/6">Type</th>
                  <th className="text-left py-2 w-1/3">Host URL</th>
                  <th className="text-left py-2 w-1/4">Created By</th>
                  <th className="text-right py-2 w-1/6 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dep.devices && dep.devices.length > 0 ? (
                  dep.devices.map((host) => (
                    <tr key={host._id} className="border-b hover:bg-gray-100 transition-colors">
                      <td className="py-2">{host.name}</td>
                      <td>{DeviceType[host.type]}</td>
                      <td>
                        {host.hostUrl ? (
                          <a
                            href={host.hostUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {host.hostUrl}
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{host.createdBy?.email || '-'}</td>
                      <td className="text-right pr-4">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setCurrHost(host._id);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-3">
                      No hosts assigned to this department.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  ))}
</div>


      <AlertModal
        open={showDelete}
        title="Delete Department"
        description="Confirm to delete this department permanently"
        handleClose={() => setShowDelete(false)}
        handleMediaDelete={currHost ? handleHostDelete : handleDeptDelete}
      />
    </div>
  );
}
