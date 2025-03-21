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
  blockchainId?: string; // Unique blockchain identifier for web3 integration
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
  senderName?: string; // Name for display
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
  instructions: string; // Added instructions
  imageUrl?: string; // Added image URL
  color?: string; // Added pill color for UI
}

export interface LabTechnician {
  id: string;
  name: string;
  role: string;
  specialty: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  testType: string;
  referredBy: string;
  referringDoctorId: string;
  requestDate: string;
  status: string;
  completionDate?: string;
  technician: string;
  result: string;
  notes?: string;
  reportUrl?: string;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  patientImage: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful: boolean;
}

export interface MedicationHistoryEntry {
  date: string;
  doses: {
    id: string;
    time: string;
    taken: boolean;
    takenAt?: string;
    skipped: boolean;
    late: boolean;
  }[];
  compliance: number;
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

// Generate blockchain-like addresses for patients
const generateBlockchainId = () => {
  return '0x' + Array.from({ length: 40 })
    .map(() => faker.number.hex({ min: 0, max: 15 }))
    .join('');
};

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
  blockchainId: generateBlockchainId(), // Add unique blockchain ID
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
  const sender = i % 2 === 0 
    ? patients[i % patients.length]
    : doctors[i % doctors.length];
  const receiver = i % 2 === 0 
    ? doctors[i % doctors.length]
    : patients[i % patients.length];
  return {
    id: `m${i + 1}`,
    senderId: sender.id,
    receiverId: receiver.id,
    timestamp: faker.date.recent(),
    content: faker.lorem.paragraph(2),
    isRead: faker.datatype.boolean(),
    senderName: sender.name,
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

// Generate medication reminders with more detailed information
export const medicationReminders: MedicationReminder[] = Array.from({ length: 12 }, (_, i) => {
  const patient = patients[i % patients.length];
  const medications = [
    "Lisinopril 10mg",
    "Atorvastatin 20mg",
    "Metformin 500mg",
    "Levothyroxine 50mcg",
    "Amlodipine 5mg",
    "Metoprolol 25mg",
    "Omeprazole 20mg",
    "Simvastatin 40mg",
    "Losartan 50mg",
    "Albuterol Inhaler",
    "Gabapentin 300mg",
    "Hydrochlorothiazide 25mg"
  ];
  
  const instructions = [
    "Take with food",
    "Take on empty stomach",
    "Take before meal",
    "Take after meal",
    "Take with water",
    "Do not take with dairy products",
    "Take at the same time each day"
  ];
  
  const times = ["06:00", "08:00", "12:00", "14:00", "18:00", "20:00", "22:00"];
  const colors = ["blue", "red", "orange", "green", "purple", "pink", "teal"];
  
  return {
    id: `mr${i + 1}`,
    patientId: patient.id,
    medication: medications[i % medications.length],
    time: times[i % times.length],
    taken: faker.datatype.boolean(),
    instructions: instructions[i % instructions.length],
    color: colors[i % colors.length]
  };
});

// New dummy data for lab tests
export const labTechnicians: LabTechnician[] = [
  { id: "lt1", name: "Sarah Johnson", role: "Lab Technician", specialty: "Hematology" },
  { id: "lt2", name: "Michael Chen", role: "Lab Technician", specialty: "Clinical Chemistry" },
  { id: "lt3", name: "Priya Patel", role: "Lab Manager", specialty: "Microbiology" },
];

export const getLabTests = () => {
  return [
    {
      id: "test1",
      patientId: "p1",
      patientName: "John Smith",
      testName: "Complete Blood Count (CBC)",
      testType: "Blood",
      referredBy: "Dr. Emily Chen",
      referringDoctorId: "d1",
      requestDate: "2023-10-05",
      status: "Completed",
      completionDate: "2023-10-07",
      technician: "Sarah Johnson",
      result: "Normal",
      notes: "All blood cell counts are within normal ranges.",
      reportUrl: "/reports/cbc-john-smith.pdf"
    },
    {
      id: "test2",
      patientId: "p2",
      patientName: "Maria Garcia",
      testName: "Lipid Profile",
      testType: "Blood",
      referredBy: "Dr. James Williams",
      referringDoctorId: "d2",
      requestDate: "2023-10-10",
      status: "Completed",
      completionDate: "2023-10-12",
      technician: "Michael Chen",
      result: "Abnormal",
      notes: "Elevated LDL cholesterol levels. Recommend follow-up.",
      reportUrl: "/reports/lipid-maria-garcia.pdf"
    },
    {
      id: "test3",
      patientId: "p3",
      patientName: "David Johnson",
      testName: "Urinalysis",
      testType: "Urine",
      referredBy: "Dr. Emily Chen",
      referringDoctorId: "d1",
      requestDate: "2023-10-15",
      status: "Pending",
      technician: "Priya Patel"
    },
    {
      id: "test4",
      patientId: "p1",
      patientName: "John Smith",
      testName: "Liver Function Test",
      testType: "Blood",
      referredBy: "Dr. Emily Chen",
      referringDoctorId: "d1",
      requestDate: "2023-10-18",
      status: "Pending",
      technician: "Sarah Johnson"
    },
    {
      id: "test5",
      patientId: "p4",
      patientName: "Sarah Williams",
      testName: "Thyroid Function Test",
      testType: "Blood",
      referredBy: "Dr. Robert Johnson",
      referringDoctorId: "d3",
      requestDate: "2023-10-08",
      status: "Completed",
      completionDate: "2023-10-10",
      technician: "Michael Chen",
      result: "Normal",
      notes: "TSH, T3, and T4 levels are within normal ranges.",
      reportUrl: "/reports/thyroid-sarah-williams.pdf"
    }
  ];
};

// Doctor reviews data
export const getDoctorReviews = (doctorId: string) => {
  const allReviews = [
    {
      id: "r1",
      doctorId: "d1",
      patientId: "p1",
      patientName: "John Smith",
      patientImage: "/images/patients/john-smith.jpg",
      rating: 5,
      comment: "Dr. Chen is an excellent doctor. She took the time to explain everything and answer all my questions. Very professional and caring.",
      date: "2023-09-15",
      helpfulCount: 12,
      isHelpful: false
    },
    {
      id: "r2",
      doctorId: "d1",
      patientId: "p2",
      patientName: "Maria Garcia",
      rating: 4,
      comment: "Very knowledgeable doctor. The waiting time was a bit long, but the consultation was worth it.",
      date: "2023-08-22",
      helpfulCount: 8,
      isHelpful: false
    },
    {
      id: "r3",
      doctorId: "d1",
      patientId: "p3",
      patientName: "David Johnson",
      rating: 5,
      comment: "I've been seeing Dr. Chen for years and she always provides excellent care. Highly recommend!",
      date: "2023-07-10",
      helpfulCount: 15,
      isHelpful: false
    },
    {
      id: "r4",
      doctorId: "d2",
      patientId: "p1",
      patientName: "John Smith",
      patientImage: "/images/patients/john-smith.jpg",
      rating: 3,
      comment: "Dr. Williams is knowledgeable but seemed rushed during our appointment. Could improve on patient communication.",
      date: "2023-09-05",
      helpfulCount: 4,
      isHelpful: false
    },
    {
      id: "r5",
      doctorId: "d2",
      patientId: "p4",
      patientName: "Sarah Williams",
      rating: 4,
      comment: "Good experience overall. Dr. Williams diagnosed my condition accurately and the treatment was effective.",
      date: "2023-08-18",
      helpfulCount: 6,
      isHelpful: false
    }
  ];

  return allReviews.filter(review => review.doctorId === doctorId);
};

// Doctor rating calculation
export const getDoctorRating = (doctorId: string) => {
  const reviews = getDoctorReviews(doctorId);
  if (reviews.length === 0) return { average: 0, total: 0 };
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return {
    average: sum / reviews.length,
    total: reviews.length
  };
};

// Doctor specialties for filtering
export const doctorSpecialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "Neurology",
  "Obstetrics & Gynecology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Urology"
];

// Medication schedule history
export const getMedicationHistory = (patientId: string) => {
  const allMedications = [
    {
      id: "med1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      instructions: "Take in the morning with food",
      image: "/images/medications/lisinopril.png",
      color: "bg-blue-500",
      history: generateMedicationHistory(30, 1, 85) // 85% compliance
    },
    {
      id: "med2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      instructions: "Take with meals, morning and evening",
      image: "/images/medications/metformin.png",
      color: "bg-purple-500",
      history: generateMedicationHistory(30, 2, 70) // 70% compliance
    },
    {
      id: "med3",
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      instructions: "Take in the evening",
      image: "/images/medications/atorvastatin.png",
      color: "bg-green-500",
      history: generateMedicationHistory(30, 1, 90) // 90% compliance
    },
    {
      id: "med4",
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      instructions: "Take with food to reduce stomach irritation",
      image: "/images/medications/aspirin.png",
      color: "bg-red-500",
      history: generateMedicationHistory(30, 1, 95) // 95% compliance
    }
  ];

  // In a real app, you would filter by patientId
  return allMedications;
};

// Helper function to generate medication history
function generateMedicationHistory(days: number, dosesPerDay: number, compliancePercentage: number) {
  const history: any[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const doses = [];
    for (let j = 0; j < dosesPerDay; j++) {
      // Generate time based on doses per day
      let hour;
      if (dosesPerDay === 1) {
        hour = 8; // 8 AM for once daily
      } else if (dosesPerDay === 2) {
        hour = j === 0 ? 8 : 20; // 8 AM and 8 PM for twice daily
      } else if (dosesPerDay === 3) {
        hour = j === 0 ? 8 : j === 1 ? 14 : 20; // 8 AM, 2 PM, 8 PM for three times daily
      } else {
        hour = 8 + (j * 4); // Evenly spaced for 4+ doses
      }
      
      const time = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
      
      // Determine if this dose was taken based on compliance percentage
      const taken = Math.random() * 100 < compliancePercentage;
      
      // If not taken, randomly determine if it was skipped or late
      const skipped = !taken && Math.random() > 0.5;
      const late = !taken && !skipped && Math.random() > 0.7;
      
      // Generate a random taken time (slightly after scheduled time)
      const takenHour = hour + Math.floor(Math.random() * 2);
      const takenMinute = Math.floor(Math.random() * 59);
      const takenTime = `${takenHour > 12 ? takenHour - 12 : takenHour}:${takenMinute.toString().padStart(2, '0')} ${takenHour >= 12 ? 'PM' : 'AM'}`;
      
      doses.push({
        id: `dose-${i}-${j}`,
        time,
        taken,
        takenAt: taken ? takenTime : undefined,
        skipped,
        late
      });
    }
    
    // Calculate compliance for this day
    const takenCount = doses.filter(dose => dose.taken).length;
    const compliance = (takenCount / dosesPerDay) * 100;
    
    history.push({
      date: date.toISOString().split('T')[0],
      doses,
      compliance
    });
  }
  
  return history;
}

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

export function searchPatientsByName(searchTerm: string): Patient[] {
  if (!searchTerm.trim()) return [];
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(lowerSearchTerm)
  );
}

export function searchPatientsByBlockchainId(blockchainId: string): Patient | undefined {
  if (!blockchainId.trim()) return undefined;
  
  return patients.find(patient => 
    patient.blockchainId && patient.blockchainId.toLowerCase().includes(blockchainId.toLowerCase())
  );
}

export function getPatientMessages(patientId: string) {
  return messages.filter(
    message => message.senderId === patientId || message.receiverId === patientId
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getDoctorMessages(doctorId: string) {
  return messages.filter(
    message => message.senderId === doctorId || message.receiverId === doctorId
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Find doctor by ID
export function findDoctorById(doctorId: string) {
  return doctors.find(doctor => doctor.id === doctorId);
}

// Get patient by blockchain ID
export function findPatientByBlockchainId(blockchainId: string) {
  return patients.find(patient => patient.blockchainId === blockchainId);
}
