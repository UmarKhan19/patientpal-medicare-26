
export const idlFactory = ({ IDL }: any) => {
  const Patient = IDL.Record({
    'id': IDL.Text,
    'name': IDL.Text,
    'email': IDL.Text,
    'dateOfBirth': IDL.Text,
    'gender': IDL.Text,
    'contactNumber': IDL.Text,
    'address': IDL.Text,
    'bloodGroup': IDL.Opt(IDL.Text),
    'allergies': IDL.Opt(IDL.Text),
    'emergencyContact': IDL.Opt(IDL.Text),
    'insuranceInfo': IDL.Opt(IDL.Text),
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });
  
  return IDL.Service({
    'createPatient': IDL.Func([Patient], [IDL.Text], []),
    'getPatient': IDL.Func([IDL.Text], [IDL.Opt(Patient)], ['query']),
    'updatePatient': IDL.Func([Patient], [IDL.Bool], []),
    'deletePatient': IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllPatients': IDL.Func([], [IDL.Vec(Patient)], ['query']),
    'searchPatients': IDL.Func([IDL.Text], [IDL.Vec(Patient)], ['query']),
  });
};
