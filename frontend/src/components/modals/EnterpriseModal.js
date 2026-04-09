import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

export default function EnterpriseModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  actions = null,
  maxWidth = "sm",
  fullWidth = true,
  keepMounted = true,
  contentDividers = false,
  scroll = "paper",
  showClose = true,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      keepMounted={keepMounted}
      scroll={scroll}
      PaperProps={{
        sx: {
          borderRadius: "22px",
          border: "1px solid rgba(148, 163, 184, 0.34)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
          boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)",
          overflow: "hidden",
          maxHeight: "calc(100dvh - 28px)",
          display: "flex",
          flexDirection: "column",
        },
      }}
      aria-labelledby="enterprise-modal-title"
    >
      <DialogTitle
        id="enterprise-modal-title"
        sx={{
          px: 3,
          py: 2.25,
          borderBottom: "1px solid rgba(148, 163, 184, 0.22)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          background:
            "radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 58%), linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
        }}
      >
        <div>
          <Typography
            variant="h6"
            sx={{ fontFamily: "var(--font-family-heading)", fontWeight: 700, color: "#0f172a" }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {showClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: "#64748b",
              border: "1px solid rgba(148, 163, 184, 0.3)",
              background: "rgba(255,255,255,0.85)",
              "&:hover": { background: "rgba(241,245,249,0.95)", color: "#0f172a" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}
      </DialogTitle>

      <DialogContent
        dividers={contentDividers}
        sx={{
          flex: "1 1 auto",
          px: 3,
          pt: 3.75,
          pb: 2.75,
          background: "transparent",
          overflowY: "auto",
          minHeight: 0,
          "& > *:first-of-type": { mt: 0.75 },
          // Keep first input labels clear of the title divider when they float.
          "& .MuiTextField-root:first-of-type": { mt: 0.75 },
          "& .MuiFormControl-root:first-of-type": { mt: 0.75 },
        }}
      >
        {children}
      </DialogContent>

      {actions ? (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(148, 163, 184, 0.2)",
            background: "rgba(248,250,252,0.75)",
          }}
        >
          {actions}
        </DialogActions>
      ) : null}
    </Dialog>
  );
}
