import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Save, 
  X, 
  MapPin, 
  Calendar, 
  Star,
  Award,
  Users,
  Package,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import { useAlert } from "@/context/alert/AlertContext";

interface SellerAbout {
  bio: string;
  story: string;
  specialties: string[];
  achievements: string[];
  location: string;
  experience: string;
  education: string;
  awards: string[];
  socialLinks: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export default function SellerAbout() {
  const { user } = useAuth();
  const { showSuccess, showError } = useAlert();
  const [about, setAbout] = useState<SellerAbout>({
    bio: "",
    story: "",
    specialties: [],
    achievements: [],
    location: "",
    experience: "",
    education: "",
    awards: [],
    socialLinks: {
      website: "",
      instagram: "",
      facebook: "",
      twitter: ""
    }
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [newAward, setNewAward] = useState("");

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        // In a real app, you'd fetch this from the API
        // For now, we'll use mock data
        setAbout({
          bio: "Passionate artisan with over 10 years of experience in creating unique handmade pottery and ceramics. I specialize in traditional techniques passed down through generations.",
          story: "My journey began in a small village where I learned pottery from my grandmother. Each piece I create tells a story and carries the essence of traditional craftsmanship while incorporating modern design elements.",
          specialties: ["Pottery", "Ceramics", "Handmade Crafts", "Traditional Techniques"],
          achievements: ["Featured in Artisan Magazine", "Local Craft Fair Winner 2023", "100+ Happy Customers"],
          location: "San Francisco, CA",
          experience: "10+ years",
          education: "Fine Arts Degree, Art Institute",
          awards: ["Best Pottery Award 2023", "Craft Excellence Recognition 2022"],
          socialLinks: {
            website: "https://myartisanstudio.com",
            instagram: "@myartisanstudio",
            facebook: "MyArtisanStudio",
            twitter: "@myartisanstudio"
          }
        });
      } catch (error) {
        console.error("Error loading about data:", error);
      }
    };

    if (user) {
      loadAboutData();
    }
  }, [user]);

  const handleAboutChange = (field: string, value: string) => {
    if (field.startsWith("socialLinks.")) {
      const socialField = field.split(".")[1];
      setAbout(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setAbout(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !about.specialties.includes(newSpecialty.trim())) {
      setAbout(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    setAbout(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !about.achievements.includes(newAchievement.trim())) {
      setAbout(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()]
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAbout(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    if (newAward.trim() && !about.awards.includes(newAward.trim())) {
      setAbout(prev => ({
        ...prev,
        awards: [...prev.awards, newAward.trim()]
      }));
      setNewAward("");
    }
  };

  const removeAward = (index: number) => {
    setAbout(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // In a real app, you'd make an API call to save the about data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEditing(false);
      showSuccess("About section updated successfully!");
    } catch (error) {
      showError("Failed to update about section");
      console.error("About update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset to original data
    // In a real app, you'd reload from the server
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            About {user?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Tell your story and showcase your craft to customers.
          </p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit About
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main About Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Bio</CardTitle>
              <CardDescription>A brief introduction about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={about.bio}
                  onChange={(e) => handleAboutChange("bio", e.target.value)}
                  placeholder="Tell customers about yourself and your craft..."
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{about.bio || "No bio added yet."}</p>
              )}
            </CardContent>
          </Card>

          {/* Story */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>My Story</CardTitle>
              <CardDescription>Share your journey and inspiration</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={about.story}
                  onChange={(e) => handleAboutChange("story", e.target.value)}
                  placeholder="Share your story, inspiration, and journey as an artisan..."
                  rows={6}
                />
              ) : (
                <p className="text-muted-foreground">{about.story || "No story added yet."}</p>
              )}
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
              <CardDescription>What you specialize in</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Add a specialty"
                      onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                    />
                    <Button onClick={addSpecialty} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {about.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeSpecialty(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {about.specialties.length > 0 ? (
                    about.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No specialties added yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your notable accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Add an achievement"
                      onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                    />
                    <Button onClick={addAchievement} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {about.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span>{achievement}</span>
                        <X 
                          className="w-4 h-4 cursor-pointer text-muted-foreground" 
                          onClick={() => removeAchievement(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {about.achievements.length > 0 ? (
                    about.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Award className="w-4 h-4 text-primary" />
                        <span>{achievement}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No achievements added yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Location</Label>
                {editing ? (
                  <Input
                    value={about.location}
                    onChange={(e) => handleAboutChange("location", e.target.value)}
                    placeholder="City, Country"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{about.location || "Not specified"}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Experience</Label>
                {editing ? (
                  <Input
                    value={about.experience}
                    onChange={(e) => handleAboutChange("experience", e.target.value)}
                    placeholder="e.g., 5+ years"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{about.experience || "Not specified"}</span>
                  </div>
                )}
              </div>

              <div>
                <Label>Education</Label>
                {editing ? (
                  <Input
                    value={about.education}
                    onChange={(e) => handleAboutChange("education", e.target.value)}
                    placeholder="Educational background"
                  />
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span>{about.education || "Not specified"}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Awards */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Awards & Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAward}
                      onChange={(e) => setNewAward(e.target.value)}
                      placeholder="Add an award"
                      onKeyPress={(e) => e.key === 'Enter' && addAward()}
                    />
                    <Button onClick={addAward} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {about.awards.map((award, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <span className="text-sm">{award}</span>
                        <X 
                          className="w-4 h-4 cursor-pointer text-muted-foreground" 
                          onClick={() => removeAward(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {about.awards.length > 0 ? (
                    about.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{award}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No awards added yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Website</Label>
                {editing ? (
                  <Input
                    value={about.socialLinks.website}
                    onChange={(e) => handleAboutChange("socialLinks.website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {about.socialLinks.website || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <Label>Instagram</Label>
                {editing ? (
                  <Input
                    value={about.socialLinks.instagram}
                    onChange={(e) => handleAboutChange("socialLinks.instagram", e.target.value)}
                    placeholder="@username"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {about.socialLinks.instagram || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <Label>Facebook</Label>
                {editing ? (
                  <Input
                    value={about.socialLinks.facebook}
                    onChange={(e) => handleAboutChange("socialLinks.facebook", e.target.value)}
                    placeholder="Page name"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {about.socialLinks.facebook || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <Label>Twitter</Label>
                {editing ? (
                  <Input
                    value={about.socialLinks.twitter}
                    onChange={(e) => handleAboutChange("socialLinks.twitter", e.target.value)}
                    placeholder="@username"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {about.socialLinks.twitter || "Not provided"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
