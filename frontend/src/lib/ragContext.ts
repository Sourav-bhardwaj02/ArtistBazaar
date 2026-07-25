import { mockProductData, Product } from "./productData";
import { apiService } from "@/api/api";

let cachedCatalog: Product[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 30000; // 30 seconds

/**
 * Fetches all products (live from backend API + fallback mock data)
 */
export const getAllCatalogProducts = async (): Promise<Product[]> => {
  const now = Date.now();
  if (cachedCatalog && now - lastCacheTime < CACHE_TTL) {
    return cachedCatalog;
  }

  let liveProducts: Product[] = [];
  try {
    const data: any = await apiService.getProducts({ limit: "100" });
    if (data && Array.isArray(data.items)) {
      liveProducts = data.items.map((item: any) => {
        const imageUrl =
          (Array.isArray(item.images) && item.images[0]) ||
          (Array.isArray(item.imagesData) && item.imagesData[0]?.url) ||
          item.image ||
          "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop";
        return {
          id: item._id || String(Math.random()),
          name: item.name,
          description: item.description || "",
          category: item.category || "Craft",
          price: String(item.price || 0),
          artisan: item.seller?.name || item.artisan || "Local Artisan",
          location: item.location || item.category || "India",
          tags: item.tags || [],
          url: `/products/${item._id}`,
          imageUrl: imageUrl,
        };
      });
    }
  } catch (error) {
    console.warn("Could not fetch live products for RAG context, fallback to mock data:", error);
  }

  // Merge live products with mockProductData without duplicates
  const liveIds = new Set(liveProducts.map((p) => p.id));
  const liveNames = new Set(liveProducts.map((p) => p.name.toLowerCase()));

  const merged = [...liveProducts];
  for (const mockP of mockProductData) {
    if (!liveIds.has(mockP.id) && !liveNames.has(mockP.name.toLowerCase())) {
      merged.push(mockP);
    }
  }

  cachedCatalog = merged;
  lastCacheTime = now;
  return merged;
};

/**
 * Simulates the RAG process by filtering product data based on the query.
 */
export const fetchRAGContext = async (userQuery: string): Promise<string> => {
  const allProducts = await getAllCatalogProducts();
  const lowerQuery = userQuery.toLowerCase();
  
  // Define non-significant words to filter out
  const stopWords = /a|an|the|is|are|in|for|of|on|show|me|to|i|want|need|have|any|product|art|item|look|find|what/i;

  // Extract significant keywords
  const significantWords = lowerQuery
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.test(w));

  // Determine if it's a general shopping query to return all products as a fallback
  const isGeneralShoppingQuery = significantWords.length === 0 && lowerQuery.length > 3;

  let relevantProducts: Product[] = [];

  if (isGeneralShoppingQuery) {
    relevantProducts = allProducts.slice(0, 6);
  } else {
    // Core robust search logic
    relevantProducts = allProducts.filter((p) => {
      const productSearchableString = [
        p.name,
        p.description,
        p.category,
        p.artisan,
        p.location,
        ...(p.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      // Check if ANY of the significant words match the product string
      return significantWords.some((word) => productSearchableString.includes(word));
    });
  }

  if (relevantProducts.length === 0) {
    return "No products found matching the specific query in the catalog.";
  }

  // Format the data as RAG context for Gemini
  const productContext = relevantProducts
    .slice(0, 6)
    .map(
      (p) =>
        `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ₹${p.price}, Artisan: ${p.artisan}, Location: ${p.location}, Description: ${p.description.substring(0, 100)}..., URL: /products/${p.id}`
    )
    .join("\n---\n");

  return productContext;
};
