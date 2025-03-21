
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { icpActor } from "@/services/icp/actor";
import { useICP } from "@/contexts/ICPContext";
import { toast } from "sonner";

export const useICPDoctors = () => {
  const { isConnected } = useICP();
  const queryClient = useQueryClient();

  // Get all doctors
  const useGetAllDoctors = () => {
    return useQuery({
      queryKey: ['doctors'],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        return doctorActor.getAllDoctors();
      },
      enabled: isConnected,
    });
  };

  // Get doctor by ID
  const useGetDoctor = (doctorId: string) => {
    return useQuery({
      queryKey: ['doctor', doctorId],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        const doctor = await doctorActor.getDoctor(doctorId);
        
        if (!doctor.length) {
          throw new Error("Doctor not found");
        }
        
        return doctor[0];
      },
      enabled: isConnected && !!doctorId,
    });
  };

  // Create a new doctor
  const useCreateDoctor = () => {
    return useMutation({
      mutationFn: async (doctor: any) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        return doctorActor.createDoctor({
          ...doctor,
          createdAt: BigInt(Date.now()),
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['doctors'] });
        toast.success("Doctor created successfully");
      },
      onError: (error: any) => {
        toast.error(`Error creating doctor: ${error.message}`);
      },
    });
  };

  // Update a doctor
  const useUpdateDoctor = () => {
    return useMutation({
      mutationFn: async (doctor: any) => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        return doctorActor.updateDoctor({
          ...doctor,
          updatedAt: BigInt(Date.now()),
        });
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['doctors'] });
        queryClient.invalidateQueries({ queryKey: ['doctor', variables.id] });
        toast.success("Doctor updated successfully");
      },
      onError: (error: any) => {
        toast.error(`Error updating doctor: ${error.message}`);
      },
    });
  };

  // Search doctors
  const useSearchDoctors = (query: string) => {
    return useQuery({
      queryKey: ['doctors', 'search', query],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        return doctorActor.searchDoctors(query);
      },
      enabled: isConnected && !!query,
    });
  };

  // Get doctors by specialty
  const useGetDoctorsBySpecialty = (specialty: string) => {
    return useQuery({
      queryKey: ['doctors', 'specialty', specialty],
      queryFn: async () => {
        if (!isConnected) {
          throw new Error("Not connected to Internet Computer");
        }
        
        const doctorActor = await icpActor.getDoctorActor();
        return doctorActor.getDoctorsBySpecialty(specialty);
      },
      enabled: isConnected && !!specialty,
    });
  };

  return {
    useGetAllDoctors,
    useGetDoctor,
    useCreateDoctor,
    useUpdateDoctor,
    useSearchDoctors,
    useGetDoctorsBySpecialty,
  };
};
