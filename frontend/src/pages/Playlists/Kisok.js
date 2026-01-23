import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Star from "@mui/icons-material/Star";
import Checkbox from "@mui/material/Checkbox";
import "./kisokcss.css";
import { FormControl } from "@mui/material";
import { getRandomId } from "../../helper/helper";
import { useConfig } from "../../contexts/ConfigContext";
import { useAuth } from "../../contexts/AuthContext";
import React, { useState, useEffect } from "react";

import {
  getmedia,
  getplaylistbyid,
  editplaylistkisok,
  createplaylistkisok,
  cloneplaylistkisok,
} from "../../apis/api";

import PlaylistCssModal from "./Modals/PlaylistCssModal";
import TextContentModal from "./Modals/TextContentModal";
import SlideImgCssModal from "./Modals/SlideImgCssModal";
import BottomImagesCssModal from "./Modals/BottomImagesCssModal";
import SimpleBackdrop from "../../components/Loading";
import SocialMediaModal from "./Modals/SocialMediaModal";
import { useParams } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import CustomSelect from "../../components/forms/CustomSelect";
import Tooltip from "@mui/material/Tooltip";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
import SocialMediasIcons from "./SocialMediasIcons";
import MediaSelect from "../../components/modals/MediaSelect";
const fullScreenClass = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
};
function Kisok() {
  const { id } = useParams();
  const { departments } = useConfig();
  const { user } = useAuth();
  const addAlert = useAlert();
  const [filterTag, setFilterTag] = useState("");
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevslideimport, setPrevSlideImport] = useState(false);
  const [PlaylistObj, setPlaylistObj] = useState({
    name: "",
    description: "",
    department: "",
    playlistType: "3",
    slides: [],
    style: {
      bgColor: "lightgray",
      paddingX: "2rem",
      paddingY: "2rem",
      topGap: "2rem",
      imgContbgColor: "white",
      slideNobgColor: "lightgreen",
      slideNoTextColor: "black",
      // captionGap:'10px',
      captionAlign: "center",
      textContGap: "10px",
      captionTextColor: "black",
      captionFontSize: "12px",
      captionBorderColor: "black",
      captionBorderRadius: "5px",
      headingBoxShadowColor: "black",
      headingTextColor: "#000000",
      subtitleTextColor: "#000000",
      bulletTextColor: "#000000",
      paragraphTextColor: "#000000",
      textContentBgColor: "transparent",
      FontSize: "8px",
      headingFontSize: "14px",
      subHeadingFontSize: "10px",
      bulletFontSize: "10px",
      paragraphFontSize: "12px",
      iconsColor: "white",
      iconSize: "large",
      fontFamily: "Arial",
      bottomImgbgColor: "black",
      bottomImgActiveBorder: "blue",
      bottomActiveShadow: "white",
      bottomImageAlign: "center",
      bulletGap: "4px",
    },
  });
  const [slide, setSlide] = useState({
    image: null,
    caption: "Your Caption",
    heading: "Your Title",
    subtitle: "Your Sub Title",
    bullets: ["Your bullet point"],
    paragraph: "Your Paragraph",
    sociallinks: [],
  });
  //modal
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [headingModalOpen, setHeadingModalOpen] = useState(false);
  const [slideImageModal, setSlideImageModal] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [PlaylistCssModalOpen, setPlaylistCssModalOpen] = useState(false);
  const [TextContentModalOpen, setTextContentModalOpen] = useState(false);
  const [bottomImageModalOpen, setBottomImageModalOpen] = useState(false);
  const [socialMediaModalOpen, setSocialMediaModalOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const MainCss = {
    backgroundColor: PlaylistObj.style.bgColor,
    padding: `${PlaylistObj.style.paddingY} ${PlaylistObj.style.paddingX}`,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  };
  const CaptionNoCss = {
    backgroundColor: PlaylistObj.style.slideNobgColor,
    color: PlaylistObj.style.slideNoTextColor,
  };
  const CaptionTextcss = {
    padding: "10px",
    color: PlaylistObj.style.captionTextColor,
    fontSize: PlaylistObj.style.captionFontSize,
    textAlign: PlaylistObj.style.captionAlign,
    gap: PlaylistObj.style.captionGap,
    border: `1px solid ${PlaylistObj.style.captionBorderColor}`,
    borderRadius: PlaylistObj.style.captionBorderRadius,
  };
  const HeadingTextcss = {
    borderRadius: "5px",
    marginTop: "20px",
    width: "100%",
    padding: "2px 10px",
    boxShadow: `0 0 10px 1px ${PlaylistObj.style.headingBoxShadowColor} `,
  };
  const TitleTextcss = {
    color: PlaylistObj.style.headingTextColor,
    fontFamily: PlaylistObj.style.headingFont,
    fontSize: PlaylistObj.style.headingFontSize,
  };
  const SubTitleTextcss = {
    color: PlaylistObj.style.subtitleTextColor,
    fontFamily: PlaylistObj.style.headingFont,
    fontSize: PlaylistObj.style.subHeadingFontSize,
  };
  const BulletTextCss = {
    color: PlaylistObj.style.bulletTextColor,
    fontFamily: PlaylistObj.style.headingFont,
    fontSize: PlaylistObj.style.bulletFontSize,
  };
  const BottomImgcss = {
    backgroundColor: PlaylistObj.style.bottomImgbgColor,
  };
  const BottomImgActiveCss = {
    border: `5px solid ${PlaylistObj.style.bottomImgActiveBorder}`,
    boxShadow: PlaylistObj.style.bottomActiveShadow,
    backgroundColor: PlaylistObj.style.bottomImgbgColor,
  };

  const handlePlaylistFeilds = (e) => {
    const { name, value } = e.target;
    setPlaylistObj({ ...PlaylistObj, [name]: value });
  };
  const handlePlaylistCss = (e) => {
    const { name, value } = e.target;
    setPlaylistObj({
      ...PlaylistObj,
      style: { ...PlaylistObj.style, [name]: value },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSlide({ ...slide, [name]: value });
  };
  const handleBulletsChange = (e, index) => {
    let temp = slide.bullets;
    temp[index] = e.target.value;
    setSlide({ ...slide, bullets: temp });
  };
  const handleAddSlide = () => {
    const tempSlide = { ...slide };
    if (tempSlide._id == undefined) {
      tempSlide._id = getRandomId();
    }
    const existingSlide = slides.find((i) => i._id == tempSlide._id);
    if (existingSlide) {
      // replace the existing slide with the new one
      const tempSlides = [...slides];
      const index = slides.findIndex((i) => i._id == tempSlide._id);
      tempSlides[index] = tempSlide;
      setSlides(tempSlides);
    } else {
      setSlides([...slides, tempSlide]);
    }
    setSlide({
      image: null,
      caption: "Your Caption",
      heading: "Your Title",
      subtitle: "Your Sub Title",
      bullets: ["Your bullet point"],
      paragraph: "Your Paragraph",
      sociallinks: [],
    });
    setPrevSlideImport(false);
  };
  const handleCreateNewSlide = () => {
    setSlide({
      image: null,
      caption: "Your Caption",
      heading: "Your Title",
      subtitle: "Your Sub Title",
      bullets: ["Your bullet point"],
      paragraph: "Your Paragraph",
      sociallinks: [],
    });
  };

  const handleBulletAdd = () => {
    let temp = slide.bullets;
    temp.push("Your bullet point");
    setSlide({ ...slide, bullets: temp });
  };
  const HandleCurrentSlide = (slide) => {
    setSlide(slide);
  };
  const HandleCreatePlaylist = async () => {
    // return
    setIsLoading(true);
    const Playlist = { ...PlaylistObj, slides: slides };
    const filteredSlides = Playlist.slides.map((slide) => {
      return {
        image: slide.image._id,
        caption: slide.caption,
        heading: slide.heading,
        subtitle: slide.subtitle,
        bullets: slide.bullets,
        paragraph: slide.paragraph,
        sociallinks: slide.sociallinks,
      };
    });
    Playlist.slides = filteredSlides;
    let response = null;
    //make the condition to check if playlist is new or existing

    if (id) {
      response = await editplaylistkisok({ ...Playlist }, id, user.token);
    } else {
      response = await createplaylistkisok({ ...Playlist }, user.token, id);
    }
    if (response.success) {
      addAlert({ type: "success", message: response.message });
      setIsLoading(false);
      window.location.href = "/playlist/viewandedit";
    } else {
      addAlert({ type: "error", message: response.message });
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleImageSelect = async (media) => {
    const updatedslideObj = {
      ...slide,
      image: { _id: media._id, mediaUrl: media.mediaUrl },
    };
    setSlide(updatedslideObj);
  };
  const handlePlaylistFetch = async () => {
    const response = await getplaylistbyid(id, user.token);
    const data = response.data;
    if (response.success) {
      const tempObj = {
        name: data.name,
        description: data.description,
        department: data.department._id,
        playlistType: data.type,
        slides: [...data.slides],
        style: { ...data.style },
      };
      setPlaylistObj({ ...tempObj });
      setSlides([...data.slides]);
    }
  };
  const handleImportPrevSlide = () => {
    const prevSlide = slides[slides.length - 1];
    setSlide({ ...prevSlide, _id: undefined });
  };
  const handleSocialMediaChange = ({ name, link }) => {
    if (slide?.sociallinks?.some((obj) => obj.name === name)) {
      addAlert({ type: "error", message: "Social Media already exists" });
    } else {
      setSlide({
        ...slide,
        sociallinks: [...(slide?.sociallinks || []), { name, link }],
      });
    }
    setSocialMediaModalOpen(false);
  };
  useEffect(() => {
    if (prevslideimport) {
      handleImportPrevSlide();
    }
  }, [prevslideimport]);
  useEffect(() => {
    if (id) {
      //fetch the playlist
      handlePlaylistFetch();
    }
  }, []);

  return (
    <div className="h-full overflow-hidden">
      <div>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center py-2">
            <label htmlFor="name">Playlist Name</label>
            <TextField
              size="small"
              id="name"
              name="name"
              className="text-xl"
              value={PlaylistObj.name}
              inputProps={{
                maxLength: 20,
                minLength: 3,
                required: true,
                // readOnly: currPlaylist ? true : false,
              }}
              onChange={handlePlaylistFeilds}
              color="primary"
              required
            />
          </div>
          <div className="w-1/5 flex gap-2 items-center">
            <label htmlFor="description">Description</label>
            <CustomSelect
              inputName={"department"}
              labelText={""}
              selectedValue={PlaylistObj.department || ""}
              items={departments}
              onChange={handlePlaylistFeilds}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            className="w-[600px]"
            onClick={HandleCreatePlaylist}
            disabled={
              PlaylistObj.name == "" &&
              PlaylistObj.department == "" &&
              PlaylistObj.slides.length == 0
            }
          >
            Create Playlist
          </Button>
        </div>
      </div>
      <div
        className="relative border h-full flex justify-center bg-gray-300 p-2"
        style={fullScreen ? fullScreenClass : {}}
      >
        <div
          className="flex flex-col h-full w-auto relative border border-gray-400 aspect-video p-6"
          style={MainCss}
        >
          <div className="h-[60%]">
            <div
              className="flex h-full"
              style={{ gap: PlaylistObj.style.topGap }}
            >
              <div
                className=" w-full position relative flex flex-col gap-2 items-center p-2"
                style={{ background: PlaylistObj.style.imgContbgColor }}
              >
                <div
                  className="flex gap-4 p-1 items-center w-full"
                  style={{ justifyContent: PlaylistObj.style.captionAlign }}
                >
                  <div className="p-2" style={CaptionNoCss}>
                    1/1
                  </div>
                  <div style={CaptionTextcss}>{slide.caption}</div>
                </div>
                <img
                  src={
                    slide.image !== null
                      ? process.env.REACT_APP_CDN_URL + slide.image?.mediaUrl
                      : "https://via.placeholder.com/1920x1080"
                  }
                  className="w-full h-[80%]"
                  onClick={() => {
                    setMediaOpen(true);
                  }}
                  alt="placeholder"
                />
                <div className="absolute top-0 right-0 bg-white px-2">
                  <EditIcon
                    onClick={() => {
                      setSlideImageModal(true);
                    }}
                  />
                </div>
              </div>

              <div
                className="bg-white h-full w-full flex flex-col items-center  position relative rounded gap-6 overflow p-2"
                style={{ background: PlaylistObj.style.textContentBgColor }}
              >
                <div className="w-full flex gap-2 flex-col justify-between items-center">
                  <div style={HeadingTextcss} className="relative">
                    <h2 style={TitleTextcss}>{slide.heading}</h2>
                    <h3 style={SubTitleTextcss}>{slide.subtitle}</h3>
                    <div className="bg-white absolute top-0 right-0">
                      <EditIcon
                        onClick={() => {
                          setTitleModalOpen(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <ul className="w-full flex flex-col  relative  p-2">
                  {slide?.bullets?.map((bullet, idx) => {
                    return <div style={BulletTextCss}>{bullet}</div>;
                  })}
                  <span className="bg-white absolute top-0 right-0">
                    <EditIcon
                      onClick={() => {
                        setHeadingModalOpen(true);
                      }}
                    />
                  </span>
                  {slide?.bullets?.length == 0 && (
                    <Tooltip title="Add Bullet">
                      <div className="flex justify-center">
                        <div
                          className="addButton"
                          onClick={() => {
                            setSlide((prev) => {
                              return {
                                ...prev,
                                bullets: ["Your Bullet point"],
                              };
                            });
                            setHeadingModalOpen(true);
                          }}
                        >
                          +
                        </div>
                      </div>
                    </Tooltip>
                  )}
                </ul>
                <div className="w-full items-center h-full">
                  <textarea
                    maxLength={800}
                    className="w-full h-full bg-transparent p-2 rounded-lg border border-gray-500"
                    style={{
                      resize: "none",
                      color: PlaylistObj.style.paragraphTextColor,
                      fontSize: PlaylistObj.style.paragraphFontSize,
                    }}
                    name="paragraph"
                    value={slide.paragraph}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  {PlaylistObj.slides?.links?.map((link, idx) => {
                    return <div className="bg-blue w-10">{link.text}</div>;
                  })}
                </div>
                <div className="absolute top-0 right-0 bg-white ">
                  <EditIcon onClick={() => setTextContentModalOpen(true)} />
                </div>
                <div className="absolute bottom-10 right-10 flex gap-2 w-4/5 justify-center items-center">
                  <SocialMediasIcons
                    socialMedialist={slide.sociallinks}
                    iconColor={PlaylistObj.style.iconsColor}
                    iconSize={PlaylistObj.style.iconSize}
                  />
                  <Tooltip title="Add Icon">
                    <div className="flex justify-center">
                      <div
                        className="addButton"
                        onClick={() => {
                          setSocialMediaModalOpen(true);
                        }}
                      >
                        +
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip title="Import from prev slide">
                    <Checkbox
                      {...label}
                      disabled={slides.length === 0}
                      checked={prevslideimport}
                      onChange={(e) => {
                        setPrevSlideImport(e.target.checked);
                      }}
                    />
                  </Tooltip>
                  <Button
                    variant="contained"
                    onClick={handleAddSlide}
                    disabled={slide.image ? false : true}
                  >
                    {slide._id !== undefined ? "Edit" : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="h-[30%] flex gap-4 py-2 overflow relative items-center"
            style={{ justifyContent: PlaylistObj.style.bottomImageAlign }}
          >
            {slides.map((i, index) => {
              return (
                <div
                  className="card"
                  style={slide._id == i._id ? BottomImgActiveCss : BottomImgcss}
                  onClick={() => {
                    HandleCurrentSlide(i);
                  }}
                >
                  <img
                    src={
                      i.image !== null
                        ? process.env.REACT_APP_CDN_URL + i.image.mediaUrl
                        : "https://via.placeholder.com/1920x1080"
                    }
                    alt="placeholder"
                  />
                  {i.title}
                </div>
              );
            })}
            {slide.image !== null && (
              <div className="addButton" onClick={handleCreateNewSlide}>
                +
              </div>
            )}
            <div className="absolute top-0 right-0 bg-white">
              <EditIcon
                onClick={() => {
                  setBottomImageModalOpen(true);
                }}
              />
            </div>
          </div>
          <div className="absolute top-0 right-0 bg-white">
            {fullScreen ? (
              <FullscreenExitIcon
                fontSize="large"
                onClick={() => {
                  setFullScreen(false);
                }}
              />
            ) : (
              <FullscreenIcon
                fontSize="large"
                onClick={() => {
                  setFullScreen(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Dialog open={titleModalOpen}>
        <DialogTitle>Edit Header Text</DialogTitle>
        <DialogContent>
          <FormControl
            sx={{ mt: 2, minHeight: 200, width: 400 }}
            className="flex flex-col gap-4"
          >
            <TextField
              id="outlined-basic"
              label="Title"
              size="small"
              fullWidth
              variant="outlined"
              value={slide.heading}
              name="heading"
              onChange={handleInputChange}
            />
            <TextField
              id="outlined-basic"
              label="Subtitle"
              size="small"
              fullWidth
              variant="outlined"
              value={slide.subtitle}
              name="subtitle"
              onChange={handleInputChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTitleModalOpen(false);
            }}
          >
            Submit
          </Button>
          {/* <Button type="submit">Subscribe</Button> */}
        </DialogActions>
      </Dialog>

      <Dialog open={headingModalOpen} fullWidth maxWidth="sm">
        <DialogTitle>Edit Bullet</DialogTitle>
        <DialogContent className="text-center">
          <FormControl
            sx={{
              mt: 2,
              minHeight: 200,
              width: "100%",
              display: "flex",
              flexDirection: "col",
              gap: PlaylistObj.style.bulletGap,
            }}
          >
            {slide.bullets?.map((bullet, idx) => {
              return (
                <TextField
                  id="outlined-basic"
                  label="Bullet"
                  size="medium"
                  fullWidth
                  variant="outlined"
                  value={bullet}
                  onChange={(e) => handleBulletsChange(e, idx)}
                />
              );
            })}
          </FormControl>
          <Button variant="contained" onClick={handleBulletAdd}>
            add Bullet
          </Button>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setHeadingModalOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <MediaSelect
        open={mediaOpen}
        handleImageSelect={handleImageSelect}
        handleClose={() => {
          setMediaOpen(false);
        }}
      />

      <PlaylistCssModal
        open={PlaylistCssModalOpen}
        handleInputChange={handlePlaylistCss}
        handleClose={() => {
          setPlaylistCssModalOpen(false);
        }}
        handleSubmit={() => {
          setPlaylistCssModalOpen(false);
        }}
        style={PlaylistObj.style}
      />
      <TextContentModal
        open={TextContentModalOpen}
        handleCssChange={handlePlaylistCss}
        handleClose={() => {
          setTextContentModalOpen(false);
        }}
        handleSubmit={() => {
          setTextContentModalOpen(false);
        }}
        style={PlaylistObj.style}
      />
      <SlideImgCssModal
        open={slideImageModal}
        slide={slide}
        handleCssChange={handlePlaylistCss}
        handleInputChange={handleInputChange}
        handleClose={() => {
          setSlideImageModal(false);
        }}
        handleSubmit={() => {
          setSlideImageModal(false);
        }}
        style={PlaylistObj.style}
      />
      <BottomImagesCssModal
        open={bottomImageModalOpen}
        slide={slide}
        handleCssChange={handlePlaylistCss}
        handleInputChange={handleInputChange}
        handleClose={() => {
          setBottomImageModalOpen(false);
        }}
        handleSubmit={() => {
          setBottomImageModalOpen(false);
        }}
        style={PlaylistObj.style}
      />
      <SocialMediaModal
        open={socialMediaModalOpen}
        handleClose={() => {
          setSocialMediaModalOpen(false);
        }}
        handleSubmit={handleSocialMediaChange}
        icons={slide.sociallinks}
      />
      <SimpleBackdrop open={isLoading} />
    </div>
  );
}

export default Kisok;
