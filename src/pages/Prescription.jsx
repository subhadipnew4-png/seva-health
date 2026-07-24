import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { findPatient, getConsultations } from "../services/patientService";

export default function Prescription() {
  const { mobile } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
  const [patient, setPatient] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .prescription-print-root, .prescription-print-root * { visibility: visible; }
        .prescription-print-root { position: absolute; left: 0; top: 0; width: 100%; }
        .prescription-print-root * { box-shadow: none !important; }
        .no-print { display: none !important; }
        @page { size: A4 portrait; margin: 10mm; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const p = await findPatient(mobile);
        setPatient(p);
        const h = await getConsultations(mobile);
        if (h?.length) setConsultation(h[0]);
      } finally {
        setLoading(false);
      }
    })();
  }, [mobile]);

  const handlePrint = useReactToPrint({ contentRef: printRef, documentTitle: "Medical Prescription" });

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;
  if (!patient) return <Container sx={{ mt: 4 }}><Typography color="error">Patient not found.</Typography></Container>;
  if (!consultation) return <Container sx={{ mt: 4 }}><Typography color="error">No consultation available.</Typography></Container>;

  const medicineRows = (consultation.medicines || [])
    .filter((item) => item?.medicine || item?.name || item?.dose || item?.days || item?.remarks)
    .map((item, index) => ({
      key: index,
      name: item.medicine || item.name || "",
      strength: item.strength || "",
      dosage: item.dosage || item.dose || "",
      frequency: item.frequency || "",
      duration: item.duration || item.days || "",
      instructions: item.instructions || item.remarks || "",
    }));

  const specialInstructions = (consultation.medicines || [])
    .map((item) => item?.remarks || item?.instructions)
    .filter(Boolean);

  return (
    <Container maxWidth="md" sx={{ my: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
      <Box className="prescription-print-root">
        <Paper
          ref={printRef}
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 0,
            background: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
            fontFamily: "'Segoe UI', Arial, sans-serif",
            '@media print': {
              border: "none",
              boxShadow: "none",
              p: 3,
            },
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3, borderBottom: "1px solid #111827", pb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 2, mb: 0.6 }}>
              MEDICAL CAMP
            </Typography>
            <Typography variant="body2" sx={{ color: "#4b5563", mb: 1 }}>
              Conducted by
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              RAMAKRISHNA MISSION CALCUTTA STUDENTS' HOME
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, color: "#374151" }}>
              Belgharia, Kolkata – 700056
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1, md: 3 }}
              justifyContent="center"
              sx={{ mt: 2, flexWrap: "wrap" }}
            >
              <Typography variant="body2" sx={{ color: "#111827", fontWeight: 600 }}>
                Medical Camp Date: {consultation.created_at ? new Date(consultation.created_at).toLocaleDateString("en-IN") : "___________________"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#111827", fontWeight: 600 }}>
                Camp Venue: _________________________________
              </Typography>
              <Typography variant="body2" sx={{ color: "#111827", fontWeight: 600 }}>
                Consulting Doctor: {consultation.doctor || "___________________________"}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Patient Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Patient Name:</strong> {patient.full_name || patient.patient_name || patient.name || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Patient ID:</strong> {patient.patient_code || patient.id || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Age / Gender:</strong> {patient.age || "-"} / {patient.gender || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Mobile Number:</strong> {patient.mobile || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Address:</strong> {patient.village || patient.address || "-"}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 0.7 }}><strong>Visit Date:</strong> {new Date(consultation.created_at).toLocaleDateString("en-IN")}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
              Clinical Details
            </Typography>
            <Stack spacing={1.8}>
              <Box sx={{ border: "1px solid #d1d5db", borderRadius: 1, p: 1.8, minHeight: 96 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Chief Complaint</Typography>
                <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                  {consultation.complaint || ""}
                </Typography>
              </Box>
              <Box sx={{ border: "1px solid #d1d5db", borderRadius: 1, p: 1.8, minHeight: 96 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Clinical Findings</Typography>
                <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                  {[(consultation.bp ? `BP: ${consultation.bp}` : ""), (consultation.weight ? `Weight: ${consultation.weight}` : ""), (consultation.sugar ? `Sugar: ${consultation.sugar}` : "")].filter(Boolean).join(" | ")}
                </Typography>
              </Box>
              <Box sx={{ border: "1px solid #d1d5db", borderRadius: 1, p: 1.8, minHeight: 96 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Diagnosis</Typography>
                <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                  {consultation.diagnosis || ""}
                </Typography>
              </Box>
              <Box sx={{ border: "1px solid #d1d5db", borderRadius: 1, p: 1.8, minHeight: 96 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Advice</Typography>
                <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                  {consultation.advice || ""}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.2 }}>
              Medicine Prescription
            </Typography>
            <Table size="small" sx={{ border: "1px solid #d1d5db", '& th, & td': { border: '1px solid #d1d5db', py: 1.2, px: 1.2 } }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Medicine Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Strength</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Dosage</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Instructions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicineRows.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.strength}</TableCell>
                    <TableCell>{row.dosage}</TableCell>
                    <TableCell>{row.frequency}</TableCell>
                    <TableCell>{row.duration}</TableCell>
                    <TableCell>{row.instructions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {specialInstructions.length > 0 && (
            <Box sx={{ mb: 3, border: "1px solid #d1d5db", borderRadius: 1, backgroundColor: "#f9fafb", p: 1.8 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.6 }}>
                Special Instructions
              </Typography>
              <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                {specialInstructions.map((instruction, index) => (
                  <span key={`${instruction}-${index}`}>
                    {index > 0 ? <br /> : null}
                    • {instruction}
                  </span>
                ))}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Box sx={{ textAlign: "center", minWidth: 220 }}>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Doctor's Signature
              </Typography>
              <Typography variant="body2" sx={{ mt: 1.5 }}>
                Registration No.: ____________________
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 4, borderTop: "1px solid #e5e7eb", pt: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Generated on:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: ___________
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time: ___________
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Page 1 of 1
            </Typography>
          </Box>

          <Box className="no-print" sx={{ display: "flex", justifyContent: "space-between", mt: 3, gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/history/" + mobile)}>
              Back
            </Button>
            <Button variant="contained" onClick={handlePrint}>
              Download / Print PDF
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
