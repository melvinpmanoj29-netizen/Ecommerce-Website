import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaSearch, FaChevronDown, FaBox, FaSignOutAlt, FaShieldAlt, FaSun, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCart } from "../../services/cartService";

function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // State for dark mode theme
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Toggle Dark Mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Load cart count dynamically to show on the badge
  // Load cart count dynamically to show on the badge
  useEffect(() => {
    const loadCartCount = async () => {
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const items = await getCart();

        const count = items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );

        setCartCount(count);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setCartCount(0);
        } else {
          console.error("Failed to load cart count", error);
        }
      }
    };

    loadCartCount();

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [token]);

  const handleLogout = () => {  
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#2874F0] dark:bg-[#131b2e] text-white shadow-md border-b dark:border-[#24324f] transition-colors duration-200">
      <div className="max-w-[1240px] mx-auto px-4 flex h-[64px] items-center gap-4 md:gap-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col min-w-fit leading-tight select-none">
          <span className="text-2xl font-black tracking-tight italic font-outfit text-white">
            ME10X<span className="text-[#FFE500]">LUXE</span>
          </span>
          <span className="text-[10px] text-blue-100 dark:text-gray-400 flex items-center gap-0.5 italic">
            Explore <span className="text-[#FFE500] font-bold">Plus ✦</span>
          </span>
        </Link>

        {/* Search Bar - Center */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-[600px] relative hidden sm:flex">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 pl-4 pr-12 py-2 rounded-sm text-sm focus:outline-none shadow-inner border-none focus:ring-0"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-4 bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-[#2e3b4e] text-[#2874F0] dark:text-[#FFE500] transition-colors rounded-r-sm cursor-pointer"
          >
            <FaSearch size={16} />
          </button>
        </form>

        {/* Navigation links & Profile */}
        <div className="flex items-center gap-4 md:gap-6 ml-auto text-sm">
          
          <Link
            to="/products"
            className="font-semibold hover:text-[#FFE500] transition-colors py-2"
          >
            Products
          </Link>

          {/* User Profile Menu */}
          {token ? (
            <div className="relative group py-2 cursor-pointer flex items-center gap-1 hover:text-[#FFE500] transition-colors">
              <FaUserCircle size={18} className="text-blue-100 dark:text-gray-400 group-hover:text-[#FFE500]" />
              <span className="max-w-[80px] md:max-w-[100px] truncate font-semibold">
                {user?.name || "Profile"}
              </span>
              <FaChevronDown size={10} className="transition-transform group-hover:rotate-180" />

              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-0.5 w-[200px] bg-white dark:bg-[#131b2e] rounded-sm shadow-xl border border-gray-100 dark:border-[#24324f] py-1.5 text-gray-800 dark:text-slate-200 hidden group-hover:block transition-all duration-200">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-[#24324f]">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Welcome,</p>
                  <p className="font-semibold text-sm truncate">{user?.name}</p>
                </div>

                <Link to="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1b2640] text-sm">
                  <FaBox className="text-[#2874F0] dark:text-[#5897ff]" />
                  <span>My Orders</span>
                </Link>

                {user?.role === "Admin" && (
                  <Link to="/admin" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1b2640] text-sm">
                    <FaShieldAlt className="text-[#FB641B]" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-[#1b2640] text-sm text-red-600 dark:text-red-400 border-t border-gray-100 dark:border-[#24324f] mt-1.5 cursor-pointer text-left font-medium"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-[#2874F0] px-5 py-1.5 rounded-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm text-xs md:text-sm"
            >
              Login
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-blue-600 dark:hover:bg-slate-800 text-white transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <FaSun size={18} className="text-[#FFE500]" /> : <FaMoon size={16} />}
          </button>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="flex items-center gap-2 font-semibold hover:text-[#FFE500] transition-colors relative py-2"
          >
            <div className="relative">
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2 bg-[#FB641B] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center border border-[#2874F0] dark:border-[#131b2e] animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>
      
      {/* Mobile Search Bar - displayed only on mobile below the main header */}
      <div className="px-4 pb-3 pt-1 block sm:hidden bg-[#2874F0] dark:bg-[#131b2e]">
        <form onSubmit={handleSearchSubmit} className="flex relative w-full">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500 pl-4 pr-12 py-1.5 rounded-sm text-sm focus:outline-none shadow-inner border-none focus:ring-0"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-4 bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-[#2e3b4e] text-[#2874F0] dark:text-[#FFE500] transition-colors rounded-r-sm cursor-pointer"
          >
            <FaSearch size={14} />
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navbar;