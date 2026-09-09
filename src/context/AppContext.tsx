import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product, products as initialFallbackProducts } from "../data/products";
import { fetchProducts } from "../services/productService";
import {
  signInUser,
  signUpUser,
  signOutUser,
  getCurrentUser,
  getUserProfile,
  onAuthStateChange,
} from "../services/authService";
import { createOrder, fetchUserOrders } from "../services/orderService";
import { Order, CreateOrderInput, UserProfile } from "../types/database";
import type { User } from "@supabase/supabase-js";

export type Page =
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "login"
  | "register"
  | "checkout"
  | "order-success"
  | "orders";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface AppContextType {
  page: Page;
  navigate: (page: Page, productId?: number) => void;
  selectedProductId: number | null;
  products: Product[];
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, qty?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  wishlist: number[];
  toggleWishlist: (productId: number) => void;
  lastOrderId: string;
  setLastOrderId: (id: string) => void;
  lastOrder: Order | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Auth state & methods
  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  // Orders
  orders: Order[];
  loadingOrders: boolean;
  placeOrder: (input: Omit<CreateOrderInput, "items">) => Promise<Order>;
  refreshOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Live products from Supabase
  const [products, setProducts] = useState<Product[]>(initialFallbackProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cart & Wishlist with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("myshop_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("myshop_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrderId, setLastOrderId] = useState("");
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auth & Profile
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem("myshop_cart", JSON.stringify(cart));
    } catch (err) {
      console.warn("Error saving cart to localStorage:", err);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem("myshop_wishlist", JSON.stringify(wishlist));
    } catch (err) {
      console.warn("Error saving wishlist to localStorage:", err);
    }
  }, [wishlist]);

  // Load products from Supabase
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const list = await fetchProducts();
      setProducts(list);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Load user orders
  const loadOrders = useCallback(async (currentUserId?: string | null, currentEmail?: string | null) => {
    setLoadingOrders(true);
    try {
      const list = await fetchUserOrders(currentUserId, currentEmail);
      setOrders(list);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Supabase Auth Listener
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          if (currentUser) {
            const userProf = await getUserProfile(currentUser.id);
            setProfile(userProf);
            loadOrders(currentUser.id, currentUser.email);
          } else {
            loadOrders(null, null);
          }
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    initAuth();

    const subscription = onAuthStateChange(async (_event, session) => {
      const authUser = session?.user || null;
      setUser(authUser);
      if (authUser) {
        const userProf = await getUserProfile(authUser.id);
        setProfile(userProf);
        loadOrders(authUser.id, authUser.email);
      } else {
        setProfile(null);
        loadOrders(null, null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [loadOrders]);

  const navigate = (newPage: Page, productId?: number) => {
    if (productId !== undefined) setSelectedProductId(productId);
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product: Product, qty = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id &&
          i.selectedColor === color &&
          i.selectedSize === size
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: qty,
          selectedColor: color,
          selectedSize: size,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty < 1) return removeFromCart(productId);
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("myshop_cart");
    } catch {}
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // Auth actions
  const login = async (email: string, pass: string) => {
    await signInUser(email, pass);
  };

  const register = async (email: string, pass: string, name: string) => {
    await signUpUser(email, pass, name);
  };

  const logout = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
    navigate("home");
  };

  // Place order
  const placeOrder = async (input: Omit<CreateOrderInput, "items">) => {
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const order = await createOrder(
      {
        ...input,
        items: cart,
      },
      user ? user.id : null
    );

    setLastOrder(order);
    setLastOrderId(order.id);
    clearCart();
    // Refresh user order list
    setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);

    return order;
  };

  const refreshOrders = async () => {
    await loadOrders(user ? user.id : null, user ? user.email : null);
  };

  return (
    <AppContext.Provider
      value={{
        page,
        navigate,
        selectedProductId,
        products,
        loadingProducts,
        refreshProducts: loadProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        wishlist,
        toggleWishlist,
        lastOrderId,
        setLastOrderId,
        lastOrder,
        searchQuery,
        setSearchQuery,
        user,
        profile,
        authLoading,
        login,
        register,
        logout,
        orders,
        loadingOrders,
        placeOrder,
        refreshOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
