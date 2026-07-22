import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  findPatient,
  addConsultation,
} from "../services/storage";

export default function Consultation() {

  const navigate = useNavigate();
  const { mobile } = useParams();

  const patient = findPatient(mobile);

  const [bp, setBp] = useState("");
  const [weight, setWeight] = useState("");
  const [sugar, setSugar] = useState("");

  const [complaint, setComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [doctor, setDoctor] = useState("");

  const [medicines, setMedicines] = useState([
    {
      medicine: "",
      dose: "",
      days: "",
      remarks: "",
    },
  ]);

  if (!patient) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h5">
          Patient not found
        </Typography>
      </Container>
    );
  }

  function handleMedicineChange(index, field, value) {

    const updated = [...medicines];

    updated[index][field] = value;

    setMedicines(updated);

  }

  function addMedicineRow() {

    setMedicines([
      ...medicines,
      {
        medicine: "",
        dose: "",
        days: "",
        remarks: "",
      },
    ]);

  }

  function deleteMedicineRow(index) {

    const updated = medicines.filter(
      (_, i) => i !== index
    );

    if (updated.length === 0) {

      updated.push({
        medicine: "",
        dose: "",
        days: "",
        remarks: "",
      });

    }

    setMedicines(updated);

  }

  function buildConsultation() {

    return {

      consultationId: Date.now(),

      date: new Date().toLocaleDateString(),

      bp,

      weight,

      sugar,

      complaint,

      diagnosis,

      advice,

      doctor,

      medicines,

    };

  }

  function saveConsultation() {

    addConsultation(
      mobile,
      buildConsultation()
    );

    alert("Consultation Saved Successfully");

    navigate("/history/" + mobile);

  }

  function printPrescription() {

    addConsultation(
      mobile,
      buildConsultation()
    );

    navigate("/prescription/" + mobile);

  }

  return (
<Container maxWidth="lg" sx={{ mt: 3, mb: 5 }}>

      <Paper sx={{ p: 4 }}>

        <Typography variant="h4" gutterBottom>
          New Consultation
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Patient Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Patient ID"
              value={patient.patientId}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Patient Name"
              value={patient.name}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Age"
              value={patient.age}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Gender"
              value={patient.gender}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Village"
              value={patient.village}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mobile"
              value={patient.mobile}
              InputProps={{ readOnly: true }}
            />
          </Grid>

        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          Clinical Details
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="BP"
              value={bp}
              onChange={(e) => setBp(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Sugar"
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Chief Complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Medicines
        </Typography>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell><strong>Medicine</strong></TableCell>

              <TableCell width="140">
                <strong>Dose</strong>
              </TableCell>

              <TableCell width="100">
                <strong>Days</strong>
              </TableCell>

              <TableCell>
                <strong>Remarks</strong>
              </TableCell>

              <TableCell width="70">
                <strong>Delete</strong>
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {medicines.map((medicine, index) => (

              <TableRow key={index}>

                <TableCell>

                  <TextField
                    fullWidth
                    value={medicine.medicine}
                    placeholder="Medicine Name"
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "medicine",
                        e.target.value
                      )
                    }
                  />

                </TableCell>

                <TableCell>

                  <TextField
                    fullWidth
                    value={medicine.dose}
                    placeholder="1-0-1"
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "dose",
                        e.target.value
                      )
                    }
                  />

                </TableCell>

                <TableCell>

                  <TextField
                    fullWidth
                    value={medicine.days}
                    placeholder="5"
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "days",
                        e.target.value
                      )
                    }
                  />

                </TableCell>

                <TableCell>

                  <TextField
                    fullWidth
                    value={medicine.remarks}
                    placeholder="After Food"
                    onChange={(e) =>
                      handleMedicineChange(
                        index,
                        "remarks",
                        e.target.value
                      )
                    }
                  />

                </TableCell>

                <TableCell align="center">

                  <IconButton
                    color="error"
                    onClick={() =>
                      deleteMedicineRow(index)
                    }
                  >
                    <DeleteIcon />
                  </IconButton>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addMedicineRow}
        >
          Add Medicine
        </Button>

        <Divider sx={{ my: 4 }} />
<Typography variant="h6" gutterBottom>
          Advice
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Doctor's Advice"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" gutterBottom>
          Doctor Details
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Doctor Name"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consultation Date"
              value={new Date().toLocaleDateString()}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

        </Grid>

        <Divider sx={{ mb: 3 }} />

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          justifyContent="center"
        >

          <Button
            variant="contained"
            size="large"
            onClick={saveConsultation}
          >
            Save Consultation
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={printPrescription}
          >
            Print Prescription
          </Button>

          <Button
            variant="text"
            size="large"
            onClick={() =>
              navigate("/history/" + mobile)
            }
          >
            Back
          </Button>

        </Stack>

      </Paper>

    </Container>

  );

}
