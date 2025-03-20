
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Calendar, FileText, Pill, ClipboardList, Flask, MessageSquare } from "lucide-react";
import { formatDate, getStatusColor, getStatusTextColor } from "@/lib/utils";
import { findPatientById, getPatientAppointments, getPatientPrescriptions, getPatientTests } from "@/lib/dummy-data";

const PatientProfile = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    if (patientId) {
      const patientData = findPatientById(patientId);
      if (patientData) {
        setPatient(patientData);
        setAppointments(getPatientAppointments(patientId));
        setPrescriptions(getPatientPrescriptions(patientId));
        setTests(getPatientTests(patientId));
      } else {
        navigate("/doctor"); // Redirect if patient not found
      }
    }
  }, [patientId, navigate]);

  if (!patient) {
    return (
      <Dashboard requiredRole="doctor">
        <div className="flex justify-center items-center h-64">
          <p>Loading patient data...</p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard requiredRole="doctor">
      <div className="mb-6 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{patient.name}</h1>
            <p className="text-slate-600">Patient ID: {patient.id}</p>
          </div>
          <ButtonCustom onClick={() => navigate("/doctor")}>
            Back to Dashboard
          </ButtonCustom>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                {patient.picture ? (
                  <img 
                    src={patient.picture} 
                    alt={patient.name} 
                    className="h-16 w-16 rounded-full object-cover" 
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {patient.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-500">Contact</p>
                  <p className="font-medium">{patient.email}</p>
                  <p className="text-sm">{patient.phone || "No phone number"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-slate-500">Personal Information</p>
                <p className="font-medium">Age: {patient.age || "N/A"}</p>
                <p className="text-sm">Gender: {patient.gender || "N/A"}</p>
                <p className="text-sm">Blood Type: {patient.bloodType || "Unknown"}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-slate-500">Medical History</p>
                <p className="font-medium">Allergies: {patient.allergies?.join(", ") || "None"}</p>
                <p className="text-sm">Chronic Conditions: {patient.chronicConditions?.join(", ") || "None"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-slate-100 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className={`py-3 ${activeTab === "overview" ? "bg-white shadow-sm" : ""}`}
          >
            Overview
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
          <TabsTrigger 
            value="notes" 
            className={`py-3 ${activeTab === "notes" ? "bg-white shadow-sm" : ""}`}
          >
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Appointments</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
                </div>
                <CardDescription>Recent visits and upcoming appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-slate-600">{formatDate(appointment.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <p className={`text-sm ${getStatusTextColor(appointment.status)}`}>{appointment.status}</p>
                      </div>
                    </div>
                  ))}
                  
                  {appointments.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No appointments found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
                </div>
                <CardDescription>Recently prescribed medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{prescription.medication}</p>
                        <p className="text-sm text-slate-600">{prescription.dosage}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatDate(prescription.date)}</p>
                        <p className="text-sm text-slate-600">Dr. {prescription.doctor.split(' ')[1]}</p>
                      </div>
                    </div>
                  ))}
                  
                  {prescriptions.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No prescriptions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Test Results</CardTitle>
                <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
              </div>
              <CardDescription>Recently conducted medical tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.slice(0, 3).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <Flask className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-slate-600">{formatDate(test.date)}</p>
                      </div>
                    </div>
                    <ButtonCustom size="sm">View Results</ButtonCustom>
                  </div>
                ))}
                
                {tests.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No test results found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Appointment History</CardTitle>
              <CardDescription>All patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="flex items-center mb-1">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <p className="font-medium">{appointment.type}</p>
                      </div>
                      <p className="text-sm text-slate-600">Date: {formatDate(appointment.date)}</p>
                      <p className="text-sm text-slate-600">Time: {appointment.time}</p>
                      <p className="text-sm text-slate-600">Doctor: {appointment.doctor}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm mb-2 ${getStatusColor(appointment.status)} text-white`}>
                        {appointment.status}
                      </div>
                      <ButtonCustom size="sm" variant="outline">View Details</ButtonCustom>
                    </div>
                  </div>
                ))}
                
                {appointments.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No appointments found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>All prescribed medications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="flex items-center mb-1">
                        <Pill className="h-4 w-4 mr-2 text-primary" />
                        <p className="font-medium">{prescription.medication}</p>
                      </div>
                      <p className="text-sm text-slate-600">Dosage: {prescription.dosage}</p>
                      <p className="text-sm text-slate-600">Instructions: {prescription.instructions}</p>
                      <p className="text-sm text-slate-600">Prescribed: {formatDate(prescription.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 mb-2">By Dr. {prescription.doctor.split(' ')[1]}</p>
                      <ButtonCustom size="sm" variant="outline">View Details</ButtonCustom>
                    </div>
                  </div>
                ))}
                
                {prescriptions.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No prescriptions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>All medical tests and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="flex items-center mb-1">
                        <Flask className="h-4 w-4 mr-2 text-primary" />
                        <p className="font-medium">{test.name}</p>
                      </div>
                      <p className="text-sm text-slate-600">Date: {formatDate(test.date)}</p>
                      <p className="text-sm text-slate-600">Lab: {test.lab}</p>
                      <p className="text-sm text-slate-600 mt-1">Results: {test.result}</p>
                    </div>
                    <div className="text-right">
                      <ButtonCustom size="sm" variant="outline">View Report</ButtonCustom>
                    </div>
                  </div>
                ))}
                
                {tests.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No test results found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Medical Notes</CardTitle>
              <CardDescription>Doctor's notes and observations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patient.notes ? patient.notes.map((note: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">{note.date}</p>
                      <p className="text-sm text-slate-600">By Dr. {note.doctor}</p>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                )) : (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No medical notes found</p>
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
