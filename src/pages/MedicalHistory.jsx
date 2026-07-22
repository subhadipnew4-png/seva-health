import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

import { findPatient } from "../services/storage";

export default function MedicalHistory() {
  const { mobile } = useParams();
  const navigate = useNavigate();

  const patient = findPatient(mobile);

  if (!patient) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Patient not found.</Typography>
      </Container>
    );
  }

  const visits = patient.visits || [];

  return (
    <Container maxWidth="md">

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Medical History
      </Typography>

      <Typography sx={{ mb: 3 }}>
        {patient.name} ({patient.patientId})
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/consultation/" + patient.mobile)}
        sx={{ mb: 3 }}
      >
        New Consultation
      </Button>

      {visits.length === 0 ? (
        <Typography>No previous consultations found.</Typography>
      ) : (
        visits
          .slice()
          .reverse()
          .map(function (visit, index) {
            return (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>

                  <Stack spacing={1}>

                    <Typography fontWeight="bold">
                      Date: {visit.date}
                    </Typography>

                    <Typography>
                      Complaint: {visit.complaint}
                    </Typography>

                    <Typography>
                      Diagnosis: {visit.diagnosis}
                    </Typography>

                    <Typography>
                      Medicines: {visit.medicines}
                    </Typography>

                    <Typography>
                      Advice: {visit.advice}
                    </Typography>

                    <Typography>
                      Doctor: {visit.doctor}
                    </Typography>

                  </Stack>

                </CardContent>
              </Card>
            );
          })
      )}

    </Container>
  );
}