import React from "react";
import { useConfig } from "../contexts/ConfigContext";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";

const Footer = () => {
  const { configData } = useConfig();

  return (
    <footer className="bg-nav-footer border-t border-white/10">
      <div className="section-shell px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
              Platform footer
            </span>
            <span className="text-lg font-semibold text-white">
              {configData?.footer.text || "Universal Digital Signage"}
            </span>
            <span className="text-sm text-white/65">
              Managed content distribution for enterprise screens and kiosks.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {configData?.footer.link && (
              <a
                href={configData.footer.link}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                target="_blank"
                rel="noreferrer"
              >
                Visit portal
              </a>
            )}

            <a
              href="/help"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <IconButton title="Help Section" className="iconButton" size="small">
                <InfoIcon sx={{ color: "#ffffff" }} />
              </IconButton>
              Help
            </a>
          </div>

          <div className="text-sm text-white/55 md:text-right">
            © {new Date().getFullYear()} Universal Digital Signage. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
