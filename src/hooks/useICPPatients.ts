
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { icpActor } from "@/services/icp/actor";
import { useICP } from "@/contexts/ICPContext";
import { toast } from "sonner";

export const useICPPatients = () => {
  const { isConnected } = useICP();
  const queryClient = useQueryClient();

  // Get all patients
  const useGetAllPatients = () => {
    return useQuery({
      queryKey: ['patients'],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const patientActor = await icpActor.getPatientActor();
        return patientActor.getAllPatients();
      },
      enabled: isConnected,
    });
  };

  // Get patient by ID
  const useGetPatient = (patientId: string) => {
    return useQuery({
      queryKey: ['patient', patientId],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const patientActor = await icpActor.getPatientActor();
        const patient = await patientActor.getPatient(patientId);
        
        if (!patient.length) {
          throw new Error("Patient not found");
        }
        
        return patient[0];
      },
      enabled: isConnected && !!patientId,
    });
  };

  // Create a new patient
  const useCreatePatient = () => {
    return useMutation({
      mutationFn: async (patient: any) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const patientActor = await icpActor.getPatientActor();
        return patientActor.createPatient({
          ...patient,
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        toast.success("Patient created successfully");
      },
      onError: (error: any) => {
        toast.error(`Error creating patient: ${error.message}`);
      },
    });
  };

  // Update a patient
  const useUpdatePatient = () => {
    return useMutation({
      mutationFn: async (patient: any) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const patientActor = await icpActor.getPatientActor();
        return patientActor.updatePatient({
          ...patient,
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['patients'] });
        queryClient.invalidateQueries({ queryKey: ['patient', variables.id] });
        toast.success("Patient updated successfully");
      },
      onError: (error: any) => {
        toast.error(`Error updating patient: ${error.message}`);
      },
    });
  };

  // Search patients
  const useSearchPatients = (query: string) => {
    return useQuery({
      queryKey: ['patients', 'search', query],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const patientActor = await icpActor.getPatientActor();
        return patientActor.searchPatients(query);
      },
      enabled: isConnected && !!query,
    });
  };

  return {
    useGetAllPatients,
    useGetPatient,
    useCreatePatient,
    useUpdatePatient,
    useSearchPatients,
  };
};
