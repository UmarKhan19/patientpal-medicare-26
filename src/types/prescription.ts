
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
