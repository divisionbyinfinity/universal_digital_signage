import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Box, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

const AlertContext = createContext(null);

const TYPE_ICONS = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function AlertProvider({ children, autoHideDuration = 10000, maxAlerts = 10 }) {
  const [alerts, setAlerts] = useState([]);
  const timersRef = useRef({});
  const theme = useTheme();

  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const addAlert = (alert) => {
    const id = genId();
    const startTime = Date.now();

    setAlerts((prev) => {
      const next = [...prev, { ...alert, id, progress: 0 }];
      if (next.length > maxAlerts) next.shift();
      return next;
    });

    timersRef.current[id] = setInterval(() => {
      setAlerts((prev) =>
        prev
          .map((a) => {
            if (a.id !== id) return a;
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / autoHideDuration, 1);
            if (progress >= 1) {
              clearInterval(timersRef.current[id]);
              delete timersRef.current[id];
              return null;
            }
            return { ...a, progress };
          })
          .filter(Boolean)
      );
    }, 50);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (timersRef.current[id]) {
      clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
      timersRef.current = {};
    };
  }, []);

  // color mapping based on theme
  const getColors = (type) => {
    const palette = theme.palette;
    switch (type) {
      case "success":
        return { border: palette.success.main, icon: palette.success.main };
      case "error":
        return { border: palette.error.main, icon: palette.error.main };
      case "warning":
        return { border: palette.warning.main, icon: palette.warning.main };
      case "info":
      default:
        return { border: palette.info.main, icon: palette.info.main };
    }
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {children}
      {/* Bottom-right alerts */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 1.5,
          width: 360,
          zIndex: 1500,
        }}
      >
        {alerts.map((alert) => {
          const { border, icon } = getColors(alert.type);
          const Icon = TYPE_ICONS[alert.type] || InfoIcon;

          return (
            <Slide key={alert.id} direction="up" in mountOnEnter unmountOnExit>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: theme.typography.fontFamily,
                  fontSize: 14,
                  borderRadius: "0.5rem",
                  backgroundColor: theme.palette.background.paper,
                  borderLeft: `4px solid ${border}`,
                  padding: "12px 16px",
                  boxShadow: theme.shadows[4],
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Icon */}
                <Icon sx={{ mr: 1, color: icon }} fontSize="small" />

                {/* Message */}
                <Box sx={{ flex: 1, color: theme.palette.text.primary }}>
                  {alert.message}
                </Box>

                {/* Close button */}
                <IconButton
                  size="small"
                  aria-label="close"
                  onClick={() => removeAlert(alert.id)}
                  sx={{ color: theme.palette.text.secondary, ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>

                {/* Progress bar */}
                {/* <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: `${(alert.progress || 0) * 100}%`,
                    backgroundColor: theme.palette.primary.main,
                    transition: "width 50ms linear",
                  }}
                /> */}
              </Box>
            </Slide>
          );
        })}
      </Box>
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside <AlertProvider>");
  return ctx.addAlert;
};
