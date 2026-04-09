import { useState, useEffect } from "react";
import {
  getdepartments,
  adddepartment,
  deletedepartment,
  gethosts,
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
  const { departments, setDepartmentsData,setHostsData } = useConfig();
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
   const handleDevicesFetch = async () => {
      try {
        setIsLoading(true);
        const data = await gethosts("common/hosts/", user.token);
        if (data.success) {
          setHostsData(data.data);
        } else {
          addAlert({
            type: "warning",
            message: data.message || "Failed to fetch hosts",
          });
        }
      } catch (error) {
        console.error("Error fetching hosts:", error);
        addAlert({ type: "error", message: "Error fetching hosts" });
      } finally {
        setIsLoading(false);  
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
      const res = await deleteHost("common/hosts/", user.token, currHost?._id);
      addAlert({
        type: res.success ? "success" : "warning",
        message: res.message,
      });
      if (res.success) {
        fetchDepartments();
        handleDevicesFetch();
      }
    } catch {
      addAlert({ type: "error", message: "Error deleting host" });
    }
    finally{
      setIsLoading(false)
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);
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
  }, [user.role, navigate]);
  if (departments.length === 0) {
    return (
      <div className="p-4 page-backdrop">
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
  const handleCleanUp=()=>{
    setCurrDept(null)
    setCurrHost(null)
  }
  return (
    <div className="enterprise-page-shell page-backdrop">
      {/* Header */}
      <div className="enterprise-page-header">
        <Typography variant="h5" className="font-semibold text-slate-900">
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
          <div className="w-full h-full bg-white/45 backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 z-10 rounded-2xl">
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

      <div className="enterprise-table-header grid-cols-4">
        <span>Department</span>
        <span>Created At</span>
        <span>Created By</span>
        <span className="text-right pr-8">Actions</span>
      </div>

{/* Department List */}
<div className="enterprise-list-body px-2 sm:px-3">
  {departments.map((dep) => (
    <Accordion
      key={dep._id}
      className="my-2 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm hover:shadow-md transition-shadow"
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
            <span className="font-semibold text-slate-900 truncate">{dep.name}</span>
          </div>

          {/* Created At */}
          <span>
            {dep.createdAt
              ? new Date(dep.createdAt).toLocaleString()
              : '-'}
          </span>

          {/* Created By */}
          <span>
            {dep.createdBy || '-'}
          </span>

          {/* Edit/Delete buttons */}
          <div className="flex justify-end gap-2">
            <Button
              size="small"
              sx={{ color: 'var(--button-color-secondary)' }}
              onClick={() => {
                handleCleanUp()
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
                handleCleanUp()
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
      <AccordionDetails className="bg-slate-50/90 rounded-2xl p-4">
        <div className="grid grid-cols-2 gap-y-3 text-slate-700 text-sm">

          {/* Section header */}
          <div className="col-span-2 border-b border-slate-200 pb-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-900">Department Details</h3>
          </div>

          <div><b>Name</b></div>
          <div>{dep.name || '-'}</div>

          <div><b>Description</b></div>
          <div>{dep.description || '-'}</div>

          <div><b>Created By</b></div>
          <div>{dep.createdBy || '-'}</div>

          <div><b>Created At</b></div>
          <div>
            {dep.createdAt ? new Date(dep.createdAt).toLocaleString() : '-'}
          </div>

          <div className="col-span-2 border-t pt-3 mt-3">
            <h3 className="text-md font-semibold text-slate-900 mb-2">Hosts under this Department</h3>

            
                {dep.devices && dep.devices.length > 0 ? 
                  (<table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 font-semibold text-slate-700">
                        <th className="text-left py-2 w-1/5">Host Name</th>
                        <th className="text-left py-2 w-1/6">Type</th>
                        <th className="text-left py-2 w-1/3">Host URL</th>
                        <th className="text-left py-2 w-1/4">Created By</th>
                        <th className="text-right py-2 w-1/6 pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dep.devices.map((host) => (
                        
                    <tr key={host._id} className="border-b border-slate-200 hover:bg-slate-100/70 transition-colors">
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
                      <td>{host.createdBy || '-'}</td>
                      <td className="text-right pr-4">
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setCurrHost(host);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>))}

                    </tbody>
                  </table>
                  ):(
                    <div className="text-center text-slate-500 py-4">
                      No hosts assigned to this department.
                    </div>
                  )}
                
              
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  ))}
</div>


      <AlertModal
        open={showDelete}
        title="Delete Department"
        description={currHost ? `Are you sure you want to delete the host "${currHost.name}" permanently?` : `Are you sure you want to delete the department "${currDept?.name}" permanently?`}
        handleClose={() => setShowDelete(false)}
        handleMediaDelete={currHost ? handleHostDelete : handleDeptDelete}
      />
    </div>
  );
}
