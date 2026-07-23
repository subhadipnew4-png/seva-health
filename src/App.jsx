import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import MedicineMaster from "./pages/MedicineMaster";

import Dashboard from "./pages/Dashboard";
import RegisterPatient from "./pages/RegisterPatient";
import SearchPatient from "./pages/SearchPatient";
import PatientProfile from "./pages/PatientProfile";
import Consultation from "./pages/Consultation";
import PatientHistory from "./pages/PatientHistory";
import Prescription from "./pages/Prescription";

function App() {
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/register"
            element={<RegisterPatient />}
          />
          <Route
  path="/medicines"
  element={<MedicineMaster />}
/>

          <Route
            path="/search"
            element={<SearchPatient />}
          />

          <Route
            path="/patient/:mobile"
            element={<PatientProfile />}
          />

          <Route
            path="/consultation/:mobile"
            element={<Consultation />}
          />

          <Route
            path="/history/:mobile"
            element={<PatientHistory />}
          />

          <Route
            path="/prescription/:mobile"
            element={<Prescription />}
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;