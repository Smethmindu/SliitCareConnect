import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AboutUs } from "./pages/AboutUs";
import { ContactPage } from "./pages/ContactPage";
import { MessagesPage } from "./pages/MessagesPage";
import { UsersPage } from "./pages/UsersPage";
import { ProfileSettings } from "./pages/ProfileSettings";
import { StudentDashboard } from "./pages/StudentDashboard";
import { AdminPage } from "./pages/AdminPage";
import { CounselorDashboard } from "./pages/CounselorDashboard";
import { FeedbackReviews } from "./pages/FeedbackReviews";
import { MainLayout } from "./components/layout/MainLayout.jsx";
import { DashboardLayout } from "./components/layout/DashboardLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/feedback" element={<FeedbackReviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
