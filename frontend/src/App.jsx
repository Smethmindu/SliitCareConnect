/**
 * MAIN ROUTING COMPONENT
 * This file defines all the URL paths (routes) for the application and
 * connects them to their respective page components.
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
// --- MEMBER 1: AUTH & ADMIN PAGES ---
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { UsersPage } from "./pages/UsersPage";
import { ProfileSettings } from "./pages/ProfileSettings";
import { AdminPage } from "./pages/AdminPage";
import { AMainLayout } from "./components/layout/AMainLayout.jsx";
import { ADashboardLayout } from "./components/layout/ADashboardLayout.jsx";

// --- MEMBER 3: BOOKING & APPOINTMENTS ---
import { BookAppointment } from "./pages/BookAppointment";
import { MyAppointments } from "./pages/MyAppointments";

// --- MEMBER 2: LANDING & COUNSELOR PAGES ---
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { LandingPage } from "./pages/LandingPage";
import { AboutUs } from "./pages/AboutUs";
import { ContactPage } from "./pages/ContactPage";
import { CounselorListing } from "./pages/CounselorListing";
import { CounselorProfile } from "./pages/CounselorProfile";
import { CounselorDashboard } from "./pages/CounselorDashboard";
import { CounselorAppointments } from "./pages/CounselorAppointments";
import { CounselorAvailability } from "./pages/CounselorAvailability";
import { CounselorSettings } from "./pages/CounselorSettings";
import { CounselorMessages } from "./pages/CounselorMessages";
import { CounselorResources } from "./pages/CounselorResources";

// --- MEMBER 4: RESOURCES, FEEDBACK & QUIZ ---
import { MessagesPage } from "./pages/MessagesPage";
import { FeedbackReviews } from "./pages/FeedbackReviews";
import { StudentProfile } from "./pages/StudentProfile";
import Resources from "./pages/Resources";
import AdminResources from "./pages/AdminResources";
import Quiz from "./pages/Quiz";
import FeedbackPage from "./pages/feedback";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          AUTH ROUTES 
          Wrapped in AMainLayout (simplified header/footer for login/register)
        */}
        <Route element={<AMainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* 
          PUBLIC ROUTES 
          Accessible to everyone (Landing, About Us, etc.)
          Wrapped in MainLayout (standard header/footer)
        */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* 
          STUDENT DASHBOARD ROUTES 
          Wrapped in DashboardLayout (Sidebar + Content area)
        */}
        <Route element={<DashboardLayout />}>
          <Route path="/counselors" element={<CounselorListing />} />
          <Route path="/counselors/:id" element={<CounselorProfile />} />
          <Route path="/book" element={<BookAppointment />} />
          {/* <Route path="/appointments/:id" element={<AppointmentDetails />} /> */}
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/dashboard/contact" element={<ContactPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          
          <Route path="/resources" element={<Resources />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Route>

        {/* 
          COUNSELOR ROUTES 
          Standalone routes for the Counselor's internal portal
        */}
        <Route path="/counselor-dashboard" element={<CounselorDashboard />} />
        <Route path="/counselor-appointments" element={<CounselorAppointments />} />
        <Route path="/counselor-availability" element={<CounselorAvailability />} />
        <Route path="/settings" element={<CounselorSettings />} />
        <Route path="/counselor-messages" element={<CounselorMessages />} />
        <Route path="/counselor-resources" element={<CounselorResources />} />

        {/* 
          ADMIN DASHBOARD ROUTES 
          Wrapped in ADashboardLayout (Admin-specific sidebar)
        */}
        <Route element={<ADashboardLayout />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/asettings" element={<ProfileSettings />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/feedback" element={<FeedbackReviews />} />
          <Route path="/admin/resources" element={<AdminResources />} />
        </Route>
      </Routes>
    </BrowserRouter>
  ); 
}
   

