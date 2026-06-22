import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";
import { FaStar } from "react-icons/fa";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  // Generate deterministic mockup rating & reviews based on product id
  const rating = ((product.id * 7.7) % 1.3 + 3.6).toFixed(1);
  const reviewsCount = (product.id * 23) % 240 + 15;
  const originalPrice = Math.round(product.price * 1.25);

  return (
    <Link
      to={`/products/${product.id}`}
      className="
        block
        bg-theme-card
        rounded-lg
        overflow-hidden
        border
        border-theme
        hover:shadow-md
        transition-all
        duration-300
        w-full
        max-w-[280px]
        flex
        flex-col
        h-full
        group
      "
    >
      {/* Image Container */}
      <div className="relative pt-[100%] bg-white dark:bg-[#1e293b] border-b border-theme overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="
            absolute
            top-0
            left-0
            w-full
            h-full
            object-contain
            p-5
            group-hover:scale-105
            transition-transform
            duration-300
          "
        />
        
        {/* Discount Badge */}
        <div className="absolute top-2.5 left-2.5 bg-[#388e3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm uppercase">
          20% OFF
        </div>
      </div>

      {/* Info Container */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[11px] font-medium text-theme-muted uppercase tracking-wider mb-1">
          {product.categoryName}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-theme-primary line-clamp-2 mb-1.5 hover:text-[#2874F0] dark:hover:text-[#5897ff] transition-colors leading-tight min-h-[36px]">
          {product.name}
        </h3>

        {/* Star Rating Panel */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 leading-none">
            <span>{rating}</span>
            <FaStar size={8} />
          </div>
          <span className="text-xs text-theme-muted">({reviewsCount})</span>
        </div>

        {/* Price Panel */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-base font-bold text-theme-primary">₹{product.price}</span>
          <span className="text-xs text-theme-muted line-through">₹{originalPrice}</span>
        </div>

        {/* Stock & Delivery details */}
        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-theme/60 text-xs font-medium">
          <span
            className={`font-medium ${
              product.stock === 0
                ? "text-red-500"
                : product.stock <= 5
                  ? "text-orange-500"
                  : "text-green-500"
            }`}
          >
            {product.stock === 0
              ? "Out of Stock"
              : product.stock <= 5
                ? `Low Stock (${product.stock} left)`
                : "In Stock"}
          </span>
          <span className="text-theme-muted text-[11px]">Free Delivery</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;