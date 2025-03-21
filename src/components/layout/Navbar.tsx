
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonCustom } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      // If user is logged in, redirect to the appropriate dashboard
      if (user.role === 'doctor') {
        navigate("/doctor");
      } else if (user.role === 'lab') {
        navigate("/lab");
      } else {
        navigate("/patient");
      }
    } else {
      // If not logged in, redirect to landing page
      navigate("/");
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
        isScrolled ? "glass shadow-md backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer">
          <div className="text-primary font-bold text-2xl">BBPMS</div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-4">
              <ButtonCustom
                variant="glass"
                size="sm"
                className="flex items-center space-x-2"
                asChild
              >
                <Link to={
                  user.role === 'doctor' ? "/doctor" : 
                  user.role === 'lab' ? "/lab" : 
                  "/patient"
                }>
                  <UserCircle size={16} />
                  <span>Dashboard</span>
                </Link>
              </ButtonCustom>
              <ButtonCustom
                variant="glass"
                size="sm"
                className="flex items-center space-x-2"
                asChild
              >
                <Link to="/profile">
                  <span>Profile</span>
                </Link>
              </ButtonCustom>
              <ButtonCustom
                variant="outline"
                size="sm"
                onClick={logout}
              >
                Logout
              </ButtonCustom>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ButtonCustom
                variant="outline"
                size="sm"
                asChild
              >
                <Link to="/signin">Sign In</Link>
              </ButtonCustom>
              <ButtonCustom
                variant="glow"
                size="sm"
                asChild
              >
                <Link to="/signup">Sign Up</Link>
              </ButtonCustom>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden glass mt-4 p-4 rounded-lg animate-fade-in">
          <ul className="flex flex-col space-y-4">
            {user ? (
              <>
                <li>
                  <Link
                    to={
                      user.role === 'doctor' ? "/doctor" : 
                      user.role === 'lab' ? "/lab" : 
                      "/patient"
                    }
                    className="block py-2 text-sm font-medium text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="block py-2 text-sm font-medium text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-sm font-medium text-foreground/80 hover:text-primary"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/signin"
                    className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="block py-2 text-sm font-medium text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
