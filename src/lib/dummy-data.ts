
// Doctor data
export const doctors = [
  {
    id: "d1",
    name: "Dr. John Smith",
    email: "doctor@example.com",
    specialty: "Cardiologist",
    picture: null,
    experience: 12,
    patients: 124,
    address: "123 Medical Center, New York, NY",
    phone: "(123) 456-7890",
    about: "Dr. Smith is a board-certified cardiologist with over 12 years of experience in treating various heart conditions."
  },
  {
    id: "d2",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    specialty: "Dermatologist",
    picture: null,
    experience: 8,
    patients: 98,
    address: "456 Health Plaza, New York, NY",
    phone: "(123) 456-7891",
    about: "Dr. Johnson specializes in dermatology and has expertise in treating various skin conditions and performing cosmetic procedures."
  },
  {
    id: "d3",
    name: "Dr. Michael Brown",
    email: "michael.brown@example.com",
    specialty: "Pediatrician",
    picture: null,
    experience: 15,
    patients: 210,
    address: "789 Children's Clinic, New York, NY",
    phone: "(123) 456-7892",
    about: "Dr. Brown is a compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence."
  }
];

// Patient data
export const patients = [
  {
    id: "p1",
    name: "Jane Doe",
    email: "patient@example.com",
    age: 35,
    gender: "Female",
    bloodType: "A+",
    picture: null,
    address: "456 Park Avenue, New York, NY",
    phone: "(123) 456-7893",
    emergencyContact: "John Doe (Husband) - (123) 456-7894",
    medicalHistory: [
      { condition: "Hypertension", diagnosedYear: 2018, status: "Ongoing" },
      { condition: "Allergies - Pollen", diagnosedYear: 2010, status: "Seasonal" }
    ]
  },
  {
    id: "p2",
    name: "Robert Chen",
    email: "robert.chen@example.com",
    age: 58,
    gender: "Male",
    bloodType: "O+",
    picture: null,
    address: "789 Broadway, New York, NY",
    phone: "(123) 456-7895",
    emergencyContact: "Lisa Chen (Wife) - (123) 456-7896",
    medicalHistory: [
      { condition: "Type 2 Diabetes", diagnosedYear: 2015, status: "Managed" },
      { condition: "High Cholesterol", diagnosedYear: 2015, status: "Ongoing" }
    ]
  },
  {
    id: "p3",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    age: 42,
    gender: "Female",
    bloodType: "B-",
    picture: null,
    address: "321 Oak Street, New York, NY",
    phone: "(123) 456-7897",
    emergencyContact: "David Wilson (Brother) - (123) 456-7898",
    medicalHistory: [
      { condition: "Asthma", diagnosedYear: 2005, status: "Managed" },
      { condition: "Migraine", diagnosedYear: 2012, status: "Recurring" }
    ]
  },
  {
    id: "p4",
    name: "James Jackson",
    email: "james.jackson@example.com",
    age: 29,
    gender: "Male",
    bloodType: "AB+",
    picture: null,
    address: "654 Pine Road, New York, NY",
    phone: "(123) 456-7899",
    emergencyContact: "Mary Jackson (Mother) - (123) 456-7900",
    medicalHistory: [
      { condition: "Seasonal Allergies", diagnosedYear: 2016, status: "Seasonal" }
    ]
  },
  {
    id: "p5",
    name: "Sarah Johnson",
    email: "sarah.patient@example.com",
    age: 45,
    gender: "Female",
    bloodType: "A-",
    picture: null,
    address: "987 Maple Avenue, New York, NY",
    phone: "(123) 456-7901",
    emergencyContact: "Michael Johnson (Husband) - (123) 456-7902",
    medicalHistory: [
      { condition: "Hypothyroidism", diagnosedYear: 2014, status: "Managed" },
      { condition: "Osteoporosis", diagnosedYear: 2019, status: "Ongoing" }
    ]
  }
];

// Appointment data
export const appointments = [
  // Today's appointments
  {
    id: "a1",
    patientId: "p1",
    doctorId: "d1",
    date: new Date(),
    time: "09:30 AM",
    type: "Check-up",
    status: "scheduled",
    notes: "Regular check-up with blood pressure monitoring"
  },
  {
    id: "a2",
    patientId: "p2",
    doctorId: "d1",
    date: new Date(),
    time: "11:00 AM",
    type: "Follow-up",
    status: "scheduled",
    notes: "Follow-up on diabetes management and medication review"
  },
  {
    id: "a3",
    patientId: "p3",
    doctorId: "d1",
    date: new Date(),
    time: "02:15 PM",
    type: "Consultation",
    status: "scheduled",
    notes: "Initial consultation regarding recurring migraines"
  },
  
  // Upcoming appointments
  {
    id: "a4",
    patientId: "p4",
    doctorId: "d1",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    time: "10:00 AM",
    type: "Check-up",
    status: "scheduled",
    notes: "Annual physical examination"
  },
  {
    id: "a5",
    patientId: "p5",
    doctorId: "d1",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    time: "03:30 PM",
    type: "Follow-up",
    status: "scheduled",
    notes: "Thyroid medication follow-up"
  },
  
  // Past appointments
  {
    id: "a6",
    patientId: "p1",
    doctorId: "d1",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    time: "02:00 PM",
    type: "Check-up",
    status: "completed",
    notes: "Patient reported feeling better. Blood pressure: 120/80."
  },
  {
    id: "a7",
    patientId: "p2",
    doctorId: "d1",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    time: "11:30 AM",
    type: "Urgent Care",
    status: "completed",
    notes: "Patient complained of chest pains. ECG normal. Advised rest and stress reduction."
  }
];

// Patient Appointment View (for Patient Dashboard)
export const patientAppointments = [
  {
    id: "pa1",
    doctor: "Dr. John Smith",
    specialty: "Cardiologist",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: "02:30 PM",
    type: "Check-up",
    status: "scheduled",
    location: "Main Clinic - Room 105"
  },
  {
    id: "pa2",
    doctor: "Dr. Sarah Johnson",
    specialty: "Dermatologist",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    time: "11:00 AM",
    type: "Consultation",
    status: "scheduled",
    location: "Dermatology Center - Room 3B"
  },
  {
    id: "pa3",
    doctor: "Dr. John Smith",
    specialty: "Cardiologist",
    date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
    time: "09:15 AM",
    type: "Follow-up",
    status: "completed",
    location: "Main Clinic - Room 105"
  }
];

// Prescription data
export const prescriptions = [
  {
    id: "pr1",
    patientId: "p1",
    doctorId: "d1",
    medication: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    duration: "30 days",
    issued: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    instructions: "Take one tablet daily in the morning",
    refills: 2
  },
  {
    id: "pr2",
    patientId: "p1",
    doctorId: "d1",
    medication: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    duration: "10 days",
    issued: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    instructions: "Take one capsule three times a day with meals",
    refills: 0
  },
  {
    id: "pr3",
    patientId: "p2",
    doctorId: "d1",
    medication: "Metformin",
    dosage: "850mg",
    frequency: "Twice daily",
    duration: "90 days",
    issued: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    instructions: "Take one tablet twice a day with meals",
    refills: 3
  },
  {
    id: "pr4",
    patientId: "p2",
    doctorId: "d1",
    medication: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    duration: "90 days",
    issued: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    instructions: "Take one tablet at bedtime",
    refills: 3
  },
  {
    id: "pr5",
    patientId: "p3",
    doctorId: "d1",
    medication: "Albuterol",
    dosage: "90mcg",
    frequency: "As needed",
    duration: "30 days",
    issued: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    instructions: "Use inhaler as needed for shortness of breath, 2 puffs",
    refills: 1
  }
];

// Medication Reminders (for Patient Dashboard)
export const medicationReminders = [
  {
    id: "mr1",
    patientId: "p1",
    medication: "Lisinopril",
    time: "08:00 AM",
    taken: true
  },
  {
    id: "mr2",
    patientId: "p1",
    medication: "Amoxicillin",
    time: "08:00 AM",
    taken: true
  },
  {
    id: "mr3",
    patientId: "p1",
    medication: "Amoxicillin",
    time: "02:00 PM",
    taken: false
  },
  {
    id: "mr4",
    patientId: "p1",
    medication: "Amoxicillin",
    time: "08:00 PM",
    taken: false
  }
];

// Inventory data
export const inventory = [
  {
    id: "i1",
    name: "Amoxicillin 500mg",
    category: "Antibiotic",
    inStock: 15,
    threshold: 20,
    unit: "Capsules",
    supplier: "Pharma Supplies Inc.",
    reorderStatus: "urgent"
  },
  {
    id: "i2",
    name: "Lisinopril 10mg",
    category: "Antihypertensive",
    inStock: 45,
    threshold: 25,
    unit: "Tablets",
    supplier: "MediSource Ltd.",
    reorderStatus: "good"
  },
  {
    id: "i3",
    name: "Metformin 850mg",
    category: "Antidiabetic",
    inStock: 32,
    threshold: 30,
    unit: "Tablets",
    supplier: "MediSource Ltd.",
    reorderStatus: "good"
  },
  {
    id: "i4",
    name: "Atorvastatin 20mg",
    category: "Statin",
    inStock: 22,
    threshold: 20,
    unit: "Tablets",
    supplier: "Pharma Supplies Inc.",
    reorderStatus: "warning"
  },
  {
    id: "i5",
    name: "Albuterol Inhaler",
    category: "Bronchodilator",
    inStock: 8,
    threshold: 15,
    unit: "Inhalers",
    supplier: "MediSource Ltd.",
    reorderStatus: "urgent"
  },
  {
    id: "i6",
    name: "Disposable Syringes",
    category: "Medical Supply",
    inStock: 12,
    threshold: 30,
    unit: "Syringes",
    supplier: "Medical Essentials Co.",
    reorderStatus: "urgent"
  },
  {
    id: "i7",
    name: "Examination Gloves",
    category: "Medical Supply",
    inStock: 150,
    threshold: 100,
    unit: "Pairs",
    supplier: "Medical Essentials Co.",
    reorderStatus: "good"
  },
  {
    id: "i8",
    name: "Surgical Masks",
    category: "Medical Supply",
    inStock: 75,
    threshold: 50,
    unit: "Masks",
    supplier: "Medical Essentials Co.",
    reorderStatus: "good"
  }
];

// Medical test results
export const testResults = [
  {
    id: "t1",
    patientId: "p1",
    doctorId: "d1",
    testName: "Complete Blood Count",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    fileUrl: "#",
    status: "completed",
    summary: "Normal results. White blood cell count slightly elevated but within acceptable range.",
    criticalValue: false
  },
  {
    id: "t2",
    patientId: "p1",
    doctorId: "d1",
    testName: "Lipid Panel",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    fileUrl: "#",
    status: "completed",
    summary: "Cholesterol levels slightly elevated. LDL: 135 mg/dL (high), HDL: 45 mg/dL (good), Triglycerides: 150 mg/dL (borderline high).",
    criticalValue: false
  },
  {
    id: "t3",
    patientId: "p2",
    doctorId: "d1",
    testName: "HbA1c",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    fileUrl: "#",
    status: "completed",
    summary: "HbA1c level at 7.2%. Indicates fair blood sugar control but room for improvement.",
    criticalValue: false
  },
  {
    id: "t4",
    patientId: "p3",
    doctorId: "d1",
    testName: "Chest X-Ray",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    fileUrl: "#",
    status: "completed",
    summary: "No significant findings. Lungs clear.",
    criticalValue: false
  },
  {
    id: "t5",
    patientId: "p4",
    doctorId: "d1",
    testName: "Allergy Panel",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    fileUrl: "#",
    status: "pending",
    summary: "Results pending lab analysis.",
    criticalValue: false
  }
];

// Messages data
export const messages = [
  {
    id: "m1",
    senderId: "p1", // patient
    receiverId: "d1", // doctor
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // 2 days and 30 minutes ago
    content: "Hello Dr. Smith, I've been experiencing some side effects from the new medication. Could we discuss this?",
    read: true
  },
  {
    id: "m2",
    senderId: "d1", // doctor
    receiverId: "p1", // patient
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    content: "Hello Jane, I'm sorry to hear that. What kind of side effects are you experiencing? Please provide details so I can help you better.",
    read: true
  },
  {
    id: "m3",
    senderId: "p1", // patient
    receiverId: "d1", // doctor
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 12 * 60 * 60 * 1000), // 1.5 days ago
    content: "I've been feeling dizzy and nauseous, especially in the morning after taking the medication.",
    read: true
  },
  {
    id: "m4",
    senderId: "d1", // doctor
    receiverId: "p1", // patient
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 11 * 60 * 60 * 1000), // 1.45 days ago
    content: "I see. Let's adjust your dosage. Take half a pill for the next three days and see if that helps with the side effects. If symptoms persist or worsen, please call the office immediately.",
    read: true
  },
  {
    id: "m5",
    senderId: "p1", // patient
    receiverId: "d1", // doctor
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    content: "Thank you Dr. Smith. I've been following your advice and the symptoms have improved. I'll continue with the adjusted dosage.",
    read: false
  },
  // Conversation with another patient
  {
    id: "m6",
    senderId: "p2", // patient
    receiverId: "d1", // doctor
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    content: "Dr. Smith, my blood sugar readings have been fluctuating more than usual this week. Should I be concerned?",
    read: true
  },
  {
    id: "m7",
    senderId: "d1", // doctor
    receiverId: "p2", // patient
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 3 days ago + 2 hours
    content: "Hello Robert. Have you been consistent with your diet and medication? Please send me your readings from the past week so I can review them.",
    read: true
  },
  {
    id: "m8",
    senderId: "p2", // patient
    receiverId: "d1", // doctor
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    content: "Yes, I've been following the diet plan and taking medications as prescribed. Here are my readings: Monday: 140, Tuesday: 165, Wednesday: 130, Thursday: 175, Friday: 145",
    read: true
  },
  {
    id: "m9",
    senderId: "d1", // doctor
    receiverId: "p2", // patient
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000), // 2 days ago + 1 hour
    content: "Thank you for sharing. There is some fluctuation, but it's not severely concerning. Let's discuss this further during your appointment next week. In the meantime, please try to note what you eat before the higher readings.",
    read: false
  }
];

// Helper functions to get data
export const getTodaysAppointments = (doctorId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime() && appointment.doctorId === doctorId;
  }).map(appointment => {
    const patient = patients.find(p => p.id === appointment.patientId);
    return {
      ...appointment,
      patient: patient ? patient.name : "Unknown Patient"
    };
  });
};

export const getUpcomingAppointments = (doctorId: string, limit = 5) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() >= today.getTime() && appointment.doctorId === doctorId;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit)
    .map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      return {
        ...appointment,
        patient: patient ? patient.name : "Unknown Patient"
      };
    });
};

export const getRecentPatients = (doctorId: string, limit = 5) => {
  // Get unique patient IDs from recent appointments
  const patientIds = new Set(
    appointments
      .filter(a => a.doctorId === doctorId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map(a => a.patientId)
  );
  
  // Get the patient details
  return Array.from(patientIds)
    .slice(0, limit)
    .map(id => {
      const patient = patients.find(p => p.id === id);
      if (!patient) return null;
      
      // Find most recent appointment for this patient
      const lastAppointment = appointments
        .filter(a => a.patientId === id && a.doctorId === doctorId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        lastVisit: lastAppointment ? new Date(lastAppointment.date) : null
      };
    })
    .filter(Boolean);
};

export const getLowInventoryItems = (threshold = "warning", limit = 5) => {
  return inventory
    .filter(item => {
      if (threshold === "urgent") return item.reorderStatus === "urgent";
      return item.reorderStatus === "urgent" || item.reorderStatus === "warning";
    })
    .slice(0, limit);
};

export const getUnreadMessageCount = (userId: string) => {
  return messages.filter(message => 
    message.receiverId === userId && !message.read
  ).length;
};

export const getPatientPrescriptions = (patientId: string) => {
  return prescriptions
    .filter(prescription => prescription.patientId === patientId)
    .map(prescription => {
      const doctor = doctors.find(d => d.id === prescription.doctorId);
      return {
        ...prescription,
        doctor: doctor ? doctor.name : "Unknown Doctor"
      };
    });
};

export const getPatientTestResults = (patientId: string) => {
  return testResults
    .filter(test => test.patientId === patientId)
    .map(test => {
      const doctor = doctors.find(d => d.id === test.doctorId);
      return {
        ...test,
        doctor: doctor ? doctor.name : "Unknown Doctor"
      };
    });
};

export const getPatientMedicationReminders = (patientId: string) => {
  return medicationReminders.filter(reminder => reminder.patientId === patientId);
};

// Get conversation between two users
export const getConversation = (user1Id: string, user2Id: string) => {
  return messages
    .filter(message => 
      (message.senderId === user1Id && message.receiverId === user2Id) || 
      (message.senderId === user2Id && message.receiverId === user1Id)
    )
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Mark messages as read
export const markMessagesAsRead = (receiverId: string, senderId: string) => {
  // In a real app, this would update the database
  // For our dummy data, we'll just return the updated messages
  return messages.map(message => {
    if (message.receiverId === receiverId && message.senderId === senderId && !message.read) {
      return { ...message, read: true };
    }
    return message;
  });
};

// Get a patient's doctors
export const getPatientDoctors = (patientId: string) => {
  // Get unique doctor IDs from appointments
  const doctorIds = new Set(
    appointments
      .filter(a => a.patientId === patientId)
      .map(a => a.doctorId)
  );
  
  // Get the doctor details
  return Array.from(doctorIds)
    .map(id => doctors.find(d => d.id === id))
    .filter(Boolean);
};

// Get all conversations for a user (preview for messages list)
export const getUserConversations = (userId: string) => {
  // Get unique conversation partners
  const conversationPartners = new Set([
    ...messages.filter(m => m.senderId === userId).map(m => m.receiverId),
    ...messages.filter(m => m.receiverId === userId).map(m => m.senderId)
  ]);
  
  return Array.from(conversationPartners).map(partnerId => {
    // Get the most recent message
    const conversationMessages = getConversation(userId, partnerId);
    const latestMessage = conversationMessages[conversationMessages.length - 1];
    
    // Get partner details (could be doctor or patient)
    const isDoctor = doctors.some(d => d.id === partnerId);
    const partner = isDoctor 
      ? doctors.find(d => d.id === partnerId)
      : patients.find(p => p.id === partnerId);
    
    // Count unread messages
    const unreadCount = messages.filter(
      m => m.receiverId === userId && m.senderId === partnerId && !m.read
    ).length;
    
    return {
      partnerId,
      partnerName: partner ? partner.name : "Unknown",
      partnerRole: isDoctor ? "doctor" : "patient",
      lastMessage: latestMessage ? latestMessage.content : "",
      timestamp: latestMessage ? latestMessage.timestamp : new Date(),
      unreadCount
    };
  })
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
