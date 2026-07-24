import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import MedicineMaster from "./pages/MedicineMaster";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import RegisterPatient from "./pages/RegisterPatient";
import SearchPatient from "./pages/SearchPatient";
import PatientProfile from "./pages/PatientProfile";
import Consultation from "./pages/Consultation";
import PatientHistory from "./pages/PatientHistory";
import Prescription from "./pages/Prescription";
import { supabase } from "./services/supabase";

function ProtectedRoute({ children }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const session = data.session;
      const isAllowed = !adminEmail || session?.user?.email?.toLowerCase() === adminEmail;
      setIsAuthenticated(Boolean(session) && isAllowed);
      setSessionReady(true);
    }

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const isAllowed = !adminEmail || session?.user?.email?.toLowerCase() === adminEmail;
      if (session && !isAllowed) {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setSessionReady(true);
        return;
      }
      setIsAuthenticated(Boolean(session) && isAllowed);
      setSessionReady(true);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!sessionReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [sessionReady, setSessionReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || "").trim();

    async function ensureAdminAccount() {
      if (!adminEmail || !adminPassword) {
        return;
      }

      try {
        await supabase.auth.signUp({
          email: adminEmail,
          password: adminPassword,
        });
      } catch {
        // Ignore bootstrap errors; the login page will handle real authentication.
      }
    }

    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const session = data.session;
      const isAllowed = !adminEmail || session?.user?.email?.toLowerCase() === adminEmail;
      setIsAuthenticated(Boolean(session) && isAllowed);
      setSessionReady(true);
    }

    ensureAdminAccount();
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      const isAllowed = !adminEmail || session?.user?.email?.toLowerCase() === adminEmail;
      if (session && !isAllowed) {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setSessionReady(true);
        return;
      }
      setIsAuthenticated(Boolean(session) && isAllowed);
      setSessionReady(true);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!sessionReady) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onAuthenticated={() => setIsAuthenticated(true)} />}
        />

        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/register" element={<RegisterPatient />} />
                  <Route path="/medicines" element={<MedicineMaster />} />
                  <Route path="/search" element={<SearchPatient />} />
                  <Route path="/patient/:mobile" element={<PatientProfile />} />
                  <Route path="/consultation/:mobile" element={<Consultation />} />
                  <Route path="/history/:mobile" element={<PatientHistory />} />
                  <Route path="/prescription/:mobile" element={<Prescription />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;