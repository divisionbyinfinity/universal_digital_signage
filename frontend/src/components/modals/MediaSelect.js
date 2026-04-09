import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { useAuth } from "../../contexts/AuthContext";
import { useConfig } from "../../contexts/ConfigContext";
import { useAlert } from "../../contexts/AlertContext";
import Pagination from "../pagination";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import EnterpriseModal from "./EnterpriseModal";

export default function MediaSelect({ open, handleImageSelect, handleClose }) {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  const isLg = useMediaQuery(theme.breakpoints.down("lg"));
  const [mediaList, setMediaList] = useState([]);
  const { user } = useAuth();
  const addAlert = useAlert();
  const { departments, tags, setTagsData } = useConfig();
  const [currentDept, setCurrentDept] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [tag, setTag] = useState("");
  const imageCols = isXs ? 1 : isMd ? 2 : isLg ? 3 : 4;
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
      <EnterpriseModal
        open={open}
        onClose={handleClose}
        title="Select Media"
        maxWidth="lg"
        contentDividers
        actions={
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              autoFocus
              variant="contained"
              disabled={!selectedMedia}
              onClick={() => {
                handleImageSelect({
                  _id: selectedMedia._id,
                  mediaUrl: selectedMedia.mediaUrl,
                  mediaType: selectedMedia.mediaType,
                  mediaDuration: selectedMedia.mediaDuration,
                });
                handleClose();
              }}
            >
              Submit
            </Button>
          </>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%", maxHeight: { xs: "56vh", md: "62vh" } }}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={(page) => {
              setCurrentPage(page);
            }}
            disabled
          />
          <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
            <ImageList cols={imageCols} gap={10} sx={{ m: 0 }}>
              {mediaList?.length > 0 &&
                mediaList.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      border: "1px solid var(--bg-color-secondary)",
                      position: "relative",
                      width: "100%",
                      height: isXs ? "180px" : "220px",
                    }}
                    className="relative cursor-pointer flex items-center justify-center rounded-lg overflow-hidden"
                    onClick={() => {
                      setSelectedMedia(item);
                    }}
                  >
                    <ImageListItem sx={{ width: "100%", height: "100%" }}>
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
                          objectFit: "cover",
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
                          height: "100%",
                          objectFit: "cover",
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
          </Box>

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleCurrPage={(page) => {
              setCurrentPage(page);
            }}
            disabled
          />
        </Box>
      </EnterpriseModal>
    </React.Fragment>
  );
}
