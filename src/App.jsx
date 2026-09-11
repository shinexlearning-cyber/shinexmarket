import React from "react";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { AppShell } from "./components/layout/AppShell";

/* ============================================================
   SHINEX MARKETPLACE — app entry
   Client-side state routing (no react-router in this environment —
   page switches are handled through the `nav` state in AppShell).
   Wired to the real SHINEX backend (Express + Supabase). See
   src/services/api.js for the request helper and backend contract
   notes.
   ============================================================ */

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CategoriesProvider>
          <AppShell />
        </CategoriesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
