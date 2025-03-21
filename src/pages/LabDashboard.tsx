
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ButtonCustom } from "@/components/ui/button-custom";
import { 
  Search, Upload, FileText, Check, X, Clock, Filter
} from "lucide-react";
import { getLabTests, labTechnicians } from "@/lib/dummy-data";
import { formatDate, getStatusColor } from "@/lib/utils";

const LabDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  
  const allTests = getLabTests();
  const pendingTests = allTests.filter(test => test.status === "Pending");
  const completedTests = allTests.filter(test => test.status === "Completed");

  const filteredTests = activeTab === "pending" 
    ? pendingTests.filter(test => 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.referredBy.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : completedTests.filter(test => 
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.referredBy.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <Dashboard requiredRole="lab">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2">Lab Test Dashboard</h1>
        <p className="text-slate-600">Manage patient test reports</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tests by patient name, test type, or doctor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-slate-100 rounded-lg">
          <TabsTrigger 
            value="pending" 
            className={`py-3 ${activeTab === "pending" ? "bg-white shadow-sm" : ""}`}
          >
            Pending Tests
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className={`py-3 ${activeTab === "completed" ? "bg-white shadow-sm" : ""}`}
          >
            Completed Tests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Pending Lab Tests</CardTitle>
              <CardDescription>Tests that need to be processed and uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTests.length > 0 ? (
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-medium text-lg">{test.testName}</h3>
                        <p className="text-sm text-slate-600">Patient: {test.patientName}</p>
                        <p className="text-sm text-slate-600">Referred by: Dr. {test.referredBy}</p>
                        <div className="flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1 text-amber-500" />
                          <p className="text-sm text-amber-600">
                            Requested on: {formatDate(test.requestDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <ButtonCustom variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </ButtonCustom>
                        <ButtonCustom size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Results
                        </ButtonCustom>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FileText className="h-16 w-16 mb-4 text-slate-300" />
                  <p className="text-lg font-medium mb-1">No pending tests found</p>
                  <p className="text-sm">All tests have been processed or no tests match your search</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Completed Lab Tests</CardTitle>
              <CardDescription>Test results that have been uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTests.length > 0 ? (
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="mb-4 md:mb-0">
                        <h3 className="font-medium text-lg">{test.testName}</h3>
                        <p className="text-sm text-slate-600">Patient: {test.patientName}</p>
                        <p className="text-sm text-slate-600">Referred by: Dr. {test.referredBy}</p>
                        <div className="flex items-center mt-1">
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          <p className="text-sm text-green-600">
                            Completed on: {formatDate(test.completionDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <ButtonCustom variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </ButtonCustom>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <FileText className="h-16 w-16 mb-4 text-slate-300" />
                  <p className="text-lg font-medium mb-1">No completed tests found</p>
                  <p className="text-sm">No tests have been completed yet or no tests match your search</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default LabDashboard;
