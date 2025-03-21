
import { ButtonCustom } from "@/components/ui/button-custom";
import { Link } from "react-router-dom";
import DoctorSearchEnhanced from "./DoctorSearchEnhanced";

const DoctorSearch = ({ onTabChange }: { onTabChange?: (tab: string) => void }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <DoctorSearchEnhanced onTabChange={onTabChange} />
      
      <div className="text-center mt-4">
        <p className="text-sm text-slate-500 mb-2">
          Need to browse all doctors by specialty?
        </p>
        <Link to="/patient">
          <ButtonCustom variant="outline" size="sm">
            Back to Dashboard
          </ButtonCustom>
        </Link>
      </div>
    </div>
  );
};

export default DoctorSearch;
