
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold text-primary">BBPMS</h2>
            </Link>
            <p className="text-sm text-slate-600 max-w-xs">
              Bridging the gap between wholesale pharmacy operations and healthcare providers with an integrated patient management system.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-3">
              {["For Doctors", "For Patients", "For Pharmacies", "For Hospitals"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600">123 Healthcare Avenue, Medical District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm text-slate-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-sm text-slate-600">contact@bbpms.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600">
            &copy; {currentYear} BBPMS. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-slate-600 hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
