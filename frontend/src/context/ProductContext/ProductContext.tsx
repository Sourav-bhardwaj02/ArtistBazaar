// src/context/ProductContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { apiService } from "@/api/api";

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  // Primary field used by the UI
  images?: string[];
  // Possible backend variants we'll normalize from
  image?: string;
  imagesData?: Array<{ url?: string; publicId?: string }>;
  tags?: string[];
  artisan?: string;
  location?: string;
  seller?: { name?: string };
}

interface ProductListResponse {
  items: any[];
  total: number;
  page: number;
  pages: number;
}

interface ProductContextType {
  products: ApiProduct[];
  setProducts: (products: ApiProduct[]) => void;
  q: string;
  setQ: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  page: number;
  setPage: (page: number) => void;
  pages: number;
  setPages: (pages: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchProducts: (p?: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

import { mockProductData } from "@/lib/productData";

const initialProducts: ApiProduct[] = mockProductData.map((m) => ({
  _id: m.id,
  name: m.name,
  description: m.description,
  category: m.category,
  price: Number(m.price.replace(/,/g, "")) || 1000,
  images: [m.imageUrl],
  tags: m.tags,
  artisan: m.artisan,
  location: m.location,
}));

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(Math.ceil(initialProducts.length / 24));
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (p = 1) => {
    setLoading(true);
    try {
      const data = (await apiService.getProducts({
        page: p.toString(),
        limit: "24",
        ...(q && { q }),
        ...(category && { category }),
        ...(tags.length > 0 && { tags: tags.join(",") }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      })) as ProductListResponse;
      
      // Normalize image fields so UI always gets images: string[]
      const fetchedItems: ApiProduct[] = (data.items || []).map((item: any) => {
        const mockMatch = mockProductData.find(
          (m) =>
            m.name.toLowerCase() === (item?.name || "").toLowerCase() ||
            m.id === item?._id ||
            (item?.name && m.name.toLowerCase().includes(item.name.toLowerCase())) ||
            (item?.name && item.name.toLowerCase().includes(m.name.toLowerCase()))
        );

        let imgs: string[] = Array.isArray(item?.images) && item.images.length
          ? item.images
          : Array.isArray(item?.imagesData) && item.imagesData.length
            ? item.imagesData.map((x: any) => x?.url).filter(Boolean)
            : item?.image
              ? [item.image]
              : [];

        if (mockMatch?.imageUrl) {
          imgs = [mockMatch.imageUrl, ...imgs.filter(img => img !== mockMatch.imageUrl)];
        } else if (imgs.length === 0 || imgs[0].includes("example.com") || imgs[0].includes("placehold.co")) {
          imgs = ["https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop"];
        }

        return {
          ...item,
          name: item.name || mockMatch?.name || "Handcrafted Item",
          description: item.description || mockMatch?.description || "Authentic handmade craft.",
          artisan: item.seller?.name || item.artisan || mockMatch?.artisan || "Local Artisan",
          location: item.location || mockMatch?.location || "India",
          images: imgs,
        } as ApiProduct;
      });

      // Merge fetched items with mockProductData so catalog is never empty
      const existingIds = new Set(fetchedItems.map((x) => x._id));
      const mergedItems = [...fetchedItems];
      for (const mockItem of initialProducts) {
        if (!existingIds.has(mockItem._id)) {
          mergedItems.push(mockItem);
        }
      }

      setProducts(mergedItems);
      setPage(data.page || p);
      setPages(data.pages || Math.ceil(mergedItems.length / 24));
    } catch (error) {
      console.error("Error fetching products, falling back to mock catalog:", error);
      setProducts(initialProducts);
      setPages(Math.ceil(initialProducts.length / 24));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, [q, category, tags, minPrice, maxPrice]);

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
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
        setPage,
        pages,
        setPages,
        loading,
        setLoading,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};

export default ProductContext;