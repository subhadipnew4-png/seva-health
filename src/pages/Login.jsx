import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { supabase } from "../services/supabase";

export default function Login({ onAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Invalid email address or password.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError || !data?.session) {
      setError("Invalid email address or password.");
      return;
    }

    onAuthenticated?.(data.session);
    navigate("/dashboard", { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f4f8fc 0%, #eaf2fb 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4.5 },
            borderRadius: 4,
            boxShadow: "0 20px 50px rgba(15, 76, 129, 0.12)",
          }}
        >
          <Stack spacing={2.5} alignItems="center" sx={{ textAlign: "center" }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0f4c81 0%, #1976d2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 32 }} />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
                MEDICAL CAMP MANAGEMENT SYSTEM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ramakrishna Mission Calcutta Students' Home
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Belgharia, Kolkata – 700056
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((value) => !value)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error ? <Alert severity="error">{error}</Alert> : null}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.2,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #0f4c81 0%, #1976d2 100%)",
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : "Login"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
