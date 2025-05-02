import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import apiConfig from "@/utils/apiConfig";

const Settings = () => {
  const { id } = useParams();
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    openingHours: "",
    description: "",
    image: "",
    coverImageUrl: "",
  });

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        const response = await fetch(
          `${apiConfig.getMyRestaurants}by-id/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setRestaurantData(data);
      } catch (error) {
        console.error("Error fetching restaurant name:", error);
      }
    };

    fetchRestaurantName();
  }, [id]);

  const [preferences, setPreferences] = useState({
    autoAcceptOrders: true,
    emailNotifications: true,
    smsNotifications: false,
    appNotifications: true,
    soundAlerts: true,
  });

  const { toast } = useToast();

  const handleRestaurantChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  const saveRestaurantProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your restaurant profile has been successfully updated.",
    });
  };

  const savePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const savePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Account Settings"
        description="Manage your restaurant profile and preferences"
      />

      <Tabs defaultValue="profile" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Restaurant Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>
                Update your restaurant details visible to customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    name="name"
                    value={restaurantData.name}
                    onChange={handleRestaurantChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={restaurantData.address}
                    onChange={handleRestaurantChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={restaurantData.phone}
                      onChange={handleRestaurantChange}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      value={restaurantData.email}
                      onChange={handleRestaurantChange}
                    />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    name="website"
                    value={restaurantData.website}
                    onChange={handleRestaurantChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="openingHours">Opening Hours</Label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={restaurantData.openingHours}
                    onChange={handleRestaurantChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Restaurant Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={restaurantData.description}
                    onChange={handleRestaurantChange}
                    rows={4}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="logo">Restaurant Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <img
                        src={restaurantData.image}
                        alt="Restaurant Logo"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <Button variant="outline">Change Logo</Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={restaurantData.coverImageUrl}
                      alt="Cover Image"
                      className="w-full h-full rounded-lg object-cover"
                    ></img>
                    <Button variant="outline">Upload Cover Image</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={saveRestaurantProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Order Preferences</CardTitle>
              <CardDescription>
                Customize how you receive and manage orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoAccept">Auto-Accept Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically accept new orders without manual
                      confirmation
                    </p>
                  </div>
                  <Switch
                    id="autoAccept"
                    checked={preferences.autoAcceptOrders}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("autoAcceptOrders", checked)
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Notification Preferences</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive order updates and summaries via email
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("emailNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive order alerts via text message
                        </p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={preferences.smsNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("smsNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="appNotifications">
                          App Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in the Q-Tasty app
                        </p>
                      </div>
                      <Switch
                        id="appNotifications"
                        checked={preferences.appNotifications}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("appNotifications", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="soundAlerts">Sound Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sound when new orders arrive
                        </p>
                      </div>
                      <Switch
                        id="soundAlerts"
                        checked={preferences.soundAlerts}
                        onCheckedChange={(checked) =>
                          handlePreferenceChange("soundAlerts", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePreferences} className="ml-auto">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">
                    Two-Factor Authentication
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Set Up 2FA</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={savePassword} className="ml-auto">
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Privacy Policy and Terms</CardTitle>
          <CardDescription>
            Review our legal agreements and policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              Privacy Policy
            </Button>
            <Button variant="outline" className="justify-start">
              Terms of Service
            </Button>
            <Button variant="outline" className="justify-start">
              Data Processing Agreement
            </Button>
            <Button variant="outline" className="justify-start">
              Partner Guidelines
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-100">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Actions that can't be undone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-100 rounded-lg">
              <h3 className="font-medium">Deactivate Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Temporarily hide your restaurant from the Q-Tasty marketplace
              </p>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Deactivate Account
              </Button>
            </div>

            <div className="p-4 border border-red-100 rounded-lg">
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently remove your restaurant and all its data from Q-Tasty
              </p>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
