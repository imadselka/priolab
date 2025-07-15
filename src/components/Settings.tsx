
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Shield, User, Github } from "lucide-react";

export const Settings = () => {
  const { user, signOut } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Account</span>
            </CardTitle>
            <CardDescription className="text-sm">Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50 text-sm"
                />
              </div>
              <div>
                <Label htmlFor="username" className="text-sm">GitHub Username</Label>
                <Input
                  id="username"
                  value={user?.user_metadata?.user_name || ""}
                  disabled
                  className="bg-gray-50 text-sm"
                />
              </div>
            </div>
            <Button variant="destructive" className="w-full sm:w-auto text-sm sm:text-base" onClick={signOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription className="text-sm">Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="email-notifications" className="text-sm sm:text-base">Email Notifications</Label>
                <p className="text-xs sm:text-sm text-gray-500 break-words">Receive notifications via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="push-notifications" className="text-sm sm:text-base">Push Notifications</Label>
                <p className="text-xs sm:text-sm text-gray-500 break-words">Receive browser push notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* GitHub Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>GitHub Integration</span>
            </CardTitle>
            <CardDescription className="text-sm">Manage your GitHub connection and sync settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <Label htmlFor="auto-sync" className="text-sm sm:text-base">Auto Sync Repositories</Label>
                <p className="text-xs sm:text-sm text-gray-500 break-words">Automatically sync new repositories and issues</p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base">
              <Github className="w-4 h-4 mr-2" />
              Reconnect GitHub Account
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Privacy & Security</span>
            </CardTitle>
            <CardDescription className="text-sm">Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 text-sm sm:text-base">Data Usage</h4>
              <p className="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                We only access public GitHub data and never store your GitHub tokens permanently.
              </p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto text-sm sm:text-base">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
