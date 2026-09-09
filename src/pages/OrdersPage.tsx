import { useApp } from "../context/AppContext";

export default function OrdersPage() {
  const { orders, loadingOrders, navigate, user } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Delivered</span>;
      case "shipped":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Shipped</span>;
      case "packed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">Packed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Processing</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
            My Orders
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {user ? `Logged in as ${user.email}` : "Guest and recent orders on this device"}
          </p>
        </div>
        <button
          onClick={() => navigate("products")}
          className="btn-primary px-5 py-2.5 text-sm self-start sm:self-auto"
        >
          Continue Shopping
        </button>
      </div>

      {loadingOrders ? (
        <div className="card p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-500">Loading your orders from Supabase...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-12 text-center max-w-lg mx-auto">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
            No orders found
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            You haven't placed any orders yet. Discover trending products and start shopping!
          </p>
          <button
            onClick={() => navigate("products")}
            className="btn-primary px-6 py-3 text-sm"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={order.id} className="card p-6 border rounded-xl" style={{ borderColor: "var(--border)" }}>
                {/* Order Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order ID</p>
                      <p className="text-sm font-bold text-indigo-600 font-mono mt-0.5">{order.id}</p>
                    </div>
                    <div className="hidden sm:block h-6 w-px bg-gray-200" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date Placed</p>
                      <p className="text-sm font-medium text-gray-700 mt-0.5">{formattedDate}</p>
                    </div>
                    <div className="hidden sm:block h-6 w-px bg-gray-200" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Amount</p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xs uppercase px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                      {order.payment_method.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Shipping & Recipient Info */}
                <div className="py-3 text-xs text-gray-600 flex flex-wrap gap-x-6 gap-y-1">
                  <span><strong>Delivering to:</strong> {order.customer_name} ({order.phone})</span>
                  <span><strong>Address:</strong> {order.address}, {order.city}, {order.state} {order.zip}</span>
                </div>

                {/* Items List */}
                <div className="mt-3 flex flex-col gap-3">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-2 rounded-lg bg-gray-50">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-200"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product_name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: {item.quantity}
                            {item.selected_color && ` • Color: ${item.selected_color}`}
                            {item.selected_size && ` • Size: ${item.selected_size}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            (₹{item.price.toFixed(2)} each)
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No specific items listed.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
