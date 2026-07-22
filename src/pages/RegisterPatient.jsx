import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";

import { addPatient, getPatients } from "../services/storage";

export default function RegisterPatient() {
  const emptyPatient = {
    name: "",
    age: "",
    gender: "",
    mobile: "",
    village: "",
    height: "",
    weight: "",
    bp: "",
    sugar: "",
    bloodGroup: "",
    allergies: "",
    complaint: "",
    doctor: "",
  };

  const [patient, setPatient] = useState(emptyPatient);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setPatient({
      ...patient,
      [e.target.name]: e.target.value,
    });
  };

  const savePatient = () => {
    if (
      !patient.name ||
      !patient.mobile ||
      !patient.age ||
      !patient.gender
    ) {
      setMessage("Please fill all mandatory fields.");
      return;
    }

    const patients = getPatients();

    const duplicate = patients.find(
      (p) => p.mobile === patient.mobile
    );

    if (duplicate) {
      setMessage("Patient already exists with this mobile number.");
      return;
    }

    addPatient(patient);

    setMessage("Patient Registered Successfully.");

    setPatient(emptyPatient);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
        >
          Register New Patient
        </Typography>

        {message && (
          <Alert sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        <Grid container spacing={2}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Patient Name *"
              name="name"
              value={patient.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Age *"
              name="age"
              value={patient.age}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Gender *"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Mobile Number *"
              name="mobile"
              value={patient.mobile}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Village"
              name="village"
              value={patient.village}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Height (cm)"
              name="height"
              value={patient.height}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Weight (kg)"
              name="weight"
              value={patient.weight}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Blood Pressure"
              name="bp"
              value={patient.bp}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Sugar"
              name="sugar"
              value={patient.sugar}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Blood Group"
              name="bloodGroup"
              value={patient.bloodGroup}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Known Allergies"
              name="allergies"
              value={patient.allergies}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Chief Complaint"
              name="complaint"
              value={patient.complaint}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Doctor Name"
              name="doctor"
              value={patient.doctor}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={savePatient}
            >
              Save Patient
            </Button>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
}