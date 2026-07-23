import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Divider,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import {
  findPatient,
  getConsultations,
} from "../services/patientService";

export default function PatientHistory() {

  const { mobile } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadData() {

      try {

        const patientData = await findPatient(mobile);
        setPatient(patientData);

        const history = await getConsultations(mobile);
        setConsultations(history || []);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    }

    loadData();

  }, [mobile]);

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          Patient not found.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/search")}
        >
          Back
        </Button>
      </Container>
    );
  }

  return (

    <Container maxWidth="md" sx={{ my: 4 }}>

      <Paper elevation={3} sx={{ p: 4 }}>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Patient Medical History
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography>
          <strong>Patient ID:</strong> {patient.patient_code || patient.id}
        </Typography>

        <Typography>
          <strong>Name:</strong> {patient.full_name}
        </Typography>

        <Typography>
          <strong>Age:</strong> {patient.age}
        </Typography>

        <Typography>
          <strong>Gender:</strong> {patient.gender}
        </Typography>

        <Typography>
          <strong>Village:</strong> {patient.village}
        </Typography>

        <Typography>
          <strong>Mobile:</strong> {patient.mobile}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Consultation History
        </Typography>

        <Stack spacing={2}>

          {consultations.length === 0 ? (

            <Typography color="text.secondary">
              No consultation history found.
            </Typography>

          ) : (

            consultations.map((consultation, index) => (

              <Card key={consultation.id} variant="outlined">

                <CardContent>

                  <Typography variant="h6">
                    Visit {consultations.length - index}
                  </Typography>

                  <Typography>
                    <strong>Date:</strong>{" "}
                    {new Date(consultation.created_at).toLocaleDateString()}
                  </Typography>

                  <Typography>
                    <strong>BP:</strong> {consultation.bp}
                  </Typography>

                  <Typography>
                    <strong>Weight:</strong> {consultation.weight}
                  </Typography>

                  <Typography>
                    <strong>Sugar:</strong> {consultation.sugar}
                  </Typography>

                  <Typography>
                    <strong>Chief Complaint:</strong> {consultation.complaint}
                  </Typography>

                  <Typography>
                    <strong>Diagnosis:</strong> {consultation.diagnosis}
                  </Typography>

                  <Typography>
                    <strong>Doctor:</strong> {consultation.doctor}
                  </Typography>

                  <Typography>
                    <strong>Medicines:</strong>{" "}
                    {consultation.medicines
                      ?.map((m) => m.medicine)
                      .join(", ")}
                  </Typography>

                  <Box sx={{ mt: 2 }}>

                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/prescription/" + mobile)
                      }
                    >
                      View Prescription
                    </Button>

                  </Box>

                </CardContent>

              </Card>

            ))

          )}

        </Stack>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <Button
            variant="outlined"
            onClick={() => navigate("/search")}
          >
            Back to Search
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/consultation/" + mobile)}
          >
            New Consultation
          </Button>

        </Box>

      </Paper>

    </Container>

  );

}