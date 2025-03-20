
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back to BBPMS</h1>
            <p className="text-slate-600 max-w-lg mx-auto lg:mx-0">
              Sign in to access your personalized healthcare dashboard and continue managing your practice or healthcare journey.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure & Private</h3>
                  <p className="text-sm text-slate-600">Your data is encrypted and protected</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Efficient Access</h3>
                  <p className="text-sm text-slate-600">Quick access to all your healthcare needs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <AuthForm type="login" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
