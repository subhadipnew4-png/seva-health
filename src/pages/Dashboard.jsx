import { Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Welcome to SEVA HEALTH
      </Typography>

      <Typography sx={{ mb: 4 }}>
        NGO Digital Health Management System
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <DashboardCard
            title="👤 Register Patient"
            subtitle="Create a new patient record"
            onClick={() => navigate("/register")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard
            title="🔍 Search Patient"
            subtitle="Find existing patients"
            onClick={() => navigate("/search")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard
            title="📊 Reports"
            subtitle="View patient statistics"
            onClick={() => alert("Coming Soon")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard
            title="⚙️ Settings"
            subtitle="Application settings"
            onClick={() => alert("Coming Soon")}
          />
        </Grid>

      </Grid>

    </Container>
  );
}