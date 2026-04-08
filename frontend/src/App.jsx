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
import { ACounselorDashboard } from "./pages/ACounselorDashboard.jsx";
import { FeedbackReviews } from "./pages/FeedbackReviews";
import { AMainLayout } from "./components/layout/AMainLayout.jsx";
import { ADashboardLayout } from "./components/layout/ADashboardLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<AMainLayout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

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
