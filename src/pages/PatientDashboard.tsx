
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, FileText, Pill, ClipboardCheck, MessageSquare } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";
import { 
  getPatientAppointments, 
  getPatientPrescriptions, 
  getPatientMedicationReminders,
  getUnreadMessageCount
} from "@/lib/dummy-data";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Get data from our dummy data source
  const appointments = getPatientAppointments(user?.id || "p1");
  const prescriptions = getPatientPrescriptions(user?.id || "p1");
  const medicationReminders = getPatientMedicationReminders(user?.id || "p1");
  const unreadMessages = getUnreadMessageCount(user?.id || "p1");

  // Get next appointment (first upcoming one)
  const upcomingAppointments = appointments.filter(a => new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  return (
    <Dashboard requiredRole="patient">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-600">Manage your healthcare journey from your dashboard</p>
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
            value="reminders" 
            className={`py-3 ${activeTab === "reminders" ? "bg-white shadow-sm" : ""}`}
          >
            Reminders
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
              <CardTitle>Appointment Booking</CardTitle>
              <CardDescription>Schedule appointments with your healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Appointment booking interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Prescription History</CardTitle>
              <CardDescription>View your current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Prescription history interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Medication Reminders</CardTitle>
              <CardDescription>Set and manage your medication schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Medication reminder interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your healthcare providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Messaging interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default PatientDashboard;
