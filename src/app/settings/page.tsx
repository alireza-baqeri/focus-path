"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, User, Cloud, Globe, Quote, Loader2, Lock, Database, Shield, KeyRound, FileJson, FileSpreadsheet } from "lucide-react";
import { CountryCombobox } from "@/components/ui/country-combobox";
import { CityCombobox } from "@/components/ui/city-combobox";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    weatherCity: "Tehran",
    newsCountry: "us",
    quoteCategory: "motivational",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;

    let cancelled = false;
    fetch("/api/settings")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setFormData({
          name: data.name || "",
          weatherCity: data.settings?.weatherCity || "Tehran",
          newsCountry: data.settings?.newsCountry || "us",
          quoteCategory: data.settings?.quoteCategory || "motivational",
        });
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load account settings.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to save settings");
      }
      // Force session update to reflect new name in header
      await update({ name: formData.name.trim() });
      router.refresh();
      toast.success("Settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to change password.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleExportData = async (format: "json" | "csv") => {
    setExporting(true);
    try {
      const res = await fetch(`/api/export?format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `focus-path-data.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Data exported as ${format.toUpperCase()} successfully!`);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-lg">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your profile, preferences, and data.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={session?.user?.email || ""} disabled className="bg-gray-50 dark:bg-gray-900" />
                <p className="text-xs text-gray-400">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Widget Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                Widget Preferences
              </CardTitle>
              <CardDescription>Customize the data shown on your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Weather City */}
              <div className="space-y-2">
                <Label htmlFor="weather" className="flex items-center gap-2">
                  <Cloud className="w-4 h-4" /> Weather City
                </Label>
                <CityCombobox
                  value={formData.weatherCity}
                  onChange={(val) => setFormData({ ...formData, weatherCity: val })}
                />
              </div>

              {/* News Country */}
              <div className="space-y-2">
                <Label htmlFor="news" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> News Country
                </Label>
                <CountryCombobox
                  value={formData.newsCountry}
                  onChange={(val) => setFormData({ ...formData, newsCountry: val })}
                />
              </div>

              {/* Quote Category */}
              <div className="space-y-2">
                <Label htmlFor="quote" className="flex items-center gap-2">
                  <Quote className="w-4 h-4" /> Quote Genre
                </Label>
                <Select
                  value={formData.quoteCategory}
                  onValueChange={(val) => setFormData({ ...formData, quoteCategory: val || "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="wisdom">Wisdom</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Change */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-500" />
                Change Password
              </CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 chars)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                variant="outline"
                className="w-full"
              >
                {changingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                Update Password
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Data Management
              </CardTitle>
              <CardDescription>Export and manage your data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium">Your data is stored locally</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  All your data is stored in a local SQLite database. You can export it at any time.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleExportData("json")}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileJson className="w-4 h-4 text-blue-500" />
                  Export JSON
                </Button>
                <Button
                  onClick={() => handleExportData("csv")}
                  disabled={exporting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  Export CSV
                </Button>
              </div>
              {exporting && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing export...
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-end items-center gap-4 border-t border-gray-200 dark:border-gray-800 pt-6"
      >
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </motion.div>
    </div>
  );
}
