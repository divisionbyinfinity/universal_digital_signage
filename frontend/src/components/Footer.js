import React from "react";
import { useConfig } from "../contexts/ConfigContext";
import InfoIcon from "@mui/icons-material/Info";
import "../../src/theme.css";
import { IconButton, Tooltip } from "@mui/material";

const Footer = () => {
  const { configData } = useConfig();

  return (
    <footer className="bg-nav-footer from-slate-700 to-slate-900 text-gray-100 ">
      <div className="px-6 py-2 flex flex-col md:flex-row items-center gap-4">
        {/* Branding / Text */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <span className="font-semibold text-lg">
            {configData?.footer.text || "Universal Digital Signage"}
          </span>
        </div>

        {/* Links */}
        <div className="flex space-x-6">
          {configData?.footer.link && (
            <a
              href={configData.footer.link}
              className="text-gray-300 hover:text-white transition-colors duration-200"
              target="_blank"
              rel="noreferrer"
            >
              Visit
            </a>
          )}

          {/* You can add more links here */}
          <a
            href="/help"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            <IconButton title="Help Section" className="iconButton">
              <InfoIcon sx={{ color: "var( --bg-color-secondary)" }} />
            </IconButton>
          </a>
          {/* <a
            href="/privacy"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Privacy
          </a> */}
        </div>

        {/* Copyright */}
        <div
          className="text-sm text-gray-400 mt-4 md:mt-0 text-center md:text-right ml-auto"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
        >
          © {new Date().getFullYear()} Universal Digital Signage. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
