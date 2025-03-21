
export interface MedicalTest {
  id: string;
  patientId: string;
  doctorId: string;
  name: string;
  date: string;
  result?: string;
  status: string;
  recommendations?: string;
  createdAt: bigint;
  updatedAt: bigint;
}
