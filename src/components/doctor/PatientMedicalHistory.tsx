import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Clipboard, FileText, Beaker, HeartPulse, History, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PatientPrescriptionForm from "./PatientPrescriptionForm";
import PatientPrescriptionManager from "./PatientPrescriptionManager";
import { toast } from "sonner";

// Types
interface MedicalTest {
  id: string;
  name: string;
  date: string;
  result: string;
  status: string;
}

interface Prescription {
  id: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  tests: {
    name: string;
    instructions?: string;
  }[];
}

interface VitalRecord {
  id: string;
  date: string;
  height: string;
  weight: string;
  bloodPressure: string;
  temperature?: string;
  heartRate?: string;
  respiratoryRate?: string;
}

interface PatientMedicalHistoryProps {
  patientId: string;
  patientName: string;
  prescriptions: Prescription[];
  vitalRecords: VitalRecord[];
  medicalTests: MedicalTest[];
}

const PatientMedicalHistory = ({
  patientId,
  patientName,
  prescriptions,
  vitalRecords,
  medicalTests,
}: PatientMedicalHistoryProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [localPrescriptions, setLocalPrescriptions] = useState(prescriptions);
  const [showVitalForm, setShowVitalForm] = useState(false);
  
  const latestVitals = vitalRecords.length > 0 ? vitalRecords[0] : null;
  
  const handleNewPrescription = (data: any) => {
    const newPrescription = {
      ...data,
      id: `presc_${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    setLocalPrescriptions([newPrescription, ...localPrescriptions]);
    toast.success("Prescription added successfully");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">
            <Clipboard className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <FileText className="h-4 w-4 mr-2" /> Prescriptions
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <HeartPulse className="h-4 w-4 mr-2" /> Vitals
          </TabsTrigger>
          <TabsTrigger value="tests">
            <Beaker className="h-4 w-4 mr-2" /> Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HeartPulse className="h-5 w-5 mr-2 text-primary" />
                  Latest Vitals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {latestVitals ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-500">Recorded on {formatDate(latestVitals.date)}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Height</p>
                        <p className="text-lg">{latestVitals.height} cm</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Weight</p>
                        <p className="text-lg">{latestVitals.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Blood Pressure</p>
                        <p className="text-lg">{latestVitals.bloodPressure}</p>
                      </div>
                      {latestVitals.heartRate && (
                        <div>
                          <p className="text-sm font-medium">Heart Rate</p>
                          <p className="text-lg">{latestVitals.heartRate} BPM</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-slate-500 mb-3">No vital records available.</p>
                    <ButtonCustom 
                      onClick={() => {
                        setActiveTab("vitals");
                        setShowVitalForm(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vitals
                    </ButtonCustom>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {prescriptions.length > 0 || medicalTests.length > 0 ? (
                  <div className="space-y-3">
                    {prescriptions.slice(0, 3).map(prescription => (
                      <div key={prescription.id} className="border-b pb-2 last:border-b-0">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium">New Prescription</p>
                            <p className="text-xs text-slate-500">{formatDate(prescription.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {medicalTests.slice(0, 3).map(test => (
                      <div key={test.id} className="border-b pb-2 last:border-b-0">
                        <div className="flex items-center">
                          <Beaker className="h-4 w-4 mr-2 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium">{test.name}</p>
                            <p className="text-xs text-slate-500">{formatDate(test.date)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 mb-3">No recent activity.</p>
                    <ButtonCustom 
                      onClick={() => {
                        setActiveTab("prescriptions");
                        setIsAddingPrescription(true);
                      }}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prescription
                    </ButtonCustom>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="pt-4">
          <PatientPrescriptionManager 
            patientId={patientId}
            patientName={patientName}
            prescriptions={localPrescriptions}
            onAddPrescription={handleNewPrescription}
          />
        </TabsContent>

        <TabsContent value="vitals" className="pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Vital Records</h2>
              <ButtonCustom onClick={() => setShowVitalForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Vitals
              </ButtonCustom>
            </div>
            
            {vitalRecords.length > 0 ? (
              <div className="space-y-4">
                {vitalRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <HeartPulse className="h-5 w-5 mr-2 text-primary" />
                          Vitals Record
                        </div>
                        <p className="text-sm text-slate-500 font-normal">{formatDate(record.date)}</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium">Height</p>
                          <p className="text-lg">{record.height} cm</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Weight</p>
                          <p className="text-lg">{record.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Blood Pressure</p>
                          <p className="text-lg">{record.bloodPressure}</p>
                        </div>
                        {record.temperature && (
                          <div>
                            <p className="text-sm font-medium">Temperature</p>
                            <p className="text-lg">{record.temperature} °C</p>
                          </div>
                        )}
                        {record.heartRate && (
                          <div>
                            <p className="text-sm font-medium">Heart Rate</p>
                            <p className="text-lg">{record.heartRate} BPM</p>
                          </div>
                        )}
                        {record.respiratoryRate && (
                          <div>
                            <p className="text-sm font-medium">Respiratory Rate</p>
                            <p className="text-lg">{record.respiratoryRate} breaths/min</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <HeartPulse className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Vital Records</h3>
                <p className="text-slate-600">
                  No vital records have been added for this patient yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests" className="pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Medical Tests</h2>
              <ButtonCustom variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Order New Test
              </ButtonCustom>
            </div>
            
            {medicalTests.length > 0 ? (
              <div className="space-y-4">
                {medicalTests.map((test) => (
                  <Card key={test.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <Beaker className="h-5 w-5 mr-2 text-primary" />
                          {test.name}
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          test.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                          test.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {test.status}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-slate-500">Test date: {formatDate(test.date)}</p>
                        {test.status === 'Completed' && (
                          <div>
                            <p className="text-sm font-medium">Results</p>
                            <p className="text-sm">{test.result}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg">
                <Beaker className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                <h3 className="text-lg font-medium mb-1">No Medical Tests</h3>
                <p className="text-slate-600">
                  No tests have been ordered for this patient yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientMedicalHistory;
