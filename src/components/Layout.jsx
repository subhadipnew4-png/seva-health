import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>

        <Navbar />

        <Box
          sx={{
            p: 3,
            mt: "64px",
            background: "#f5f7fb",
            minHeight: "100vh",
          }}
        >
          {children}
        </Box>

      </Box>
    </Box>
  );
}