import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ButtonCustom } from '@/components/ui/button-custom';
import { Search, Calendar, UserCircle, CheckCircle, Stethoscope, Star } from 'lucide-react';
import { doctors } from '@/lib/dummy-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DoctorFilter from './DoctorFilter';
import { formatPrice } from '@/lib/utils';

const specialtyKeywords: Record<string, string[]> = {
  'Cardiologist': ['heart', 'cardiac', 'chest pain', 'cardiovascular'],
  'Dermatologist': ['skin', 'rash', 'acne', 'eczema'],
  'Orthopedic': ['bone', 'joint', 'knee', 'fracture', 'back pain'],
  'ENT': ['ear', 'nose', 'throat', 'hearing', 'sinus', 'tonsil'],
  'Ophthalmologist': ['eye', 'vision', 'glasses', 'cataract'],
  'Neurologist': ['brain', 'nerve', 'headache', 'migraine'],
  'Psychiatrist': ['mental', 'anxiety', 'depression', 'stress'],
  'Gynecologist': ['womens health', 'pregnancy', 'menstrual'],
  'Pediatrician': ['child', 'kid', 'baby', 'children'],
  'Urologist': ['urinary', 'bladder', 'kidney', 'prostate'],
};

const appointmentSchema = z.object({
  doctorId: z.string({ required_error: "Please select a doctor" }),
  date: z.string({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time" }),
  type: z.string({ required_error: "Please select an appointment type" }),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface FilterOptions {
  specialty: string | null;
  gender: string | null;
  priceRange: [number, number];
  rating: number | null;
}

const DoctorSearchEnhanced = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<typeof doctors>([]);
  const [filteredResults, setFilteredResults] = useState<typeof doctors>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    specialty: null,
    gender: null,
    priceRange: [0, 500],
    rating: null
  });
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: '',
      date: '',
      time: '',
      type: '',
    },
  });

  useEffect(() => {
    let results = [...doctors];
    
    if (searchTerm.trim().length > 0) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      results = results.filter(doctor => 
        doctor.specialty.toLowerCase().includes(lowerSearchTerm) ||
        doctor.name.toLowerCase().includes(lowerSearchTerm)
      );
      
      if (results.length === 0) {
        const matchingSpecialties = Object.entries(specialtyKeywords).filter(([specialty, keywords]) => 
          keywords.some(keyword => lowerSearchTerm.includes(keyword))
        ).map(([specialty]) => specialty);
        
        if (matchingSpecialties.length > 0) {
          results = doctors.filter(doctor => 
            matchingSpecialties.some(specialty => 
              doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
            )
          );
        }
      }
    }
    
    setSearchResults(results);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = [...searchResults];
    
    if (filterOptions.specialty) {
      filtered = filtered.filter(doctor => 
        doctor.specialty === filterOptions.specialty
      );
    }
    
    if (filterOptions.gender) {
      filtered = filtered.filter(doctor => 
        doctor.gender === filterOptions.gender
      );
    }
    
    filtered = filtered.filter(doctor => {
      const fee = doctor.consultationFee || 100;
      return fee >= filterOptions.priceRange[0] && fee <= filterOptions.priceRange[1];
    });
    
    if (filterOptions.rating) {
      filtered = filtered.filter(doctor => 
        (doctor.rating || 0) >= (filterOptions.rating || 0)
      );
    }
    
    setFilteredResults(filtered);
  }, [searchResults, filterOptions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setFilterOptions(filters);
  };

  const openBookingDialog = (doctor: any) => {
    setSelectedDoctor(doctor);
    setBookingOpen(true);
    form.reset({
      doctorId: doctor.id,
      date: '',
      time: '',
      type: '',
    });
  };

  const onSubmit = (data: AppointmentFormValues) => {
    console.log("Booking appointment with data:", data);
    
    toast.success(`Your appointment with Dr. ${selectedDoctor.name} has been scheduled for ${data.date} at ${data.time}.`);
    
    setBookingOpen(false);
    setSelectedDoctor(null);
    
    if (onTabChange) {
      onTabChange("appointments");
    }
  };

  const availableTimes = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
  });

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const appointmentTypes = [
    "Check-up",
    "Consultation",
    "Follow-up",
    "Specialist Referral",
    "Emergency",
  ];

  return (
    <div className="relative space-y-4">
      <form onSubmit={handleSearch} className="relative mb-4">
        <Input
          type="text"
          placeholder="Search for specialists or describe your health concern (e.g., ear problem)..."
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

      <DoctorFilter onFilterChange={handleFilterChange} />

      {searchTerm && (
        <div className="text-sm text-slate-500 mb-2">
          {filteredResults.length > 0 
            ? `Found ${filteredResults.length} doctor${filteredResults.length > 1 ? 's' : ''}`
            : `No doctors found matching your criteria`
          }
        </div>
      )}

      <div className="space-y-4 mt-4">
        {filteredResults.map((doctor) => (
          <div key={doctor.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center mb-3 sm:mb-0">
              {doctor.picture ? (
                <img
                  src={doctor.picture}
                  alt={doctor.name}
                  className="h-12 w-12 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">Dr. {doctor.name}</h3>
                <p className="text-slate-600">{doctor.specialty}</p>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-3 w-3 ${
                          star <= (doctor.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">
                    ({doctor.reviewCount || 0} reviews)
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">{doctor.location}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <p className="font-medium text-lg text-primary">
                {formatPrice(doctor.consultationFee || 100)}
              </p>
              <ButtonCustom onClick={() => openBookingDialog(doctor)}>
                <Calendar className="h-4 w-4 mr-2" /> 
                Book Appointment
              </ButtonCustom>
            </div>
          </div>
        ))}

        {!searchTerm && filteredResults.length === 0 && (
          <div className="text-center p-6 bg-slate-50 rounded-lg">
            <Stethoscope className="h-12 w-12 mx-auto text-slate-300 mb-2" />
            <h3 className="text-lg font-medium mb-1">Find the Right Specialist</h3>
            <p className="text-slate-600">
              Search for a health concern (like "ear problem" or "heart issue") or enter a doctor's name.
            </p>
          </div>
        )}
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book an Appointment</DialogTitle>
            <DialogDescription>
              {selectedDoctor && (
                <div className="flex items-center mt-2">
                  {selectedDoctor.picture ? (
                    <img
                      src={selectedDoctor.picture}
                      alt={selectedDoctor.name}
                      className="h-10 w-10 rounded-full mr-3 object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <UserCircle className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">Dr. {selectedDoctor.name}</p>
                    <p className="text-sm text-slate-600">{selectedDoctor.specialty}</p>
                    <p className="text-sm font-medium text-primary mt-1">
                      {formatPrice(selectedDoctor.consultationFee || 100)} per visit
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableDates.map((date) => (
                          <SelectItem key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <ButtonCustom variant="outline" type="button" onClick={() => setBookingOpen(false)}>
                  Cancel
                </ButtonCustom>
                <ButtonCustom type="submit">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking ({formatPrice(selectedDoctor?.consultationFee || 100)})
                </ButtonCustom>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorSearchEnhanced;
