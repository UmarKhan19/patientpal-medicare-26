
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardProps {
  children: ReactNode;
  requiredRole?: "doctor" | "patient" | "lab";
}

const Dashboard = ({ children, requiredRole }: DashboardProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    } else if (!loading && user && requiredRole && user.role !== requiredRole) {
      // Redirect if user doesn't have the required role
      switch (user.role) {
        case "doctor":
          navigate("/doctor");
          break;
        case "patient":
          navigate("/patient");
          break;
        case "lab":
          navigate("/lab");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, loading, navigate, requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
