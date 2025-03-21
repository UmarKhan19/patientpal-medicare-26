
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Actor } from '@dfinity/agent';
import { createActor } from '@/services/icp/actor';
import { idlFactory } from '@/services/icp/idl/test.did';
import { ICP_CONFIG } from '@/services/icp/config';
import { MedicalTest } from '@/types/medical-test';

// Create the tests actor
const getTestsActor = async () => {
  return createActor(idlFactory, {
    canisterId: ICP_CONFIG.canisterIds.testsCanister,
    host: ICP_CONFIG.network
  });
};

// Get all tests for a patient
export const useGetTestsByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['tests', 'patient', patientId],
    queryFn: async () => {
      const actor = await getTestsActor();
      return actor.getTestsByPatient(patientId);
    },
    enabled: !!patientId,
  });
};

// Get all tests for a doctor
export const useGetTestsByDoctor = (doctorId: string) => {
  return useQuery({
    queryKey: ['tests', 'doctor', doctorId],
    queryFn: async () => {
      const actor = await getTestsActor();
      return actor.getTestsByDoctor(doctorId);
    },
    enabled: !!doctorId,
  });
};

// Get a specific test
export const useGetTest = (testId: string) => {
  return useQuery({
    queryKey: ['tests', testId],
    queryFn: async () => {
      const actor = await getTestsActor();
      return actor.getTest(testId);
    },
    enabled: !!testId,
  });
};

// Create a new test
export const useCreateTest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (test: MedicalTest) => {
      const actor = await getTestsActor();
      return actor.createTest(test);
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
      const actor = await getTestsActor();
      return actor.updateTest(test);
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
      const actor = await getTestsActor();
      return actor.deleteTest(testId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
};

// Get tests by status
export const useGetTestsByStatus = (status: string) => {
  return useQuery({
    queryKey: ['tests', 'status', status],
    queryFn: async () => {
      const actor = await getTestsActor();
      return actor.getTestsByStatus(status);
    },
    enabled: !!status,
  });
};
