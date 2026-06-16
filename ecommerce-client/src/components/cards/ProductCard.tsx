import { Link } from "react-router-dom";
import type { Product } from "../../types/Product";

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="
      block
      bg-slate-800
      rounded-xl
      overflow-hidden
      shadow-lg
      border
      border-slate-700
      hover:-translate-y-2
      hover:shadow-2xl
      hover:border-blue-500
      transition-all
      duration-300
      "
    >
      <div className="relative">

        <img
          src={product.imageUrl}
          alt={product.name}
          className="
          w-full
          h-56
          object-cover
          "
        />

        <div
          className="
          absolute
          top-3
          right-3
          bg-blue-600
          text-white
          text-sm
          px-3
          py-1
          rounded-full
          "
        >
          ₹{product.price}
        </div>

      </div>

      <div className="p-5">

        <h3
          className="
          text-xl
          font-bold
          mb-2
          "
        >
          {product.name}
        </h3>

        <p
          className="
          text-slate-400
          text-sm
          line-clamp-2
          "
        >
          {product.description}
        </p>

        <div
          className="
          flex
          justify-between
          items-center
          mt-5
          "
        >

          <span
            className="
            text-green-400
            text-sm
            font-semibold
            "
          >
            In Stock
          </span>

          <span
            className="
            text-blue-400
            font-semibold
            "
          >
            View Details →
          </span>

        </div>

      </div>
    </Link>
  );
}

export default ProductCard;