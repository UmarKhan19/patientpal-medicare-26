
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonCustom } from "@/components/ui/button-custom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
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

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Features", path: "/#features" },
    { title: "About", path: "/#about" },
    { title: "Contact", path: "/#contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-12",
        isScrolled ? "glass shadow-md backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-primary font-bold text-2xl">BBPMS</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    location.pathname === link.path || location.hash === link.path.substring(1)
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="flex items-center space-x-4">
              <ButtonCustom
                variant="glass"
                size="sm"
                className="flex items-center space-x-2"
                asChild
              >
                <Link to={user.role === 'doctor' ? "/doctor" : "/patient"}>
                  <UserCircle size={16} />
                  <span>Dashboard</span>
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
            {navLinks.map((link) => (
              <li key={link.title}>
                <Link
                  to={link.path}
                  className={cn(
                    "block py-2 text-sm font-medium transition-colors",
                    location.pathname === link.path
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-primary"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </Link>
              </li>
            ))}

            {user ? (
              <>
                <li>
                  <Link
                    to={user.role === 'doctor' ? "/doctor" : "/patient"}
                    className="block py-2 text-sm font-medium text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
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
