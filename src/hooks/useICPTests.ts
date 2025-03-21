
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ActorSubclass } from '@dfinity/agent';
import { createActor } from '@/services/icp/actor';
import { idlFactory } from '@/services/icp/idl/test.did';
import { ICP_CONFIG } from '@/services/icp/config';
import { MedicalTest } from '@/types/medical-test';

// Create the tests actor
const getTestsActor = async () => {
  try {
    return await createActor<ActorSubclass<any>>(
      ICP_CONFIG.canisterIds.testsCanister,
      idlFactory
    );
  } catch (error) {
    console.error("Failed to create tests actor:", error);
    throw error;
  }
};

// Get all tests for a patient
export const useGetTestsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['tests', 'patient', patientId],
    queryFn: async () => {
      try {
        const actor = await getTestsActor();
        return actor.getTestsByPatient(patientId);
      } catch (error) {
        console.error("Failed to get tests by patient:", error);
        throw error;
      }
    },
    enabled: !!patientId,
  });
};

// Get all tests for a doctor
export const useGetTestsByDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['tests', 'doctor', doctorId],
    queryFn: async () => {
      try {
        const actor = await getTestsActor();
        return actor.getTestsByDoctor(doctorId);
      } catch (error) {
        console.error("Failed to get tests by doctor:", error);
        throw error;
      }
    },
    enabled: !!doctorId,
  });
};

// Get a specific test
export const useGetTest = (testId: string) => {
  return useQuery({
    queryKey: ['tests', testId],
    queryFn: async () => {
      try {
        const actor = await getTestsActor();
        return actor.getTest(testId);
      } catch (error) {
        console.error("Failed to get test:", error);
        throw error;
      }
    },
    enabled: !!testId,
  });
};

// Create a new test
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (test: MedicalTest) => {
      try {
        const actor = await getTestsActor();
        return actor.createTest(test);
      } catch (error) {
        console.error("Failed to create test:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tests', 'patient', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['tests', 'doctor', variables.doctorId] });
    },
  });
};

// Update an existing test
export const useUpdateTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (test: MedicalTest) => {
      try {
        const actor = await getTestsActor();
        return actor.updateTest(test);
      } catch (error) {
        console.error("Failed to update test:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tests', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tests', 'patient', variables.patientId] });
      queryClient.invalidateQueries({ queryKey: ['tests', 'doctor', variables.doctorId] });
    },
  });
};

// Delete a test
export const useDeleteTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (testId: string) => {
      try {
        const actor = await getTestsActor();
        return actor.deleteTest(testId);
      } catch (error) {
        console.error("Failed to delete test:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

// Get tests by status
export const useGetTestsByStatus = (status: string) => {
  return useQuery({
    queryKey: ['tests', 'status', status],
    queryFn: async () => {
      try {
        const actor = await getTestsActor();
        return actor.getTestsByStatus(status);
      } catch (error) {
        console.error("Failed to get tests by status:", error);
        throw error;
      }
    },
    enabled: !!status,
  });
};
