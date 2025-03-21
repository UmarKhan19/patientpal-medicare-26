
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { FileText, Plus, FileSearch } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PatientPrescriptionForm from "./PatientPrescriptionForm";
import { toast } from "sonner";
import { Prescription } from "@/types/prescription";

// Local interface for the existing prescriptions structure
interface PrescriptionDisplay {
  id: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  height: string;
  weight: string;
  bloodPressure?: string;
  allergies?: string;
  notes?: string;
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

interface PatientPrescriptionManagerProps {
  patientId: string;
  patientName: string;
  prescriptions: PrescriptionDisplay[];
  onAddPrescription?: (prescription: any) => void;
}

const PatientPrescriptionManager = ({
  patientId,
  patientName,
  prescriptions = [],
  onAddPrescription,
}: PatientPrescriptionManagerProps) => {
  const [isAddingPrescription, setIsAddingPrescription] = useState(false);
  const [viewingPrescription, setViewingPrescription] = useState<PrescriptionDisplay | null>(null);

  const handleNewPrescription = (data: any) => {
    console.log("New prescription data:", data);
    
    if (onAddPrescription) {
      // Add timestamp and ID
      const newPrescription = {
        ...data,
        id: `presc_${Date.now()}`,
        date: new Date().toISOString(),
      };
      
      onAddPrescription(newPrescription);
    }
    
    setIsAddingPrescription(false);
    toast.success("Prescription added successfully");
  };

  const viewPrescription = (prescription: PrescriptionDisplay) => {
    setViewingPrescription(prescription);
    setIsAddingPrescription(false);
  };

  const handleCancel = () => {
    setIsAddingPrescription(false);
    setViewingPrescription(null);
  };

  if (isAddingPrescription) {
    return (
      <PatientPrescriptionForm 
        patientId={patientId}
        patientName={patientName}
        onSave={handleNewPrescription}
        onCancel={handleCancel}
      />
    );
  }

  if (viewingPrescription) {
    return (
      <PatientPrescriptionForm 
        patientId={patientId}
        patientName={patientName}
        existingPrescription={viewingPrescription}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prescription History</h2>
        <ButtonCustom onClick={() => setIsAddingPrescription(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </ButtonCustom>
      </div>

      <div className="space-y-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <Card key={prescription.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Prescription
                  </CardTitle>
                  <p className="text-sm text-slate-500">{formatDate(prescription.date)}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Symptoms</p>
                    <p className="text-sm">{prescription.symptoms}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Diagnosis</p>
                    <p className="text-sm">{prescription.diagnosis}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <ButtonCustom 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewPrescription(prescription)}
                  >
                    <FileSearch className="h-4 w-4 mr-2" />
                    View Full Prescription
                  </ButtonCustom>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-lg font-medium mb-1">No Prescriptions Yet</h3>
            <p className="text-slate-600">
              Create a new prescription for {patientName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptionManager;
