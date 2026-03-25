import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Core Pages
import { LandingPage } from "./pages/LandingPage";
import { AboutUs } from "./pages/AboutUs";

// Counselor Pages
import { CounselorListing } from "./pages/CounselorListing";
import { CounselorProfile } from "./pages/CounselorProfile";
import { CounselorDashboard } from "./pages/CounselorDashboard";
import { CounselorAvailability } from "./pages/CounselorAvailability";
import { CounselorSettings } from "./pages/CounselorSettings";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        {/* Dashboard Routes / Student View */}
        <Route element={<DashboardLayout />}>
          <Route path="/counselors" element={<CounselorListing />} />
          <Route path="/counselors/:id" element={<CounselorProfile />} />
        </Route>

        {/* Counselor specific Routes / Counselor View */}
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        <Route path="/counselor-availability" element={<CounselorAvailability />} />
        <Route path="/settings" element={<CounselorSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
