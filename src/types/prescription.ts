
import { Principal } from '@dfinity/principal';

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: Medication[];
  tests: Test[];
  notes: string;
  symptoms: string;
  diagnosis: string;
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  // Added for ICP integration
  canisterId?: string;
  lastUpdated?: number;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Test {
  name: string;
  instructions?: string;
}

// ICP specific interfaces
export interface ICPIdentity {
  principal: Principal;
  isAuthenticated: boolean;
}

export interface ICPCanisterIds {
  patientsCanister: string;
  doctorsCanister: string;
  prescriptionsCanister: string;
  testsCanister: string;
}
