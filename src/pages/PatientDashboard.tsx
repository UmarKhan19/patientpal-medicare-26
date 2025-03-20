
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, User, FileText, Pill, ClipboardCheck, MessageSquare, 
  Plus, Clock, Check, X, Copy, TestTube 
} from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { 
  getPatientAppointments, 
  getPatientPrescriptions, 
  getPatientMedicationReminders,
  getUnreadMessageCount,
  getPatientMessages,
  getPatientTests,
  findPatientById
} from "@/lib/dummy-data";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Get data from our dummy data source
  const patientData = findPatientById(user?.id || "p1");
  const appointments = getPatientAppointments(user?.id || "p1");
  const prescriptions = getPatientPrescriptions(user?.id || "p1");
  const medicationReminders = getPatientMedicationReminders(user?.id || "p1");
  const testResults = getPatientTests(user?.id || "p1");
  const unreadMessages = getUnreadMessageCount(user?.id || "p1");
  const messages = getPatientMessages(user?.id || "p1").slice(0, 5);

  // Get next appointment (first upcoming one)
  const upcomingAppointments = appointments
    .filter(a => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Copy blockchain ID to clipboard
  const copyBlockchainId = () => {
    if (patientData?.blockchainId) {
      navigator.clipboard.writeText(patientData.blockchainId);
      toast({
        title: "Blockchain ID copied",
        description: "Your unique blockchain ID has been copied to clipboard",
      });
    }
  };

  return (
    <Dashboard requiredRole="patient">
      <div className="mb-4 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-600">Manage your healthcare journey from your dashboard</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-600 mb-1">Your Unique Blockchain ID:</p>
              <div className="flex items-center">
                <code className="bg-slate-100 p-2 rounded font-mono text-sm">
                  {patientData?.blockchainId || "0x0000000000000000000000000000000000000000"}
                </code>
                <ButtonCustom variant="ghost" size="sm" onClick={copyBlockchainId}>
                  <Copy className="h-4 w-4" />
                </ButtonCustom>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                This ID allows doctors to access your medical data securely on the blockchain
              </p>
            </div>
            <ButtonCustom>Share Medical Data</ButtonCustom>
          </div>
        </CardContent>
      </Card>

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
            value="tests" 
            className={`py-3 ${activeTab === "tests" ? "bg-white shadow-sm" : ""}`}
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
                  <CardTitle className="text-lg">Next Appointment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {nextAppointment ? (
                  <>
                    <div className="text-xl font-medium mb-1">{nextAppointment.doctor}</div>
                    <p className="text-sm text-slate-600 mb-1">{nextAppointment.specialty}</p>
                    <p className="text-sm text-slate-600 mb-4">
                      {formatDate(nextAppointment.date)} at {nextAppointment.time}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-600 mb-4">No upcoming appointments</p>
                )}
                <ButtonCustom variant="outline" size="sm" className="w-full">
                  Book Appointment
                </ButtonCustom>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Active Prescriptions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{prescriptions.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {prescriptions.length > 0 
                    ? `Last updated ${formatDate(prescriptions[0]?.issued)}`
                    : "No active prescriptions"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full">
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
                <div className="text-3xl font-bold mb-2">{unreadMessages}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {unreadMessages > 0 
                    ? `${unreadMessages} unread message${unreadMessages > 1 ? 's' : ''}`
                    : "No new messages"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full">
                  View Messages
                </ButtonCustom>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Today's Medication Schedule</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
                </div>
                <CardDescription>Track your medication schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicationReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${reminder.taken ? 'bg-green-100' : 'bg-slate-100'}`}>
                          <Pill className={`h-6 w-6 ${reminder.taken ? 'text-green-500' : 'text-slate-400'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{reminder.medication}</p>
                          <p className="text-sm text-slate-600">{reminder.time}</p>
                        </div>
                      </div>
                      <div>
                        {reminder.taken ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Taken</span>
                        ) : (
                          <ButtonCustom variant="outline" size="sm">Mark as Taken</ButtonCustom>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {medicationReminders.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No medication reminders for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Prescriptions</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
                </div>
                <CardDescription>Your most recent prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{prescription.medication} {prescription.dosage}</p>
                        <p className="text-sm text-slate-600">{prescription.instructions}</p>
                        <p className="text-xs text-slate-500 mt-1">Prescribed by {prescription.doctor} on {formatDate(prescription.issued)}</p>
                      </div>
                      <ButtonCustom variant="outline" size="sm">Details</ButtonCustom>
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
        </TabsContent>

        <TabsContent value="appointments" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>My Appointments</CardTitle>
                  <CardDescription>View and manage your scheduled appointments</CardDescription>
                </div>
                <ButtonCustom>
                  <Plus className="mr-2 h-4 w-4" />
                  Request Appointment
                </ButtonCustom>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className={`p-2 rounded-full ${
                        appointment.status === "Scheduled" ? "bg-blue-100 text-blue-600" :
                        appointment.status === "Completed" ? "bg-green-100 text-green-600" :
                        "bg-orange-100 text-orange-600"
                      }`}>
                        {appointment.status === "Scheduled" ? <Clock className="h-5 w-5" /> :
                         appointment.status === "Completed" ? <Check className="h-5 w-5" /> :
                         <X className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">Dr. {appointment.doctor}</h4>
                        <p className="text-sm text-slate-600">{appointment.specialty}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {formatDate(appointment.date)} at {appointment.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <ButtonCustom size="sm" variant="outline">Details</ButtonCustom>
                      {appointment.status === "Scheduled" && (
                        <ButtonCustom size="sm" variant="outline">Cancel</ButtonCustom>
                      )}
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <Calendar className="h-12 w-12 mb-2 text-slate-300" />
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
              <CardTitle>My Prescriptions</CardTitle>
              <CardDescription>View your current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="font-medium">{prescription.medication}</h4>
                      <p className="text-sm text-slate-600">{prescription.dosage} - {prescription.instructions}</p>
                      <div className="flex flex-col md:flex-row md:space-x-3 text-xs text-slate-500 mt-1">
                        <span>Prescribed by Dr. {prescription.doctor}</span>
                        <span>Issued: {formatDate(prescription.issued)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <ButtonCustom size="sm" variant="outline">Refill</ButtonCustom>
                      <ButtonCustom size="sm" variant="outline">Details</ButtonCustom>
                    </div>
                  </div>
                ))}

                {prescriptions.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <FileText className="h-12 w-12 mb-2 text-slate-300" />
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
              <CardDescription>Access your medical test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((test) => (
                  <div key={test.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <div className="p-2 rounded-full bg-primary/10">
                        <TestTube className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-slate-600">Lab: {test.lab}</p>
                        <div className="flex items-center text-xs text-slate-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" /> 
                          {formatDate(test.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-primary/10 px-3 py-1 rounded-full text-primary font-medium mb-2">
                        Result: {test.result}
                      </div>
                      <ButtonCustom size="sm" variant="outline">View Details</ButtonCustom>
                    </div>
                  </div>
                ))}

                {testResults.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <TestTube className="h-12 w-12 mb-2 text-slate-300" />
                    <p>No test results found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communicate with your healthcare providers</CardDescription>
                </div>
                <ButtonCustom>
                  <Plus className="mr-2 h-4 w-4" />
                  New Message
                </ButtonCustom>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`p-4 rounded-lg ${
                    message.senderId === (user?.id || "p1") 
                      ? "bg-primary/10 ml-12" 
                      : "bg-slate-50 mr-12 border border-slate-200"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium">
                        {message.senderId === (user?.id || "p1") ? "You" : message.senderName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                    <MessageSquare className="h-12 w-12 mb-2 text-slate-300" />
                    <p>No messages found</p>
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

export default PatientDashboard;
