import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import Chatuser from "@/components/Userchat";

const artisans = [
  {
    id: 1,
    name: "Ravi Kumar",
    craft: "Pottery",
    location: "Jaipur, Rajasthan"
  },
  {
    id: 2,
    name: "Meera Devi",
    craft: "Textiles", 
    location: "Varanasi, UP"
  },
  {
    id: 3,
    name: "Arjun Singh",
    craft: "Woodcarving",
    location: "Udaipur, Rajasthan"
  }
];

const DirectChat = () => {
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Artisans
          </Button>
          
          <Card className="shadow-elegant">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-warm/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{artisan.name}</CardTitle>
                  <p className="text-primary font-medium">{artisan.craft}</p>
                  <p className="text-sm text-muted-foreground">{artisan.location}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start a conversation with {artisan.name} to learn about their craft, 
                discuss custom orders, or ask about their techniques and experience.
              </p>
              
              <div className="bg-gradient-subtle rounded-lg p-6">
                <Chatuser />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DirectChat;