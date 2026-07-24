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
  Autocomplete,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  findPatient,
  addConsultation,
  getMedicines,
  updateMedicine,
  savePrescriptionMedicines,
  deletePrescriptionMedicines,
} from "../services/patientService";

export default function Consultation() {
  const navigate = useNavigate();
  const { mobile } = useParams();

  const [patient, setPatient] = useState(null);
  const [medicineMaster, setMedicineMaster] = useState([]);

  React.useEffect(() => {
    async function loadPatient() {
      const data = await findPatient(mobile);
      setPatient(data);
    }

    loadPatient();
  }, [mobile]);

  React.useEffect(() => {
    async function loadMedicines() {
      const data = await getMedicines();
      setMedicineMaster(data.filter((m) => m.active));
    }

    loadMedicines();
  }, []);

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
        <Typography variant="h5">Patient not found</Typography>
      </Container>
    );
  }

  function handleMedicineChange(index, field, value) {
    const updated = [...medicines];

    updated[index][field] = value;

    setMedicines(updated);
  }

  function handleMedicineSelection(index, selected) {
    const updated = [...medicines];

    updated[index] = {
      ...updated[index],
      medicine: selected ? selected.medicine_name : "",
      medicineId: selected ? selected.id : "",
      stock: selected ? selected.current_stock : "",
    };

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
    const updated = medicines.filter((_, i) => i !== index);

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

  function parseDose(dose) {
    if (!dose) return 0;

    return String(dose)
      .split("-")
      .reduce((total, part) => {
        const parsed = Number.parseInt(part, 10);
        return total + (Number.isFinite(parsed) ? parsed : 0);
      }, 0);
  }

  function isLiquidMedicine(dosageForm) {
    const form = String(dosageForm || "").trim().toLowerCase();
    return /syrup|liquid|suspension|solution|drop/i.test(form);
  }

  async function saveConsultation() {
    try {
      const latestMedicines = await getMedicines();
      const validMedicines = medicines.filter((medicine) => medicine.medicineId);

      if (validMedicines.length === 0) {
        alert("Please select at least one medicine from the medicine master.");
        return;
      }

      const prescriptionRows = [];
      const updatedMedicines = [];

      for (const medicine of validMedicines) {
        const medicineRecord = latestMedicines.find(
          (item) => item.id === medicine.medicineId
        );

        const medicineName =
          medicine.medicine || medicineRecord?.medicine_name || "Medicine";

        const currentStock = Number(
          medicineRecord?.current_stock ?? medicine.stock ?? 0
        );

        const days = Number(medicine.days || 0);
        const tabletsPerDay = parseDose(medicine.dose);

        const quantityToDeduct = isLiquidMedicine(medicineRecord?.dosage_form)
          ? 1
          : tabletsPerDay * days;

        if (quantityToDeduct <= 0) {
          alert("Please enter a valid dose and number of days.");
          return;
        }

        if (quantityToDeduct > currentStock) {
          alert(`Insufficient stock for ${medicineName}`);
          return;
        }

        prescriptionRows.push({
          medicineId: medicine.medicineId,
          medicineName,
          quantity: quantityToDeduct,
          dosage: medicine.dose,
          duration: medicine.days,
          instructions: medicine.remarks,
        });

        updatedMedicines.push({
          id: medicine.medicineId,
          currentStock,
          quantityToDeduct,
          medicineName,
          reorderLevel: Number(medicineRecord?.reorder_level ?? 0),
          dosageForm: medicineRecord?.dosage_form,
        });
      }

      const consultationPayload = {
        mobile,
        bp,
        weight,
        sugar,
        complaint,
        diagnosis,
        advice,
        doctor,
        medicines: validMedicines,
      };

      const consultationResult = await addConsultation(consultationPayload);
      const consultationId = consultationResult?.[0]?.id || consultationResult?.id;

      if (!consultationId) {
        throw new Error("Consultation save failed");
      }

      await savePrescriptionMedicines(consultationId, prescriptionRows);

      const stockUpdates = [];
      let lowStockAlert = false;

      for (const entry of updatedMedicines) {
        const newStock = entry.currentStock - entry.quantityToDeduct;
        const updateValues = {
          current_stock: newStock,
          active: newStock > 0,
        };

        await updateMedicine(entry.id, updateValues);
        stockUpdates.push({ id: entry.id, newStock, medicineName: entry.medicineName });

        const recordIndex = latestMedicines.findIndex((item) => item.id === entry.id);
        if (recordIndex >= 0) {
          latestMedicines[recordIndex].current_stock = newStock;
          latestMedicines[recordIndex].active = newStock > 0;
        }

        setMedicineMaster((prev) =>
          prev.map((item) =>
            item.id === entry.id
              ? { ...item, current_stock: newStock, active: newStock > 0 }
              : item
          )
        );

        if (newStock <= Number(entry.reorderLevel ?? 0)) {
          lowStockAlert = true;
        }
      }

      const stockSummary = stockUpdates
        .map((item) => `${item.medicineName}: ${item.newStock}`)
        .join(" | ");

      if (lowStockAlert) {
        alert(`Low Stock Alert\n${stockSummary}`);
      }

      alert(`Consultation Saved Successfully\nUpdated Stock: ${stockSummary}`);

      navigate("/history/" + mobile);
    } catch (err) {
      console.error(err);
      alert("Error saving consultation");
    }
  }

  function printPrescription() {
    addConsultation(mobile, buildConsultation());

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
              value={patient.patient_code || patient.id}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Patient Name"
              value={patient.full_name}
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
              <TableCell>
                <strong>Medicine</strong>
              </TableCell>

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
                  <Autocomplete
                    fullWidth
                    options={medicineMaster}
                    value={
                      medicineMaster.find((m) => m.id === medicine.medicineId) || null
                    }
                    onChange={(_, selected) =>
                      handleMedicineSelection(index, selected)
                    }
                    getOptionLabel={(option) =>
                      option
                        ? `${option.medicine_name} (${option.strength} ${option.dosage_form})`
                        : ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Medicine" />
                    )}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Available Stock: {medicine.stock ?? 0}
                  </Typography>
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    value={medicine.dose}
                    placeholder="1-0-1"
                    onChange={(e) =>
                      handleMedicineChange(index, "dose", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    value={medicine.days}
                    placeholder="5"
                    onChange={(e) =>
                      handleMedicineChange(index, "days", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    fullWidth
                    value={medicine.remarks}
                    placeholder="After Food"
                    onChange={(e) =>
                      handleMedicineChange(index, "remarks", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => deleteMedicineRow(index)}
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
          <Button variant="contained" size="large" onClick={saveConsultation}>
            Save Consultation
          </Button>

          <Button variant="outlined" size="large" onClick={printPrescription}>
            Print Prescription
          </Button>

          <Button
            variant="text"
            size="large"
            onClick={() => navigate("/history/" + mobile)}
          >
            Back
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
