
import { 
  Calendar, 
  User, 
  Clipboard, 
  Package, 
  History, 
  Share, 
  FileText, 
  MessageSquare,
  Clock,
  Search,
  Pill,
  Upload,
  Bell
} from "lucide-react";

const Feature = ({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div className="glass p-6 rounded-xl card-hover">
      <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const doctorFeatures = [
    {
      icon: Calendar,
      title: "Appointment Management",
      description: "Schedule and manage patient appointments with an intuitive calendar interface."
    },
    {
      icon: Clipboard,
      title: "Prescription Maker",
      description: "Create and manage digital prescriptions with automated drug interaction checks."
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track medication and supply inventory with automated reorder notifications."
    },
    {
      icon: History,
      title: "Patient History",
      description: "Access comprehensive patient records, including medical history and previous treatments."
    },
    {
      icon: Share,
      title: "Referral System",
      description: "Generate and manage patient referrals to specialists within the network."
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Real-time secure messaging with patients for follow-ups and consultations."
    }
  ];

  const patientFeatures = [
    {
      icon: Clock,
      title: "Appointment Booking",
      description: "Schedule appointments with healthcare providers based on availability."
    },
    {
      icon: Search,
      title: "Doctor Finder",
      description: "Locate healthcare providers based on specialty, location, and availability."
    },
    {
      icon: FileText,
      title: "Prescription History",
      description: "View and manage current and past prescriptions with reminder notifications."
    },
    {
      icon: Pill,
      title: "Medicine Reminders",
      description: "Set personalized reminders for medication schedules and treatments."
    },
    {
      icon: Upload,
      title: "Test Uploads",
      description: "Securely upload and share medical test results with healthcare providers."
    },
    {
      icon: Bell,
      title: "Health Advice",
      description: "Receive personalized health tips and preventative care recommendations."
    }
  ];

  return (
    <section id="features" className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Comprehensive Healthcare Management
          </h2>
          <p className="text-lg text-slate-600">
            Our dual-interface system provides tailored solutions for both healthcare providers and patients.
          </p>
        </div>

        <div className="mb-20">
          <div className="flex items-center space-x-4 mb-12">
            <User className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-semibold">For Doctors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctorFeatures.map((feature, index) => (
              <Feature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-4 mb-12">
            <User className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-semibold">For Patients</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {patientFeatures.map((feature, index) => (
              <Feature 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
