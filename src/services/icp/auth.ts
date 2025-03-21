
import { AuthClient } from "@dfinity/auth-client";
import { ICPIdentity } from "@/types/prescription";

// Default authentication options
const DEFAULT_AUTH_OPTIONS = {
  identityProvider: process.env.NODE_ENV === "production" 
    ? "https://identity.ic0.app"
    : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
  maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 7 days in nanoseconds
};

/**
 * Manages authentication with the Internet Computer
 */
export class ICPAuthService {
  private static instance: ICPAuthService;
  private authClient: AuthClient | null = null;
  
  private constructor() {}

  /**
   * Get singleton instance of the auth service
   */
  public static getInstance(): ICPAuthService {
    if (!ICPAuthService.instance) {
      ICPAuthService.instance = new ICPAuthService();
    }
    return ICPAuthService.instance;
  }

  /**
   * Initialize the auth client
   */
  public async init(): Promise<AuthClient> {
    if (!this.authClient) {
      this.authClient = await AuthClient.create();
    }
    return this.authClient;
  }

  /**
   * Login to the Internet Computer
   */
  public async login(): Promise<boolean> {
    const authClient = await this.init();
    return new Promise((resolve) => {
      authClient.login({
        ...DEFAULT_AUTH_OPTIONS,
        onSuccess: () => resolve(true),
        onError: (error) => {
          console.error("ICP login error:", error);
          resolve(false);
        },
      });
    });
  }

  /**
   * Logout from the Internet Computer
   */
  public async logout(): Promise<void> {
    const authClient = await this.init();
    await authClient.logout();
  }

  /**
   * Check if user is authenticated
   */
  public async isAuthenticated(): Promise<boolean> {
    const authClient = await this.init();
    return authClient.isAuthenticated();
  }

  /**
   * Get the current identity
   */
  public async getIdentity(): Promise<ICPIdentity | null> {
    const authClient = await this.init();
    if (!authClient.isAuthenticated()) {
      return null;
    }
    
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal();
    
    return {
      principal,
      isAuthenticated: true,
    };
  }
}

// Export singleton instance
export const icpAuth = ICPAuthService.getInstance();
