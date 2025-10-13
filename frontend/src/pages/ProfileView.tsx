import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, MessageCircle, Phone, Mail } from "lucide-react";
import craftsShowcase from "@/assets/crafts-showcase.jpg";

const artisans = [
  {
    id: 1,
    name: "Ravi Kumar",
    craft: "Pottery",
    location: "Jaipur, Rajasthan",
    rating: 4.8,
    reviews: 124,
    specialties: ["Traditional Pottery", "Blue Pottery", "Terracotta"],
    experience: "15+ years",
    description: "Master potter specializing in traditional Rajasthani blue pottery techniques passed down through generations.",
    phone: "+91 98765 43210",
    email: "ravi.kumar@example.com",
    bio: "Born into a family of potters, Ravi has been working with clay for over 15 years. His expertise lies in the traditional blue pottery of Jaipur, a craft that requires immense skill and patience. Each piece is hand-painted with intricate designs that reflect the rich cultural heritage of Rajasthan."
  },
  {
    id: 2,
    name: "Meera Devi",
    craft: "Textiles",
    location: "Varanasi, UP",
    rating: 4.9,
    reviews: 89,
    specialties: ["Silk Weaving", "Banarasi Sarees", "Traditional Patterns"],
    experience: "20+ years",
    description: "Expert weaver creating exquisite Banarasi silk sarees with intricate gold and silver thread work.",
    phone: "+91 87654 32109",
    email: "meera.devi@example.com",
    bio: "Meera comes from a lineage of master weavers in Varanasi. For two decades, she has been creating some of the finest Banarasi sarees, known for their lustrous silk and detailed brocade work. Her sarees are treasured by brides across India."
  },
  {
    id: 3,
    name: "Arjun Singh",
    craft: "Woodcarving",
    location: "Udaipur, Rajasthan",
    rating: 4.7,
    reviews: 156,
    specialties: ["Furniture", "Decorative Items", "Temple Art"],
    experience: "12+ years",
    description: "Skilled woodcarver creating beautiful furniture and decorative pieces with traditional Rajasthani motifs.",
    phone: "+91 76543 21098",
    email: "arjun.singh@example.com",
    bio: "Arjun's passion for woodcarving began in his childhood when he watched his grandfather create beautiful pieces. Today, he specializes in traditional Rajasthani woodwork, creating furniture and decorative items that blend functionality with artistic beauty."
  }
];

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const artisan = artisans.find(a => a.id === parseInt(id || ""));
  
  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Artisan Not Found</h2>
          <Button onClick={() => navigate("/")} variant="cultural">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Artisans
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden shadow-elegant">
              <div className="aspect-square bg-gradient-warm/10 p-6">
                <img 
                  src={craftsShowcase} 
                  alt={`${artisan.name}'s crafts`}
                  className="w-full h-full object-cover rounded-lg shadow-elegant"
                />
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{artisan.name}</CardTitle>
                <p className="text-primary font-semibold text-lg">{artisan.craft}</p>
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{artisan.rating}</span>
                  <span className="text-muted-foreground">({artisan.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{artisan.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    variant="cultural" 
                    className="flex-1"
                    onClick={() => navigate(`/chat/${artisan.id}`)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{artisan.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{artisan.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>About {artisan.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {artisan.bio}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Skills & Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Experience</h4>
                  <p className="text-primary font-semibold">{artisan.experience}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {artisan.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {artisan.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;