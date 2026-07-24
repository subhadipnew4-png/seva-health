import { Box, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", background: "linear-gradient(180deg, #f4f8fc 0%, #eef3f8 100%)" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
        <Navbar />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            mt: "64px",
            minHeight: "calc(100vh - 64px)",
            background: "linear-gradient(180deg, #f4f8fc 0%, #eef3f8 100%)",
          }}
        >
          {children}

          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(15, 76, 129, 0.12)" }}>
            <Typography variant="h6" fontWeight={700} align="center" sx={{ mb: 1 }}>
              SEVA HEALTH
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
              Digital Medical Camp Management System
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
              Developed for Ramakrishna Mission Calcutta Students' Home
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Version 1.0 • © 2026 SEVA HEALTH
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}