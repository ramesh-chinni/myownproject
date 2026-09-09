import { Product } from "../data/products";
import { useApp } from "../context/AppContext";
import StarRating from "./StarRating";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { navigate, addToCart, wishlist, toggleWishlist } = useApp();
  const isWishlisted = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="card product-card flex flex-col overflow-hidden group cursor-pointer"
      onClick={() => navigate("product-detail", product.id)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ background: "#F3F4F6", aspectRatio: "1/1" }}>
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img w-full h-full object-cover"
        />
        {/* Badge */}
        {product.badge && (
          <span className={`badge absolute top-3 left-3 ${
            product.badge === "Sale" ? "badge-sale" :
            product.badge === "New" ? "badge-new" : "badge-hot"
          }`}>
            {product.badge === "Sale" && discount ? `-${discount}%` : product.badge}
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted ? "#EF4444" : "none"} stroke={isWishlisted ? "#EF4444" : "#6B7280"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <p className="text-xs font-medium" style={{ color: "var(--primary)", fontFamily: "Outfit, sans-serif" }}>
          {product.category}
        </p>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: "var(--text)", fontFamily: "Outfit, sans-serif" }}>
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-0.5">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-2">
          <span className="text-lg font-bold" style={{ color: "var(--text)", fontFamily: "Outfit, sans-serif" }}>
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          className="btn-primary w-full py-2 text-sm mt-1"
          style={{ fontSize: "0.8125rem" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
