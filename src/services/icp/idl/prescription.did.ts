
export const idlFactory = ({ IDL }: any) => {
  const Medication = IDL.Record({
    'name': IDL.Text,
    'dosage': IDL.Text,
    'frequency': IDL.Text,
    'duration': IDL.Text,
  });
  
  const Test = IDL.Record({
    'name': IDL.Text,
    'instructions': IDL.Opt(IDL.Text),
  });
  
  const Prescription = IDL.Record({
    'id': IDL.Text,
    'patientId': IDL.Text,
    'doctorId': IDL.Text,
    'date': IDL.Text,
    'medications': IDL.Vec(Medication),
    'tests': IDL.Vec(Test),
    'notes': IDL.Text,
    'symptoms': IDL.Text,
    'diagnosis': IDL.Text,
    'height': IDL.Opt(IDL.Float64),
    'weight': IDL.Opt(IDL.Float64),
    'bloodPressure': IDL.Opt(IDL.Text),
    'temperature': IDL.Opt(IDL.Float64),
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });
  
  return IDL.Service({
    'createPrescription': IDL.Func([Prescription], [IDL.Text], []),
    'getPrescription': IDL.Func([IDL.Text], [IDL.Opt(Prescription)], ['query']),
    'updatePrescription': IDL.Func([Prescription], [IDL.Bool], []),
    'deletePrescription': IDL.Func([IDL.Text], [IDL.Bool], []),
    'getPrescriptionsByPatient': IDL.Func([IDL.Text], [IDL.Vec(Prescription)], ['query']),
    'getPrescriptionsByDoctor': IDL.Func([IDL.Text], [IDL.Vec(Prescription)], ['query']),
  });
};
