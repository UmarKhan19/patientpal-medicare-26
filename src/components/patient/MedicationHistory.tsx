import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, Check, X, Clock, AlertTriangle, Pill, Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonCustom } from "@/components/ui/button-custom";
import { formatDate } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MedicationDose {
  id: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  skipped: boolean;
  late: boolean;
}

interface MedicationDay {
  date: string;
  doses: MedicationDose[];
  compliance: number; // 0-100
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  image?: string;
  color?: string;
  history: MedicationDay[];
}

interface MedicationHistoryProps {
  medications: Medication[];
  patientId: string;
}

const MedicationHistory = ({ medications, patientId }: MedicationHistoryProps) => {
  const [activeTab, setActiveTab] = useState<string>("today");
  
  const getCompliance = (medication: Medication) => {
    const allDoses = medication.history.flatMap(day => day.doses);
    const takenDoses = allDoses.filter(dose => dose.taken).length;
    return (takenDoses / allDoses.length) * 100;
  };

  const getStatusIcon = (dose: MedicationDose) => {
    if (dose.taken) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (dose.skipped) {
      return <X className="h-4 w-4 text-red-500" />;
    } else if (dose.late) {
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    } else {
      return <Clock className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusText = (dose: MedicationDose) => {
    if (dose.taken) {
      return `Taken at ${dose.takenAt}`;
    } else if (dose.skipped) {
      return "Skipped";
    } else if (dose.late) {
      return "Late";
    } else {
      return "Scheduled";
    }
  };

  const getDayLabel = (date: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const medicationDate = new Date(date);
    
    if (medicationDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (medicationDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return formatDate(date);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="mr-2 h-5 w-5 text-primary" />
          Medication Schedule History
        </CardTitle>
        <CardDescription>
          Track medicine adherence and schedule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="animate-in fade-in-50 duration-300">
            <div className="space-y-6">
              {medications.map(medication => {
                const today = medication.history.find(day => 
                  new Date(day.date).toDateString() === new Date().toDateString()
                );
                
                if (!today) {
                  return (
                    <Card key={medication.id} className="bg-slate-50 border">
                      <CardContent className="pt-6">
                        <div className="text-center text-slate-500 py-3">
                          No medication scheduled for today
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
                
                return (
                  <Card key={medication.id} className="bg-slate-50 border">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                              medication.color || "bg-primary/10"
                            }`}
                          >
                            {medication.image ? (
                              <img 
                                src={medication.image} 
                                alt={medication.name}
                                className="w-6 h-6 object-contain" 
                              />
                            ) : (
                              <Pill className={`h-5 w-5 ${medication.color ? "text-white" : "text-primary"}`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{medication.name}</h3>
                            <p className="text-sm text-slate-600">{medication.dosage} - {medication.frequency}</p>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ButtonCustom variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Info className="h-4 w-4" />
                              </ButtonCustom>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{medication.instructions}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {today.doses.map(dose => (
                          <div 
                            key={dose.id} 
                            className={`flex items-center justify-between p-3 rounded-md ${
                              dose.taken ? "bg-green-50" : 
                              dose.skipped ? "bg-red-50" :
                              dose.late ? "bg-amber-50" : "bg-white"
                            } border`}
                          >
                            <div className="flex items-center">
                              <div className="mr-3">
                                {getStatusIcon(dose)}
                              </div>
                              <div>
                                <p className="font-medium">{dose.time}</p>
                                <p className="text-xs text-slate-600">{getStatusText(dose)}</p>
                              </div>
                            </div>
                            
                            {!dose.taken && !dose.skipped && (
                              <div className="flex space-x-2">
                                <ButtonCustom 
                                  variant="outline" 
                                  size="sm"
                                  className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <X className="h-3.5 w-3.5 mr-1" />
                                  Skip
                                </ButtonCustom>
                                <ButtonCustom 
                                  size="sm"
                                  className="h-8"
                                >
                                  <Check className="h-3.5 w-3.5 mr-1" />
                                  Take
                                </ButtonCustom>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="animate-in fade-in-50 duration-300">
            <div className="space-y-6">
              {medications.map(medication => {
                // Get last 7 days
                const lastWeek = medication.history
                  .filter(day => {
                    const date = new Date(day.date);
                    const now = new Date();
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo && date <= now;
                  })
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                return (
                  <Card key={medication.id} className="bg-slate-50 border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                              medication.color || "bg-primary/10"
                            }`}
                          >
                            {medication.image ? (
                              <img 
                                src={medication.image} 
                                alt={medication.name}
                                className="w-6 h-6 object-contain" 
                              />
                            ) : (
                              <Pill className={`h-5 w-5 ${medication.color ? "text-white" : "text-primary"}`} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{medication.name}</h3>
                            <p className="text-sm text-slate-600">{medication.dosage} - {medication.frequency}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">Compliance</div>
                          <div className={`text-lg font-bold ${
                            getCompliance(medication) >= 80 ? "text-green-600" :
                            getCompliance(medication) >= 50 ? "text-amber-600" : "text-red-600"
                          }`}>
                            {getCompliance(medication).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {lastWeek.map(day => (
                          <div key={day.date} className="border rounded-md">
                            <div className="p-3 bg-slate-100 border-b flex items-center justify-between">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="font-medium">{getDayLabel(day.date)}</span>
                              </div>
                              <div className="text-sm">
                                Taken: {day.doses.filter(d => d.taken).length}/{day.doses.length}
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {day.doses.map(dose => (
                                  <div 
                                    key={dose.id} 
                                    className={`p-2 rounded border ${
                                      dose.taken ? "bg-green-50 border-green-200" : 
                                      dose.skipped ? "bg-red-50 border-red-200" :
                                      dose.late ? "bg-amber-50 border-amber-200" : "bg-white"
                                    }`}
                                  >
                                    <div className="flex items-center mb-1">
                                      {getStatusIcon(dose)}
                                      <span className="text-sm font-medium ml-1">{dose.time}</span>
                                    </div>
                                    <div className="text-xs text-slate-600">
                                      {getStatusText(dose)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {lastWeek.length === 0 && (
                          <div className="text-center text-slate-500 py-8">
                            No medication history for this week
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="animate-in fade-in-50 duration-300">
            <div className="space-y-6">
              {medications.map(medication => {
                // Get the monthly view with compliance stats
                return (
                  <Card key={medication.id} className="bg-slate-50 border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                              medication.color || "bg-primary/10"
                            }`}
                          >
                            {medication.image ? (
                              <img 
                                src={medication.image} 
                                alt={medication.name}
                                className="w-6 h-6 object-contain" 
                              />
                            ) : (
                              <Pill className={`h-5 w-5 ${medication.color ? "text-white" : "text-primary"}`} />
                            )}
                          </div>
                          <div>
                            <CardTitle>{medication.name}</CardTitle>
                            <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium mb-3">Monthly Compliance</h3>
                        <div className="bg-slate-100 h-4 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              getCompliance(medication) >= 80 ? "bg-green-500" :
                              getCompliance(medication) >= 50 ? "bg-amber-500" : "bg-red-500"
                            }`}
                            style={{ width: `${getCompliance(medication)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                          <span>0%</span>
                          <span className={`font-medium ${
                            getCompliance(medication) >= 80 ? "text-green-600" :
                            getCompliance(medication) >= 50 ? "text-amber-600" : "text-red-600"
                          }`}>
                            {getCompliance(medication).toFixed(0)}%
                          </span>
                          <span>100%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium mb-3">Monthly Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <Card className="bg-green-50 border-green-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-green-700">Taken</div>
                                <Check className="h-4 w-4 text-green-500" />
                              </div>
                              <div className="text-2xl font-bold text-green-700 mt-1">
                                {medication.history.flatMap(d => d.doses).filter(d => d.taken).length}
                              </div>
                              <div className="text-xs text-green-600 mt-1">doses</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-red-50 border-red-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-red-700">Missed</div>
                                <X className="h-4 w-4 text-red-500" />
                              </div>
                              <div className="text-2xl font-bold text-red-700 mt-1">
                                {medication.history.flatMap(d => d.doses).filter(d => d.skipped).length}
                              </div>
                              <div className="text-xs text-red-600 mt-1">doses</div>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-amber-700">Late</div>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                              </div>
                              <div className="text-2xl font-bold text-amber-700 mt-1">
                                {medication.history.flatMap(d => d.doses).filter(d => d.late).length}
                              </div>
                              <div className="text-xs text-amber-600 mt-1">doses</div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MedicationHistory;
