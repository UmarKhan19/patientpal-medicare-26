
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ICPProvider } from "@/contexts/ICPContext";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PatientProfile from "./pages/PatientProfile";
import DoctorProfile from "./pages/DoctorProfile";
import Profile from "./pages/Profile";
import LabDashboard from "./pages/LabDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ICPProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/patient/:patientId" element={<PatientProfile />} />
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/doctor/:doctorId" element={<DoctorProfile />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lab" element={<LabDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ICPProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
