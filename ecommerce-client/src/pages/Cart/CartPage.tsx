import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getCart, updateCart, removeCartItem } from "../../services/cartService";
import toast from "react-hot-toast";
import type { CartItem } from "../../types/CartItem";
import { Link } from "react-router-dom";
import { checkout } from "../../services/paymentService";
import Button from "../../components/buttons/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { FaTrash, FaPlus, FaMinus, FaLock } from "react-icons/fa";

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const handleCheckout = async () => {
    try {
      sessionStorage.removeItem("paymentCompleted");
      sessionStorage.removeItem("paymentProcessing");
      const url = await checkout();
      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to start checkout process");
    }
  };

  const increaseQuantity = async (itemId: number,currentQty: number,stock: number) => {
    try {
      if (currentQty >= stock) {
        toast.error(`Only ${stock} items available`);
        return;
      }
      await updateCart(itemId, currentQty + 1);
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Could not update item quantity");
    }
  };

  const decreaseQuantity = async (itemId: number, currentQty: number) => {
    if (currentQty <= 1) return;
    try {
      await updateCart(itemId, currentQty - 1);
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Could not update item quantity");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await removeCartItem(itemId);
      loadCart();
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Could not delete item");
    }
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await getCart();
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.subTotal, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Simulated retail savings stats (25% markup original value)
  const mockOriginalTotal = Math.round(total * 1.25);
  const discountSavings = mockOriginalTotal - total;

  if (loading) {
    return (
      <MainLayout>
        <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-[600px] mx-auto text-center py-20 px-6 bg-theme-card border border-theme rounded-md shadow-sm my-6 transition-colors duration-200">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-theme-primary mb-2 font-outfit">
            Your Cart is Empty!
          </h2>
          <p className="text-sm text-theme-muted mb-8 max-w-sm mx-auto">
            Explore our curated collection of tech devices and place items here to check out.
          </p>
          <Link to="/products" className="inline-block">
            <Button variant="primary" className="px-8 py-3 font-semibold">
              Browse Products
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-xl md:text-2xl font-bold text-theme-primary mb-6 font-outfit">
        Shopping Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="flex-1 w-full space-y-4">
          <div className="bg-theme-card border border-theme rounded-md shadow-sm divide-y divide-theme/60 transition-colors duration-200">
            {items.map((item) => (
              <div key={item.id} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Item Thumbnail */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-800 rounded border border-theme p-2 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Item Info Description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-semibold text-theme-primary truncate hover:text-[#2874F0] dark:hover:text-[#5897ff]">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-theme-muted mt-0.5">Seller: ME10XLUXE Retail</p>
                  
                  {/* Pricing line */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-bold text-theme-primary">₹{item.subTotal}</span>
                    <span className="text-xs text-theme-muted font-medium">({item.quantity} × ₹{item.subTotal / item.quantity})</span>
                  </div>
                </div>

                {/* Adjuster Controls */}
                <div className="flex flex-row sm:flex-col items-center gap-3.5 sm:gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start pt-3 sm:pt-0 border-t border-theme/40 sm:border-t-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.quantity)}
                      disabled={item.quantity <= 1}
                      className="w-7 h-7 bg-theme-body border border-theme rounded-full flex items-center justify-center text-theme-primary hover:bg-gray-150 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus size={8} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-theme-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.id,item.quantity,item.stock)}
                      disabled={item.quantity >= item.stock}
                      disabled:opacity-40 disabled:cursor-not-allowed
                      className="w-7 h-7 bg-theme-body border border-theme rounded-full flex items-center justify-center text-theme-primary hover:bg-gray-150 transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <FaPlus size={8} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer border-none bg-transparent font-medium py-1.5"
                  >
                    <FaTrash size={10} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Invoice Sidebar */}
        <div className="w-full lg:w-[360px] shrink-0 sticky top-[80px]">
          <div className="bg-theme-card border border-theme rounded-md shadow-sm p-4 md:p-5 transition-colors duration-200">
            <h2 className="text-xs font-bold text-theme-secondary uppercase tracking-wider border-b border-theme/60 pb-3 mb-4">
              Price Details
            </h2>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-theme-secondary">
                <span>Price ({totalItemsCount} item{totalItemsCount !== 1 ? "s" : ""})</span>
                <span>₹{mockOriginalTotal}</span>
              </div>
              <div className="flex justify-between text-[#388e3c] dark:text-green-400 font-medium">
                <span>Discount</span>
                <span>- ₹{discountSavings}</span>
              </div>
              <div className="flex justify-between text-theme-secondary">
                <span>Delivery Charges</span>
                <span className="text-[#388e3c] dark:text-green-400">FREE</span>
              </div>
              
              <div className="border-t border-dashed border-theme/80 pt-3.5 mt-2 flex justify-between text-base font-black text-theme-primary">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Savings Tag */}
            {discountSavings > 0 && (
              <div className="bg-[#388e3c]/10 dark:bg-green-950/20 text-[#388e3c] dark:text-green-400 border border-[#388e3c]/20 text-xs font-bold rounded-sm p-3 mt-4 text-center">
                🎉 You will save ₹{discountSavings} on this order
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#fb641b] hover:bg-[#e04f0b] text-white font-bold py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 text-sm uppercase tracking-wide cursor-pointer transition-colors shadow-sm mt-5 active:scale-[0.99]"
            >
              <FaLock size={12} />
              <span>Place Order</span>
            </button>
            
            <div className="text-[10px] text-theme-muted mt-3 text-center flex items-center justify-center gap-1 font-semibold">
              <FaLock /> Safe and Secure Payments. Easy returns.
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default CartPage;