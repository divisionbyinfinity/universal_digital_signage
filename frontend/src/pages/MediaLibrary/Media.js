import { useParams } from "react-router-dom";
import { getmedia, editmedia } from "../../apis/api";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import MovieCreationOutlinedIcon from "@mui/icons-material/MovieCreationOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

const DisplayTextField = ({ label, value }) => (
  <TextField
    label={label}
    value={value}
    InputProps={{
      readOnly: true,
    }}
    fullWidth
    variant="standard"
  />
);

const EditableTextField = ({ label, name, value, onChange, multiline = false }) => (
  <TextField
    label={label}
    name={name}
    multiline={multiline}
    value={value}
    onChange={onChange}
    fullWidth
    focused
    maxRows={multiline ? 4 : undefined}
    variant="standard"
  />
);

const formatDateTime = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const getFileName = (mediaUrl = "") => {
  if (!mediaUrl) return "-";
  const segments = mediaUrl.split("/");
  return segments[segments.length - 1] || mediaUrl;
};

export default function Media() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { imageId } = useParams();
  const [media, setMedia] = useState(null);
  const [formData, setFormData] = useState({ name: "", tags: "" });
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const data = await getmedia(`common/gallery/${imageId}`, user.token);
      if (data.success) {
        setMedia({ ...data.data, name: data.data.name, tags: data.data.tags });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching media:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await editmedia(
        "common/gallery/" + media._id + `?name=${formData.name}&tags=${formData.tags}`,
        user.token
      );
      if (res.success) {
        addAlert({ type: "success", message: res.message });
        fetchMedia();
      } else {
        addAlert({ type: "error", message: res.message });
      }
    } catch (err) {
      addAlert({ type: "error", message: "cannot edit the image" });
    }
  };

  useEffect(() => {
    if (imageId) {
      fetchMedia();
    } else {
      setLoading(false);
    }
  }, [imageId]);

  useEffect(() => {
    if (media) {
      setInitialdata();
    }
  }, [media]);

  const handleImageEdit = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const setInitialdata = () => {
    setFormData({ name: media.name, tags: media.tags });
  };

  return (
    <div className="enterprise-page-shell page-backdrop">
      <div className="enterprise-list-body">
        <div className="section-shell px-4 py-8 sm:px-6 lg:px-8">
          <div className="enterprise-surface-strong overflow-hidden">
            {loading && (
              <div className="flex min-h-[24rem] items-center justify-center">
                <CircularProgress />
              </div>
            )}

            {!loading && media !== null && (
              <div className="grid lg:grid-cols-[minmax(0,1.3fr)_minmax(22rem,0.9fr)]">
                <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_32%),linear-gradient(145deg,#020617_0%,#0f172a_55%,#1e293b_100%)] p-6 sm:p-8">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    <Chip
                      icon={media.mediaType == 2 ? <MovieCreationOutlinedIcon /> : <ImageOutlinedIcon />}
                      label={media.mediaType == 2 ? "Video asset" : "Image asset"}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.14)",
                        color: "#f8fafc",
                        fontWeight: 700,
                        "& .MuiChip-icon": { color: "#f8fafc" },
                      }}
                    />
                    <Chip
                      icon={<LabelOutlinedIcon />}
                      label={media.department?.name || "Global library"}
                      sx={{
                        backgroundColor: "rgba(14,165,233,0.18)",
                        color: "#e0f2fe",
                        fontWeight: 700,
                        "& .MuiChip-icon": { color: "#e0f2fe" },
                      }}
                    />
                  </div>

                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 shadow-[0_28px_70px_rgba(2,6,23,0.38)] backdrop-blur">
                    <div className="flex min-h-[22rem] items-center justify-center bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0))] p-4 sm:p-6">
                      {media.mediaType == 1 ? (
                        <img
                          src={`${process.env.REACT_APP_CDN_URL}${media?.mediaUrl}`}
                          className="max-h-[70vh] w-full rounded-[22px] object-contain"
                          alt={media?.name || "media asset"}
                        />
                      ) : media.mediaType == 2 ? (
                        <video
                          src={`${process.env.REACT_APP_CDN_URL}${media?.mediaUrl}`}
                          controls
                          loading="lazy"
                          className="max-h-[70vh] w-full rounded-[22px] object-contain shadow-xl"
                          onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/150"
                          className="h-auto w-60 rounded-[22px] object-cover"
                          alt="Unknown Media"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-5 rounded-[24px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                    <div className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
                      Asset file
                    </div>
                    <div className="mt-2 break-all text-sm font-medium text-slate-100">
                      {getFileName(media.mediaUrl)}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5">
                        <UpdateOutlinedIcon sx={{ fontSize: 16 }} />
                        Updated {formatDateTime(media.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 sm:p-8">
                  <div className="space-y-4">
                    <span className="status-badge">Media editor</span>
                    <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
                      Refine asset details without leaving the preview.
                    </h1>
                    <p className="max-w-xl text-base text-slate-600">
                      Update the media name and tags while keeping file metadata and timestamps visible in one cleaner inspection panel.
                    </p>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="metric-card">
                      <div className="metric-label">Size</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">{media.size || "-"}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-label">Created</div>
                      <div className="mt-2 text-lg font-semibold text-slate-950">
                        {formatDateTime(media.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6 rounded-[28px] border border-slate-200/80 bg-slate-50/85 p-5 sm:p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <EditableTextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleImageEdit}
                      />
                      <DisplayTextField label="Size" value={media.size || "-"} />
                    </div>

                    <EditableTextField
                      label="Tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleImageEdit}
                      multiline
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <DisplayTextField label="Created At" value={formatDateTime(media.createdAt)} />
                      <DisplayTextField label="Updated At" value={formatDateTime(media.updatedAt)} />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-slate-500">
                      Changes are saved only when you submit this form.
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outlined"
                        disabled={media.name === formData.name && media.tags === formData.tags}
                        color="error"
                        onClick={setInitialdata}
                        sx={{ borderRadius: "999px", px: 3 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        disabled={media.name === formData.name && media.tags === formData.tags}
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ borderRadius: "999px", px: 3 }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
