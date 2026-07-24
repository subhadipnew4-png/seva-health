import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 270;
const collapsedWidth = 84;

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
  { label: "Register Patient", path: "/register", icon: PersonAddAlt1Icon },
  { label: "Search Patient", path: "/search", icon: SearchIcon },
  { label: "Reports", path: "/reports", icon: AssessmentIcon },
  { label: "Medicine Master", path: "/medicines", icon: MedicalServicesIcon },
  { label: "Settings", path: "/settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        transition: "width 0.25s ease",
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #0f4c81 0%, #1463a8 100%)",
          color: "white",
          borderRight: "none",
          boxShadow: "12px 0 28px rgba(15, 76, 129, 0.18)",
          transition: "width 0.25s ease",
        },
      }}
    >
      <Toolbar sx={{ px: 2, py: 2, justifyContent: "space-between" }}>
        <Stack spacing={0.5} sx={{ overflow: "hidden" }}>
          <Typography variant="h6" fontWeight={800} sx={{ whiteSpace: "nowrap" }}>
            {collapsed ? "SH" : "SEVA HEALTH"}
          </Typography>
          {!collapsed && (
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Medical Camp Portal
            </Typography>
          )}
        </Stack>
        <IconButton onClick={() => setCollapsed((prev) => !prev)} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.12)", borderRadius: 2 }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.16)" }} />

      <List sx={{ px: 1.2, pt: 1.2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 3,
                mb: 0.8,
                minHeight: 48,
                px: 1.2,
                color: active ? "#0f4c81" : "white",
                background: active ? "rgba(255,255,255,0.96)" : "transparent",
                boxShadow: active ? "0 8px 20px rgba(255,255,255,0.14)" : "none",
                transition: "all 0.2s ease",
                transform: active ? "translateX(2px)" : "translateX(0)",
                "&:hover": {
                  background: active ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.12)",
                  transform: "translateX(2px)",
                },
              }}
            >
              <Box sx={{ mr: collapsed ? 0 : 1.5, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 28 }}>
                <Icon sx={{ fontSize: 22 }} />
              </Box>
              {!collapsed && (
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
    </Drawer>
  );
}