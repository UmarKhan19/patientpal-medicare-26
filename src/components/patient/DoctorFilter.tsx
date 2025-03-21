
import { useState } from "react";
import { Filter, X, Check, Star } from "lucide-react";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export type FilterCriteria = {
  priceRange: [number, number];
  specialties: string[];
  experience: string | null;
  rating: number | null;
  availability: string[];
};

const defaultFilters: FilterCriteria = {
  priceRange: [0, 200],
  specialties: [],
  experience: null,
  rating: null,
  availability: [],
};

interface DoctorFilterProps {
  onFilterChange: (filters: FilterCriteria) => void;
  specialtiesList: string[];
  maxPrice: number;
}

const DoctorFilter = ({ onFilterChange, specialtiesList, maxPrice = 200 }: DoctorFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const experienceOptions = ["0-5 years", "5-10 years", "10+ years"];
  const availabilityOptions = ["Today", "Tomorrow", "This Week", "Weekends"];

  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    updateFilters({ ...filters, priceRange: newRange });
  };

  const toggleSpecialty = (specialty: string) => {
    const updatedSpecialties = filters.specialties.includes(specialty)
      ? filters.specialties.filter(s => s !== specialty)
      : [...filters.specialties, specialty];
    
    updateFilters({ ...filters, specialties: updatedSpecialties });
  };

  const toggleAvailability = (availability: string) => {
    const updatedAvailability = filters.availability.includes(availability)
      ? filters.availability.filter(a => a !== availability)
      : [...filters.availability, availability];
    
    updateFilters({ ...filters, availability: updatedAvailability });
  };

  const setExperience = (value: string) => {
    updateFilters({ ...filters, experience: filters.experience === value ? null : value });
  };

  const setRating = (value: number) => {
    updateFilters({ ...filters, rating: filters.rating === value ? null : value });
  };

  const updateFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPriceRange([0, maxPrice]);
    onFilterChange(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.specialties.length > 0) count++;
    if (filters.experience) count++;
    if (filters.rating) count++;
    if (filters.availability.length > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <ButtonCustom
          variant="outline"
          size="sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </ButtonCustom>
        
        {activeFilterCount > 0 && (
          <ButtonCustom
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-slate-500"
          >
            Reset
          </ButtonCustom>
        )}
      </div>

      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Doctors</h3>
            <ButtonCustom
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </ButtonCustom>
          </div>

          <div className="space-y-6">
            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="px-2">
                <Slider
                  defaultValue={[0, maxPrice]}
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={10}
                  onValueChange={handlePriceChange}
                  className="my-5"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">${priceRange[0]}</span>
                <span className="text-sm text-slate-600">${priceRange[1]}</span>
              </div>
            </div>

            <Separator />

            {/* Specialties */}
            <div>
              <h4 className="text-sm font-medium mb-2">Specialties</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {specialtiesList.map((specialty) => (
                  <div key={specialty} className="flex items-center">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={filters.specialties.includes(specialty)}
                      onCheckedChange={() => toggleSpecialty(specialty)}
                    />
                    <label
                      htmlFor={`specialty-${specialty}`}
                      className="text-sm ml-2 cursor-pointer"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Experience */}
            <div>
              <h4 className="text-sm font-medium mb-2">Experience</h4>
              <div className="flex flex-wrap gap-2">
                {experienceOptions.map((exp) => (
                  <ButtonCustom
                    key={exp}
                    variant={filters.experience === exp ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExperience(exp)}
                    className="h-8 text-xs"
                  >
                    {exp}
                  </ButtonCustom>
                ))}
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div>
              <h4 className="text-sm font-medium mb-2">Rating</h4>
              <div className="flex flex-wrap gap-2">
                {[4, 3, 2].map((rating) => (
                  <ButtonCustom
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRating(rating)}
                    className="h-8"
                  >
                    <div className="flex items-center">
                      <span className="mr-1">{rating}+</span>
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </ButtonCustom>
                ))}
              </div>
            </div>

            <Separator />

            {/* Availability */}
            <div>
              <h4 className="text-sm font-medium mb-2">Availability</h4>
              <div className="space-y-2">
                {availabilityOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <Checkbox
                      id={`availability-${option}`}
                      checked={filters.availability.includes(option)}
                      onCheckedChange={() => toggleAvailability(option)}
                    />
                    <label
                      htmlFor={`availability-${option}`}
                      className="text-sm ml-2 cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <ButtonCustom 
              className="w-full"
              onClick={() => setIsFilterOpen(false)}
            >
              <Check className="h-4 w-4 mr-2" />
              Apply Filters
            </ButtonCustom>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorFilter;
