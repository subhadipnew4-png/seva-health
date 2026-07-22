import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {

  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#1565c0",
          color: "white",
        },
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          SEVA HEALTH
        </Typography>

      </Toolbar>

      <List>

        <ListItemButton
          onClick={() => navigate("/dashboard")}
        >
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/register")}
        >
          <ListItemText primary="Register Patient" />
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate("/search")}
        >
          <ListItemText primary="Search Patient" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Reports" />
        </ListItemButton>

        <ListItemButton>
          <ListItemText primary="Settings" />
        </ListItemButton>

      </List>

    </Drawer>
  );
}