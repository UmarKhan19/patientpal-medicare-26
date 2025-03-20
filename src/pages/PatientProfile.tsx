import { useState } from "react";
import { useParams } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Calendar, User, FileText, MessageSquare, TestTube, Pill, ClipboardList } from "lucide-react";
import { findPatientById, getPatientAppointments, getPatientPrescriptions, getPatientTests } from "@/lib/dummy-data";
import { formatDate } from "@/lib/utils";

const PatientProfile = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch patient data (replace with actual data fetching logic)
  const patient = findPatientById(patientId || "p1");
  const appointments = getPatientAppointments(patientId || "p1");
  const prescriptions = getPatientPrescriptions(patientId || "p1");
  const tests = getPatientTests(patientId || "p1");

  if (!patient) {
    return (
      <Dashboard>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <p>The requested patient could not be found.</p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center mb-4">
          {patient.picture ? (
            <img
              src={patient.picture}
              alt={patient.name}
              className="h-16 w-16 rounded-full mr-4 object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <User className="h-8 w-8 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-slate-600">Patient ID: {patient.id}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 rounded-lg">
          <TabsTrigger
            value="profile"
            className={`py-3 ${activeTab === "profile" ? "bg-white shadow-sm" : ""}`}
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className={`py-3 ${activeTab === "appointments" ? "bg-white shadow-sm" : ""}`}
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger
            value="prescriptions"
            className={`py-3 ${activeTab === "prescriptions" ? "bg-white shadow-sm" : ""}`}
          >
            Prescriptions
          </TabsTrigger>
          <TabsTrigger
            value="tests"
            className={`py-3 ${activeTab === "tests" ? "bg-white shadow-sm" : ""}`}
          >
            Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>View and manage patient details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-700">Name</p>
                  <p>{patient.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <p>{patient.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Phone</p>
                  <p>{patient.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Gender</p>
                  <p>{patient.gender || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Age</p>
                  <p>{patient.age || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Blood Type</p>
                  <p>{patient.bloodType || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-700">Allergies</p>
                {patient.allergies && patient.allergies.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index}>{allergy}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No known allergies</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-700">Chronic Conditions</p>
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {patient.chronicConditions.map((condition, index) => (
                      <li key={index}>{condition}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No known chronic conditions</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Appointments</CardTitle>
                <ButtonCustom variant="outline">Add Appointment</ButtonCustom>
              </div>
              <CardDescription>Manage patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium">{appointment.type}</p>
                      <p className="text-sm text-slate-600">{formatDate(appointment.date)} at {appointment.time}</p>
                      <p className="text-sm text-slate-600">Doctor: {appointment.doctor}</p>
                    </div>
                    <ButtonCustom variant="outline" size="sm">View Details</ButtonCustom>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No appointments found for this patient</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Prescriptions</CardTitle>
                <ButtonCustom variant="outline">Add Prescription</ButtonCustom>
              </div>
              <CardDescription>Manage patient prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium">{prescription.medication} ({prescription.dosage})</p>
                      <p className="text-sm text-slate-600">Instructions: {prescription.instructions}</p>
                      <p className="text-xs text-slate-500">Prescribed by {prescription.doctor} on {formatDate(prescription.issued)}</p>
                    </div>
                    <ButtonCustom variant="outline" size="sm">View Details</ButtonCustom>
                  </div>
                ))}
                {prescriptions.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No prescriptions found for this patient</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tests</CardTitle>
                <ButtonCustom variant="outline">Add Test Result</ButtonCustom>
              </div>
              <CardDescription>Manage patient test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-sm text-slate-600">Result: {test.result}</p>
                      <p className="text-xs text-slate-500">Lab: {test.lab} on {formatDate(test.date)}</p>
                    </div>
                    <ButtonCustom variant="outline" size="sm">View Details</ButtonCustom>
                  </div>
                ))}
                {tests.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No tests found for this patient</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default PatientProfile;
