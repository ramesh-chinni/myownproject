import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";

function AppContent() {
  const { page } = useApp();

  // Pages that use a full-screen layout (no shared navbar/footer)
  const fullScreen = page === "login" || page === "register" || page === "order-success";

  if (fullScreen) {
    return (
      <div className="min-h-full">
        {page === "login" && <LoginPage />}
        {page === "register" && <RegisterPage />}
        {page === "order-success" && <OrderSuccessPage />}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <div className="flex-1">
        {page === "home" && <HomePage />}
        {page === "products" && <ProductsPage />}
        {page === "product-detail" && <ProductDetailPage />}
        {page === "cart" && <CartPage />}
        {page === "checkout" && <CheckoutPage />}
        {page === "orders" && <OrdersPage />}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
