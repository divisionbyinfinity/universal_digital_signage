import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LaunchIcon from "@mui/icons-material/Launch";
import AlertModal from "../../components/modals/Alert";
import { getschedulers, deleteScheduler } from "../../apis/api";
import { useNavigate } from "react-router-dom";
import { DeviceType } from "../../enums";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";
import GetStarted from "../../components/feedback/GetStarted";

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
};

const formatRange = (start, end) => `${formatDateTime(start)} to ${formatDateTime(end)}`;

const InfoBlock = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
      {label}
    </div>
    <div className="mt-2 text-sm font-medium text-slate-700">{value || "-"}</div>
  </div>
);

const LinkedValue = ({ href, value }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 transition hover:text-blue-800 hover:underline"
    >
      <span className="truncate">{value}</span>
      <LaunchIcon sx={{ fontSize: 16 }} />
    </a>
  ) : (
    <span className="text-sm font-medium text-slate-700">{value || "-"}</span>
  );

export default function Scheduler() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const navigate = useNavigate();

  const [schedules, setSchedules] = React.useState([]);
  const [showDelete, setShowDelete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const fetchSchedulers = async () => {
    setIsLoading(true);
    try {
      const data = await getschedulers("common/schedules/", user.token);
      if (data.success) {
        setSchedules(data.data || []);
      } else {
        addAlert({ type: "warning", message: data.message || "Failed to fetch schedules" });
      }
    } catch (err) {
      addAlert({ type: "error", message: "Error fetching schedulers" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedulerDelete = async () => {
    try {
      const res = await deleteScheduler("common/schedules", user.token, deleteId);
      if (res) {
        addAlert({
          type: res.success ? "success" : "warning",
          message: res.message,
        });
        if (res.success) {
          fetchSchedulers();
        }
        setShowDelete(false);
        setDeleteId(null);
      }
    } catch {
      addAlert({ type: "error", message: "Error deleting scheduler" });
    }
  };

  React.useEffect(() => {
    fetchSchedulers();
  }, []);

  const totalSchedules = schedules.length;
  const recurringSchedules = schedules.filter(
    (item) => item.frequency && item.frequency.toLowerCase() !== "once"
  ).length;
  const assignedSchedules = schedules.filter((item) => item.device || item.channel).length;

  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-4 page-backdrop">
        <div className="mb-4 flex items-center justify-between">
          <Tooltip title="Refresh">
            <Button
              variant="outlined"
              sx={{ color: "var(--button-color-secondary)" }}
              onClick={fetchSchedulers}
            >
              Refresh
            </Button>
          </Tooltip>
        </div>
        <GetStarted
          Title="No Schedulers Yet? Set Up Your Content Schedule!"
          Description="Schedulers define when and how often playlists are shown across devices and channels. Create your first schedule to automate content delivery with predictable timing."
          callback={() => {
            navigate("/scheduler/create");
          }}
        />
      </div>
    );
  }

  return (
    <div className="enterprise-page-shell page-backdrop">
      <div className="enterprise-list-body">
        <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
          <div className="enterprise-surface-strong relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-white/60 backdrop-blur-sm">
                <CircularProgress />
              </div>
            )}

            <div className="border-b border-slate-200/80 px-6 py-6 lg:px-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl space-y-4">
                  <span className="status-badge">Schedule control</span>
                  <h1 className="text-4xl font-semibold text-slate-950 md:text-5xl">
                    Build clearer playback schedules for every screen.
                  </h1>
                  <p className="max-w-2xl text-base text-slate-600">
                    Review timing windows, connected devices, and publishing ownership from one cleaner operations dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[42rem]">
                  <div className="metric-card">
                    <div className="metric-value">{totalSchedules}</div>
                    <div className="metric-label">Total schedules</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{recurringSchedules}</div>
                    <div className="metric-label">Recurring plans</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">{assignedSchedules}</div>
                    <div className="metric-label">Assigned outputs</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="contained"
                  onClick={() => navigate("/scheduler/create")}
                  sx={{ background: "var(--gradient-color)", borderRadius: "999px", px: 3 }}
                >
                  Create Schedule
                </Button>
                <Button
                  variant="outlined"
                  onClick={fetchSchedulers}
                  sx={{ color: "var(--button-color-secondary)", borderRadius: "999px", px: 3 }}
                >
                  Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-5 p-6 lg:p-8">
              {schedules.map((row) => (
                <Accordion
                  key={row._id}
                  disableGutters
                  className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(239,246,255,0.86))] shadow-[0_20px_50px_rgba(15,23,42,0.08)] before:hidden"
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ px: 0, minHeight: "unset", "& .MuiAccordionSummary-content": { my: 0 } }}
                  >
                    <div className="w-full px-5 py-5 sm:px-6">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                              <ScheduleIcon sx={{ fontSize: 20 }} />
                            </span>
                            <Chip
                              label={row.frequency || "Unscheduled"}
                              size="small"
                              sx={{
                                backgroundColor: "rgba(15, 118, 110, 0.12)",
                                color: "#0f766e",
                                fontWeight: 700,
                              }}
                            />
                            {row.department?.name ? (
                              <Chip
                                label={row.department.name}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(37, 99, 235, 0.12)",
                                  color: "#1d4ed8",
                                  fontWeight: 700,
                                }}
                              />
                            ) : null}
                          </div>

                          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                            <div className="space-y-2">
                              <Typography className="text-2xl font-semibold text-slate-950">
                                {row.name || "Untitled schedule"}
                              </Typography>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                <span className="inline-flex items-center gap-2">
                                  <CalendarMonthIcon sx={{ fontSize: 16 }} />
                                  {formatRange(row.startTime, row.endTime)}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <ApartmentIcon sx={{ fontSize: 16 }} />
                                  {row.createdBy?.email || "Unknown owner"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outlined"
                                sx={{ borderRadius: "999px", minWidth: 0 }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  navigate("/Scheduler/edit/" + row._id);
                                }}
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{ borderRadius: "999px", minWidth: 0 }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setDeleteId(row._id);
                                  setShowDelete(true);
                                }}
                              >
                                <DeleteIcon />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>

                  <AccordionDetails className="border-t border-slate-200/80 bg-white/80 px-5 py-5 sm:px-6">
                    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                      <InfoBlock label="Created At" value={formatDateTime(row.createdAt)} />
                      <InfoBlock label="Start Time" value={formatDateTime(row.startTime)} />
                      <InfoBlock label="End Time" value={formatDateTime(row.endTime)} />
                      <InfoBlock label="Department" value={row.department?.name || "Global"} />
                    </div>

                    <div className="mt-5 rounded-[24px] border border-slate-200/80 bg-slate-50/85 p-5">
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Description
                      </div>
                      <p className="mt-3 mb-0 text-sm leading-7 text-slate-600">
                        {row.description || "No description provided for this schedule."}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-5 xl:grid-cols-2">
                      <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Device output
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                              {row.device?.name || "No device assigned"}
                            </h3>
                          </div>
                          <Chip
                            label={row.device ? "Connected" : "Empty"}
                            size="small"
                            sx={{
                              backgroundColor: row.device
                                ? "rgba(34, 197, 94, 0.12)"
                                : "rgba(148, 163, 184, 0.18)",
                              color: row.device ? "#15803d" : "#64748b",
                              fontWeight: 700,
                            }}
                          />
                        </div>

                        <div className="mt-4 space-y-3">
                          <InfoBlock
                            label="Host Type"
                            value={row.device ? DeviceType[row.device.type] : "No device assigned"}
                          />
                          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Host URL
                            </div>
                            <div className="mt-2 min-w-0">
                              <LinkedValue
                                href={row.device?.hostUrl}
                                value={row.device?.hostUrl || "No URL available"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-slate-200/80 bg-white/85 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Channel output
                            </div>
                            <h3 className="mt-2 text-xl font-semibold text-slate-900">
                              {row.channel?.name || "No channel assigned"}
                            </h3>
                          </div>
                          <Chip
                            label={row.channel ? "Connected" : "Empty"}
                            size="small"
                            sx={{
                              backgroundColor: row.channel
                                ? "rgba(37, 99, 235, 0.12)"
                                : "rgba(148, 163, 184, 0.18)",
                              color: row.channel ? "#1d4ed8" : "#64748b",
                              fontWeight: 700,
                            }}
                          />
                        </div>

                        <div className="mt-4 space-y-3">
                          <InfoBlock
                            label="Channel Name"
                            value={row.channel?.name || "No channel assigned"}
                          />
                          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                              Channel URL
                            </div>
                            <div className="mt-2 min-w-0">
                              <LinkedValue
                                href={row.channel?.channelUrl}
                                value={row.channel?.channelUrl || "No URL available"}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AlertModal
        open={showDelete}
        handleClose={() => {
          setShowDelete(false);
          setDeleteId(null);
        }}
        handleMediaDelete={handleSchedulerDelete}
        title="Delete Schedule"
        description="Confirm to delete this scheduler permanently"
      />
    </div>
  );
}
