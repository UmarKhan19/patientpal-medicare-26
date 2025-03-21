
export const idlFactory = ({ IDL }: any) => {
  const MedicalTest = IDL.Record({
    'id': IDL.Text,
    'patientId': IDL.Text,
    'doctorId': IDL.Text,
    'name': IDL.Text,
    'date': IDL.Text,
    'result': IDL.Opt(IDL.Text),
    'status': IDL.Text,
    'recommendations': IDL.Opt(IDL.Text),
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });
  
  return IDL.Service({
    'createTest': IDL.Func([MedicalTest], [IDL.Text], []),
    'getTest': IDL.Func([IDL.Text], [IDL.Opt(MedicalTest)], ['query']),
    'updateTest': IDL.Func([MedicalTest], [IDL.Bool], []),
    'deleteTest': IDL.Func([IDL.Text], [IDL.Bool], []),
    'getTestsByPatient': IDL.Func([IDL.Text], [IDL.Vec(MedicalTest)], ['query']),
    'getTestsByDoctor': IDL.Func([IDL.Text], [IDL.Vec(MedicalTest)], ['query']),
    'getTestsByStatus': IDL.Func([IDL.Text], [IDL.Vec(MedicalTest)], ['query']),
  });
};
