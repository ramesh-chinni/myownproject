import { supabase } from "../lib/supabase";
import { Product, products as fallbackProducts } from "../data/products";

// Convert raw database row into typed Product interface
function mapRowToProduct(row: any, index: number): Product {
  const fallback = fallbackProducts[index % fallbackProducts.length] || fallbackProducts[0];

  return {
    id: Number(row.id) || fallback.id,
    name: row.name || fallback.name,
    price: Number(row.price) || fallback.price,
    originalPrice: row.original_price ?? row.originalPrice ?? fallback.originalPrice,
    rating: Number(row.rating) || fallback.rating || 4.5,
    reviews: Number(row.reviews) || fallback.reviews || 50,
    category: row.category || fallback.category || "General",
    subcategory: row.subcategory || fallback.subcategory,
    image: row.image || fallback.image,
    images: Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : (row.image ? [row.image] : fallback.images || [fallback.image]),
    badge: row.badge || fallback.badge,
    description: row.description || fallback.description || "Premium quality product from MyShop.",
    colors: Array.isArray(row.colors) && row.colors.length > 0 ? row.colors : fallback.colors,
    sizes: Array.isArray(row.sizes) && row.sizes.length > 0 ? row.sizes : fallback.sizes,
    inStock: row.in_stock !== undefined ? Boolean(row.in_stock) : (row.inStock ?? true),
    seller: row.seller || fallback.seller || "MyShop Verified Store",
    deliveryDays: Number(row.delivery_days ?? row.deliveryDays ?? fallback.deliveryDays ?? 3),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.warn("Supabase products fetch warning, using fallback products:", error.message);
      return fallbackProducts;
    }

    if (data && data.length > 0) {
      // If the database has products, map them. If it has fewer than fallbackProducts, supplement with fallback products
      const mapped = data.map((row, idx) => mapRowToProduct(row, idx));
      if (mapped.length < fallbackProducts.length) {
        const existingIds = new Set(mapped.map((p) => p.id));
        const additional = fallbackProducts.filter((p) => !existingIds.has(p.id));
        return [...mapped, ...additional];
      }
      return mapped;
    }

    return fallbackProducts;
  } catch (err) {
    console.error("Error fetching products from Supabase:", err);
    return fallbackProducts;
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      return mapRowToProduct(data, 0);
    }
  } catch (err) {
    console.error("Error fetching single product from Supabase:", err);
  }

  const fallback = fallbackProducts.find((p) => p.id === id);
  return fallback || null;
}
