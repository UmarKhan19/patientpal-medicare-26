
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { doctors } from "@/lib/dummy-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

// Get unique specialties from dummy data
const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

// Calculate price range from dummy data
const allPrices = doctors.map(doctor => doctor.consultationFee || 100);
const minPrice = Math.min(...allPrices);
const maxPrice = Math.max(...allPrices);

interface DoctorFilterProps {
  onFilterChange: (filters: {
    specialty: string | null;
    gender: string | null;
    priceRange: [number, number];
    rating: number | null;
  }) => void;
}

const DoctorFilter = ({ onFilterChange }: DoctorFilterProps) => {
  const [open, setOpen] = useState(false);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [rating, setRating] = useState<number | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    // Update active filters list
    const newActiveFilters: string[] = [];
    if (specialty) newActiveFilters.push(`Specialty: ${specialty}`);
    if (gender) newActiveFilters.push(`Gender: ${gender}`);
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) 
      newActiveFilters.push(`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`);
    if (rating) newActiveFilters.push(`Min Rating: ${rating}★`);
    
    setActiveFilters(newActiveFilters);
    
    // Notify parent component with the updated filters
    onFilterChange({
      specialty,
      gender,
      priceRange,
      rating
    });
    
    // Show toast if filters are applied or changed
    if (newActiveFilters.length > 0 && JSON.stringify(newActiveFilters) !== JSON.stringify(activeFilters)) {
      toast.success("Filters applied successfully");
    }
  }, [specialty, gender, priceRange, rating, onFilterChange, activeFilters]);

  const handlePriceChange = (value: number[]) => {
    if (value.length >= 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const clearFilters = () => {
    setSpecialty(null);
    setGender(null);
    setPriceRange([minPrice, maxPrice]);
    setRating(null);
    toast.success("All filters cleared");
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Specialty:")) setSpecialty(null);
    else if (filter.startsWith("Gender:")) setGender(null);
    else if (filter.startsWith("Price:")) setPriceRange([minPrice, maxPrice]);
    else if (filter.startsWith("Min Rating:")) setRating(null);
    toast.success("Filter removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) => (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {filter}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-2"
              onClick={() => removeFilter(filter)}
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex items-center justify-between w-full md:w-auto"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter Doctors
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Card className="border-0 shadow-none">
            <CardHeader className="px-4 pb-2 pt-3">
              <CardTitle className="text-md">Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 space-y-4">
              <div className="space-y-2">
                <Label>Specialty</Label>
                <Command>
                  <CommandInput placeholder="Search specialty..." />
                  <CommandEmpty>No specialty found.</CommandEmpty>
                  <CommandGroup className="max-h-60 overflow-y-auto">
                    {specialties.map((item) => (
                      <CommandItem
                        key={item}
                        value={item}
                        onSelect={() => {
                          setSpecialty(specialty === item ? null : item);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            specialty === item ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant={gender === "Male" ? "default" : "outline"}
                    onClick={() => setGender(gender === "Male" ? null : "Male")}
                    className="flex-1"
                  >
                    Male
                  </Button>
                  <Button
                    size="sm"
                    variant={gender === "Female" ? "default" : "outline"}
                    onClick={() => setGender(gender === "Female" ? null : "Female")}
                    className="flex-1"
                  >
                    Female
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Price Range</Label>
                  <span className="text-sm text-slate-500">
                    {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </span>
                </div>
                <Slider
                  defaultValue={[minPrice, maxPrice]}
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>Minimum Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      size="sm"
                      variant={rating === star ? "default" : "outline"}
                      onClick={() => setRating(rating === star ? null : star)}
                      className="flex-1"
                    >
                      {star}★
                    </Button>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={clearFilters} className="w-full mt-2">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DoctorFilter;
