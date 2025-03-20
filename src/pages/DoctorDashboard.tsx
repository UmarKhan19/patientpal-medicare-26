
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, ClipboardList, Package, MessageSquare, UserCircle } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/utils";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample data for dashboard
  const upcomingAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "09:30 AM", date: new Date(), type: "Check-up" },
    { id: 2, patient: "Michael Brown", time: "11:00 AM", date: new Date(), type: "Follow-up" },
    { id: 3, patient: "Emily Wilson", time: "02:15 PM", date: new Date(), type: "Consultation" },
  ];

  const recentPatients = [
    { id: 1, name: "John Doe", age: 45, lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { id: 2, name: "Lisa Garcia", age: 32, lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { id: 3, name: "Robert Chen", age: 58, lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  ];

  const lowInventoryItems = [
    { id: 1, name: "Amoxicillin 500mg", current: 15, threshold: 20 },
    { id: 2, name: "Paracetamol 500mg", current: 8, threshold: 25 },
    { id: 3, name: "Disposable Syringes", current: 12, threshold: 30 },
  ];

  return (
    <Dashboard requiredRole="doctor">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-600">Manage your practice and patients from your dashboard</p>
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
            value="patients" 
            className={`py-3 ${activeTab === "patients" ? "bg-white shadow-sm" : ""}`}
          >
            Patients
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className={`py-3 ${activeTab === "inventory" ? "bg-white shadow-sm" : ""}`}
          >
            Inventory
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
                  <CardTitle className="text-lg">Today's Appointments</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{upcomingAppointments.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  Next appointment at {upcomingAppointments[0]?.time}
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full">
                  View Schedule
                </ButtonCustom>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Total Patients</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">124</div>
                <p className="text-sm text-slate-600 mb-4">
                  3 new patients this week
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full">
                  Patient List
                </ButtonCustom>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Pending Reports</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">7</div>
                <p className="text-sm text-slate-600 mb-4">
                  2 require urgent attention
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full">
                  Review Reports
                </ButtonCustom>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
                </div>
                <CardDescription>Your scheduled appointments for today</CardDescription>
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
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-slate-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{appointment.time}</p>
                        <p className="text-sm text-slate-600">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Low Inventory Alert</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">Manage Inventory</ButtonCustom>
                </div>
                <CardDescription>Items that need restocking soon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowInventoryItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-slate-600">Current: {item.current} / Threshold: {item.threshold}</p>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.current < item.threshold * 0.5 ? 'bg-red-500' : 'bg-amber-500'} mr-2`}></div>
                        <ButtonCustom variant="outline" size="sm">Restock</ButtonCustom>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>Manage and schedule patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Appointment management interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>View and manage your patient information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Patient records interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and manage your medical supplies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 text-slate-400">
                <p>Inventory management interface will be available here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with your patients securely</CardDescription>
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

export default DoctorDashboard;
