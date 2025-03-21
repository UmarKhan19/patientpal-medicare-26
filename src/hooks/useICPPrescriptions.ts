
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { icpActor } from "@/services/icp/actor";
import { useICP } from "@/contexts/ICPContext";
import { toast } from "sonner";
import { Prescription } from "@/types/prescription";

export const useICPPrescriptions = () => {
  const { isConnected } = useICP();
  const queryClient = useQueryClient();

  // Get prescription by ID
  const useGetPrescription = (prescriptionId: string) => {
    return useQuery({
      queryKey: ['prescription', prescriptionId],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const prescriptionActor = await icpActor.getPrescriptionActor();
        const prescription = await prescriptionActor.getPrescription(prescriptionId);
        
        if (!prescription.length) {
          throw new Error("Prescription not found");
        }
        
        return prescription[0];
      },
      enabled: isConnected && !!prescriptionId,
    });
  };

  // Get prescriptions by patient ID
  const useGetPrescriptionsByPatient = (patientId: string) => {
    return useQuery({
      queryKey: ['prescriptions', 'patient', patientId],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const prescriptionActor = await icpActor.getPrescriptionActor();
        return prescriptionActor.getPrescriptionsByPatient(patientId);
      },
      enabled: isConnected && !!patientId,
    });
  };

  // Get prescriptions by doctor ID
  const useGetPrescriptionsByDoctor = (doctorId: string) => {
    return useQuery({
      queryKey: ['prescriptions', 'doctor', doctorId],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const prescriptionActor = await icpActor.getPrescriptionActor();
        return prescriptionActor.getPrescriptionsByDoctor(doctorId);
      },
      enabled: isConnected && !!doctorId,
    });
  };

  // Create a new prescription
  const useCreatePrescription = () => {
    return useMutation({
      mutationFn: async (prescription: Prescription) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const prescriptionActor = await icpActor.getPrescriptionActor();
        return prescriptionActor.createPrescription({
          ...prescription,
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'patient', variables.patientId] });
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'doctor', variables.doctorId] });
        toast.success("Prescription created successfully");
      },
      onError: (error: any) => {
        toast.error(`Error creating prescription: ${error.message}`);
      },
    });
  };

  // Update a prescription
  const useUpdatePrescription = () => {
    return useMutation({
      mutationFn: async (prescription: Prescription) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const prescriptionActor = await icpActor.getPrescriptionActor();
        return prescriptionActor.updatePrescription({
          ...prescription,
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['prescription', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'patient', variables.patientId] });
        queryClient.invalidateQueries({ queryKey: ['prescriptions', 'doctor', variables.doctorId] });
        toast.success("Prescription updated successfully");
      },
      onError: (error: any) => {
        toast.error(`Error updating prescription: ${error.message}`);
      },
    });
  };

  return {
    useGetPrescription,
    useGetPrescriptionsByPatient,
    useGetPrescriptionsByDoctor,
    useCreatePrescription,
    useUpdatePrescription,
  };
};
