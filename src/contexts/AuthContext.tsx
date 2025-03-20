
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { doctors, patients } from "@/lib/dummy-data";

// Define user type
export type UserRole = "doctor" | "patient";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  picture?: string | null;
}

// Define context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Combine doctor and patient data for authentication
const USERS = [
  ...doctors.map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    password: "password", // In a real app, this would be hashed
    role: "doctor" as UserRole,
    picture: doctor.picture
  })),
  ...patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    email: patient.email,
    password: "password", // In a real app, this would be hashed
    role: "patient" as UserRole,
    picture: patient.picture
  }))
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("bbpms_user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("bbpms_user");
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = USERS.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("bbpms_user", JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      navigate(foundUser.role === "doctor" ? "/doctor" : "/patient");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (USERS.some(u => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const newUser = {
        id: `${role.charAt(0)}${USERS.length + 1}`,
        name,
        email,
        role,
      };
      
      setUser(newUser);
      localStorage.setItem("bbpms_user", JSON.stringify(newUser));
      
      toast({
        title: "Account created",
        description: `Welcome to BBPMS, ${name}!`,
      });
      
      navigate(role === "doctor" ? "/doctor" : "/patient");
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("bbpms_user");
    navigate("/");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
