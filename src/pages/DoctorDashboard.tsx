
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, Users, ClipboardList, Package, MessageSquare, 
  UserCircle, Search, Plus, Clock, Check, X, AlertTriangle 
} from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, getStatusColor } from "@/lib/utils";
import PatientSearch from "@/components/doctor/PatientSearch";
import { 
  getTodaysAppointments, 
  getUpcomingAppointments, 
  getRecentPatients, 
  getLowInventoryItems,
  getUnreadMessageCount,
  getDoctorMessages,
  inventoryItems,
  appointments,
} from "@/lib/dummy-data";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Get data from our dummy data source
  const todaysAppointments = getTodaysAppointments(user?.id || "d1");
  const upcomingAppointments = getUpcomingAppointments(user?.id || "d1", 5);
  const recentPatients = getRecentPatients(user?.id || "d1", 5);
  const lowInventoryItems = getLowInventoryItems("warning", 3);
  const urgentInventoryItems = getLowInventoryItems("Urgent", 3);
  const unreadMessages = getUnreadMessageCount(user?.id || "d1");
  const messages = getDoctorMessages(user?.id || "d1").slice(0, 5);

  // For appointment tab - filter by status
  const [appointmentStatus, setAppointmentStatus] = useState<string>("all");
  const filteredAppointments = appointmentStatus === "all" 
    ? appointments.filter(a => a.doctorId === (user?.id || "d1"))
    : appointments.filter(a => a.doctorId === (user?.id || "d1") && a.status === appointmentStatus);

  return (
    <Dashboard requiredRole="doctor">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-slate-600">Manage your practice and patients from your dashboard</p>
      </div>

      <div className="mb-6">
        <PatientSearch placeholder="Search for a patient by name or blockchain ID..." />
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
                <div className="text-3xl font-bold mb-2">{todaysAppointments.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {todaysAppointments.length > 0 
                    ? `Next appointment at ${todaysAppointments[0]?.time}`
                    : "No appointments scheduled for today"
                  }
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
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All</ButtonCustom>
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
                  <CardTitle>Recent Patients</CardTitle>
                  <ButtonCustom variant="ghost" size="sm">View All Patients</ButtonCustom>
                </div>
                <CardDescription>Your recently seen patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div 
                      key={patient.id} 
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100"
                      onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                    >
                      <div className="flex items-center space-x-3">
                        {patient.picture ? (
                          <img 
                            src={patient.picture} 
                            alt={patient.name} 
                            className="h-10 w-10 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-slate-600">
                            Last visit: {patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <ButtonCustom size="sm">View Profile</ButtonCustom>
                    </div>
                  ))}
                  
                  {recentPatients.length === 0 && (
                    <div className="flex justify-center items-center py-8 text-slate-400">
                      <p>No recent patients</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

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
                      <p className="text-sm text-slate-600">Current: {item.inStock} / Threshold: {item.threshold}</p>
                    </div>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(item.reorderStatus)} mr-2`}></div>
                      <ButtonCustom variant="outline" size="sm">Restock</ButtonCustom>
                    </div>
                  </div>
                ))}
                
                {lowInventoryItems.length === 0 && (
                  <div className="flex justify-center items-center py-8 text-slate-400">
                    <p>No low inventory items</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Patient Records</CardTitle>
                <ButtonCustom variant="outline">Add New Patient</ButtonCustom>
              </div>
              <CardDescription>
                Search and manage your patient records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <PatientSearch placeholder="Search patients..." />
              </div>
              
              <h3 className="text-lg font-medium mb-4">Recent Patients</h3>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100"
                    onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      {patient.picture ? (
                        <img 
                          src={patient.picture} 
                          alt={patient.name} 
                          className="h-12 w-12 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-slate-600">ID: {patient.id}</p>
                        <p className="text-sm text-slate-600">
                          Last visit: {patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <ButtonCustom>View Profile</ButtonCustom>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Appointment Management</CardTitle>
                  <CardDescription>Manage and schedule patient appointments</CardDescription>
                </div>
                <ButtonCustom>
                  <Plus className="mr-2 h-4 w-4" />
                  New Appointment
                </ButtonCustom>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <ButtonCustom 
                    variant={appointmentStatus === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAppointmentStatus("all")}
                  >
                    All
                  </ButtonCustom>
                  <ButtonCustom 
                    variant={appointmentStatus === "Scheduled" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAppointmentStatus("Scheduled")}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    Scheduled
                  </ButtonCustom>
                  <ButtonCustom 
                    variant={appointmentStatus === "Completed" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAppointmentStatus("Completed")}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Completed
                  </ButtonCustom>
                  <ButtonCustom 
                    variant={appointmentStatus === "Cancelled" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAppointmentStatus("Cancelled")}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Cancelled
                  </ButtonCustom>
                </div>

                <div className="space-y-4">
                  {filteredAppointments.map(appointment => (
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
                          <h4 className="font-medium">{appointment.patient}</h4>
                          <p className="text-sm text-slate-600">{appointment.type}</p>
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

                  {filteredAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-slate-400">
                      <Calendar className="h-12 w-12 mb-2 text-slate-300" />
                      <p>No appointments found</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Patient Records</CardTitle>
                  <CardDescription>Search and manage your patient records</CardDescription>
                </div>
                <ButtonCustom variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </ButtonCustom>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <PatientSearch placeholder="Search patients by name or blockchain ID..." />
              </div>
              
              <h3 className="text-lg font-medium mb-4">Recent Patients</h3>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <div 
                    key={patient.id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100"
                    onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                  >
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      {patient.picture ? (
                        <img 
                          src={patient.picture} 
                          alt={patient.name} 
                          className="h-12 w-12 rounded-full object-cover" 
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCircle className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-slate-600">ID: {patient.id}</p>
                        <div className="flex flex-col md:flex-row md:space-x-3">
                          <p className="text-xs text-slate-500">
                            Last visit: {patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}
                          </p>
                          <p className="text-xs font-mono bg-slate-200 p-1 rounded mt-1 md:mt-0">
                            Blockchain ID: {patient.blockchainId?.substring(0, 10)}...
                          </p>
                        </div>
                      </div>
                    </div>
                    <ButtonCustom>View Profile</ButtonCustom>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="animate-fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Track and manage your medical supplies</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <ButtonCustom variant="outline" size="sm">
                    Export Data
                  </ButtonCustom>
                  <ButtonCustom size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </ButtonCustom>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {urgentInventoryItems.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                      Urgent Restock Needed
                    </h3>
                    <div className="space-y-3">
                      {urgentInventoryItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-600">Current: {item.inStock} / Threshold: {item.threshold}</p>
                          </div>
                          <ButtonCustom size="sm">Restock</ButtonCustom>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-3">All Inventory Items</h3>
                  <div className="space-y-3">
                    {inventoryItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-slate-600">{item.description}</p>
                          <div className="flex items-center mt-1">
                            <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(item.reorderStatus)} mr-2`}></div>
                            <p className="text-sm">
                              Stock: <span className="font-medium">{item.inStock}</span> / Threshold: {item.threshold}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <ButtonCustom variant="outline" size="sm">Edit</ButtonCustom>
                          <ButtonCustom variant="outline" size="sm">Restock</ButtonCustom>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  <CardDescription>Communicate with your patients securely</CardDescription>
                </div>
                <ButtonCustom>
                  <Plus className="mr-2 h-4 w-4" />
                  New Message
                </ButtonCustom>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="mb-4">
                    <Input placeholder="Search messages..." />
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-slate-100 p-3 border-b font-medium">
                      Recent Conversations
                    </div>
                    <div className="divide-y">
                      {messages.map((message) => (
                        <div key={message.id} className="p-3 hover:bg-slate-50 cursor-pointer flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{message.senderName}</p>
                            <p className="text-sm text-slate-600 truncate">{message.content}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2 border rounded-lg flex flex-col h-[500px]">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Select a conversation</h3>
                    <p className="text-sm text-slate-600">Choose a patient or colleague to message</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center p-6 text-slate-400">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                      <p>Select a conversation to view messages</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default DoctorDashboard;
