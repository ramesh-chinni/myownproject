import { Product } from "../data/products";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id?: number | string;
  order_id?: string;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  selected_color?: string;
  selected_size?: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: "card" | "upi" | "cod";
  payment_status: "paid" | "pending" | "failed";
  status: "processing" | "packed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  items?: OrderItem[];
}

export interface CreateOrderInput {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  payment_method: "card" | "upi" | "cod";
  items: {
    product: Product;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
}
