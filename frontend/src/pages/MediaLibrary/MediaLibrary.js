import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  duration,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import { green } from "@mui/material/colors";
import MediaView from "./MediaView";
import Pagination from "../../components/pagination";
import AlertModal from "../../components/modals/Alert";
import FormControl from "@mui/material/FormControl";
import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import MultiSelect from "../../components/multiSelect";
import GetStarted from "../../components/feedback/GetStarted";
import { useAlert } from "../../contexts/AlertContext";
import { gettags } from "../../apis/api";
export default function MediaLibrary() {
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, tags, setTagsData } = useConfig();
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
      setAlbumsUpload(true);
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
    }

    updatedFilesList = files;

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
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        const status = await handleUpload(batch, batchIndex, batchCount);
        batchIndex++;
        if (batchIndex >= batches.length) {
          setFiles([]);
          setSelectedFiles([]);
          setImageTag("default");
          setLoading(false);
          setSuccess(true);
          setAlbumsUpload(false);
          handleMediaFetch();
        }

        if (!status) {
          setError("Failed to upload files.");
          setLoading(false);
        }
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve(video.duration * 1000); // Convert to milliseconds
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
  return (
    <div className="h-full flex  flex-col justify-between gap-2 overflow-auto ">
      <div>
      <div className="flex space-between items-center p-4 gap-4">
        <div className="flex gap-4 ">


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

        <div className="flex flex-row-reverse">
          <input
            //actept image or videos
            accept="image/*,video/*"
            className="input"
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

      <MediaView
        user={user}
        mediaList={mediaList}
        departments={departments}
        selectCurrImg={selectCurrImg}
      />

      <Dialog
        open={openAlbumsUpload}
        aria-labelledby="upload_images_dialog"
        aria-describedby="upload_images_dialog_description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="upload_images_dialog">Albums Upload</DialogTitle>
        <DialogContent>
          <div>
            <FormControlLabel
              control={
                <Switch
                  onChange={handleSelectAll}
                  name="loading"
                  color="primary"
                />
              }
              label="Select all"
            />
          </div>

          {files.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "start",
                overflow: "hidden",
                minHeight: "500px",
              }}
            >
              {files.map((item, idx) => (
                <div
                  key={item.name}
                  className="flex items-center justify-center h-40 bg-black rounded relative "
                >
                  <div>
                    {item?.type?.includes("image") ? (
                      <img
                        src={URL.createObjectURL(item)}
                        alt={item?.name || "media"}
                        loading="lazy"
                        style={{
                          width: "250px",
                          objectFit: "cover",
                        }}
                      />
                    ) : item?.type?.includes("video") ? (
                      <video
                        src={URL.createObjectURL(item)}
                        controls
                        loading="lazy"
                        style={{
                          width: "250px",
                          objectFit: "cover",
                        }}
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
                          : "var(--button-disabled-color)",
                        color: selectedFiles[idx] ? "white" : "black",
                      }}
                      onClick={() => handleAlbumSelect(idx)}
                    >
                      <StarBorderIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>

        <DialogActions>
          <TextField
            error={imageTag.length === 0}
            value={imageTag}
            onChange={(e) => setImageTag(e.target.value)}
            required
            fullWidth
            id="image_tags"
            label="Tags"
            variant="outlined"
          />
          <Button onClick={handleAlbumsUploadClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!imageTag || selectedFiles.length === 0}
            sx={{ padding: "0.5rem 1rem !important" }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleCurrPage={handleCurrPage}
        disabled
        />
    </div>
  );
}
