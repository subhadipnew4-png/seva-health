import { AppBar, Box, Button, Chip, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "calc(100% - 270px)",
        ml: "270px",
        background: "linear-gradient(90deg, #0f4c81 0%, #1976d2 100%)",
        boxShadow: "0 10px 24px rgba(15, 76, 129, 0.18)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
        <Typography variant="h6" fontWeight={800}>
          🩺 Medical Camp Dashboard
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label="Camp Online" color="success" sx={{ fontWeight: 700 }} />
          <Button
            variant="outlined"
            color="inherit"
            size="small"
            onClick={handleLogout}
            sx={{ borderColor: "rgba(255,255,255,0.4)", color: "white", textTransform: "none" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}