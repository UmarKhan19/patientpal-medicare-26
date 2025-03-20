
import { faker } from '@faker-js/faker';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  location: string;
  picture?: string | null;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  age?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  picture?: string | null;
  notes?: { date: string; doctor: string; content: string }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  time: string;
  type: string;
  status: string;
  notes?: string;
  patient?: string; // Patient name for display
  doctor?: string; // Doctor name for display
  specialty?: string; // Doctor specialty for display
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  inStock: number;
  threshold: number;
  reorderStatus: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  content: string;
  isRead: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  instructions: string;
  date: Date;
  issued: Date; // Added issued date
  doctor: string;
}

export interface TestResult {
  id: string;
  patientId: string;
  name: string;
  date: Date;
  lab: string;
  result: string;
  notes?: string;
}

export interface MedicationReminder {
  id: string;
  patientId: string;
  medication: string;
  time: string;
  taken: boolean;
}

// Generate dummy data
export const doctors: Doctor[] = Array.from({ length: 5 }, (_, i) => ({
  id: `d${i + 1}`,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  specialty: faker.person.jobType(),
  location: faker.location.city(),
  picture: faker.image.avatar(),
}));

// Blood type options since faker.person.bloodType() doesn't exist
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const patients: Patient[] = Array.from({ length: 20 }, (_, i) => ({
  id: `p${i + 1}`,
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  gender: faker.person.sex(),
  age: faker.number.int({ min: 18, max: 85 }),
  bloodType: faker.helpers.arrayElement(bloodTypes),
  allergies: faker.helpers.arrayElements([
    'Penicillin',
    'Latex',
    'Pollen',
    'Shellfish',
  ]),
  chronicConditions: faker.helpers.arrayElements([
    'Diabetes',
    'Hypertension',
    'Asthma',
    'Arthritis',
  ]),
  picture: faker.image.avatar(),
  notes: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    date: faker.date.past().toLocaleDateString(),
    doctor: faker.person.fullName(),
    content: faker.lorem.sentence(),
  })),
}));

export const appointments: Appointment[] = Array.from({ length: 30 }, (_, i) => {
  const patient = patients[i % patients.length];
  const doctor = doctors[i % doctors.length];
  return {
    id: `a${i + 1}`,
    patientId: patient.id,
    doctorId: doctor.id,
    date: faker.date.future(),
    time: `${faker.number.int({ min: 8, max: 17 })}:${faker.number.int({ min: 0, max: 59 })}`,
    type: faker.helpers.arrayElement([
      'Check-up',
      'Consultation',
      'Follow-up',
    ]),
    status: faker.helpers.arrayElement([
      'Scheduled',
      'Completed',
      'Cancelled',
    ]),
    notes: faker.lorem.sentence(),
    patient: patient.name,
    doctor: doctor.name,
    specialty: doctor.specialty,
  };
});

export const inventoryItems: InventoryItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `i${i + 1}`,
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  inStock: faker.number.int({ min: 0, max: 100 }),
  threshold: faker.number.int({ min: 5, max: 20 }),
  reorderStatus: faker.helpers.arrayElement([
    'Good',
    'Warning',
    'Urgent',
  ]),
}));

export const messages: Message[] = Array.from({ length: 20 }, (_, i) => {
  const sender = patients[i % patients.length];
  const receiver = doctors[i % doctors.length];
  return {
    id: `m${i + 1}`,
    senderId: sender.id,
    receiverId: receiver.id,
    timestamp: faker.date.recent(),
    content: faker.lorem.sentence(),
    isRead: faker.datatype.boolean(),
  };
});

export const prescriptions: Prescription[] = Array.from({ length: 20 }, (_, i) => {
  const patient = patients[i % patients.length];
  const doctor = doctors[i % doctors.length];
  return {
    id: `pr${i + 1}`,
    patientId: patient.id,
    doctorId: doctor.id,
    medication: faker.commerce.productName(),
    dosage: `${faker.number.int({ min: 1, max: 5 })} pills`,
    instructions: faker.lorem.sentence(),
    date: faker.date.past(),
    issued: faker.date.past(), // Added issued date
    doctor: doctor.name,
  };
});

export const testResults: TestResult[] = Array.from({ length: 15 }, (_, i) => {
  const patient = patients[i % patients.length];
  return {
    id: `t${i + 1}`,
    patientId: patient.id,
    name: faker.science.chemicalElement().name,
    date: faker.date.past(),
    lab: faker.company.name(),
    result: faker.number.float({ min: 0, max: 100 }).toString(),
    notes: faker.lorem.sentence(),
  };
});

// Generate medication reminders
export const medicationReminders: MedicationReminder[] = Array.from({ length: 12 }, (_, i) => {
  const patient = patients[i % patients.length];
  return {
    id: `mr${i + 1}`,
    patientId: patient.id,
    medication: faker.commerce.productName(),
    time: `${faker.number.int({ min: 6, max: 22 })}:${faker.helpers.arrayElement(['00', '30'])}`,
    taken: faker.datatype.boolean(),
  };
});

// Helper functions to get specific data
export function getTodaysAppointments(doctorId: string): Appointment[] {
  const today = new Date();
  return appointments.filter(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date.getDate() === today.getDate() &&
      appointment.date.getMonth() === today.getMonth() &&
      appointment.date.getFullYear() === today.getFullYear()
  );
}

export function getUpcomingAppointments(doctorId: string, limit: number = 5): Appointment[] {
  const today = new Date();
  return appointments
    .filter((appointment) => appointment.doctorId === doctorId && appointment.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
}

export function getLowInventoryItems(reorderStatus: string, limit: number = 3): InventoryItem[] {
  return inventoryItems
    .filter((item) => item.reorderStatus === reorderStatus)
    .slice(0, limit);
}

export function getUnreadMessageCount(receiverId: string): number {
  return messages.filter((message) => message.receiverId === receiverId && !message.isRead).length;
}

// Helper functions to find specific patient data
export function findPatientById(patientId: string) {
  return patients.find(patient => patient.id === patientId);
}

export function getPatientAppointments(patientId: string) {
  return appointments.filter(appointment => appointment.patientId === patientId);
}

export function getPatientPrescriptions(patientId: string) {
  return prescriptions.filter(prescription => prescription.patientId === patientId);
}

export function getPatientTests(patientId: string) {
  return testResults.filter(test => test.patientId === patientId);
}

export function getPatientMedicationReminders(patientId: string) {
  return medicationReminders.filter(reminder => reminder.patientId === patientId);
}

export function getRecentPatients(doctorId: string, limit = 5) {
  // Get unique patients from appointments for this doctor, sorted by most recent
  const doctorAppointments = appointments
    .filter(appointment => appointment.doctorId === doctorId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const uniquePatientIds = Array.from(new Set(doctorAppointments.map(a => a.patientId)));
  
  // Get patient details for each unique patient ID, up to the limit
  return uniquePatientIds
    .slice(0, limit)
    .map(patientId => {
      const patient = findPatientById(patientId);
      const lastAppointment = doctorAppointments.find(a => a.patientId === patientId);
      return {
        ...patient,
        lastVisit: lastAppointment ? lastAppointment.date : null
      };
    });
}

export function searchPatientsByName(searchTerm: string) {
  if (!searchTerm.trim()) return [];
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(lowerSearchTerm)
  );
}
