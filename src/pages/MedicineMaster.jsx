import React, { useEffect, useState } from "react";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Switch,
  FormControlLabel,
  IconButton,
  Chip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../services/patientService";

export default function MedicineMaster() {

  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const emptyMedicine = {
    medicine_name: "",
    generic_name: "",
    strength: "",
    dosage_form: "",
    manufacturer: "",
    current_stock: 0,
    reorder_level: 10,
    active: true,
  };

  const [medicine, setMedicine] =
    useState(emptyMedicine);

  useEffect(() => {
    loadMedicines();
  }, []);

  async function loadMedicines() {

    try {

      const data = await getMedicines();

      setMedicines(data);

    } catch (err) {

      console.error(err);

      alert("Unable to load medicines.");

    }

  }

  function handleOpenNew() {

    setEditingId(null);

    setMedicine(emptyMedicine);

    setOpen(true);

  }

  function handleEdit(item) {

    setEditingId(item.id);

    setMedicine(item);

    setOpen(true);

  }

  async function handleDelete(id) {

    if (!window.confirm("Delete this medicine?"))
      return;

    try {

      await deleteMedicine(id);

      loadMedicines();

    } catch (err) {

      console.error(err);

      alert("Unable to delete medicine.");

    }

  }

  async function handleSave() {

    try {

      if (editingId) {

        await updateMedicine(
          editingId,
          medicine
        );

      } else {

        await addMedicine(medicine);

      }

      setOpen(false);

      loadMedicines();

    } catch (err) {

      console.error(err);

      alert("Unable to save medicine.");

    }

  }

  const filtered = medicines.filter((m) => {

    return (

      m.medicine_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      m.generic_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    );

  });

  return (

    <Container
      maxWidth="lg"
      sx={{ mt: 4 }}
    >

      <Paper
        elevation={3}
        sx={{ p: 3 }}
      >

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >

          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Medicine Master
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNew}
          >
            Add Medicine
          </Button>

        </Box>

        <TextField
          fullWidth
          label="Search Medicine"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          sx={{ mb: 3 }}
        />
<TableContainer>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <strong>Medicine</strong>
                </TableCell>

                <TableCell>
                  <strong>Generic Name</strong>
                </TableCell>

                <TableCell>
                  <strong>Strength</strong>
                </TableCell>

                <TableCell>
                  <strong>Form</strong>
                </TableCell>

                <TableCell>
                  <strong>Manufacturer</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Stock</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Status</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filtered.map((item) => (

                <TableRow
                  key={item.id}
                  hover
                >

                  <TableCell>

                    <Typography
                      fontWeight="bold"
                    >
                      {item.medicine_name}
                    </Typography>

                  </TableCell>

                  <TableCell>

                    {item.generic_name}

                  </TableCell>

                  <TableCell>

                    {item.strength}

                  </TableCell>

                  <TableCell>

                    {item.dosage_form}

                  </TableCell>

                  <TableCell>

                    {item.manufacturer}

                  </TableCell>

                  <TableCell
                    align="center"
                  >

                    {item.current_stock <= item.reorder_level ? (

                      <Chip
                        color="error"
                        label={
                          item.current_stock
                        }
                      />

                    ) : (

                      <Chip
                        color="success"
                        label={
                          item.current_stock
                        }
                      />

                    )}

                  </TableCell>

                  <TableCell
                    align="center"
                  >

                    {item.active ? (

                      <Chip
                        label="Active"
                        color="success"
                      />

                    ) : (

                      <Chip
                        label="Inactive"
                        color="default"
                      />

                    )}

                  </TableCell>

                  <TableCell
                    align="center"
                  >

                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleEdit(item)
                      }
                    >

                      <EditIcon />

                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >

                      <DeleteIcon />

                    </IconButton>

                  </TableCell>

                </TableRow>

              ))}

              {filtered.length === 0 && (

                <TableRow>

                  <TableCell
                    colSpan={8}
                    align="center"
                  >

                    <Typography>

                      No medicines found.

                    </Typography>

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </TableContainer>
<Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >

          <DialogTitle>

            {editingId
              ? "Edit Medicine"
              : "Add Medicine"}

          </DialogTitle>

          <DialogContent>

            <Grid
              container
              spacing={2}
              sx={{ mt: 1 }}
            >

              <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                  fullWidth
                  label="Medicine Name"
                  value={medicine.medicine_name}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      medicine_name: e.target.value,
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                  fullWidth
                  label="Generic Name"
                  value={medicine.generic_name}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      generic_name: e.target.value,
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>

                <TextField
                  fullWidth
                  label="Strength"
                  value={medicine.strength}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      strength: e.target.value,
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>

                <TextField
                  fullWidth
                  label="Dosage Form"
                  value={medicine.dosage_form}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      dosage_form: e.target.value,
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>

                <TextField
                  fullWidth
                  label="Manufacturer"
                  value={medicine.manufacturer}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      manufacturer: e.target.value,
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                  fullWidth
                  type="number"
                  label="Current Stock"
                  value={medicine.current_stock}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      current_stock: Number(
                        e.target.value
                      ),
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>

                <TextField
                  fullWidth
                  type="number"
                  label="Reorder Level"
                  value={medicine.reorder_level}
                  onChange={(e) =>
                    setMedicine({
                      ...medicine,
                      reorder_level: Number(
                        e.target.value
                      ),
                    })
                  }
                />

              </Grid>

              <Grid size={{ xs: 12 }}>

                <FormControlLabel
                  control={
                    <Switch
                      checked={medicine.active}
                      onChange={(e) =>
                        setMedicine({
                          ...medicine,
                          active: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Active Medicine"
                />

              </Grid>

            </Grid>

          </DialogContent>

          <DialogActions>

            <Button
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>

          </DialogActions>

        </Dialog>

      </Paper>

    </Container>

  );

}
