import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Camera,
  Save,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { useAlert } from "@/context/alert/AlertContext";
import { apiService } from "@/api/api";
import { uploadImageToCloudinary, validateImageFile } from "@/utils/cloudinary";

interface SellerProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  avatar: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export default function SellerSettings() {
  const { user, login } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [profile, setProfile] = useState<SellerProfile>({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    avatar: user?.avatar || "",
    socialMedia: {
      instagram: "",
      facebook: "",
      twitter: ""
    }
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // Load existing profile data
    const loadProfile = async () => {
      try {
        // In a real app, you'd fetch this from the API
        // For now, we'll use the user data from context
        setProfile(prev => ({
          ...prev,
          name: user?.name || "",
          email: user?.email || "",
          avatar: user?.avatar || ""
        }));
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleProfileChange = (field: string, value: string) => {
    if (field.startsWith("socialMedia.")) {
      const socialField = field.split(".")[1];
      setProfile(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error || "Invalid file");
      return;
    }

    try {
      setLoading(true);
      
      // Upload to Cloudinary
      const uploadResult = await uploadImageToCloudinary(file, 'artist-bazaar/avatars');
      
      // Update profile with new avatar
      setProfile(prev => ({
        ...prev,
        avatar: uploadResult.secure_url
      }));
      
      showSuccess("Avatar updated successfully!");
    } catch (error) {
      showError("Failed to upload avatar");
      console.error("Avatar upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Update profile via API
      const result = await apiService.updateProfile(profile);
      
      if (result.success) {
        // Update the user context with new data
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar
        };
        
        const authToken = localStorage.getItem("auth-token") || "";
        const refreshToken = localStorage.getItem("refresh-token") || "";
        
        login(updatedUser, authToken, refreshToken);
        showSuccess("Profile updated successfully!");
      } else {
        showError("Failed to update profile");
      }
    } catch (error) {
      showError("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("New password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, you'd make an API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      showError("Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>
                  {profile.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </span>
                  </Button>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your craft..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => handleProfileChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website}
                onChange={(e) => handleProfileChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Change your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <Button onClick={handlePasswordChange} disabled={loading} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Social Media Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Social Media Links
          </CardTitle>
          <CardDescription>Connect your social media accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={profile.socialMedia.instagram}
                onChange={(e) => handleProfileChange("socialMedia.instagram", e.target.value)}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={profile.socialMedia.facebook}
                onChange={(e) => handleProfileChange("socialMedia.facebook", e.target.value)}
                placeholder="facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={profile.socialMedia.twitter}
                onChange={(e) => handleProfileChange("socialMedia.twitter", e.target.value)}
                placeholder="@yourusername"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
