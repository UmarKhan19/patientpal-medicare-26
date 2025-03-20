
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const SignUp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "doctor" ? "/doctor" : "/patient");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center">
          <div className="flex-1 lg:pr-10 mb-12 lg:mb-0 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join the BBPMS Platform</h1>
            <p className="text-slate-600 max-w-lg mx-auto lg:mx-0">
              Create an account to access our integrated healthcare platform and experience streamlined patient care and management.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Dual Interface System</h3>
                  <p className="text-sm text-slate-600">Specialized dashboards for doctors and patients</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Instant Setup</h3>
                  <p className="text-sm text-slate-600">Get started immediately after registration</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <AuthForm type="signup" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
