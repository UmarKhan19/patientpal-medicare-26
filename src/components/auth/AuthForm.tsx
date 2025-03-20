
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserRole, useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

// Define form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["doctor", "patient"], { 
    required_error: "Please select a role" 
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "patient",
    },
  });

  // Handle login submit
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      // Navigation is handled in the auth context
    } catch (error) {
      console.error("Login error:", error);
      setIsSubmitting(false);
    }
  };

  // Handle signup submit
  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(data.name, data.email, data.password, data.role as UserRole);
      // Navigation is handled in the auth context
    } catch (error) {
      console.error("Signup error:", error);
      setIsSubmitting(false);
    }
  };

  const form = type === "login" ? loginForm : signupForm;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(type === "login" ? onLoginSubmit : onSignupSubmit)} className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">{type === "login" ? "Welcome Back" : "Create Your Account"}</h2>
            <p className="text-slate-600 text-sm">
              {type === "login" 
                ? "Enter your credentials to access your account" 
                : "Fill in the details below to get started"
              }
            </p>
          </div>

          {type === "signup" && (
            <FormField
              control={signupForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="rounded-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "signup" && (
            <FormField
              control={signupForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>I am a</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="doctor" />
                        <Label htmlFor="doctor">Doctor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="patient" />
                        <Label htmlFor="patient">Patient</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {type === "login" && (
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <ButtonCustom
            type="submit"
            variant="glow"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {type === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              <>{type === "login" ? "Sign In" : "Create Account"}</>
            )}
          </ButtonCustom>

          <div className="text-center text-sm">
            {type === "login" ? (
              <p>
                Don't have an account?{" "}
                <a
                  onClick={() => navigate("/signup")}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  Sign up
                </a>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/signin")}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  Sign in
                </a>
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;
