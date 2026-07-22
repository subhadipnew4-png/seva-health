import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  Divider,
} from "@mui/material";

import { findPatient } from "../services/storage";

export default function PatientProfile() {

  const { mobile } = useParams();
  const navigate = useNavigate();

  const patient = findPatient(mobile);

  if (!patient) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5">
          Patient Not Found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>

      <Paper sx={{ p: 4 }} elevation={4}>

        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Patient Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography>
          <b>Patient ID:</b> {patient.patientId}
        </Typography>

        <Typography>
          <b>Name:</b> {patient.name}
        </Typography>

        <Typography>
          <b>Age:</b> {patient.age}
        </Typography>

        <Typography>
          <b>Gender:</b> {patient.gender}
        </Typography>

        <Typography>
          <b>Village:</b> {patient.village}
        </Typography>

        <Typography>
          <b>Mobile:</b> {patient.mobile}
        </Typography>

        <Typography>
          <b>Blood Group:</b> {patient.bloodGroup}
        </Typography>

        <Typography>
          <b>Allergies:</b> {patient.allergies}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() =>
            navigate("/history/" + patient.mobile)
          }
        >
          Medical History
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() =>
            navigate("/consultation/" + patient.mobile)
          }
        >
          New Consultation
        </Button>

      </Paper>

    </Container>
  );
}