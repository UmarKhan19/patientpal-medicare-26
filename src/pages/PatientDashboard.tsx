import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, MessageSquare, Check, X, AlertTriangle, UserCircle, Pill, Clock, CheckCircle2 } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [medicationReminders, setMedicationReminders] = useState(
    getPatientMedicationReminders(user?.id || "")
  );

  const patientData = {
    appointments: getPatientAppointments(user?.id || ""),
    prescriptions: getPatientPrescriptions(user?.id || ""),
    testResults: getPatientTests(user?.id || ""),
    medicationReminders,
    messages: getPatientMessages(user?.id || ""),
  };

  const upcomingAppointments = patientData.appointments
    .filter(a => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const recentPrescriptions = patientData.prescriptions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const groupedMedications = medicationReminders.reduce((acc, med) => {
    if (!acc[med.time]) {
      acc[med.time] = [];
    }
    acc[med.time].push(med);
    return acc;
  }, {} as Record<string, typeof medicationReminders>);

  const sortedTimes = Object.keys(groupedMedications).sort((a, b) => {
    const [aHour, aMin] = a.split(':').map(Number);
    const [bHour, bMin] = b.split(':').map(Number);
    return (aHour * 60 + aMin) - (bHour * 60 + bMin);
  });

  const handleMedicationTaken = (medicationId: string, taken: boolean) => {
    setMedicationReminders(prev => 
      prev.map(med => 
        med.id === medicationId ? { ...med, taken } : med
      )
    );
    
    const medication = medicationReminders.find(med => med.id === medicationId);
    
    if (taken) {
      toast({
        title: "Medication taken",
        description: `You've marked ${medication?.medication} as taken.`,
      });
    }
  };

  // Get today's medications for the overview section
  const todaysMedications = medicationReminders.slice(0, 3);

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
        <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-slate-100 rounded-lg">
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
            value="medication-schedule" 
            className={`py-3 ${activeTab === "medication-schedule" ? "bg-white shadow-sm" : ""}`}
          >
            Medication
          </TabsTrigger>
          <TabsTrigger 
            value="messages" 
            className={`py-3 ${activeTab === "messages" ? "bg-white shadow-sm" : ""}`}
          >
            Messages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Medications</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{medicationReminders.length}</div>
                <p className="text-sm text-slate-600 mb-4">
                  {todaysMedications.length > 0
                    ? `${todaysMedications.filter(m => m.taken).length}/${todaysMedications.length} taken today`
                    : "No medications today"
                  }
                </p>
                <ButtonCustom variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("medication-schedule")}>
                  View Schedule
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

          <Card className="card-hover">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Today's Medication</CardTitle>
                <ButtonCustom variant="ghost" size="sm" onClick={() => setActiveTab("medication-schedule")}>View Full Schedule</ButtonCustom>
              </div>
              <CardDescription>Remember to take your medications on time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedTimes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {sortedTimes.slice(0, 2).map((time) => (
                      <div key={time} className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-3">
                          <Clock className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{time}</h3>
                        </div>
                        
                        <div className="space-y-2">
                          {groupedMedications[time].map((medication) => (
                            <div 
                              key={medication.id} 
                              className={`flex items-center justify-between p-2 rounded ${
                                medication.taken ? "bg-green-50" : "bg-white"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Pill className="h-4 w-4 text-primary" />
                                <p className="text-sm font-medium">{medication.medication}</p>
                              </div>
                              
                              <div className="flex items-center">
                                <Checkbox
                                  id={`overview-med-${medication.id}`}
                                  checked={medication.taken}
                                  onCheckedChange={(checked) => 
                                    handleMedicationTaken(medication.id, checked === true)
                                  }
                                  className="mr-2"
                                />
                                {medication.taken && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No medications scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
        
        <TabsContent value="medication-schedule" className="animate-fade-in space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Medication Schedule</CardTitle>
              <CardDescription>Track your medications and mark them as taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {sortedTimes.length > 0 ? (
                  sortedTimes.map((time) => (
                    <div key={time} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">{time}</h3>
                      </div>
                      
                      {groupedMedications[time].map((medication) => (
                        <div 
                          key={medication.id} 
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            medication.taken ? "bg-[#F2FCE2]" : "bg-[#F9F9F9]"
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <Pill className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-lg">{medication.medication}</p>
                              <p className="text-slate-600">Take with food</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            {medication.taken && (
                              <div className="flex items-center text-green-600">
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                <span>Taken</span>
                              </div>
                            )}
                            
                            <button
                              onClick={() => handleMedicationTaken(medication.id, !medication.taken)}
                              className={`flex items-center gap-2 py-2 px-4 rounded-full ${
                                medication.taken 
                                  ? "bg-white text-slate-700 border border-slate-200" 
                                  : "bg-primary text-white"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                              Mark as taken
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>No medications scheduled for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Medication History</CardTitle>
              <CardDescription>Your medication history for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">Yesterday</p>
                    <span className="text-green-600 text-sm flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> All medications taken
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>3 medications scheduled</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-medium">2 days ago</p>
                    <span className="text-amber-600 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" /> 1 medication missed
                    </span>
                  </div>
                  <div className="text-sm text-slate-600">
                    <p>3 medications scheduled</p>
                  </div>
                </div>
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

