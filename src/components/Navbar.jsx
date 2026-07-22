import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "calc(100% - 240px)",
        ml: "240px",
        backgroundColor: "#1976d2",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          🩺 SEVA HEALTH - Digital Medical Camp
        </Typography>
      </Toolbar>
    </AppBar>
  );
}