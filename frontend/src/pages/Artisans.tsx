import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Loader2, Filter, X, Star, MapPin, MessageCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/api/api";

interface Artisan {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  experience?: string;
  achievements?: string[];
  awards?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  createdAt: string;
  products?: Array<{
    _id: string;
    name: string;
    price: number;
    images?: string[];
  }>;
}

export default function Artisans() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  const availableRoles = ["Seller", "Services"];
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name", label: "Name A-Z" },
  ];

  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const result: any = await apiService.getSellersList({
        page: "1",
        limit: "50",
        search: searchQuery,
        location: selectedRole === "Services" ? "" : undefined
      });
      
      if (result?.success) {
        setArtisans(result?.sellers || []);
      } else {
        setArtisans(result?.sellers || []);
      }
    } catch (error) {
      console.error("Error fetching artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchArtisans();
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery, selectedRole, sortBy]);

  const filteredArtisans = useMemo(() => {
    let filtered = artisans;

    if (searchQuery) {
      filtered = filtered.filter(artisan =>
        artisan.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artisan.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(artisan => artisan.role === selectedRole);
    }

    // Sort artisans
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [artisans, searchQuery, selectedRole, sortBy]);

  const handleArtisanClick = (artisan: Artisan) => {
    navigate(`/profile/${artisan._id}`);
  };

  const handleChatClick = (artisan: Artisan) => {
    navigate(`/chat/${artisan._id}`);
  };

  return (
    <div className="min-h-screen bg-foreground/5">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Filters */}
        <aside
          className={`
            bg-background p-4 rounded-r-2xl shadow-lg space-y-4 md:sticky md:top-10 md:h-[calc(100vh-4rem)] md:w-64 md:translate-x-0 md:col-span-1
            absolute top-0 left-0 h-full w-64 z-40 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Header for mobile */}
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="font-semibold">Filters</h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Search</label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisans..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <select
              className="w-full h-10 mt-1 rounded-md border bg-background"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Sort By</label>
            <select
              className="w-full h-10 mt-1 rounded-md border bg-background"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={fetchArtisans} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Apply Filters
          </Button>
        </aside>

        {/* Artisans Grid */}
        <main className="md:col-span-3 overflow-hidden">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Discover Artisans</h1>
            <p className="text-muted-foreground">
              Connect with talented local artisans and discover their unique crafts
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredArtisans.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtisans.map((artisan) => (
                <Card
                  key={artisan._id}
                  className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleArtisanClick(artisan)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-warm/10 flex items-center justify-center">
                        {artisan.avatar ? (
                          <img
                            src={artisan.avatar}
                            alt={artisan.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👨‍🎨</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{artisan.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{artisan.location || "Local Artisan"}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {artisan.role}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                        <span className="text-muted-foreground">(24)</span>
                      </div>
                    </div>

                    {/* <p className="text-sm text-muted-foreground line-clamp-2">
                      {artisan.bio || `Talented ${artisan.role.toLowerCase()} creating beautiful handmade crafts with traditional techniques.`}
                    </p> */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {artisan.bio || `Talented ${(artisan.role ?? "artisan").toLowerCase()} creating beautiful handmade crafts with traditional techniques.`}
                    </p>
                    {artisan.specialties && artisan.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {artisan.specialties.slice(0, 3).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {artisan.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{artisan.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArtisanClick(artisan);
                        }}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatClick(artisan);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-20">
              <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No artisans found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
