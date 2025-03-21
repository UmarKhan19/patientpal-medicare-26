
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Star, MapPin, Phone, Mail, Clock, User } from "lucide-react";
import { doctors } from "@/lib/dummy-data";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/utils";
import DoctorRatings from "@/components/doctor/DoctorRatings";
import { toast } from "sonner";

// Sample reviews for demonstration
const sampleReviews = [
  {
    id: "1",
    patientName: "John Smith",
    patientImage: "",
    rating: 5,
    comment: "Dr. Johnson is an excellent cardiologist. Very thorough and explains everything in detail.",
    date: "2023-11-15T10:30:00",
    helpfulCount: 12,
    isHelpful: false
  },
  {
    id: "2",
    patientName: "Maria Garcia",
    patientImage: "",
    rating: 4,
    comment: "Good doctor. Wait times are a bit long but the care is worth it.",
    date: "2023-10-22T15:45:00",
    helpfulCount: 8,
    isHelpful: false
  },
  {
    id: "3",
    patientName: "David Lee",
    patientImage: "",
    rating: 5,
    comment: "Excellent bedside manner. Takes time to listen to concerns and explains treatment options clearly.",
    date: "2023-09-05T09:15:00",
    helpfulCount: 15,
    isHelpful: true
  }
];

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    // In a real app, this would be an API call
    const foundDoctor = doctors.find(d => d.id === doctorId);
    if (foundDoctor) {
      setDoctor(foundDoctor);
    }
    setLoading(false);
  }, [doctorId]);

  const handleBookAppointment = () => {
    toast.success("Redirecting to appointment booking page");
    // This would redirect to appointment booking in a real app
  };

  if (loading) {
    return (
      <Dashboard requiredRole="patient">
        <div className="flex justify-center items-center h-64">
          <p>Loading doctor information...</p>
        </div>
      </Dashboard>
    );
  }

  if (!doctor) {
    return (
      <Dashboard requiredRole="patient">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-lg text-slate-600">Doctor not found</p>
          <Link to="/patient">
            <ButtonCustom>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </ButtonCustom>
          </Link>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard requiredRole="patient">
      <div className="mb-4">
        <Link to="/patient" className="text-primary flex items-center hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Doctor profile card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={doctor.picture} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">Dr. {doctor.name}</h2>
                <p className="text-primary text-lg">{doctor.specialty}</p>
                
                <div className="flex items-center justify-center my-2">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (doctor.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600">
                    {doctor.rating?.toFixed(1) || "0.0"} ({doctor.reviewCount || 0} reviews)
                  </span>
                </div>
                
                <div className="border-t border-b border-slate-200 w-full py-4 my-4">
                  <p className="text-xl font-bold text-primary">{formatPrice(doctor.consultationFee || 100)}</p>
                  <p className="text-sm text-slate-500">per consultation</p>
                </div>
                
                <ButtonCustom className="w-full" onClick={handleBookAppointment}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </ButtonCustom>
              </div>
            </CardContent>
          </Card>
          
          {/* Contact information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-slate-500 mr-3" />
                <span>{doctor.location || "Main Hospital, Medical Center"}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-slate-500 mr-3" />
                <span>{doctor.phone || "+1 555-123-4567"}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-slate-500 mr-3" />
                <span>{doctor.email || `dr.${doctor.name.toLowerCase()}@medhub.com`}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-slate-500 mr-3" />
                <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Dr. {doctor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">
                    {doctor.about || `Dr. ${doctor.name} is a highly qualified ${doctor.specialty} with over 15 years of experience. 
                    Specializing in the latest techniques and treatments, Dr. ${doctor.name} has helped thousands of patients recover and 
                    improve their quality of life. Educated at top medical schools and with numerous published research papers,
                    Dr. ${doctor.name} is committed to providing personalized care to every patient.`}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Education & Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Medical Education</h3>
                    <p className="text-slate-600">Harvard Medical School, MD</p>
                    <p className="text-sm text-slate-500">Graduated with honors, 2005</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Residency</h3>
                    <p className="text-slate-600">Johns Hopkins Hospital</p>
                    <p className="text-sm text-slate-500">Completed in 2009</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Board Certification</h3>
                    <p className="text-slate-600">American Board of {doctor.specialty}</p>
                    <p className="text-sm text-slate-500">Certified in 2010</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    <li>General {doctor.specialty} Care</li>
                    <li>Advanced Diagnostic Procedures</li>
                    <li>Minimally Invasive Treatments</li>
                    <li>Preventative Medicine</li>
                    <li>Chronic Disease Management</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <DoctorRatings 
                doctorId={doctor.id}
                doctorName={doctor.name}
                averageRating={doctor.rating || 4.5}
                totalReviews={doctor.reviewCount || sampleReviews.length}
                reviews={sampleReviews}
                showReviewForm={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Dashboard>
  );
};

export default DoctorProfile;
