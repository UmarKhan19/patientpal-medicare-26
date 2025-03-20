
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ButtonCustom } from "@/components/ui/button-custom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="relative z-10 container px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
                Integrated Healthcare
                <span className="animated-gradient-text"> Management </span>
                Solution
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                Connecting healthcare providers and patients through a comprehensive platform that streamlines patient care and pharmacy operations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ButtonCustom
                size="xl"
                variant="glow"
                className="relative group"
                asChild
              >
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </ButtonCustom>
              <ButtonCustom
                size="xl"
                variant="outline"
                asChild
              >
                <Link to="/#features">
                  Learn More
                </Link>
              </ButtonCustom>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-slate-600">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                Secure & HIPAA Compliant
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                Real-time Communication
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                Dual Interface System
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in animate-delay-300 flex justify-center">
            <div className="relative p-4">
              {/* Main Image */}
              <div className="glass rounded-2xl shadow-2xl overflow-hidden animate-float">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Healthcare Dashboard"
                  className="w-full h-auto rounded-xl"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="glass absolute -bottom-6 -left-6 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 animate-float shadow-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Patient Management</span>
                </div>
              </div>
              
              <div className="glass absolute -top-4 -right-4 px-4 py-3 rounded-lg text-sm font-medium text-slate-700 animate-float shadow-lg animation-delay-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>Doctor Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
