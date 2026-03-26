import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
// Core Pages
import { LandingPage } from "./pages/LandingPage";

import { StudentDashboard } from "./pages/StudentDashboard";
// Core Pages (Block 2)
import { CounselorListing } from "./pages/CounselorListing";
import { CounselorProfile } from "./pages/CounselorProfile";
import { BookAppointment } from "./pages/BookAppointment";
import { AppointmentDetails } from "./pages/AppointmentDetails";
// Core Pages (Block 3)
import { CounselorDashboard } from "./pages/CounselorDashboard";
import { CounselorAvailability } from "./pages/CounselorAvailability";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/counselors" element={<CounselorListing />} />
          <Route path="/counselors/:id" element={<CounselorProfile />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
          <Route
            path="/counselor-availability"
            element={<CounselorAvailability />}
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
