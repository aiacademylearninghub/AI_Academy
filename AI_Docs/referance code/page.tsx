/**
 * @file This file defines the Settings page for the application.
 * It provides users with a tabbed interface to manage their profile information,
 * family member connections, and data access permissions for the AI agent.
 */

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Users, DatabaseZap, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserSettings } from "@/hooks/use-user-settings"; // Assuming this hook provides profile, loading, error, updateProfile
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

/**
 * The Settings page component.
 * Renders a tab-based interface for various user settings.
 * @returns {JSX.Element} The rendered settings page.
 */
export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Use the useUserSettings hook to manage profile data and its loading/error states
  // Assuming 'profile', 'loading', 'error', and 'updateProfile' are returned by useUserSettings
  const { profile, loading, error, updateProfile } = useUserSettings();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  // New state for family request
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<string[]>([]); // Changed to string[] for emails
  const [isLoadingFamily, setIsLoadingFamily] = useState(true);
  const [familyError, setFamilyError] = useState<Error | null>(null);

  // Initialize 'name' state from the loaded profile data
  // This useEffect ensures 'name' is populated when the profile loads or changes
  useEffect(() => {
    if (profile) {
      if (profile.name) {
        setName(profile.name);
      }
      if (profile.email) {
        setEmail(profile.email);
      }
    }
  }, [profile]);

  // Fetch family members
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!user) return;

      setIsLoadingFamily(true);
      setFamilyError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.");
        }

        const token = await user.getIdToken();
        const response = await fetch(
          `${apiUrl}/settings/family-members`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch family members");
        }

        const data = await response.json();
        setFamilyMembers(data);
      } catch (err: any) {
        console.error("Failed to fetch family members:", err);
        setFamilyError(err);
      } finally {
        setIsLoadingFamily(false);
      }
    };

    fetchFamilyMembers();
  }, [user]);

  // --- Early Returns (AFTER all Hooks are called) ---

  // Early return for no user
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-2">Please Sign In</h2>
        <p className="text-muted-foreground">
          You need to be logged in to access settings.
        </p>
      </div>
    );
  }

  // Early return while profile data is loading (using the 'loading' from useUserSettings)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // The updateProfile function should be provided by useUserSettings
      const success = await updateProfile({ name, email }); // Pass the updated name
      if (success) {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      } else {
        // Handle cases where updateProfile returns false or an error object without throwing
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendRequest = async () => {
    setIsSending(true);
    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error("User not authenticated.");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.");
      }

      const response = await fetch(
        `${apiUrl}/settings/family-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: newMemberEmail,
            // You likely don't need to send the full token as 'sender',
            // the backend should identify the sender from the Authorization header.
            // If sender ID is needed, send user.uid.
            // sender: user.uid,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send family request");
      }

      toast({
        title: "Success",
        description: "Family request email sent successfully.",
      });

      setNewMemberEmail(""); // Clear the email input
    } catch (err: any) { // Type 'any' for error caught
      console.error("Failed to send family request:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to send family request.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-headline font-bold">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and agent preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 max-w-md bg-zinc-900/50 h-auto md:h-10">
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="family">
            <Users className="mr-2 h-4 w-4" /> Family
          </TabsTrigger>
          <TabsTrigger value="data-access">
            <DatabaseZap className="mr-2 h-4 w-4" /> Data Access
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings Tab */}
        <TabsContent value="profile" className="mt-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="font-headline">Your Profile</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 'loading' and 'error' should come from useUserSettings */}
              {error ? (
                <div className="text-red-500 text-center py-4">{error.message || "Failed to load profile."}</div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name} // Use the local 'name' state
                      onChange={(e) => setName(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email} // Prefer profile email if available
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Settings Tab */}
        <TabsContent value="family" className="mt-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="font-headline">Family Members</CardTitle>
              <CardDescription>
                Link family accounts for a holistic financial view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error ? ( // Display error if profile failed to load (assuming family data depends on profile)
                <div className="text-red-500 text-center py-4">{error.message || "Failed to load family settings."}</div>
              ) : (
                <>
                  {/* Form for sending family request */}
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="family-email">Enter Family Member's Email</Label>
                    <Input
                      id="family-email"
                      type="email"
                      placeholder="you@example.com"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="input-glass"
                    />
                  </div>
                  <Button
                    onClick={handleSendRequest}
                    disabled={isSending || !newMemberEmail}
                    className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-opacity"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      "Send Request"
                    )}
                  </Button>

                  {isLoadingFamily ? (
                    <div className="flex justify-center items-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="ml-2">Loading family members...</p>
                    </div>
                  ) : familyError ? (
                    <div className="text-red-500 text-center py-4">{familyError.message || "Failed to load family members."}</div>
                  ) : familyMembers.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Current Family Members:</h3>
                      <ul className="list-disc pl-5">
                        {familyMembers.map((member, index) => (
                          <li key={index} className="text-muted-foreground">
                            {member.email}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No family members linked yet.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Access Settings Tab */}
        <TabsContent value="data-access" className="mt-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="font-headline">Agent Data Access</CardTitle>
              <CardDescription>
                Control what data your AI agent can access to provide advice.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error ? ( // Display error if profile failed to load
                <div className="text-red-500 text-center py-4">{error.message || "Failed to load data access settings."}</div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <Label htmlFor="bank-access" className="font-medium">
                        Bank Accounts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allows agent to see transactions and balances.
                      </p>
                    </div>
                    <Switch id="bank-access" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <Label htmlFor="investment-access" className="font-medium">
                        Investment Accounts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allows agent to analyze and suggest trades.
                      </p>
                    </div>
                    <Switch id="investment-access" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <Label htmlFor="credit-card-access" className="font-medium">
                        Credit Card Data
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allows agent to analyze spending habits.
                      </p>
                    </div>
                    <Switch id="credit-card-access" />
                  </div>
                  <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold hover:opacity-90 transition-opacity">
                    <Save className="mr-2 h-4 w-4" />
                    Save Permissions
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}