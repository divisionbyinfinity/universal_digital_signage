import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";
import Pagination from "../pagination";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function MediaSelect({ open, handleImageSelect, handleClose }) {
  const [mediaList, setMediaList] = useState([]);
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, tags, setTagsData } = useConfig();
  const [currentDept, setCurrentDept] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [tag, setTag] = useState("");
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
        setMediaList(data.data);
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
  useEffect(() => {
    handleMediaFetch();
  }, [currentPage]);
  return (
    <React.Fragment>
      <BootstrapDialog
        maxWidth="lg"
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Select Media
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers className="relative">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={(page) => {
              setCurrentPage(page);
            }}
            disabled
          />
          <ImageList sx={{ height: "80%" }} cols={4} gap={8}>
            {mediaList?.length > 0 &&
              mediaList.map((item) => (
                <div
                  key={item._id}
                  style={{
                    border: "1px solid var(--bg-color-secondary)",
                    position: "relative",
                    width: "250px",
                    height: "250px",
                  }}
                  className="relative cursor-pointer flex items-center justify-center"
                  onClick={() => {
                    setSelectedMedia(item);
                  }}
                >
                  <ImageListItem>
                    {item.mediaType == 1 && (
                      <img
                        srcSet={`${
                          process.env.REACT_APP_CDN_URL + item.mediaUrl
                        }`}
                        src={`${process.env.REACT_APP_CDN_URL + item.mediaUrl}`}
                        alt={item.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          maxHeight: "250px",
                        }}
                      />
                    )}
                    {item.mediaType == 2 && (
                      <video
                        src={`${process.env.REACT_APP_CDN_URL + item.mediaUrl}`}
                        controls
                        loading="lazy"
                        style={{
                          width: "100%",
                          maxHeight: "150px",
                          minWidth: "150px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                        onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                      />
                    )}
                  </ImageListItem>
                  <Link to={`/gallery/image/${item._id}`}>
                    <ImageListItemBar
                      title={item.name}
                      sx={{
                        background: "rgba(0, 0, 0, 0.6)",
                      }}
                    />
                  </Link>

                  {item._id === selectedMedia?._id && (
                    <div className="absolute top-0 right-0">
                      <Tooltip title="Select Media">
                        <IconButton>
                          <CheckCircleIcon
                            style={{ color: "var(--primary-color)" }}
                          />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
              ))}
          </ImageList>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={(page) => {
              setCurrentPage(page);
            }}
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              handleImageSelect({
                _id: selectedMedia._id,
                mediaUrl: selectedMedia.mediaUrl,
                mediaType: selectedMedia.mediaType,
              });
              handleClose();
            }}
          >
            Select
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
