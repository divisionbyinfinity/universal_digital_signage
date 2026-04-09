import React, { useEffect, useState,useMemo } from "react";
import {
  Button,
  Box,
  Chip,
  CircularProgress,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import ImageList from "@mui/material/ImageList";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import MediaView from "./MediaView";
import Pagination from "../../components/pagination";
import AlertModal from "../../components/modals/Alert";
import FormControl from "@mui/material/FormControl";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import MultiSelect from "../../components/multiSelect";
import { useAlert } from "../../contexts/AlertContext";
import { gettags } from "../../apis/api";
import EnterpriseModal from "../../components/modals/EnterpriseModal";
export default function MediaLibrary() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, tags, setTagsData } = useConfig();
  const fileInputRef = React.useRef(null);
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const [openAlbumsUpload, setAlbumsUpload] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [currentDept, setCurrentDept] = useState(null);
  const [imageTag, setImageTag] = useState("default");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [currentImage, setCurrentImage] = useState(null);
  const [selectedtags, setSelectedTags] = useState([]);
  const [tag, setTag] = useState("");
  const handleTagsFilter = (name, value) => {
    let NewTagFilter = "";
    let filteredTags = value.map((t) => {
      t = t.replace(/ /g, "");
      t = t.replace(/,/g, "");
      t = t.replace(/;/g, "");
      return t;
    });
    filteredTags = [...new Set(filteredTags)];
    NewTagFilter = filteredTags.join(";");
    setTag(NewTagFilter);
  };

  useEffect(() => {
    handleMediaFetch();
  }, [currentPage, tag]);
  useEffect(() => {
    handleMediaFetch();
  }, [currentDept]);
  const selectCurrImg = (item) => {
    setCurrentImage(item);
  };
  const handleCurrPage = (page) => {
    setCurrentPage(page);
  };
  const handleAlbumsUploadClose = () => {
    if (loading) return;
    setAlbumsUpload(false);
    setImageTag("default");
    setFiles([]); // Clear the files when closing the modal
    setSelectedFiles([]); // Clear selected files
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
  };

  const handleMediaFetch = async () => {
    try {
      const querystring =
        process.env.REACT_APP_API_URL +
        "common/gallery/" +
        `?page=${currentPage}` +
        (currentDept ? `&department=${currentDept._id}` : "") +
        (tag ? `&tag=${tag}` : "");
      const data = await fetch(querystring, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }).then((res) => res.json());
      if (data.success) {
        // addAlert({ type: "success", message: data.message || "Images fetched successfully" });
        setMediaList(data.data);
        const restags= await gettags(user.token);
        if (restags.success) {
           const newtags = restags.data.map((i) => ({ _id: i, name: i }));
          setTagsData(newtags);
        }

        // Inside your component or function
        const totpages = data.totalPages ? data.totalPages : 0; // Replace with the actual total pages from the API response
        const currPage = data.currentPage ? data.currentPage : 1; // Replace with the current page from your state or props
        setCurrentPage(currPage);
        setTotalPages(totpages);
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error fetching images" });
    }
  };
  const handleMediaDelete = async () => {
    try {
      const imageId = currentImage._id;
      if (imageId) {
        const querystring =
          process.env.REACT_APP_API_URL + "common/gallery/" + `${imageId}`;
        const data = await fetch(querystring, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }).then((res) => res.json());
        if (data.success) {
          setCurrentImage(null);
          addAlert({ type: "success", message: data.message });
          handleMediaFetch();
        } else {
          setCurrentImage(null);
          addAlert({ type: "error", message: data.message });
        }
      }
    } catch (error) {
      console.error("Error fetching hosts:", error);
      addAlert({ type: "error", message: "Error deleting image" });
    }
  };

  useEffect(() => {
    const newSelectedFiles = selectAll
      ? Array(files.length).fill(true)
      : Array(files.length).fill(false);
    setSelectedFiles(newSelectedFiles);
  }, [selectAll]);

  const handleAlbumSelect = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles[index] = !newSelectedFiles[index];
    setSelectedFiles(newSelectedFiles);
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    //preventing poppin up of upload , in case no image is selected
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);

      setTimeout(() => {
        setAlbumsUpload(true);
      }, 0);
      setSelectAll(false);
      setTempData([]);
      setLoading(false);
      setSuccess(false);
      setError(null);
      setImageTag("default");

      event.target.value = null;
    } else {
      setAlbumsUpload(false);
      event.target.value = null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    let updatedFilesList = [];
    if (!selectAll) {
      updatedFilesList = files.filter((file, idx) => selectedFiles[idx]);
      setFiles(updatedFilesList);
    } else {
      updatedFilesList = files;
    }

    const batchCount = 10;

    const batches = Array.from(
      { length: Math.ceil(updatedFilesList.length / batchCount) },
      (_, index) => {
        const startIndex = index * batchCount;
        const endIndex = startIndex + batchCount;
        return updatedFilesList.slice(startIndex, endIndex);
      }
    );

    try {
      let uploadFailed = false;

      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const status = await handleUpload(batch, batchIndex, batchCount);

        if (!status) {
          uploadFailed = true;
          setError("Failed to upload files.");
          break;
        }
      }

      if (!uploadFailed) {
        await handleMediaFetch();
        setSuccess(true);
        handleAlbumsUploadClose();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve(Math.floor(video.duration) * 1000); // Convert to milliseconds
      };
      video.src = URL.createObjectURL(file);
      video.load();
    });
  };
  const handleUpload = async (batch, batchIndex, batchCount) => {
    const formDataImages = new FormData();
    const formDataVideos = new FormData();
    // setImageTag('default'); // Reset image tag //

    formDataImages.append("tags", imageTag);
    formDataVideos.append("tags", imageTag);

    const invalidFiles = [];
    const minHeight = 400;
    const minWidth = 400;

    // Validate and append image files
    const processImageFile = async (file) => {
      return new Promise((resolve) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
          formDataImages.append("files", file);
          // if (image.width >= minWidth && image.height >= minHeight) {
          //   formDataImages.append("files", file);
          // } else {
          //   invalidFiles.push({name:file.name,error:`Image dimensions should be at least ${minWidth}x${minHeight}px`});
          // }
          resolve();
        };
      });
    };

    // Validate and append video files
    const processVideoFile = async (file) => {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];

      if (validVideoTypes.includes(file.type)) {
        try {
          const duration = await getVideoDuration(file);
          formDataVideos.append("files", file);
          formDataVideos.append("durations[]", duration);
        } catch (error) {
          console.error(`Error processing video file ${file.name}:`, error);
          invalidFiles.push({ name: file.name, error: error.message });
        }
      } else {
        invalidFiles.push(file.name);
      }
    };

    // Iterate over the batch of files and process them
    await Promise.all(
      batch.map(async (file) => {
        if (file.type.startsWith("image/")) {
          return processImageFile(file);
        } else if (file.type.startsWith("video/")) {
          return processVideoFile(file);
        } else {
          invalidFiles.push({
            name: file.name,
            error: `Unsupported file type`,
          });
        }
      })
    );

    // Handle invalid files (show alert or log)
    if (invalidFiles.length > 0) {
      invalidFiles.forEach((file) => {
        addAlert({ type: "error", message: `${file.name}: ${file.error}` });
      });
      return false;
    }

    // Function to handle upload requests for both images and videos
    const uploadFiles = async (formData, url) => {
      if (formData.getAll("files").length > 0) {
        try {
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          });
          if (response.ok) {
            await handleMediaFetch();

            const currentBatchSize = batch.reduce(
              (accumulator, file) => Number(file.size) + accumulator,
              0
            );
            const updatedSize = Number(tempData.slice(-1)) + currentBatchSize;
            setTempData((prev) => [...prev, updatedSize]);

            return true;
          } else {
            throw new Error("Failed to upload files.");
          }
        } catch (error) {
          console.error("Error during upload:", error);
          return false;
        }
      }
      return false;
    };

    // Upload images
    const imageUploadSuccess = await uploadFiles(
      formDataImages,
      process.env.REACT_APP_API_URL + "common/gallery/uploadimages"
    );

    // Upload videos
    const videoUploadSuccess = await uploadFiles(
      formDataVideos,
      process.env.REACT_APP_API_URL + "common/gallery/uploadvideos"
    );

    // If both uploads failed, return false
    if (!imageUploadSuccess && !videoUploadSuccess) {
      return false;
    }

    return true;
  }; 
  if (fileInputRef.current) {
  fileInputRef.current.value = null;
}
const previewUrls = useMemo(() => {
  return files.map((file) => URL.createObjectURL(file));
}, [files]);

// Cleanup old object URLs when files change or component unmounts
useEffect(() => {
  return () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
  };
}, [previewUrls]);
  return (
    <div className="enterprise-page-shell page-backdrop">
      <div className="enterprise-list-body pr-1">
        <div className="rounded-2xl border border-slate-200/70 bg-white/58 p-4 md:p-5 backdrop-blur-md">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">


          {tags.length > 0 && (
            <MultiSelect
              data={tags}
              selectedItems={selectedtags}
              handleInputChange={handleTagsFilter}
              name="tags"
              sx={{minWidth:200, maxWidth:300}}
              
            />
          )}

          {departments.length > 0 && (
            <div>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="department-select-label" color="primary">
                  Departments
                </InputLabel>
                <Select
                  labelId="department-select-label" // must match InputLabel id
                  id="department-select"
                  value={currentDept ? currentDept._id : ""}
                  label="Departments" // must match InputLabel text
                  color="primary"
                  onChange={async (event) => {
                    const selectedDepartmentId = event.target.value;
                    const selectedDepartment = departments.find(
                      (dep) => dep._id === selectedDepartmentId
                    );
                    await setCurrentDept(selectedDepartment);
                  }}
                >
                  {departments.map((dep) => (
                    <MenuItem key={dep._id} value={dep._id}>
                      {dep.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="">All Departments</MenuItem>
                </Select>
              </FormControl>
            </div>
          )}
          <div>
            <Button
              variant="outlined"
              color="primary"
              onClick={async () => {
                handleMediaFetch();
                setCurrentDept(null);
                setTag("");
                setSelectedTags([]);
              }}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <input
            ref={fileInputRef}
            accept="image/*,video/*"
            style={{ display: "none" }}
            id="inputFile"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="inputFile">
            <Button
              component="span"
              variant="contained"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              Add Media
              <PermMediaIcon sx={{ marginX: 1 }} />
            </Button>
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/70 bg-white/42 p-3 md:p-4 backdrop-blur-sm mt-4">
        <MediaView
          user={user}
          mediaList={mediaList}
          departments={departments}
          selectCurrImg={selectCurrImg}
        />
      </div>

      <EnterpriseModal
        open={openAlbumsUpload}
        onClose={handleAlbumsUploadClose}
        title="Upload Media"
        subtitle="Select files, pick tags, and upload in bulk with consistent metadata."
        maxWidth="md"
        showClose={!loading}
        actions={
          <>
            <Button onClick={handleAlbumsUploadClose} disabled={loading}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !imageTag || !selectedFiles.some(Boolean)}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </>
        }
      >
        <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 2 }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                borderRadius: 2,
                background: "rgba(248,250,252,0.82)",
                backdropFilter: "blur(4px)",
              }}
            >
              <CircularProgress size={32} />
              <Box sx={{ color: "#475569", fontSize: "0.95rem", fontWeight: 600 }}>
                Uploading media...
              </Box>
            </Box>
          )}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center", justifyContent: "space-between" }}>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleSelectAll}
                  name="loading"
                  color="primary"
                  disabled={loading}
                />
              }
              label="Select all"
            />
            <Chip
              label={`${selectedFiles.filter(Boolean).length}/${files.length} selected`}
              color="primary"
              variant="outlined"
            />
          </Box>

          <TextField
            error={imageTag.length === 0}
            value={imageTag}
            onChange={(e) => setImageTag(e.target.value)}
            required
            fullWidth
            disabled={loading}
            id="image_tags"
            label="Tags"
            size="small"
            variant="outlined"
          />

          {files.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 1.5,
                maxHeight: "50vh",
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {files.map((item, idx) => (
                <Box
                  key={item.name}
                  sx={{
                    position: "relative",
                    height: 180,
                    borderRadius: 2,
                    border: "1px solid rgba(148, 163, 184, 0.35)",
                    background: "rgba(15, 23, 42, 0.96)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item?.type?.includes("image") ? (
                        <img
                          src={previewUrls[idx]}
                          alt={item?.name || "media"}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : item?.type?.includes("video") ? (
                        <video
                          src={previewUrls[idx]}
                          controls
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                        />
                      ) : (
                        <p>Unsupported file type</p>
                      )}

                    <IconButton
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        margin: "0.1rem",
                        backgroundColor: selectedFiles[idx]
                          ? "var(--primary-color)"
                          : "rgba(148,163,184,0.85)",
                        color: selectedFiles[idx] ? "white" : "#0f172a",
                      }}
                      onClick={() => handleAlbumSelect(idx)}
                    >
                      <StarBorderIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </EnterpriseModal>

      <AlertModal
        open={currentImage !== null}
        handleClose={() => {
          setCurrentImage(null);
        }}
        handleMediaDelete={handleMediaDelete}
        title="Delete Image"
        description="Confirm to delete this image permanently"
      />
        </div>
      </div>

      {totalPages > 1 && (
        <div className="enterprise-pagination-bar">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={handleCurrPage}
            disabled
          />
        </div>
      )}
    </div>
  );
}
