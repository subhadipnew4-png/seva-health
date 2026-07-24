import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MedicationIcon from "@mui/icons-material/Medication";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import { getAllConsultations, getMedicines, getPatients } from "../services/patientService";

function AnimatedCount({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let startTime;
    const duration = 900;

    const updateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(updateValue);
      }
    };

    animationFrame = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(animationFrame);
  }, [value]);

  return <Typography variant="h4" fontWeight="700">{displayValue}</Typography>;
}

function StatCard({ title, value, subtitle, icon: Icon, gradient, accent }) {
  return (
    <Grid item xs={12} sm={6} lg={3}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 4,
          background: gradient,
          color: "white",
          boxShadow: "0 16px 36px rgba(15, 23, 42, 0.16)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          transform: "translateY(0)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 22px 40px rgba(15, 23, 42, 0.22)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
                {title}
              </Typography>
              <AnimatedCount value={value} />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                {subtitle}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(6px)",
              }}
            >
              <Icon sx={{ fontSize: 26, color: accent }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}

function QuickActionCard({ icon: Icon, title, description, actionLabel, onClick, accent, accentSoft, buttonGradient }) {
  const handleButtonClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <Grid item xs={12} sm={6} lg={6}>
      <Card
        elevation={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
        sx={{
          height: "100%",
          borderRadius: 4,
          borderLeft: `4px solid ${accent}`,
          background: `linear-gradient(135deg, #ffffff 0%, ${accentSoft} 100%)`,
          boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
          cursor: "pointer",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
          transform: "translateY(0)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%", display: "flex", flexDirection: "column", gap: 2.2 }}>
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              bgcolor: accentSoft,
              border: `1px solid ${accent}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ color: accent, fontSize: 28 }} />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.8, color: "#0f172a" }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              {description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleButtonClick}
            endIcon={<ArrowForwardIcon />}
            sx={{
              mt: "auto",
              borderRadius: 999,
              py: 1.1,
              px: 2,
              background: buttonGradient,
              boxShadow: "none",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                boxShadow: "none",
                transform: "translateY(-1px)",
              },
            }}
          >
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    patients: 0,
    consultations: 0,
    medicines: 0,
    lowStock: 0,
  });
  const [recentPatients, setRecentPatients] = useState([]);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const [patientsData, consultationsData, medicinesData] = await Promise.all([
          getPatients(),
          getAllConsultations(),
          getMedicines(),
        ]);

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

        const todaysConsultations = (consultationsData || []).filter((consultation) => {
          if (!consultation.created_at) return false;
          const createdAt = new Date(consultation.created_at);
          return createdAt >= startOfToday && createdAt < endOfToday;
        });

        const lowStock = (medicinesData || []).filter((medicine) => {
          const currentStock = Number(medicine.current_stock ?? 0);
          const reorderLevel = Number(medicine.reorder_level ?? 0);
          return currentStock <= reorderLevel;
        });

        setStats({
          patients: patientsData?.length || 0,
          consultations: todaysConsultations.length,
          medicines: medicinesData?.length || 0,
          lowStock: lowStock.length,
        });
        setRecentPatients((patientsData || []).slice(0, 5));
        setLowStockMedicines(lowStock.slice(0, 6));
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    }

    loadStats();
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #0f4c81 0%, #2b7cd9 100%)",
          color: "white",
          boxShadow: "0 18px 40px rgba(15, 76, 129, 0.24)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 35%)",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 0 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          sx={{ position: "relative" }}
        >
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, opacity: 0.95, mb: 1 }}>
              Digital Medical Camp
            </Typography>
            <Typography variant="h4" fontWeight="800" gutterBottom>
              SEVA HEALTH CAMP
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.95, maxWidth: 560 }}>
              A Initiative by Ramakrishna Mission Calcutta Students' Home
            </Typography>
          </Box>

          <Stack spacing={1.2} alignItems={{ xs: "flex-start", md: "flex-end" }}>
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: 0.95 }}>
              {formattedDate}
            </Typography>
            <Typography variant="h5" fontWeight="800">
              {formattedTime}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <StatCard
          title="Total Patients"
          value={stats.patients}
          subtitle="Registered in the clinic"
          icon={PeopleIcon}
          gradient="linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)"
          accent="#dbeafe"
        />

        <StatCard
          title="Today's Consultations"
          value={stats.consultations}
          subtitle="Visits completed today"
          icon={MedicalServicesIcon}
          gradient="linear-gradient(135deg, #15803d 0%, #4ade80 100%)"
          accent="#dcfce7"
        />

        <StatCard
          title="Total Medicines"
          value={stats.medicines}
          subtitle="Items in medicine master"
          icon={MedicationIcon}
          gradient="linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)"
          accent="#f5e8ff"
        />

        <StatCard
          title="Low Stock Medicines"
          value={stats.lowStock}
          subtitle="Need reorder soon"
          icon={WarningAmberIcon}
          gradient="linear-gradient(135deg, #dc2626 0%, #fb923c 100%)"
          accent="#ffedd5"
        />
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <QuickActionCard
          icon={PersonAddAlt1Icon}
          title="Register Patient"
          description="Capture patient registration data for the camp session."
          actionLabel="Register →"
          onClick={() => navigate("/register")}
          accent="#2563eb"
          accentSoft="#e8f1ff"
          buttonGradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
        />
        <QuickActionCard
          icon={SearchIcon}
          title="Search Patient"
          description="Find existing patients quickly with a secure lookup."
          actionLabel="Search →"
          onClick={() => navigate("/search")}
          accent="#7c3aed"
          accentSoft="#f3e8ff"
          buttonGradient="linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
        />
        <QuickActionCard
          icon={ReceiptLongIcon}
          title="New Prescription"
          description="Create a consultation and issue a prescription instantly."
          actionLabel="Start →"
          onClick={() => navigate("/dashboard")}
          accent="#16a34a"
          accentSoft="#eaf7ee"
          buttonGradient="linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
        />
        <QuickActionCard
          icon={Inventory2Icon}
          title="Medicine Inventory"
          description="Track stock, low inventory, and medicine availability."
          actionLabel="Open →"
          onClick={() => navigate("/medicines")}
          accent="#f59e0b"
          accentSoft="#fff7e8"
          buttonGradient="linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)"
        />
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ height: "100%", borderRadius: 4, boxShadow: "0 16px 36px rgba(15, 23, 42, 0.08)", background: "rgba(255,255,255,0.92)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Low Stock Medicines
              </Typography>

              {lowStockMedicines.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No low stock medicines at the moment.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {lowStockMedicines.map((medicine, index) => (
                    <Box key={medicine.id || medicine.medicine_name || index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ py: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <WarningAmberIcon sx={{ color: "warning.main", fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600}>
                            {medicine.medicine_name || medicine.name || "Medicine"}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {medicine.current_stock ?? 0}
                        </Typography>
                      </Stack>
                      {index < lowStockMedicines.length - 1 ? <Divider /> : null}
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card elevation={0} sx={{ height: "100%", borderRadius: 4, boxShadow: "0 16px 36px rgba(15, 23, 42, 0.08)", background: "rgba(255,255,255,0.92)" }}>
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
                Today's Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.consultations} consultations recorded today and {stats.lowStock} items flagged for replenishment.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}