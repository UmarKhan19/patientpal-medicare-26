
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { icpAuth } from "@/services/icp/auth";
import { icpActor } from "@/services/icp/actor";
import { ICPIdentity, ICPCanisterIds } from "@/types/prescription";
import { ICP_CONFIG } from "@/services/icp/config";
import { toast } from "sonner";

interface ICPContextType {
  isConnected: boolean;
  identity: ICPIdentity | null;
  canisterIds: ICPCanisterIds;
  isLoading: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  updateCanisterIds: (ids: Partial<ICPCanisterIds>) => void;
}

const ICPContext = createContext<ICPContextType | undefined>(undefined);

export const ICPProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [identity, setIdentity] = useState<ICPIdentity | null>(null);
  const [canisterIds, setCanisterIds] = useState<ICPCanisterIds>(ICP_CONFIG.canisterIds as ICPCanisterIds);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await icpAuth.isAuthenticated();
        setIsConnected(isAuth);
        
        if (isAuth) {
          const identity = await icpAuth.getIdentity();
          setIdentity(identity);
        }
      } catch (error) {
        console.error("Error checking ICP authentication:", error);
        toast.error("Failed to connect to Internet Computer");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Connect to ICP
  const connect = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await icpAuth.login();
      if (success) {
        const identity = await icpAuth.getIdentity();
        setIdentity(identity);
        setIsConnected(true);
        toast.success("Connected to Internet Computer");
      } else {
        toast.error("Failed to connect to Internet Computer");
      }
      return success;
    } catch (error) {
      console.error("ICP connection error:", error);
      toast.error("Error connecting to Internet Computer");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect from ICP
  const disconnect = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await icpAuth.logout();
      setIsConnected(false);
      setIdentity(null);
      // Reset actors to ensure we get fresh ones on next login
      icpActor.resetActors();
      toast.success("Disconnected from Internet Computer");
    } catch (error) {
      console.error("ICP disconnection error:", error);
      toast.error("Error disconnecting from Internet Computer");
    } finally {
      setIsLoading(false);
    }
  };

  // Update canister IDs
  const updateCanisterIds = (ids: Partial<ICPCanisterIds>) => {
    setCanisterIds(prevIds => ({
      ...prevIds,
      ...ids
    }));
    
    // Update the global config
    Object.assign(ICP_CONFIG.canisterIds, ids);
    
    // Reset actors to ensure we get fresh ones with new canister IDs
    icpActor.resetActors();
  };

  return (
    <ICPContext.Provider
      value={{
        isConnected,
        identity,
        canisterIds,
        isLoading,
        connect,
        disconnect,
        updateCanisterIds,
      }}
    >
      {children}
    </ICPContext.Provider>
  );
};

export const useICP = () => {
  const context = useContext(ICPContext);
  if (context === undefined) {
    throw new Error("useICP must be used within an ICPProvider");
  }
  return context;
};
