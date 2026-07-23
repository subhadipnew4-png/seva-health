import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
} from "@mui/material";

import { getPatients } from "../services/storage";

export default function SearchPatient() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const data = await getPatients();
      setPatients(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const name = (patient.full_name || "").toLowerCase();
    const mobile = patient.mobile || "";

    return (
      name.includes(keyword.toLowerCase()) ||
      mobile.includes(keyword)
    );
  });

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }} elevation={4}>

        <Typography variant="h4" align="center" gutterBottom>
          Search Patient
        </Typography>

        <TextField
          fullWidth
          label="Search by Name or Mobile"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ mb: 4 }}
        />

        {filteredPatients.map((patient) => (
          <Card key={patient.id} sx={{ mb: 2 }}>
            <CardContent>

              <Typography variant="h6">
                {patient.full_name}
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

              <Button
                sx={{ mt: 2 }}
                variant="contained"
                onClick={() =>
                  navigate("/patient/" + patient.mobile)
                }
              >
                Open Profile
              </Button>

            </CardContent>
          </Card>
        ))}

      </Paper>
    </Container>
  );
}