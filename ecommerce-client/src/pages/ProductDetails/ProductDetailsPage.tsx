import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import Button from "../../components/buttons/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { getProductById } from "../../services/productDetailsService";
import { addToCart } from "../../services/cartService";
import { getReviews, createReview } from "../../services/reviewService";

import { FaStar, FaShoppingCart, FaBolt, FaShieldAlt, FaTruck, FaRedo } from "react-icons/fa";

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
    loadReviews();
  }, [id]);

  const loadReviews = async () => {
    try {
      const data = await getReviews(Number(id));
      setReviews(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      await createReview(Number(id), rating, comment);
      toast.success("Review submitted successfully");
      setComment("");
      setRating(5);
      loadReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    }
  };

  const loadProduct = async () => {
    try {
      const data = await getProductById(Number(id));
      setProduct(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, 1);
      toast.success("Added to cart!");
      
      // Dispatch a custom event to update the cart badge in Navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Could not add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await addToCart(product.id, 1);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.error(error);
      toast.error("Could not process transaction");
    }
  };

  if (!product) {
    return (
      <MainLayout>
        <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  // Mock pricing and stats
  const originalPrice = Math.round(product.price * 1.25);
  const avgRating = ((product.id * 7.7) % 1.3 + 3.6).toFixed(1);
  const totalRatings = (product.id * 31) % 400 + 45;

  return (
    <MainLayout>
      {/* Category Breadcrumb */}
      <div className="text-xs text-theme-muted mb-4 font-semibold tracking-wide flex items-center gap-1.5 uppercase transition-colors duration-200">
        <span>Home</span>
        <span>/</span>
        <span>Products</span>
        <span>/</span>
        <span className="text-[#2874F0] dark:text-[#5897ff]">{product.categoryName}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-theme-card border border-theme rounded-md p-6 shadow-sm mb-6 transition-colors duration-200">
        
        {/* Left Column: Image viewer & Buy buttons */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col items-center">
          <div className="w-full aspect-square border border-theme rounded-sm bg-white dark:bg-[#1e293b] flex items-center justify-center p-6 mb-4 overflow-hidden relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain max-h-[350px] transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Flipkart-style Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-3.5 mt-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock <= 0}
              className="w-full bg-[#ff9f00] hover:bg-[#e08c00] text-white font-bold py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-sm md:text-base uppercase tracking-wide cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaShoppingCart />
              <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full bg-[#fb641b] hover:bg-[#e04f0b] text-white font-bold py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-sm md:text-base uppercase tracking-wide cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaBolt />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Product Specs */}
        <div className="flex-1 flex flex-col">
          {/* Title block */}
          <h1 className="text-xl md:text-2xl font-semibold text-theme-primary mb-2 leading-tight">
            {product.name}
          </h1>

          {/* Ratings badge */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded-sm flex items-center gap-0.5 leading-none">
              <span>{avgRating}</span>
              <FaStar size={10} />
            </div>
            <span className="text-xs text-theme-muted font-semibold">
              {totalRatings} Ratings & {reviews.length} Reviews
            </span>
          </div>

          {/* Price Block */}
          <div className="bg-[#388e3c]/5 dark:bg-green-950/20 border border-[#388e3c]/20 rounded-md p-4 mb-5 flex flex-col">
            <span className="text-[11px] text-[#388e3c] dark:text-green-400 font-bold uppercase tracking-wider mb-1">
              Special Price
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-theme-primary">₹{product.price}</span>
              <span className="text-sm text-theme-muted line-through">₹{originalPrice}</span>
              <span className="text-sm text-[#388e3c] dark:text-green-400 font-bold">20% off</span>
            </div>
          </div>

          {/* Stock state */}
          <div className="mb-6 flex items-center gap-3">
            <span className="text-sm font-semibold text-theme-secondary">Availability:</span>
            <span className={`text-sm font-bold ${product.stock > 0 ? "text-[#388e3c]" : "text-red-500"}`}>
              {product.stock > 0 ? `In Stock (only ${product.stock} items left)` : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6 border-t border-theme/60 pt-4">
            <h2 className="text-sm font-bold text-theme-primary uppercase tracking-wide mb-2">
              Product Description
            </h2>
            <p className="text-sm text-theme-secondary leading-relaxed whitespace-pre-line">
              {product.description || "No description available for this item."}
            </p>
          </div>

          {/* Highlights / Features list */}
          <div className="border-t border-theme/60 pt-4 mb-6">
            <h2 className="text-sm font-bold text-theme-primary uppercase tracking-wide mb-3">
              Delivery Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-theme-secondary">
              <div className="flex items-center gap-2">
                <FaTruck className="text-[#2874F0] text-sm shrink-0" />
                <span>Free Home Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-green-600 text-sm shrink-0" />
                <span>1 Year Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <FaRedo className="text-orange-500 text-sm shrink-0" />
                <span>7 Days Return Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review timelines split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        
        {/* Write a Review Form */}
        <section className="bg-theme-card border border-theme rounded-md p-5 shadow-sm transition-colors duration-200">
          <h2 className="text-lg font-bold text-theme-primary mb-4 font-outfit">
            Write a Customer Review
          </h2>
          
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label htmlFor="rating-select" className="mb-1.5 font-semibold text-xs text-theme-secondary uppercase">
                Select Rating
              </label>
              <select
                id="rating-select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-theme-body"
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>

            <div>
              <label htmlFor="comment-textarea" className="mb-1.5 font-semibold text-xs text-theme-secondary uppercase">
                Review Details
              </label>
              <textarea
                id="comment-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience about this product's quality, packaging, delivery..."
                rows={4}
                className="w-full bg-theme-body"
              />
            </div>

            <Button type="submit" variant="primary" className="px-5 py-2 font-semibold">
              Submit Review
            </Button>
          </form>
        </section>

        {/* Customer Reviews Feed */}
        <section className="bg-theme-card border border-theme rounded-md p-5 shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
          <h2 className="text-lg font-bold text-theme-primary mb-4 font-outfit">
            Customer Reviews ({reviews.length})
          </h2>

          <div className="flex-1 space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <p className="text-sm text-theme-muted italic text-center py-12">
                No reviews yet. Be the first to share your opinion!
              </p>
            ) : (
              reviews.map((review) => {
                // Fetch first letter of user name for profile avatar initial
                const initial = review.userName ? review.userName.charAt(0).toUpperCase() : "?";
                
                return (
                  <div
                    key={review.id}
                    className="border-b border-theme/60 pb-3.5 last:border-b-0"
                  >
                    {/* User profile row */}
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-[#2874F0] dark:text-[#5897ff] flex items-center justify-center text-xs font-bold font-outfit border border-blue-200/40">
                        {initial}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-theme-primary">
                          {review.userName || "Verified User"}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <div className="text-yellow-400 text-xs flex">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                          <span className="text-[10px] text-theme-muted">Verified Buyer</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Comment text */}
                    <p className="text-sm text-theme-secondary leading-relaxed pl-1">
                      {review.comment}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default ProductDetailsPage;