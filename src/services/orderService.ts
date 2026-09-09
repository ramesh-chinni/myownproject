import { supabase } from "../lib/supabase";
import { Order, OrderItem, CreateOrderInput } from "../types/database";

const LOCAL_ORDERS_KEY = "myshop_user_orders";

function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalOrder(order: Order) {
  try {
    const orders = getLocalOrders();
    // Prepend new order
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn("Could not cache order in localStorage:", err);
  }
}

export async function createOrder(
  input: CreateOrderInput,
  userId: string | null = null
): Promise<Order> {
  const orderId = "ORD-" + Math.floor(10000000 + Math.random() * 90000000).toString();
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const delivery_fee = subtotal > 499 ? 0 : (subtotal > 0 ? 49 : 0);
  const total = Number((subtotal + delivery_fee).toFixed(2));

  const orderItems: OrderItem[] = input.items.map((item) => ({
    order_id: orderId,
    product_id: item.product.id,
    product_name: item.product.name,
    product_image: item.product.image,
    price: item.product.price,
    quantity: item.quantity,
    selected_color: item.selectedColor,
    selected_size: item.selectedSize,
  }));

  const newOrder: Order = {
    id: orderId,
    user_id: userId,
    customer_name: input.customer_name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    state: input.state,
    zip: input.zip,
    country: input.country,
    subtotal: Number(subtotal.toFixed(2)),
    delivery_fee,
    total,
    payment_method: input.payment_method,
    payment_status: input.payment_method === "cod" ? "pending" : "paid",
    status: "processing",
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  // Always cache locally so customer sees immediate confirmation
  saveLocalOrder(newOrder);

  // Attempt saving to Supabase if orders table exists
  try {
    const { error: orderError } = await supabase.from("orders").insert([
      {
        id: newOrder.id,
        user_id: newOrder.user_id,
        customer_name: newOrder.customer_name,
        email: newOrder.email,
        phone: newOrder.phone,
        address: newOrder.address,
        city: newOrder.city,
        state: newOrder.state,
        zip: newOrder.zip,
        country: newOrder.country,
        subtotal: newOrder.subtotal,
        delivery_fee: newOrder.delivery_fee,
        total: newOrder.total,
        payment_method: newOrder.payment_method,
        payment_status: newOrder.payment_status,
        status: newOrder.status,
      },
    ]);

    if (!orderError) {
      // Try inserting order items
      await supabase.from("order_items").insert(
        orderItems.map((item) => ({
          order_id: item.order_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price,
          quantity: item.quantity,
          selected_color: item.selected_color,
          selected_size: item.selected_size,
        }))
      );
    } else {
      console.warn("Notice: Supabase orders table not ready yet, stored locally.", orderError.message);
    }
  } catch (err) {
    console.warn("Could not insert order into Supabase, kept locally:", err);
  }

  return newOrder;
}

export async function fetchUserOrders(
  userId?: string | null,
  email?: string | null
): Promise<Order[]> {
  const localOrders = getLocalOrders();

  // If no user is logged in, return local orders matching email if provided, or all local
  if (!userId) {
    if (email) {
      return localOrders.filter(
        (o) => o.email.toLowerCase() === email.toLowerCase()
      );
    }
    return localOrders;
  }

  try {
    const { data: dbOrders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .or(`user_id.eq.${userId},email.eq.${email || ""}`)
      .order("created_at", { ascending: false });

    if (!error && dbOrders && dbOrders.length > 0) {
      // Map Supabase orders
      const mapped: Order[] = dbOrders.map((o: any) => ({
        id: o.id,
        user_id: o.user_id,
        customer_name: o.customer_name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        city: o.city,
        state: o.state,
        zip: o.zip,
        country: o.country,
        subtotal: Number(o.subtotal),
        delivery_fee: Number(o.delivery_fee),
        total: Number(o.total),
        payment_method: o.payment_method,
        payment_status: o.payment_status,
        status: o.status,
        created_at: o.created_at,
        items: o.order_items || [],
      }));

      // Merge with local orders that might not be in DB yet
      const dbIds = new Set(mapped.map((o) => o.id));
      const unSyncedLocal = localOrders.filter(
        (o) =>
          !dbIds.has(o.id) &&
          (o.user_id === userId || (email && o.email.toLowerCase() === email.toLowerCase()))
      );

      return [...unSyncedLocal, ...mapped];
    }
  } catch (err) {
    console.warn("Could not fetch orders from Supabase:", err);
  }

  // Fallback to local
  return localOrders.filter(
    (o) =>
      o.user_id === userId ||
      (email && o.email.toLowerCase() === email.toLowerCase())
  );
}

export function fetchOrderByIdLocal(orderId: string): Order | null {
  const orders = getLocalOrders();
  return orders.find((o) => o.id === orderId) || null;
}
