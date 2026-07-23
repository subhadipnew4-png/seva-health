import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";

import {
  findPatient,
  getConsultations,
} from "../services/patientService";

export default function MedicalHistory() {

  const { mobile } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadData() {

      try {

        const patientData = await findPatient(mobile);
        setPatient(patientData);

        const consultationData = await getConsultations(mobile);
        setVisits(consultationData || []);

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
        <Typography>Patient not found.</Typography>
      </Container>
    );

  }

  return (

    <Container maxWidth="md">

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Medical History
      </Typography>

      <Typography sx={{ mb: 3 }}>
        {patient.full_name} ({patient.patient_code || patient.id})
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => navigate("/consultation/" + patient.mobile)}
      >
        New Consultation
      </Button>

      {visits.length === 0 ? (

        <Typography>
          No previous consultations found.
        </Typography>

      ) : (

        visits
          .slice()
          .reverse()
          .map((visit) => (

            <Card key={visit.id} sx={{ mb: 2 }}>

              <CardContent>

                <Stack spacing={1}>

                  <Typography fontWeight="bold">
                    Date: {new Date(visit.created_at).toLocaleDateString()}
                  </Typography>

                  <Typography>
                    Complaint: {visit.complaint}
                  </Typography>

                  <Typography>
                    Diagnosis: {visit.diagnosis}
                  </Typography>

                  <Typography>
                    Medicines:
                    {" "}
                    {visit.medicines
                      ?.map((m) => m.medicine)
                      .join(", ")}
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

          ))

      )}

    </Container>

  );

}