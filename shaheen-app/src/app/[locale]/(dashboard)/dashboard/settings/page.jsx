"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Toggle } from "../../../../../components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Separator } from "../../../../../components/ui/separator";
import { Badge } from "../../../../../components/ui/badge";
import { Textarea } from "../../../../../components/ui/textarea";
import { cn } from "../../../../../lib/utils";
import Topbar from "../components/Topbar";
import {
  User,
  Bell,
  Shield,
  Globe,
  Instagram,
  Palette,
  Save,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Plus,
  Settings,
  Key,
  Lock,
  Smartphone,
  Monitor,
} from "lucide-react";

const SettingsPage = () => {
  const t = useTranslations("Settings");
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tabs = [
    { id: "profile", label: t("tabs.profile"), icon: User },
    { id: "notifications", label: t("tabs.notifications"), icon: Bell },
    { id: "security", label: t("tabs.security"), icon: Shield },
    { id: "language", label: t("tabs.language"), icon: Globe },
    { id: "instagram", label: t("tabs.instagram"), icon: Instagram },
    { id: "appearance", label: t("tabs.appearance"), icon: Palette },
    { id: "billing", label: t("tabs.billing"), icon: CreditCard },
  ];

  const [formData, setFormData] = useState({
    // Profile
    firstName: "Ahmad",
    lastName: "Mohamed",
    email: "ahmad@example.com",
    phone: "+966 50 123 4567",
    bio: "Digital marketer and content creator passionate about AI-powered solutions.",
    location: "Riyadh, Saudi Arabia",
    website: "https://ahmadportfolio.com",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    postReminders: true,
    weeklyReports: true,

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: false,
    sessionTimeout: "30",

    // Language
    language: "en",
    timezone: "Asia/Riyadh",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",

    // Instagram
    autoPost: true,
    postFrequency: "daily",
    contentReview: true,
    hashtagSuggestions: true,

    // Appearance
    theme: "dark",
    fontSize: "medium",
    compactMode: false,

    // Billing
    plan: "pro",
    nextBilling: "2024-02-15",
    autoRenew: true,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving settings:", formData);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t("profile.profilePicture")}
          </CardTitle>
          <CardDescription>{t("profile.profilePictureDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                {t("profile.uploadPhoto")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("profile.remove")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>{t("profile.personalInfo")}</CardTitle>
          <CardDescription>{t("profile.personalInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("profile.firstName")}</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t("profile.lastName")}</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("profile.email")}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("profile.phone")}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t("profile.location")}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">{t("profile.website")}</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t("profile.bio")}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Email Notifications</Label>
              <p className="text-sm text-white/60">
                Receive notifications via email
              </p>
            </div>
            <Toggle
              pressed={formData.emailNotifications}
              onPressedChange={(pressed) =>
                handleInputChange("emailNotifications", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Push Notifications</Label>
              <p className="text-sm text-white/60">
                Receive notifications in your browser
              </p>
            </div>
            <Toggle
              pressed={formData.pushNotifications}
              onPressedChange={(pressed) =>
                handleInputChange("pushNotifications", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Marketing Emails</Label>
              <p className="text-sm text-white/60">
                Receive promotional content and updates
              </p>
            </div>
            <Toggle
              pressed={formData.marketingEmails}
              onPressedChange={(pressed) =>
                handleInputChange("marketingEmails", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Post Reminders</Label>
              <p className="text-sm text-white/60">
                Get reminded about scheduled posts
              </p>
            </div>
            <Toggle
              pressed={formData.postReminders}
              onPressedChange={(pressed) =>
                handleInputChange("postReminders", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Weekly Reports</Label>
              <p className="text-sm text-white/60">
                Receive weekly performance reports
              </p>
            </div>
            <Toggle
              pressed={formData.weeklyReports}
              onPressedChange={(pressed) =>
                handleInputChange("weeklyReports", pressed)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="bg-white/5 border-white/20 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="bg-white/5 border-white/20 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-white/5 border-white/20 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Additional security options for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                Two-Factor Authentication
              </Label>
              <p className="text-sm text-white/60">
                Add an extra layer of security to your account
              </p>
            </div>
            <Toggle
              pressed={formData.twoFactorAuth}
              onPressedChange={(pressed) =>
                handleInputChange("twoFactorAuth", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout</Label>
            <Select
              value={formData.sessionTimeout}
              onValueChange={(value) =>
                handleInputChange("sessionTimeout", value)
              }
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Customize your language and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => handleInputChange("timezone", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                <SelectItem value="Europe/London">
                  Europe/London (GMT+0)
                </SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York (GMT-5)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select
              value={formData.dateFormat}
              onValueChange={(value) => handleInputChange("dateFormat", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeFormat">Time Format</Label>
            <Select
              value={formData.timeFormat}
              onValueChange={(value) => handleInputChange("timeFormat", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInstagramTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Instagram Integration</CardTitle>
          <CardDescription>
            Manage your Instagram account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto Post</Label>
              <p className="text-sm text-white/60">
                Automatically post generated content
              </p>
            </div>
            <Toggle
              pressed={formData.autoPost}
              onPressedChange={(pressed) =>
                handleInputChange("autoPost", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="space-y-2">
            <Label htmlFor="postFrequency">Post Frequency</Label>
            <Select
              value={formData.postFrequency}
              onValueChange={(value) =>
                handleInputChange("postFrequency", value)
              }
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Content Review</Label>
              <p className="text-sm text-white/60">
                Review content before posting
              </p>
            </div>
            <Toggle
              pressed={formData.contentReview}
              onPressedChange={(pressed) =>
                handleInputChange("contentReview", pressed)
              }
            />
          </div>

          <Separator className="bg-white/20" />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Hashtag Suggestions</Label>
              <p className="text-sm text-white/60">
                Include AI-generated hashtag suggestions
              </p>
            </div>
            <Toggle
              pressed={formData.hashtagSuggestions}
              onPressedChange={(pressed) =>
                handleInputChange("hashtagSuggestions", pressed)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Appearance Settings</CardTitle>
          <CardDescription>
            Customize the look and feel of your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={(value) => handleInputChange("theme", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto (System)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select
              value={formData.fontSize}
              onValueChange={(value) => handleInputChange("fontSize", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Compact Mode</Label>
              <p className="text-sm text-white/60">
                Reduce spacing for a more compact layout
              </p>
            </div>
            <Toggle
              pressed={formData.compactMode}
              onPressedChange={(pressed) =>
                handleInputChange("compactMode", pressed)
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-6">
      <Card
        className={cn(
          "text-white",
          "bg-white/10 border border-white/20 backdrop-blur-md shadow-[inset_0px_-66px_64px_-48px_#432C81,inset_0px_-68px_64px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)]"
        )}
      >
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <h3 className="font-semibold">Pro Plan</h3>
              <p className="text-sm text-white/60">$29/month</p>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-500/20 text-green-400"
            >
              Active
            </Badge>
          </div>

          <div className="space-y-2">
            <Label>Next Billing Date</Label>
            <p className="text-sm text-white/60">{formData.nextBilling}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto Renew</Label>
              <p className="text-sm text-white/60">
                Automatically renew your subscription
              </p>
            </div>
            <Toggle
              pressed={formData.autoRenew}
              onPressedChange={(pressed) =>
                handleInputChange("autoRenew", pressed)
              }
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileTab();
      case "notifications":
        return renderNotificationsTab();
      case "security":
        return renderSecurityTab();
      case "language":
        return renderLanguageTab();
      case "instagram":
        return renderInstagramTab();
      case "appearance":
        return renderAppearanceTab();
      case "billing":
        return renderBillingTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="px-12 pt-6 min-h-screen">
      <Topbar icon="/icons/Settings_icon.svg" title="settings" />

      <div className="mt-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold capitalize satoshi-bold">
            {t("title")}
          </h2>
          <p className="text-white/60">{t("subtitle")}</p>
        </div>

        <div className="mt-8 flex gap-6">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {t("saveChanges")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
