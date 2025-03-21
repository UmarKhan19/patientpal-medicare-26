
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as patientIdlFactory } from "./idl/patient.did";
import { idlFactory as doctorIdlFactory } from "./idl/doctor.did";
import { idlFactory as prescriptionIdlFactory } from "./idl/prescription.did";
import { idlFactory as testIdlFactory } from "./idl/test.did";
import { icpAuth } from "./auth";
import { ICP_CONFIG } from "./config";

// Define actor types
export type PatientActor = any;
export type DoctorActor = any;
export type PrescriptionActor = any;
export type TestActor = any;

/**
 * Creates an actor for interacting with a canister
 */
export const createActor = async <T>(
  canisterId: string, 
  idlFactory: any
): Promise<T> => {
  const authClient = await icpAuth.init();
  const identity = authClient.getIdentity();
  
  const agent = new HttpAgent({
    host: ICP_CONFIG.network,
    identity,
  });
  
  // When in development, we need to fetch the root key
  if (process.env.NODE_ENV !== "production") {
    await agent.fetchRootKey();
  }
  
  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
};

/**
 * Service for managing ICP actors
 */
export class ICPActorService {
  private static instance: ICPActorService;
  private patientActor: PatientActor | null = null;
  private doctorActor: DoctorActor | null = null;
  private prescriptionActor: PrescriptionActor | null = null;
  private testActor: TestActor | null = null;
  
  private constructor() {}
  
  /**
   * Get singleton instance of the actor service
   */
  public static getInstance(): ICPActorService {
    if (!ICPActorService.instance) {
      ICPActorService.instance = new ICPActorService();
    }
    return ICPActorService.instance;
  }
  
  /**
   * Get the patient actor
   */
  public async getPatientActor(): Promise<PatientActor> {
    if (!this.patientActor) {
      this.patientActor = await createActor<PatientActor>(
        ICP_CONFIG.canisterIds.patientsCanister,
        patientIdlFactory
      );
    }
    return this.patientActor;
  }
  
  /**
   * Get the doctor actor
   */
  public async getDoctorActor(): Promise<DoctorActor> {
    if (!this.doctorActor) {
      this.doctorActor = await createActor<DoctorActor>(
        ICP_CONFIG.canisterIds.doctorsCanister,
        doctorIdlFactory
      );
    }
    return this.doctorActor;
  }
  
  /**
   * Get the prescription actor
   */
  public async getPrescriptionActor(): Promise<PrescriptionActor> {
    if (!this.prescriptionActor) {
      this.prescriptionActor = await createActor<PrescriptionActor>(
        ICP_CONFIG.canisterIds.prescriptionsCanister,
        prescriptionIdlFactory
      );
    }
    return this.prescriptionActor;
  }
  
  /**
   * Get the test actor
   */
  public async getTestActor(): Promise<TestActor> {
    if (!this.testActor) {
      this.testActor = await createActor<TestActor>(
        ICP_CONFIG.canisterIds.testsCanister,
        testIdlFactory
      );
    }
    return this.testActor;
  }
  
  /**
   * Reset all actors (useful after login/logout)
   */
  public resetActors(): void {
    this.patientActor = null;
    this.doctorActor = null;
    this.prescriptionActor = null;
    this.testActor = null;
  }
}

// Export singleton instance
export const icpActor = ICPActorService.getInstance();
