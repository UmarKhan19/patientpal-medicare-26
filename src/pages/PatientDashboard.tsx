import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, MessageSquare, Check, X, AlertTriangle, UserCircle, Pill } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, getStatusColor } from "@/lib/utils";
import { 
  getPatientAppointments, 
  getPatientPrescriptions, 
  getPatientTests,
  getPatientMedicationReminders,
  getPatientMessages
} from "@/lib/dummy-data";
import DoctorSearch from "@/components/patient/DoctorSearch";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const patientData = {
    appointments: getPatientAppointments(user?.id || ""),
    prescriptions: getPatientPrescriptions(user?.id || ""),
    testResults: getPatientTests(user?.id || ""),
    medicationReminders: getPatientMedicationReminders(user?.id || ""),
    messages: getPatientMessages(user?.id || ""),
  };

  const upcomingAppointments = patientData.appointments
    .filter(a => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentPrescriptions = patientData.prescriptions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Dashboard requiredRole="patient">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-600">
          Your health information is securely stored on the blockchain.
          {user?.id && <span className="text-xs font-mono bg-slate-200 p-1 rounded ml-2">ID: {user.id}</span>}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
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
            value="test-results" 
            className={`py-3 ${activeTab === "test-results" ? "bg-white shadow-sm" : ""}`}
          >
            Test Results
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className={`py-3 ${activeTab === "messages" ? "bg-white shadow-sm" : ""}`}
          >
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{upcomingAppointments.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {upcomingAppointments.length > 0
                    ? `Next: ${formatDate(upcomingAppointments[0].date)} at ${upcomingAppointments[0].time}`
                    : "No upcoming appointments"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("appointments")}>
                  Book Appointment
                </ButtonCustom>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Pill className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Prescriptions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{patientData.prescriptions.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {patientData.prescriptions.length > 0
                    ? `Latest: ${patientData.prescriptions[0].medication}`
                    : "No prescriptions"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("prescriptions")}>
                  View Prescriptions
                </ButtonCustom>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Messages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {patientData.messages.filter(m => !m.isRead && m.receiverId === user?.id).length}
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {patientData.messages.filter(m => !m.isRead && m.receiverId === user?.id).length > 0
                    ? "Unread messages from your doctor"
                    : "No unread messages"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("messages")}>
                  View Messages
                </ButtonCustom>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment with a Specialist</CardTitle>
              <CardDescription>Search for a specialist or doctor by name or specialty</CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorSearch />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <ButtonCustom variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>View All</ButtonCustom>
                </div>
                <CardDescription>Your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Dr. {appointment.doctor}</p>
                          <p className="text-sm text-slate-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <p className="text-sm text-slate-600">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingAppointments.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No upcoming appointments</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <ButtonCustom variant="ghost" size="sm" onClick={() => setActiveTab("prescriptions")}>View All</ButtonCustom>
                </div>
                <CardDescription>Your prescribed medications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{prescription.medication}</p>
                        <p className="text-sm text-slate-600">{prescription.dosage}</p>
                        <p className="text-xs text-slate-500">Dr. {prescription.doctor}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatDate(prescription.date)}</p>
                        <ButtonCustom size="sm" variant="outline" className="mt-1">Details</ButtonCustom>
                      </div>
                    </div>
                  ))}
                  
                  {recentPrescriptions.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No prescriptions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Book an Appointment</CardTitle>
              <CardDescription>Search for a specialist and book your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorSearch />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Upcoming Appointments</CardTitle>
              <CardDescription>View and manage your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className={`p-2 rounded-full ${
                        appointment.status === "Scheduled" ? "bg-blue-100 text-blue-600" :
                        appointment.status === "Completed" ? "bg-green-100 text-green-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        {appointment.status === "Scheduled" ? <Calendar className="h-5 w-5" /> :
                         appointment.status === "Completed" ? <Check className="h-5 w-5" /> :
                         <X className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">Dr. {appointment.doctor}</h4>
                        <p className="text-sm text-slate-600">{appointment.type}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {formatDate(appointment.date)} at {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {appointment.status === "Scheduled" && (
                        <>
                          <ButtonCustom size="sm" variant="outline">Reschedule</ButtonCustom>
                          <ButtonCustom size="sm" variant="outline">Cancel</ButtonCustom>
                        </>
                      )}
                      <ButtonCustom size="sm">Details</ButtonCustom>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>History of your visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.appointments
                  .filter(a => a.status === "Completed")
                  .map((appointment) => (
                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                          <Check className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">Dr. {appointment.doctor}</h4>
                          <p className="text-sm text-slate-600">{appointment.type}</p>
                          <div className="flex items-center text-xs text-slate-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" /> 
                            {formatDate(appointment.date)} at {appointment.time}
                          </div>
                        </div>
                      </div>
                      <ButtonCustom size="sm">View Details</ButtonCustom>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="prescriptions" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your Prescriptions</CardTitle>
              <CardDescription>View your current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <Pill className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{prescription.medication}</h4>
                        <p className="text-sm text-slate-600">{prescription.dosage}</p>
                        <p className="text-xs text-slate-500">Dr. {prescription.doctor}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatDate(prescription.date)}</p>
                      <ButtonCustom size="sm" variant="outline">Details</ButtonCustom>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="test-results" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Your Test Results</CardTitle>
              <CardDescription>View your lab test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.testResults.map((test) => (
                  <div key={test.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <ClipboardList className="h-5 w-5 text-purple-500" />
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-slate-600">Lab: {test.lab}</p>
                        <p className="text-xs text-slate-500">Date: {formatDate(test.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Result: {test.result}</p>
                      <ButtonCustom size="sm" variant="outline">Details</ButtonCustom>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your doctor securely</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientData.messages.map((message) => (
                  <div key={message.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <MessageSquare className="h-5 w-5 text-orange-500" />
                      <div>
                        <h4 className="font-medium">Dr. {message.senderName}</h4>
                        <p className="text-sm text-slate-600">{message.content}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <ButtonCustom size="sm" variant="outline">View</ButtonCustom>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default PatientDashboard;
