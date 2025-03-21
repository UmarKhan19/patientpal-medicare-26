
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Trash2, HeartPulse, Save } from "lucide-react";

const prescriptionSchema = z.object({
  symptoms: z.string().min(3, "Symptoms must be at least 3 characters"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters"),
  height: z.string().regex(/^\d+(\.\d+)?$/, "Height must be a valid number"),
  weight: z.string().regex(/^\d+(\.\d+)?$/, "Weight must be a valid number"),
  bloodPressure: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
  medications: z.array(
    z.object({
      name: z.string().min(3, "Medication name must be at least 3 characters"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
      instructions: z.string().optional(),
    })
  ),
  tests: z.array(
    z.object({
      name: z.string().min(3, "Test name must be at least 3 characters"),
      instructions: z.string().optional(),
    })
  ),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PatientPrescriptionFormProps {
  patientId: string;
  patientName: string;
  existingPrescription?: PrescriptionFormValues;
  onSave?: (data: PrescriptionFormValues) => void;
  onCancel?: () => void;
}

const PatientPrescriptionForm = ({ 
  patientId, 
  patientName, 
  existingPrescription, 
  onSave, 
  onCancel 
}: PatientPrescriptionFormProps) => {
  const defaultValues: PrescriptionFormValues = existingPrescription || {
    symptoms: "",
    diagnosis: "",
    height: "",
    weight: "",
    bloodPressure: "",
    allergies: "",
    notes: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    tests: [],
  };

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues,
  });

  const medications = form.watch("medications");
  const tests = form.watch("tests");

  const addMedication = () => {
    const currentMedications = form.getValues("medications");
    form.setValue("medications", [
      ...currentMedications,
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const removeMedication = (index: number) => {
    const currentMedications = form.getValues("medications");
    form.setValue(
      "medications",
      currentMedications.filter((_, i) => i !== index)
    );
  };

  const addTest = () => {
    const currentTests = form.getValues("tests");
    form.setValue("tests", [...currentTests, { name: "", instructions: "" }]);
  };

  const removeTest = (index: number) => {
    const currentTests = form.getValues("tests");
    form.setValue(
      "tests",
      currentTests.filter((_, i) => i !== index)
    );
  };

  const onSubmit = (data: PrescriptionFormValues) => {
    console.log("Prescription data:", data);
    
    if (onSave) {
      onSave(data);
    }
    
    toast.success("Prescription saved successfully");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <HeartPulse className="mr-2 h-5 w-5 text-primary" />
          Medical Prescription for {patientName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Patient's symptoms" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Doctor's diagnosis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Pressure</FormLabel>
                      <FormControl>
                        <Input placeholder="120/80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any known allergies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Prescribed Medications</h3>
                    <ButtonCustom
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMedication}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Medication
                    </ButtonCustom>
                  </div>

                  <div className="space-y-4">
                    {medications.map((_, index) => (
                      <div key={index} className="p-3 border border-slate-200 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Medication #{index + 1}</h4>
                          {medications.length > 1 && (
                            <ButtonCustom
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedication(index)}
                              className="h-7 px-2 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </ButtonCustom>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`medications.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Medication name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`medications.${index}.dosage`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Dosage</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 500mg" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`medications.${index}.frequency`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Frequency</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Twice daily" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`medications.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Duration</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 7 days" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`medications.${index}.instructions`}
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel className="text-xs">Special Instructions</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Take with food, etc."
                                    className="min-h-[60px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Recommended Tests</h3>
                    <ButtonCustom
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTest}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Test
                    </ButtonCustom>
                  </div>

                  <div className="space-y-3">
                    {tests.map((_, index) => (
                      <div key={index} className="p-3 border border-slate-200 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Test #{index + 1}</h4>
                          <ButtonCustom
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTest(index)}
                            className="h-7 px-2 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ButtonCustom>
                        </div>

                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name={`tests.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Test Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Complete Blood Count" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tests.${index}.instructions`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs">Instructions</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Special instructions for this test"
                                    className="min-h-[60px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes or recommendations"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <ButtonCustom type="button" variant="outline" onClick={onCancel}>Cancel</ButtonCustom>
              <ButtonCustom type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Prescription
              </ButtonCustom>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PatientPrescriptionForm;
