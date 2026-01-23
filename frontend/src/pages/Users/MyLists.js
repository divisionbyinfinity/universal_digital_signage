import MyAvatar from "../../components/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertModal from "../../components/modals/Alert";
import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@mui/material";

export default function MyLists({ usersList, handleUserEdit, handleUserDelete }) {
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const { user } = useAuth();

  const filteredUsers = usersList.filter((p) => user._id !== p._id);

  return (
    <div className="flex-grow overflow-y-auto px-4">
      {filteredUsers.map((person) => (
        <Accordion
          key={person._id}
          className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <AccordionSummary sx={{ padding: "0px 0px 0px 1rem" }} expandIcon={<ExpandMoreIcon />}>
            <div className="grid grid-cols-4 w-full items-center">
              {/* Name + Avatar */}
              <div className="flex items-center gap-2">
                <MyAvatar
                  name1={person.firstName}
                  imageUrl={process.env.REACT_APP_CDN_URL + person.profileImg}
                />
                <span className="font-medium text-gray-800 truncate">
                  {person.firstName} {person.lastName}
                </span>
              </div>

              {/* Role */}
              <span className="text-gray-600 capitalize">{person.role}</span>

              {/* Department */}
              <span className="text-gray-600">{person.departmentId?.name || "-"}</span>

              {/* Actions */}
              {user.role === "admin" && (
                <div className="flex justify-end gap-2 pr-2">
                  <Button
                    size="small"
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => handleUserEdit(person)}
                  >
                    <EditIcon fontSize="small" />
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "var(--button-color-secondary)" }}
                    onClick={() => {
                      setDeleteId(person._id);
                      setShowDelete(true);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              )}
            </div>
          </AccordionSummary>

          {/* Dropdown details section */}
          <AccordionDetails className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-y-3 text-gray-700 text-sm">
              <div className="col-span-2 border-b pb-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-800">User Details</h3>
              </div>

              <div><b>First Name</b></div>
              <div>{person.firstName}</div>

              <div><b>Last Name</b></div>
              <div>{person.lastName}</div>

              <div><b>Email</b></div>
              <div>{person.email}</div>

              <div><b>Role</b></div>
              <div>{person.role}</div>

              <div><b>Department</b></div>
              <div>{person.departmentId?.name || "-"}</div>

              <div><b>Created At</b></div>
              <div>
                {person.createdAt ? new Date(person.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Delete confirmation modal */}
      <AlertModal
        open={showDelete}
        handleClose={() => setShowDelete(false)}
        handleMediaDelete={() => handleUserDelete(deleteId)}
        title="Delete User"
        description="Confirm to delete this user permanently"
      />
    </div>
  );
}
