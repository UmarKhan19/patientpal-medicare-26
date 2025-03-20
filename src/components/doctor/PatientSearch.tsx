
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Search, UserCircle } from 'lucide-react';
import { searchPatientsByName } from '@/lib/dummy-data';

interface PatientSearchProps {
  placeholder?: string;
  onlyRecent?: boolean;
}

const PatientSearch: React.FC<PatientSearchProps> = ({ 
  placeholder = "Search patients by name...",
  onlyRecent = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const results = searchPatientsByName(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // This is already handled by the useEffect
  };

  const viewPatientProfile = (patientId: string) => {
    navigate(`/doctor/patient/${patientId}`);
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <ButtonCustom
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10"
        >
          <Search className="h-4 w-4" />
        </ButtonCustom>
      </form>

      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border">
          {searchResults.map((patient) => (
            <div
              key={patient.id}
              className="p-2 hover:bg-slate-100 cursor-pointer flex items-center"
              onClick={() => viewPatientProfile(patient.id)}
            >
              {patient.picture ? (
                <img
                  src={patient.picture}
                  alt={patient.name}
                  className="h-8 w-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">{patient.name}</p>
                <p className="text-xs text-slate-500">ID: {patient.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSearching && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-4 text-center border">
          No patients found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
