// src/components/Products.tsx
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Loader2, Filter, X } from "lucide-react";
import { useProductContext } from "@/context/ProductContext/ProductContext";

export default function Products() {
  const {
    products,
    q,
    setQ,
    category,
    setCategory,
    tags,
    setTags,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    page,
    pages,
    loading,
    fetchProducts,
  } = useProductContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const availableCategories = ["Pottery", "Jewelry", "Textiles", "Woodwork", "Bamboo"];
  const availableTags = ["handmade", "traditional", "eco", "gift", "premium"];
  const selectedTagSet = useMemo(() => new Set(tags), [tags]);

  const toggleTag = (tag: string) => {
    setTags(
      selectedTagSet.has(tag)
        ? tags.filter((t) => t !== tag)
        : [...tags, tag]
    );
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
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search handmade products..."
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <select
              className="w-full h-10 mt-1 rounded-md border bg-background"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {availableCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Tags</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${selectedTagSet.has(t)
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-muted"
                    }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Price Range</label>
            <div className="flex gap-2 mt-2">
              <Input
                className="w-1/2"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                className="w-1/2"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={() => fetchProducts(1)} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Apply Filters
          </Button>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3 overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-2xl animate-pulse overflow-hidden" />
              ))}
            </div>
          ) : products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-xs sm:text-sm md:text-base overflow-hidden">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  price={p.price}
                  artisan={p.artisan || "Local Artisan"}
                  location={p.location || p.category}
                  story={p.description}
                  images={p.images}
                  tags={p.tags}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-20 overflow-hidden">
              No products found. Try adjusting your filters.
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-8 text-sm md:text-base">
              <Button
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => fetchProducts(page - 1)}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {pages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pages || loading}
                onClick={() => fetchProducts(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
