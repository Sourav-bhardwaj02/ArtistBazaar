import { useEffect, useMemo, useState } from "react";
import { apiService } from "@/api/api";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BadgeCheck, MapPin, MessageCircle, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

type CatalogItem = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  imagesData?: Array<{ url: string }>;
  image?: string;
  category?: string;
  description?: string;
  tags?: string[];
};

type ArtisanDetail = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  bio?: string;
  location?: string;
  specialties?: string[];
  experience?: string;
  createdAt?: string;
  shopBanner?: string;
  overview?: {
    productCount: number;
    categories: string[];
    topSelling: CatalogItem[];
    recentProducts: CatalogItem[];
    catalog: { items: CatalogItem[]; total: number; page: number; pages: number };
  };
  trust?: {
    avgRating: number;
    reviews: number;
    responseRate: number;
    responseTimeMinutesAvg: number;
    isVerifiedSeller: boolean;
    joinDate: string;
  };
};

export default function ProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artisan, setArtisan] = useState<ArtisanDetail | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const categories = artisan?.overview?.categories || [];
  const catalogItems = artisan?.overview?.catalog.items || [];

  const loadArtisan = async (pageParam = 1) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiService.getArtisanDetail(String(id), {
        q: q || undefined,
        category: category || undefined,
        page: String(pageParam),
        limit: "12",
        sort: "-createdAt",
      });
      setArtisan(res?.artisan || null);
    } catch (e: any) {
      setError(e?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadArtisan(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, q, category]);

  const bannerUrl = artisan?.shopBanner || artisan?.avatar;
  const avatar = artisan?.avatar;
  const trust = artisan?.trust;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="w-full">
        {/* Banner */}
        <div className="w-full h-48 md:h-64 bg-muted relative">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Shop banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20" />
          )}
          <div className="container mx-auto px-4 absolute bottom-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-background shadow-lg overflow-hidden border">
              {avatar ? (
                <img src={avatar} alt={artisan?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👨‍🎨</div>
              )}
            </div>
            <div className="text-background drop-shadow">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-semibold">{artisan?.name || "Artisan"}</h1>
                {trust?.isVerifiedSeller ? (
                  <span className="inline-flex items-center gap-1 text-sm bg-emerald-600/80 px-2 py-0.5 rounded-md">
                    <BadgeCheck className="w-4 h-4" /> Verified
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {trust ? (
                  <>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{trust.avgRating?.toFixed(1)} ({trust.reviews})</span>
                  </>
                ) : null}
                {artisan?.location ? (
                  <>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{artisan.location}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <Button variant="outline" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>

        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
        ) : null}

        {/* Top: About + Trust */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>About {artisan?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {artisan?.bio || "No bio provided."}
              </p>
              {artisan?.specialties && artisan.specialties.length ? (
                <div className="mt-4">
                  <div className="font-medium mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-2">
                    {artisan.specialties.map((s, i) => (
                      <Badge key={i} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance & Trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Seller rating</span>
                <span className="font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {trust ? trust.avgRating.toFixed(1) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reviews</span>
                <span className="font-medium">{trust?.reviews ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Response rate</span>
                <span className="font-medium">{trust?.responseRate ?? 100}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. response time</span>
                <span className="font-medium">{trust ? `${Math.round((trust.responseTimeMinutesAvg || 60) / 60)} hrs` : "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verified</span>
                <span className="font-medium">{trust?.isVerifiedSeller ? "Yes" : "No"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Seller since</span>
                <span className="font-medium">{artisan?.createdAt ? new Date(artisan.createdAt).toLocaleDateString() : "-"}</span>
              </div>
              <Button className="w-full mt-2" onClick={() => navigate(`/chat/${id}`)}>
                <MessageCircle className="w-4 h-4 mr-2" /> Chat with Seller
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Shop Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Shop Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total products listed</span>
                <span className="font-medium">{artisan?.overview?.productCount ?? 0}</span>
              </div>
              <div>
                <div className="text-muted-foreground mb-2">Categories</div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                  {!categories.length ? <span className="text-sm text-muted-foreground">No categories</span> : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top-selling / Featured</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(artisan?.overview?.topSelling || []).map((p, i) => {
                  const image = Array.isArray(p?.images) && p.images.length
                    ? p.images[0]
                    : p?.image || (Array.isArray(p?.imagesData) && p.imagesData[0]?.url) || undefined;
                  return (
                    <ProductCard
                      key={p._id || i}
                      id={p._id}
                      name={p.name}
                      price={p.price}
                      artisan={artisan?.name || ""}
                      location={p.category || ""}
                      story={p.description || ""}
                      image={image}
                      tags={p.tags || []}
                    />
                  );
                })}
                {!artisan?.overview?.topSelling?.length ? (
                  <div className="text-sm text-muted-foreground">No featured products</div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product catalog with search & filters */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <Input placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} />
              <select className="h-10 rounded-md border bg-background px-3" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Button onClick={() => loadArtisan(1)} disabled={loading}>Apply</Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-60 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {catalogItems.map((p, i) => {
                    const image = Array.isArray(p?.images) && p.images.length
                      ? p.images[0]
                      : p?.image || (Array.isArray(p?.imagesData) && p.imagesData[0]?.url) || undefined;
                    return (
                      <ProductCard
                        key={p._id || i}
                        id={p._id}
                        name={p.name}
                        price={p.price}
                        artisan={artisan?.name || ""}
                        location={p.category || ""}
                        story={p.description || ""}
                        image={image}
                        tags={p.tags || []}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {artisan?.overview?.catalog.page || 1} of {artisan?.overview?.catalog.pages || 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={(artisan?.overview?.catalog.page || 1) <= 1 || loading}
                      onClick={() => {
                        const next = Math.max(1, (artisan?.overview?.catalog.page || 1) - 1);
                        setPage(next);
                        loadArtisan(next);
                      }}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      disabled={(artisan?.overview?.catalog.page || 1) >= (artisan?.overview?.catalog.pages || 1) || loading}
                      onClick={() => {
                        const next = Math.min((artisan?.overview?.catalog.pages || 1), (artisan?.overview?.catalog.page || 1) + 1);
                        setPage(next);
                        loadArtisan(next);
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}