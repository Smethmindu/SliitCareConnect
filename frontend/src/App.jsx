import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ContactPage } from "./pages/ContactPage";
import { MessagesPage } from "./pages/MessagesPage";
import { UsersPage } from "./pages/UsersPage";
import { ProfileSettings } from "./pages/ProfileSettings";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminPage } from "./pages/AdminPage";
import { ACounselorDashboard } from "./pages/ACounselorDashboard.jsx";
import { FeedbackReviews } from "./pages/FeedbackReviews";
import { AMainLayout } from "./components/layout/AMainLayout.jsx";
import { ADashboardLayout } from "./components/layout/ADashboardLayout.jsx";


// Core Pages (Block 2)

import { BookAppointment } from "./pages/BookAppointment";
import { AppointmentDetails } from "./pages/AppointmentDetails";
// Core Pages (Block 3)

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
        {/* Public / Auth Routes */}
        <Route element={<AMainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Dashboard Routes / Student View */}
        <Route element={<DashboardLayout />}>
          <Route path="/counselors" element={<CounselorListing />} />
          <Route path="/counselors/:id" element={<CounselorProfile />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments/:id" element={<AppointmentDetails />} />
          <Route path="/dashboard/contact" element={<ContactPage />} />
        </Route>

        {/* Counselor specific Routes / Counselor View */}
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        <Route path="/counselor-availability" element={<CounselorAvailability />} />
        <Route path="/settings" element={<CounselorSettings />} />
      

        {/* Dashboard Routes */}
        <Route element={<ADashboardLayout />}>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/counselor" element={<ACounselorDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/feedback" element={<FeedbackReviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  ); 
}
   

