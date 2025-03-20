
import { useState } from "react";
import Dashboard from "./Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // In a real app, you would call an API to update the user's information
    // For now, we'll just simulate the update with a timeout
    setTimeout(() => {
      // Here we should update the user in context as well
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsUpdating(false);
    }, 1000);
  };

  if (!user) {
    return (
      <Dashboard>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Not Authenticated</h1>
          <p>Please sign in to view your profile.</p>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="container mx-auto py-6 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile information.</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <Button type="submit" disabled={isUpdating} className="w-full">
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Manage your profile picture.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-16 w-16 text-primary" />
                </div>
              )}
              <Button className="w-full">Upload New Picture</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
};

export default Profile;
