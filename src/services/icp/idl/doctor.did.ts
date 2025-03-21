
export const idlFactory = ({ IDL }: any) => {
  const Doctor = IDL.Record({
    'id': IDL.Text,
    'name': IDL.Text,
    'email': IDL.Text,
    'specialty': IDL.Text,
    'qualification': IDL.Text,
    'experience': IDL.Nat,
    'hospitalAffiliation': IDL.Opt(IDL.Text),
    'contactNumber': IDL.Text,
    'address': IDL.Text,
    'workingHours': IDL.Text,
    'rating': IDL.Opt(IDL.Float64),
    'consultationFee': IDL.Opt(IDL.Nat),
    'createdAt': IDL.Nat64,
    'updatedAt': IDL.Nat64,
  });
  
  return IDL.Service({
    'createDoctor': IDL.Func([Doctor], [IDL.Text], []),
    'getDoctor': IDL.Func([IDL.Text], [IDL.Opt(Doctor)], ['query']),
    'updateDoctor': IDL.Func([Doctor], [IDL.Bool], []),
    'deleteDoctor': IDL.Func([IDL.Text], [IDL.Bool], []),
    'getAllDoctors': IDL.Func([], [IDL.Vec(Doctor)], ['query']),
    'searchDoctors': IDL.Func([IDL.Text], [IDL.Vec(Doctor)], ['query']),
    'getDoctorsBySpecialty': IDL.Func([IDL.Text], [IDL.Vec(Doctor)], ['query']),
  });
};
