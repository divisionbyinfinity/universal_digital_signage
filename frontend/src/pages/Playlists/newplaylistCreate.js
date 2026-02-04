import * as React from "react";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PaletteIcon from "@mui/icons-material/Palette";
import { Button, Icon, IconButton, Popover } from "@mui/material";

import Box from "@mui/material/Box";

import MarginIcon from "@mui/icons-material/Margin";
import PaddingIcon from "@mui/icons-material/Padding";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import BorderAllIcon from "@mui/icons-material/BorderAll";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
import HorizontalSplitIcon from "@mui/icons-material/HorizontalSplit";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import TextFormatSharpIcon from "@mui/icons-material/TextFormatSharp";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ManageHistoryRoundedIcon from '@mui/icons-material/ManageHistoryRounded';
import FormatAlignCenterSharpIcon from "@mui/icons-material/FormatAlignCenterSharp";
import FormatAlignLeftSharpIcon from "@mui/icons-material/FormatAlignLeftSharp";
import FormatAlignRightSharpIcon from "@mui/icons-material/FormatAlignRightSharp";
import VerticalAlignBottomSharpIcon from "@mui/icons-material/VerticalAlignBottomSharp";
import VerticalAlignTopSharpIcon from "@mui/icons-material/VerticalAlignTopSharp";
import VerticalAlignCenterSharpIcon from "@mui/icons-material/VerticalAlignCenterSharp";
import FormatAlignJustifySharpIcon from "@mui/icons-material/FormatAlignJustifySharp";
import CircleIcon from "@mui/icons-material/Circle";
import RectangleIcon from "@mui/icons-material/Rectangle";
import AdjustIcon from "@mui/icons-material/Adjust";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import CategoryIcon from "@mui/icons-material/Category";
import SquareIcon from "@mui/icons-material/Square";
import RoundedCornerIcon from "@mui/icons-material/RoundedCorner";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import Pagination from "@mui/material/Pagination";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";
import PendingIcon from "@mui/icons-material/Pending";
import Filter1Icon from "@mui/icons-material/Filter1";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import DeleteIcon from "@mui/icons-material/Delete";

import AnimationIcon from "@mui/icons-material/Animation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import LayersIcon from "@mui/icons-material/Layers";
import SlideshowIcon from "@mui/icons-material/Slideshow";
// import * as React from 'react';
// import Box from '@mui/material/Box';
import WebAssetIcon from "@mui/icons-material/WebAsset";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { Grid } from "@mui/material";
import { styled } from "@mui/material";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import "./newcreate.css";
import { useState, useEffect } from "react";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { Typography } from "@mui/material";
import Switch from "@mui/material/Switch";
import MediaSelect from "../../components/modals/MediaSelect";
import { useConfig } from "../../contexts/ConfigContext";
import { useAuth } from "../../contexts/AuthContext";
import { useAlert } from "../../contexts/AlertContext";

import { createPlaylist, editPlaylist } from "../../apis/api";
import { useParams } from "react-router-dom";
import { getplaylists } from "../../apis/api";

import SlidesManager from "./slidesPreview";

const AllEnums = {
  font_family_options: [
    { name: "Arial", _id: "Arial, sans-serif" },
    { name: "Verdana", _id: "Verdana, sans-serif" },
    { name: "Helvetica", _id: "Helvetica, sans-serif" },
    { name: "Times New Roman", _id: "Times New Roman, serif" },
    { name: "Georgia", _id: "Georgia, serif" },
    { name: "Trebuchet MS", _id: "Trebuchet MS, sans-serif" },
    { name: "Calibri", _id: "Calibri, sans-serif" },
    { name: "Tahoma", _id: "Tahoma, sans-serif" },
    { name: "Century Gothic", _id: "Century Gothic, sans-serif" },
    { name: "Open Sans", _id: "Open Sans, sans-serif" },
  ],
  text_align_options: [
    { name: "left", _id: "left" },
    { name: "right", _id: "right" },
    { name: "center", _id: "center" },
  ],
  page_number_location: [
    { name: "top-left", _id: "top-left" },
    { name: "top-center", _id: "top-center" },
    { name: "top-right", _id: "top-right" },
    { name: "bottom-left", _id: "bottom-left" },
    { name: "bottom-center", _id: "bottom-center" },
    { name: "bottom-right", _id: "bottom-right" },
  ],
  fontSizeOptions: [
    { name: "small", _id: "2rem" }, // 14px
    { name: "medium", _id: "2.5rem" }, // 16px (base font size)
    { name: "large", _id: "3rem" }, // 20px
  ],
  pageIndicatorTypes: [
    { name: "circle", _id: "1" },
    { name: "rectangle", _id: "2" },
  ],
  border_types: [
    { name: "solid", _id: "solid" },
    { name: "dotted", _id: "dotted" },
    { name: "dashed", _id: "dashed" },
    { name: "double", _id: "double" },
    { name: "groove", _id: "groove" },
    { name: "ridge", _id: "ridge" },
    { name: "inset", _id: "inset" },
    { name: "outset", _id: "outset" },
    { name: "hidden", _id: "hidden" },
    { name: "none", _id: "none" },
  ],
  transition_types: [
    { name: "fade-in", _id: "fade-in" },
    { name: "slide-left", _id: "slide-left" },
    { name: "slide-right", _id: "slide-right" },
    { name: "zoom", _id: "zoom" },
    { name: "flip", _id: "flip" },
    { name: "none", _id: "none" },
  ],
};

const BorderMenu = ({ formik }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="flex justify-center text-center">
      <IconButton
        title="Border"
        onClick={handleClick}
        disabled={!formik.values.hasOwnProperty("border")}
        className="iconButton"
      >
        <BorderAllIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 200 }}>
          <Grid container spacing={1} p={1}>
            <Grid item xs={6} className="flex items-center gap-2">
              <IconButton title="Border Width">
                <HorizontalSplitIcon />
              </IconButton>
              <Input
                type="number"
                name="border.width"
                onChange={formik.handleChange}
                value={formik.values.border?.width}
                disabled={!formik.values.hasOwnProperty("border")}
              />
            </Grid>
            <Grid item xs={6} className="flex items-center gap-2">
              <IconButton title="Border Color">
                <BorderColorIcon />
              </IconButton>
              <Input
                type="color"
                name="border.color"
                onChange={formik.handleChange}
                value={formik.values.border?.color}
                className="w-full"
                placeholder="Border Color"
                disabled={!formik.values.hasOwnProperty("border")}
              />
            </Grid>
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Border Type">
                <BorderStyleIcon />
              </IconButton>
              <Select
                fullWidth
                labelId="border-type"
                id="borderType"
                name="border.type"
                onChange={formik.handleChange}
                size="small"
                value={formik.values.border?.type}
                disabled={!formik.values.hasOwnProperty("border")}
              >
                {AllEnums.border_types.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};
const AlignmentMenu = ({ formik }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle the alignment update

  const handleHorizontalAlignmentChange = (horizontal) => {
    formik.setFieldValue("align.horizontal", horizontal);
  };
  const handleVerticalAlignmentChange = (vertical) => {
    formik.setFieldValue("align.vertical", vertical);
  };

  const isAlignHorizontalAvailable =
    formik.values.hasOwnProperty("align") &&
    formik.values.align.hasOwnProperty("horizontal");
  const isAlignVerticalAvailable =
    formik.values.hasOwnProperty("align") &&
    formik.values.align.hasOwnProperty("vertical");

  return (
    <div>
      <IconButton
        title="Alignment"
        onClick={handleClick}
        disabled={!isAlignHorizontalAvailable && !isAlignVerticalAvailable}
        className="iconButton"
      >
        <FormatAlignJustifySharpIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 150 }}>
          <Grid container spacing={1} p={1}>
            {/* Horizontal alignment */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton
                title="Text Align Left"
                color={
                  formik.values?.align?.horizontal === "left"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleHorizontalAlignmentChange("left")}
                sx={{ width: "40px" }}
                disabled={!isAlignHorizontalAvailable}
              >
                <FormatAlignLeftSharpIcon />
              </IconButton>
              <IconButton
                title="Text Align Center"
                color={
                  formik.values?.align?.horizontal === "center"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleHorizontalAlignmentChange("center")}
                sx={{ width: "40px" }}
                disabled={!isAlignHorizontalAvailable}
              >
                <FormatAlignCenterSharpIcon />
              </IconButton>
              <IconButton
                title="Text Align Right"
                color={
                  formik.values?.align?.horizontal === "right"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleHorizontalAlignmentChange("right")}
                sx={{ width: "40px" }}
                disabled={!isAlignHorizontalAvailable}
              >
                <FormatAlignRightSharpIcon />
              </IconButton>
            </Grid>

            {/* Vertical alignment */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton
                title="Vertical Align Top"
                color={
                  formik.values?.align?.vertical === "top"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleVerticalAlignmentChange("top")}
                sx={{ width: "40px" }}
                disabled={!isAlignVerticalAvailable}
              >
                <VerticalAlignTopSharpIcon />
              </IconButton>
              <IconButton
                title="Vertical Align Center"
                color={
                  formik.values?.align?.vertical === "center"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleVerticalAlignmentChange("center")}
                sx={{ width: "40px" }}
                disabled={!isAlignVerticalAvailable}
              >
                <VerticalAlignCenterSharpIcon />
              </IconButton>
              <IconButton
                title="Vertical Align Bottom"
                color={
                  formik.values?.align?.vertical === "bottom"
                    ? "primary"
                    : "default"
                }
                onClick={() => handleVerticalAlignmentChange("bottom")}
                sx={{ width: "40px" }}
                disabled={!isAlignVerticalAvailable}
              >
                <VerticalAlignBottomSharpIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};

const TopMenu = ({
  user,
  isEditing,
  fullWidth,
  currentSection,
  departments,
  formik,
  globalFormik,
  selectSection,
  addSlide,
  currentSlide,
  handleSubmit,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentType, setCurrentType] = useState(""); // "margin" or "padding"
  const handleOpen = (event, type) => {
    setAnchorEl(event.currentTarget);
    setCurrentType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentType("");
  };

  const open = Boolean(anchorEl);
  const renderInputs = (type) => {
    return (
      <div className="flex flex-col gap-2 p-2 ">
        {["top", "bottom", "left", "right"].map((direction) => (
          <div key={direction} className="flex items-center gap-2">
            <label className="w-20 capitalize">{direction}</label>
            <input
              type="number"
              name={`${type}.${direction}`}
              onChange={formik.handleChange}
              value={formik.values[type]?.[direction]}
              className="w-16 p-1 border rounded"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="m-1 p-2 flex flex-row gap-1  rounded shadow-md bg-white">
      {/* Playlist Name and Department */}

      <div className="flex flex-col min-w-[100px] w-[200px] justify-between border-r border-gray-400 pr-2 gap-2 ">
        {/* Playlist Name */}
        <TextField
          required
          id="name"
          name="name"
          variant="outlined"
          size="small"
          onChange={globalFormik.handleChange}
          helperText={globalFormik.touched.name && globalFormik.errors.name}
          error={globalFormik.touched.name && Boolean(globalFormik.errors.name)}
          value={globalFormik.values.name}
          placeholder="Enter Playlist Name"
          disabled={isEditing}
        />
        {/* Department Select */}
        {["globalAssetManager", "admin"].includes(user.role) && (
          <FormControl fullWidth>
            <Select
              id="department"
              name="department"
              size="small"
              onChange={globalFormik.handleChange}
              value={globalFormik.values.department}
              error={
                globalFormik.touched.department &&
                Boolean(globalFormik.errors.department)
              }
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department._id} value={department._id}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="flex flex-row gap-1 ">
        <div className="w-40 border-r ml-2 border-gray-400">
          <Grid container spacing={1}>
            <Grid item xs={12} className="flex items-center gap-2">
              <FormControl fullWidth>
                <Select
                  fullWidth
                  labelId="font-family"
                  id="fontFamily"
                  name="fntFam"
                  onChange={formik.handleChange}
                  size="small"
                  value={formik.values?.fntFam}
                  disabled={!formik.values?.hasOwnProperty("fntFam")}
                >
                  {AllEnums.font_family_options.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                title="Font Family"
                disabled={!formik.values.hasOwnProperty("fntFam")}
                className="iconButton"
              >
                <TextFormatSharpIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12} className="flex items-center gap-2">
              <Input
                type="number"
                name="fntSize"
                className="px-2 w-2/3"
                onChange={formik.handleChange}
                value={formik.values.fntSize}
                disabled={!formik.values.hasOwnProperty("fntSize")}
              />
              <IconButton
                title="Increase Font Size"
                disabled={!formik.values.hasOwnProperty("fntSize")}
                onClick={() =>
                  formik.setFieldValue("fntSize", formik.values.fntSize + 1)
                }
                className="iconButton"
              >
                <TextIncreaseIcon />
              </IconButton>
              <IconButton
                title="Decrease Font Size"
                disabled={!formik.values.hasOwnProperty("fntSize")}
                onClick={() =>
                  formik.setFieldValue("fntSize", formik.values.fntSize - 1)
                }
                className="iconButton"
              >
                <TextDecreaseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </div>
        <div className="border-r border-gray-400 flex flex-col justify-between px-2">
          <div className="flex justify-center items-center gap-1">
            <IconButton
              title="Background Color"
              disabled={!formik.values.hasOwnProperty("bgColor")}
              className="iconButton"
            >
              <FormatColorFillIcon />
            </IconButton>
            <input
              type="color"
              name="bgColor"
              onChange={formik.handleChange}
              value={formik.values?.bgColor || ""}
              disabled={!formik.values.hasOwnProperty("bgColor")}
              className={`w-8 h-8 rounded border border-gray-300 cursor-pointer 
      ${
        !formik.values.hasOwnProperty("bgColor")
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 transition-transform duration-150"
      }`}
            />
          </div>

          <div className="flex justify-center items-center gap-1">
            <IconButton
              title="Color"
              disabled={!formik.values.hasOwnProperty("color")}
              className="iconButton"
            >
              <PaletteIcon />
            </IconButton>
            <input
              type="color"
              name="color"
              onChange={formik.handleChange}
              value={formik.values?.color || ""}
              disabled={!formik.values.hasOwnProperty("color")}
              className={`w-8 h-8 rounded border border-gray-300 cursor-pointer 
      ${
        !formik.values.hasOwnProperty("color")
          ? "opacity-50 cursor-not-allowed"
          : "hover:scale-105 transition-transform duration-150"
      }`}
            />
          </div>
        </div>
        {/* margin */}
        <div className="border-r border-gray-400">
          <Grid container direction="row">
            {/* First IconButton for Margin */}
            <Grid item xs={4} className="flex text-center justify-center">
              {" "}
              {/* Adjust xs value to make items smaller if needed */}
              <IconButton
                title="Margin"
                onClick={(e) => handleOpen(e, "margin")}
                disabled={!formik.values.hasOwnProperty("margin")}
                className="iconButton"
              >
                <MarginIcon />
              </IconButton>
              <Popover
                open={open && currentType === "margin"}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {renderInputs("margin")}
              </Popover>
            </Grid>

            {/* Second IconButton for Padding */}
            <Grid item xs={4} className="flex text-center justify-center">
              {" "}
              {/* Adjust xs value */}
              <IconButton
                title="Padding"
                onClick={(e) => handleOpen(e, "padding")}
                disabled={!formik.values.hasOwnProperty("padding")}
                className="iconButton"
              >
                <PaddingIcon />
              </IconButton>
              <Popover
                open={open && currentType === "padding"}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                {renderInputs("padding")}
              </Popover>
            </Grid>

            {/* BorderMenu component */}
            <Grid item xs={4} className="flex justify-between text-center">
              {" "}
              {/* Adjust xs value */}
              <BorderMenu formik={formik} />
            </Grid>
            <Grid item xs={4} className="flex justify-center text-center">
              <AlignmentMenu formik={formik} />
            </Grid>
          </Grid>
        </div>
        {/*pagination  */}
        <div className="flex flex-col gap-2 w-28 border-r  border-gray-400">
          <div className="text-center bg-slate-300">
            <IconButton title="Page Indicator Control" color="inherit">
              <ImportContactsIcon />
            </IconButton>
          </div>
          <div className="flex justify-between items-center gap-1">
            <PageIndicator formik={globalFormik} />
            <PageNumber formik={globalFormik} />
          </div>
        </div>
        <CaptionControl formik={currentSlide} /> 

        <div className="flex flex-col items-center justify-between gap-2 ">
          <div className="w-20 bg-slate-300 text-center">
            <IconButton title="Slide Control">
              <SlideshowIcon />
            </IconButton>
          </div>
          <div className="flex  gap-2">
            <TransitionMenu formik={formik} selectSection={selectSection} />
            <SlideTimingControls
              formik={formik}
              selectSection={selectSection}
            />
          </div>
        </div>
      </div>

      <div className="ml-auto self-end">
        <div className="flex flex-row justify-end p-2">
          <FullscreenIcon onClick={fullWidth} />
        </div>
        <div className="gap-4 flex px-2">
          <IconButton
            title="Add Slide"
            className="iconButton"
            onClick={addSlide}
          >
            <AddCircleOutlineIcon
              fontSize="large"
              style={{ color: "var(--primary-color)" }}
            />
          </IconButton>
          <Button
            variant="outlined"
            sx={{ color: "var(--button-color-secondary)" }}
            onClick={handleSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

const PageIndicator = ({ formik }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        title="Page Indicator Settings"
        onClick={handleClick}
        disabled={!formik.values.hasOwnProperty("pageIndicator")}
        className="iconButton"
      >
        <FilterNoneIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ minWidth: 200, maxWidth: 250 }}>
          <Grid container spacing={1} p={1}>
            {/* Enable/Disable Page Indicator */}
            <Grid
              item
              xs={12}
              className="flex items-center justify-between gap-2"
            >
              <Typography>Enable </Typography>
              <Switch
                name="pageIndicator.isEnable"
                checked={formik?.values?.pageIndicator?.isEnable || false}
                onChange={formik?.handleChange}
                disabled={!formik?.values.hasOwnProperty("pageIndicator")}
              />
            </Grid>

            {/* Page Indicator Size */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Size">
                <ZoomInIcon />
              </IconButton>
              <Select
                fullWidth
                size="small"
                name="pageIndicator.size"
                value={formik?.values?.pageIndicator?.size || "medium"}
                onChange={formik.handleChange}
                disabled={!formik?.values?.hasOwnProperty("pageIndicator")}
              >
                {AllEnums.fontSizeOptions.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Page Indicator Type */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Type">
                <CategoryIcon />
              </IconButton>
              <Select
                fullWidth
                size="small"
                name="pageIndicator.type"
                value={formik.values.pageIndicator?.type || "circle"}
                onChange={formik.handleChange}
                disabled={!formik.values.hasOwnProperty("pageIndicator")}
              >
                {AllEnums.pageIndicatorTypes.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {/*location*/}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Location">
                <CategoryIcon />
              </IconButton>
              <Select
                fullWidth
                size="small"
                name="pageIndicator.location"
                value={formik.values.pageIndicator?.location}
                onChange={formik.handleChange}
                disabled={!formik.values.hasOwnProperty("pageIndicator")}
              >
                {AllEnums.page_number_location.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Border Size */}
            <Grid item xs={6} className="flex items-center gap-2">
              <IconButton title="Border Size">
                <HorizontalSplitIcon />
              </IconButton>
              <Input
                type="text"
                name="pageIndicator.borderSize"
                onChange={formik.handleChange}
                value={formik.values.pageIndicator?.borderSize || "2px"}
                disabled={!formik.values.hasOwnProperty("pageIndicator")}
                fullWidth
              />
            </Grid>

            {/* Border Color */}
            <Grid item xs={6} className="flex items-center gap-2">
              <IconButton title="Border Size">
                <BorderColorIcon />
              </IconButton>
              <Input
                type="color"
                name="pageIndicator.borderColor"
                onChange={formik.handleChange}
                value={formik.values.pageIndicator?.borderColor || "#000000"}
                disabled={!formik.values.hasOwnProperty("pageIndicator")}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} className="flex items-center gap-2">
              <IconButton title="Background Color">
                <FormatColorFillIcon />
              </IconButton>
              <Input
                type="color"
                name="pageIndicator.bgColor"
                onChange={formik.handleChange}
                value={formik.values.pageIndicator?.bgColor || "#d79d9d"}
                disabled={!formik.values.hasOwnProperty("pageIndicator")}
                fullWidth
              />
            </Grid>
            {/* Location */}
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};

const PageNumber = ({ formik }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        title="Page Number Settings"
        disabled={!formik.values.hasOwnProperty("pageNumber")}
        className="iconButton"
        onClick={handleClick}
      >
        <Filter1Icon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 200 }}>
          <Grid container spacing={1} p={1}>
            {/* Enable/Disable Page Indicator */}
            <Grid
              item
              xs={12}
              className="flex items-center justify-between gap-2"
            >
              <Typography>Enable </Typography>
              <Switch
                name="pageNumber.isEnable"
                checked={formik?.values?.pageNumber?.isEnable || false}
                onChange={formik?.handleChange}
                disabled={!formik?.values.hasOwnProperty("pageNumber")}
              />
            </Grid>

            {/* Page Indicator Size */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton
                title="Size"
                disabled={!formik.values.hasOwnProperty("pageNumber")}
                color="inherit"
              >
                <ZoomInIcon />
              </IconButton>
              <Select
                fullWidth
                size="small"
                name="pageNumber.size"
                value={formik?.values?.pageNumber?.size || "medium"}
                onChange={formik.handleChange}
                disabled={!formik?.values?.hasOwnProperty("pageNumber")}
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </Grid>

            {/* Page Indicator Type */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton
                title="Color"
                disabled={!formik.values.hasOwnProperty("pageNumber")}
              >
                <FormatColorFillIcon />
              </IconButton>
              <Input
                fullWidth
                size="small"
                type="color"
                name="pageNumber.color"
                onChange={formik.handleChange}
                value={formik.values.pageNumber?.color || "#000000"}
                disabled={!formik.values.hasOwnProperty("pageNumber")}
              />
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};

const ControlPanel = () => {
  return <div className="border">control panel</div>;
};
const TransitionMenu = ({ formik, selectSection }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    selectSection(2);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        title="Transition"
        className="iconButton"
        onClick={handleClick}
      >
        <AnimationIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 200 }}>
          <Grid container spacing={1} p={1}>
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Transition Type">
                <LayersIcon />
              </IconButton>
              <Select
                fullWidth
                size="small"
                name="transition.type"
                value={formik.values.transition?.type}
                onChange={formik.handleChange}
              >
                {AllEnums.transition_types.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Transition Duration">
                <ManageHistoryRoundedIcon />
              </IconButton>
              <Input
                type="number"
                name="transition.duration"
                onChange={formik.handleChange}
                value={formik.values.transition?.duration}
              />
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};

const SlideTimingControls = ({ formik, selectSection }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    selectSection(2);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        title="Slide Timing Controls"
        onClick={handleClick}
        className="iconButton"
      >
        <PendingActionsIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper sx={{ width: 250 }}>
          <Grid container spacing={1} p={1}>
            {/* Horizontal alignment */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton
                title="slide duration in seconds"
                sx={{ width: "40px" }}
              >
                <AccessTimeIcon />
              </IconButton>
              <Input
                type="number"
                name="schedule.duration"
                disabled={!formik.values.hasOwnProperty("schedule")}
                onChange={formik.handleChange}
                value={formik.values.schedule?.duration}
              />
            </Grid>

            {/* Vertical alignment */}
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="start Date" htmlFor="schedule.sDate">
                <TodayIcon />
              </IconButton>
              <Input
                type="datetime-local"
                name="schedule.sDate"
                sx={{ width: "70%" }}
                disabled={!formik.values.hasOwnProperty("schedule")}
                onChange={formik.handleChange}
                value={formik.values.schedule?.sDate}
              />
            </Grid>
            <Grid item xs={12} className="flex items-center gap-2">
              <IconButton title="Slide End Date">
                <TodayIcon />
              </IconButton>

              <Input
                type="datetime-local"
                sx={{ width: "70%" }} // Hide input visually
                name="schedule.eDate"
                disabled={!formik.values.hasOwnProperty("schedule")}
                onChange={formik.handleChange}
                value={formik.values.schedule?.eDate || ""}
              />
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </div>
  );
};
const BottomMenu = () => {
  const actions = [
    { icon: <WebAssetIcon />, name: "Top Caption" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
        />
      ))}
    </SpeedDial>
  );
};

const PaginationCustom = ({ formik, currentPage, totalPages }) => {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const ButtonCss = {
    borderRadius: formik.values.pageIndicator?.type === "1" ? "50%" : "4%",
    backgroundColor: formik.values.pageIndicator?.bgColor || "black",
    border: `${formik.values.pageIndicator?.borderSize || 2} solid ${
      formik.values.pageIndicator?.borderColor || "black"
    }`,
    width: formik.values.pageIndicator?.size,
    height: formik.values.pageIndicator?.size,
  };

  const PageNumberStyle = {
    color: formik.values.pageNumber?.color,
    fontSize: formik.values.pageNumber?.size,
  };
  return (
    <div className="min-w-[300px] flex justify-center hover:bg-gray-400 rounded p-1 shadow-sm ">
      <div>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className="w-10 h-10"
              style={ButtonCss}
            >
              {formik?.values?.pageNumber?.isEnable && (
                <div style={PageNumberStyle}>{index + 1}</div>
              )}
            </button>
          ))}
          {[]}
        </div>
      </div>
    </div>
  );
};

const CaptionControl = ({ formik }) => {
  const isCaptionTActive = formik.values.showCaptionT;
  const isCaptionBActive = formik.values.showCaptionB;
  const handleToggle = (caption,value) => {
    // Toggles the boolean value in Formik state
    formik.setFieldValue(caption, !value);
  };
  return (
    <div className="border-r border-gray-400 flex flex-col justify-between">
      {/* Caption Control Label */}
      <div className="bg-slate-300 text-center p-1">
        <IconButton title="Caption Control" className="iconButton" >
          <ClosedCaptionOffIcon />
        </IconButton>
      </div>

      {/* Container for Caption Top and Bottom with Space Between */}
      <div className="flex ">
        {/* Caption Top */}
        <IconButton title="Caption Top" className={`iconButton ${isCaptionTActive ? 'active' : ''}`}
          onClick={()=>handleToggle('showCaptionT',isCaptionTActive)}>
          <WebAssetIcon />
        </IconButton>

        {/* Caption Bottom (Pushed to Bottom) */}
        <IconButton title="Caption Bottom" className={`iconButton ${isCaptionBActive ? 'active' : ''}`}
        onClick={()=>handleToggle('showCaptionB',isCaptionBActive)}>
          <WebAssetIcon sx={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </div>
    </div>
  );
};

const PlaylistCreate = () => {
  const [fullScreen, setFullScreen] = React.useState(false);
  const [drawerHide, setDrawerHide] = React.useState(false);
  const [mediaSelectOpen, setMediaSelectOpen] = React.useState(false);
  const [currentSection, setCurrentSection] = React.useState(0);
  const { user } = useAuth();
  const addAlert = useAlert();

  const { departments, setPlaylistsData } = useConfig();
  const { Id, cloneId } = useParams();
  const section1Formik = useFormik({
    initialValues: {
      name: "",
      department: ["globalAssetManager", "admin"].includes(user.role)
        ? ""
        : user?.department?._id,
      slides: [],
      currentSlide: 0,
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      bgColor: "#ffffff",
      pageIndicator: {
        isEnable: false,
        size: "2.5rem",
        type: "1",
        borderSize: "2px",
        borderColor: "black",
        bgColor: "white",
        location: "bottom-center",
      },
      pageNumber: {
        isEnable: false,
        size: "medium",
        color: "black",
      },
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Required";
      }
      // playlist cannot be index or _default or start with _
      if (values.name === "index" || values.name.startsWith("_")) {
        errors.name = "Invalid Playlist Name";
      }
      // check playilsName minimum length
      if (values.name.length < 3) {
        errors.name = "Minimum 3 characters";
      }
      if (!values.department) {
        errors.department = "Required";
      }
      if (values.slides.length < 1) {
        errors.slides = "Minimum 1 slide required";
      }
      console.log("error", errors);
      return errors;
    },

    onSubmit: async (values) => {
      const slides = values.slides.map((slide) => {
        const dataObj = {};
        dataObj.media = slide.media._id;
        dataObj.captionT = slide.captionT;
        dataObj.captionB = slide.captionB;
        dataObj.style = {};
        const imageStyle = { padding: null, margin: null, border: null };
        imageStyle.padding = { ...slide.style.image.padding };
        imageStyle.margin = { ...slide.style.image.margin };
        imageStyle.border = { ...slide.style.image.border };
        dataObj.style.image = imageStyle;
        dataObj.style.captionT = { ...slide.style.captionT };
        dataObj.style.captionB = { ...slide.style.captionB };
        dataObj.style.bgColor = slide.style.bgColor;
        dataObj.style.transition = { ...slide.style.transition };
        dataObj.mediaDuration = slide.mediaDuration;
        dataObj.schedule = { ...slide.schedule };
        return dataObj;
      });
      const playlist = {
        name: values.name,
        playlistType: 1,
        department: values.department,
        slides: slides,
        style: {
          bgColor: values.bgColor,
          padding: values.padding,
          pageIndicator: values.pageIndicator,
          pageNumber: values.pageNumber,
          randomizeSlides: false,
        },
      };
      const data = new FormData();
      data.append("playlist", JSON.stringify(playlist));
      let response;
      if (Id) {
        response = await editPlaylist(playlist, user.token, Id);
      } else {
        response = await createPlaylist(playlist, user.token);
      }
      if (response.success) {
        addAlert({ type: "success", message: response.message });
        section1Formik.resetForm();
        section2Formik.resetForm();
        const playlists = await getplaylists("common/playlists/", user.token);
        if (playlists.success) {
          setPlaylistsData(playlists.data);
        }
        window.location.href = `${process.env.REACT_APP_HOST_NAME}playlist/viewandedit`;

        // navigate to the playlist page
      } else {
        addAlert({ type: "error", message: response.message });
      }
    },
  });
  useEffect(() => {
    if (Id) {
      fetchPlaylist(Id);
    }
    if (cloneId) {
      fetchPlaylist(cloneId, "_clone");
    }
  }, [Id, cloneId]);

  const fetchPlaylist = async (id, clone = "") => {
    const response = await getplaylists(
      "common/playlists/" + `${id}`,
      user.token
    );
    if (response.success) {
      const data = response.data;
      let currentPlaylist = {};

      currentPlaylist.name = data.name + clone;
      currentPlaylist.department = data.department?._id;
      currentPlaylist.slides = data.slides.map((slide) => ({
        ...slide,
        style: slide.style.slideCss,
      }));
      currentPlaylist.currentSlide = 0;
      const globalStyle = data.style.globalStyle;
      currentPlaylist = { ...currentPlaylist, ...globalStyle };
      section1Formik.setValues(currentPlaylist);
    }
  };
  const fullWidth = () => {
    setFullScreen(!fullScreen);
  };

  const handleSubmit = () => {
    setCurrentSection(0);
    section1Formik.submitForm();
  };
  const playlistValid =
    section1Formik.values.name?.length > 0 &&
    section1Formik.values.department?.length > 0 &&
    section1Formik.values.slides.length > 0;

  const section2Formik = useFormik({
    // This is for the slide attributes
    initialValues: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      border: {
        width: 0,
        color: "#000000",
        type: "solid",
      },
      transition: {
        delay: 8,
        duration: 1,
        timing: "linear",
        type: "none",
      },
      media: null,
      captionT: "",
      captionB: "",
      showCaptionT:true,
      showCaptionB:true,
      style: null,
      schedule: {
        duration: 12,
        sDate: "",
        eDate: "",
        sTime: "",
        eTime: "",
      },
    },
    validate: (values) => {
      const errors = {};
      if (!values.media) {
        errors.media = "Required";
      }
      return errors;
    },
    onSubmit: (values) => {
      const dataObj = {};
      dataObj.media = values.media;
      dataObj.captionT = values.captionT;
      dataObj.captionB = values.captionB;
      dataObj.style = {};
      const imageStyle = { padding: null, margin: null, border: null };
      imageStyle.padding = { ...values.padding };
      imageStyle.margin = { ...values.margin };
      imageStyle.border = { ...values.border };
      dataObj.style.image = imageStyle;
      dataObj.style.captionT = { ...section3Formik.values };
      dataObj.style.captionB = { ...section4Formik.values };
      dataObj.style.bgColor = section1Formik.values.bgColor;
      dataObj.style.transition = { ...values.transition };
      dataObj.schedule = { ...values.schedule };
      section1Formik.setFieldValue(
        `slides[${section1Formik.values.currentSlide}]`,
        dataObj
      );
      section1Formik.setFieldValue(
        "currentSlide",
        section1Formik.values.currentSlide + 1
      );
      section2Formik.resetForm();
    },
  });
  const section3Formik = useFormik({
    // this is for the top caption attributes
    initialValues: {
      color: "",
      bgColor: "",
      fntFam: "Open Sans, sans-serif",
      fntSize: 24,
      align: {
        horizontal: "center",
      },
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      widthFull: true,
      border: {
        width: 1,
        color: "#B0BEC5",
        type: "solid",
      },
    },
    onSubmit: (values) => {},
  });
  const section4Formik = useFormik({
    // this is for the bottom caption attributes
    initialValues: {
      color: "",
      bgColor: "",
      fntFam: "Open Sans, sans-serif",
      fntSize: 24,
      align: {
        horizontal: "center",
      },
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      widthFull: true,
      border: {
        width: 1,
        color: "#B0BEC5",
        type: "solid",
      },
    },
    onSubmit: (values) => {},
  });

  const getCurrentSectionFormik = () => {
    switch (currentSection) {
      case 1:
        return section1Formik;
      case 2:
        return section2Formik;
      case 3:
        return section3Formik;
      case 4:
        return section4Formik;
      default:
        return section1Formik;
    }
  };
  getCurrentSectionFormik();
  const captionBottomStyle = {
    color: section4Formik.values.color,
    backgroundColor: section4Formik.values.bgColor,
    fontFamily: section4Formik.values.fntFam,
    fontSize: section4Formik.values.fntSize,
    textAlign: section4Formik.values.align.horizontal,
    margin: `${section4Formik.values.margin.top}rem ${section4Formik.values.margin.right}rem ${section4Formik.values.margin.bottom}rem ${section4Formik.values.margin.left}rem`,
    padding: `${section4Formik.values.padding.top}rem ${section4Formik.values.padding.right}rem ${section4Formik.values.padding.bottom}rem ${section4Formik.values.padding.left}rem`,
    width: section4Formik.values.widthFull ? "100%" : "auto",
    borderWidth: section4Formik.values.border?.width,
    borderColor: section4Formik.values.border?.color,
    borderStyle: section4Formik.values.border?.type,
  };
  const captionTopStyle = {
    color: section3Formik.values.color,
    backgroundColor: section3Formik.values.bgColor,
    fontFamily: section3Formik.values.fntFam,
    fontSize: section3Formik.values.fntSize,
    textAlign: section3Formik.values.align.horizontal,
    margin: `${section3Formik.values.margin.top}rem ${section3Formik.values.margin.right}rem ${section3Formik.values.margin.bottom}rem ${section3Formik.values.margin.left}rem`,
    padding: `${section3Formik.values.padding.top}rem ${section3Formik.values.padding.right}rem ${section3Formik.values.padding.bottom}rem ${section3Formik.values.padding.left}rem`,
    width: section3Formik.values.widthFull ? "100%" : "auto",
    borderWidth: section3Formik.values.border?.width,
    borderColor: section3Formik.values.border?.color,
    borderStyle: section3Formik.values.border?.type,
  };
  const GetPaginationContLocation = (location) => {
    switch (location) {
      case "top-left":
        return { justifyContent: "flex-start", alignItems: "flex-start" };
      case "top-right":
        return { justifyContent: "flex-end", alignItems: "flex-start" };
      case "top-center":
        return { justifyContent: "center", alignItems: "flex-start" };
      case "bottom-left":
        return { justifyContent: "flex-start", alignItems: "flex-end" };
      case "bottom-right":
        return { justifyContent: "flex-end", alignItems: "flex-end" };
      case "bottom-center":
        return { justifyContent: "center", alignItems: "flex-end" };
      default:
        return { justifyContent: "center", alignItems: "flex-end" };
    }
  };

  const PaginationContStyle = {
    position: "absolute",
    // inset: 0, // Stretches the container but doesn't block clicks
    display: "flex",
    width: "100%",
    height: "100%",
    pointerEvents: "none", // Ensures this does not block input fields
    ...GetPaginationContLocation(section1Formik.values.pageIndicator?.location),
  };
  const PaginationWrapperStyle = {
    pointerEvents: "auto",
    padding: "0.2rem",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
  };

  const handleRemoveSlide = (index) => {
    const updatedSlides = section1Formik.values.slides.filter(
      (_, i) => i !== index
    );
    section1Formik.setValues({
      ...section1Formik.values,
      slides: updatedSlides,
      currentSlide: Math.max(0, section1Formik.values.currentSlide - 1),
    });
  };

  useEffect(() => {
    const slide =
      section1Formik.values.slides[section1Formik.values.currentSlide];
    if (slide) {
      section2Formik.setFieldValue("media", slide.media);
      section2Formik.setFieldValue("captionT", slide.captionT);
      section2Formik.setFieldValue("captionB", slide.captionB);
      section2Formik.setFieldValue(
        "padding",
        slide.style?.image?.padding || { top: 0, bottom: 0, left: 0, right: 0 }
      );
      section2Formik.setFieldValue(
        "margin",
        slide.style?.image?.margin || { top: 0, bottom: 0, left: 0, right: 0 }
      );
      section2Formik.setFieldValue(
        "border",
        slide.style?.image?.border || {
          width: 0,
          color: "#000000",
          type: "solid",
        }
      );
      section2Formik.setFieldValue(
        "transition",
        slide.style?.transition || {
          delay: 0,
          duration: 0,
          timing: "linear",
          type: "fade-in",
        }
      );
      section2Formik.setFieldValue(
        "schedule",
        slide.schedule || {
          duration: 0,
          sDate: "",
          eDate: "",
          sTime: "",
          eTime: "",
        }
      );
      section2Formik.setFieldValue(
        "style",
        slide.style || { bgColor: section1Formik.values.bgColor }
      );
      section1Formik.setFieldValue("bgColor", slide.style?.bgColor);

      // can we set whole slide.style.captionT to section3Formik.values
      section3Formik.setValues(
        slide.style?.captionT || section3Formik.initialValues
      );
      section4Formik.setValues(
        slide.style?.captionB || section4Formik.initialValues
      );
    }
  }, [section1Formik.values.currentSlide, section1Formik.values.slides]);

  return (
    <div
      className={
        fullScreen == false
          ? " h-full flex flex-col gap-2 py-2 relative"
          : "absolute top-0 bottom-0 left-0 right-0 h-full flex flex-col bg-white gap-2 py-2 z-[99]"
      }
    >
      <TopMenu
        user={user}
        fullWidth={fullWidth}
        formik={getCurrentSectionFormik()}
        isEditing = {Id!=null}
        globalFormik={section1Formik}
        departments={departments}
        currentSection={currentSection}
        playlistValid={playlistValid}
        selectSection={(section) => setCurrentSection(section)}
        currentSlide = {section2Formik}
        addSlide={section2Formik.handleSubmit}
        handleSubmit={handleSubmit}
      />
      {/* <Divider /> */}
      <div className="flex flex-row gap-1 p-2" style={{ height: "88%" }}>
        <div
          className={`drawerContent ${drawerHide ? "drawerContentHidden" : ""}`}
        >
          <Box>
            <FormControl
              fullWidth
              error={
                section1Formik.touched.slides &&
                Boolean(section1Formik.errors.slides)
              }
            >
              <InputLabel id="demo-simple-select-label">
                Slides {section1Formik.values.currentSlide}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={section1Formik.values.currentSlide}
                label="currentSlide"
                onChange={(e) =>
                  section1Formik.setFieldValue("currentSlide", e.target.value)
                }
                error={
                  section1Formik.touched.slides &&
                  Boolean(section1Formik.errors.slides)
                }
              >
                {section1Formik.values.slides.map((slide, index) => (
                  <MenuItem key={index} value={index}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
              {section1Formik.touched.slides &&
                section1Formik.errors.slides && (
                  <FormHelperText>
                    {section1Formik.errors.slides}
                  </FormHelperText>
                )}
            </FormControl>
          </Box>
          <SlidesManager
            slides={section1Formik.values.slides}
            setSlides={(slides) => {
              section1Formik.setFieldValue("slides", slides);
            }}
            currentSlide={section1Formik.values.currentSlide}
            setCurrentSlide={(index) =>
              section1Formik.setFieldValue("currentSlide", index)
            }
            handleRemoveSlide={handleRemoveSlide}
          />

          <div
            className="slide border border-gray-800"
            onClick={() => {
              section1Formik.setFieldValue(
                "currentSlide",
                section1Formik.values.slides.length
              );
              section2Formik.resetForm();
              section3Formik.resetForm();
              section4Formik.resetForm();
            }}
          >
            <Typography variant="h6">Add New Slide</Typography>
          </div>
        </div>
        <div className="drawerButton">
          <IconButton
            style={{ margin: 0, padding: 0, color: "var(--primary-color)" }}
            title={drawerHide ? "Open Drawer" : "Close Drawer"}
            onClick={() => setDrawerHide(!drawerHide)}
          >
            {drawerHide ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
          </IconButton>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden relative  bg-white rounded">
          <div
            className="flex justify-center items-center cursor-pointer h-full w-full"
            style={{
              backgroundColor: section1Formik.values.bgColor,
              paddingLeft: section1Formik.values.padding?.left,
              paddingRight: section1Formik.values.padding?.right,
              paddingTop: section1Formik.values.padding?.top,
              paddingBottom: section1Formik.values.padding?.bottom,
            }}
            onClick={() => setCurrentSection(1)}
          >
            {section2Formik.values.media?.mediaType == 1 && (
              <img
                src={`${process.env.REACT_APP_CDN_URL}${section2Formik.values.media?.mediaUrl}`}
                style={{
                  width: "auto",
                  height: "98%",
                  objectFit: "contain",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSection(2);
                }}
              />
            )}
            {section2Formik.values.media?.mediaType == 2 && (
              <video
                src={`${process.env.REACT_APP_CDN_URL}${section2Formik.values.media?.mediaUrl}`}
                loading="lazy"
                onLoadedMetadata={(e) => (e.target.currentTime = 1)}
                className={`object-contain h-full max-w-full bg-transparent ${
                  currentSection == 2 ? "" : ""
                } hover:border-blue-500`}
                style={{
                  paddingLeft: section2Formik.values.padding?.left,
                  paddingRight: section2Formik.values.padding?.right,
                  paddingTop: section2Formik.values.padding?.top,
                  paddingBottom: section2Formik.values.padding?.bottom,
                  marginLeft: section2Formik.values.margin?.left,
                  marginRight: section2Formik.values.margin?.right,
                  marginTop: section2Formik.values.margin?.top,
                  marginBottom: section2Formik.values.margin?.bottom,
                  borderWidth: section2Formik.values.border?.width,
                  borderColor: section2Formik.values.border?.color,
                  borderStyle: section2Formik.values.border?.type,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSection(2);
                }}
              />
            )}
          </div>
          <div className="z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md border-dashed border-2 bg-slate-50">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-900 cursor-pointer"
              onClick={() => {
                setMediaSelectOpen(true);
              }}
            >
              <Typography variant="h6">Select Media</Typography>
              {section2Formik.errors.media && (
                <Typography variant="caption" color="error">
                  {section2Formik.errors.media}
                </Typography>
              )}
            </label>
            <MediaSelect
              open={mediaSelectOpen}
              handleImageSelect={(file) => {
                section2Formik.setFieldValue("media", file);
              }}
              handleClose={() => {
                setMediaSelectOpen(false);
              }}
            />
          </div>
          {section2Formik.values.showCaptionT &&
            <input
            type="text"
            name="captionT"
            id="captionT"
            className={`absolute top-0  hover:border-blue-500 cursor-pointer rounded ${
              currentSection == 3 ? "shadow-2xl shadow-gray-900" : ""
            }`}
            style={captionTopStyle}
            a
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            onClick={() => setCurrentSection(3)}
            value={section2Formik.values.captionT}
            onChange={section2Formik.handleChange}
            placeholder="Your Caption"
          />}
          { section2Formik.values.showCaptionB &&
          <input
            type="text"
            name="captionB"
            id="captionB"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className={`absolute bottom-0  hover:border-blue-500 cursor-pointer rounded ${
              currentSection == 4 ? "shadow-2xl shadow-gray-900" : ""
            }`}
            style={captionBottomStyle}
            onClick={() => setCurrentSection(4)}
            value={section2Formik.values.captionB}
            onChange={section2Formik.handleChange}
            placeholder="Your Caption"
          />
            }

          {section1Formik.values?.pageIndicator?.isEnable && (
            <div style={PaginationContStyle}>
              <div style={PaginationWrapperStyle}>
                <PaginationCustom
                  formik={section1Formik}
                  currentPage={1}
                  totalPages={section1Formik.values.slides.length || 1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreate;
