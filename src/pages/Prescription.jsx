import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import {
  Container,
  Paper,
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Divider,
  Box,
} from "@mui/material";

import {
  findPatient,
  getConsultations,
} from "../services/storage";

export default function Prescription() {

  const { mobile } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const patient = findPatient(mobile);

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

  const consultations = getConsultations(mobile);

  const consultation =
    consultations.length > 0
      ? consultations[consultations.length - 1]
      : null;

  if (!consultation) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">
          No consultation available.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={() => navigate("/history/" + mobile)}
        >
          Back
        </Button>
      </Container>
    );
  }

  const handlePrint = useReactToPrint({
  contentRef: printRef,
  documentTitle: "Medical Prescription",
});

  return (
    <Container
      maxWidth="md"
      sx={{
        my: 4,
      }}
    >

      <Paper
      ref={printRef}
        elevation={3}
        sx={{
          p: 4,
        }}
      >

        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            RAMAKRISHNA MISSION
            <br />
            CALCUTTA STUDENTS' HOME
          </Typography>

          <Typography variant="body1">
            Belgharia, Kolkata – 700056
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: "bold",
            }}
          >
            MEDICAL CAMP PRESCRIPTION
          </Typography>

        </Box>

        <Divider sx={{ mb: 3 }} />
<Grid container spacing={2} sx={{ mb: 3 }}>

          <Grid size={{ xs: 6 }}>
            <Typography><strong>Patient ID:</strong> {patient.patientId}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography align="right">
              <strong>Date:</strong> {consultation.date}
            </Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography><strong>Name:</strong> {patient.name}</Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Typography><strong>Age:</strong> {patient.age}</Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Typography><strong>Gender:</strong> {patient.gender}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography><strong>Village:</strong> {patient.village}</Typography>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Typography><strong>Mobile:</strong> {patient.mobile}</Typography>
          </Grid>

        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" fontWeight="bold">
          Clinical Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>

          <Grid size={{ xs: 4 }}>
            <Typography><strong>BP:</strong> {consultation.bp}</Typography>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography><strong>Weight:</strong> {consultation.weight}</Typography>
          </Grid>

          <Grid size={{ xs: 4 }}>
            <Typography><strong>Sugar:</strong> {consultation.sugar}</Typography>
          </Grid>

        </Grid>

        <Typography variant="h6" fontWeight="bold">
          Chief Complaint
        </Typography>

        <Typography sx={{ mb: 3 }}>
          {consultation.complaint}
        </Typography>

        <Typography variant="h6" fontWeight="bold">
          Diagnosis
        </Typography>

        <Typography sx={{ mb: 3 }}>
          {consultation.diagnosis}
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Prescription
        </Typography>

        <Table
          size="small"
          sx={{ mb: 3 }}
        >

          <TableHead>

            <TableRow>

              <TableCell><strong>Medicine</strong></TableCell>

              <TableCell><strong>Dose</strong></TableCell>

              <TableCell><strong>Days</strong></TableCell>

              <TableCell><strong>Remarks</strong></TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {consultation.medicines.map((medicine, index) => (

              <TableRow key={index}>

                <TableCell>{medicine.medicine}</TableCell>

                <TableCell>{medicine.dose}</TableCell>

                <TableCell>{medicine.days}</TableCell>

                <TableCell>{medicine.remarks}</TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

        <Typography variant="h6" fontWeight="bold">
          Advice
        </Typography>

        <Typography sx={{ mb: 4 }}>
          {consultation.advice}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 4 }}>

          <Grid size={{ xs: 6 }}>
            <Typography>
              <strong>Doctor:</strong> {consultation.doctor}
            </Typography>
          </Grid>

          <Grid
            size={{ xs: 6 }}
            sx={{ textAlign: "right" }}
          >
            <Typography>
              ______________________
            </Typography>

            <Typography>
              Signature
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          className="no-print"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >

          <Button
            variant="outlined"
            onClick={() => navigate("/history/" + mobile)}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handlePrint}
          >
            Download / Print PDF
          </Button>

        </Box>
</Paper>

      <style>
        {`
          @media print {

            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            .no-print {
              display: none !important;
            }

            @page {
              size: A4;
              margin: 15mm;
            }

            .MuiPaper-root {
              box-shadow: none !important;
              border: none !important;
            }

            .MuiContainer-root {
              max-width: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}
      </style>

    </Container>
  );

}
