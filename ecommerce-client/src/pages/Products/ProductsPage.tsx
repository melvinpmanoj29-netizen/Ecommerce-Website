import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/cards/ProductCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Button from "../../components/buttons/Button";

import type { Product } from "../../types/Product";

import { searchProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { FaFilter, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.get("category") || ""
  );
  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8; // Change page size to 8 to match visual grid rows of 4

  // Sync category and search query from URL search parameters
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const query = searchParams.get("search") || "";
    
    setSelectedCategory(category);
    setSearch(query);
    setPageNumber(1);
  }, [searchParams]);

  useEffect(() => {
  setPageNumber(1);
}, [selectedCategory, search, minPrice, maxPrice]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

 useEffect(() => {
  loadPagedProducts();
}, [
  pageNumber,
  selectedCategory,
  search,
  minPrice,
  maxPrice
]);
  
  const loadPagedProducts = async () => {
    try {
      setLoading(true);
          const data = await searchProducts(
        search,
        pageNumber,
        pageSize,
        selectedCategory,
        minPrice,
        maxPrice
      );
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPageNumber(1);
    
    // Update search param in URL
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPageNumber(1);

    // Update URL search parameters
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  return (
    <MainLayout>
      <div className="py-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar Filter Section (Desktop) */}
        <aside className="w-full md:w-[260px] shrink-0">
          <div className="bg-theme-card border border-theme rounded-md shadow-sm p-4 sticky top-[80px] transition-colors duration-200">
            <div className="flex items-center gap-2 border-b border-theme pb-3 mb-4 text-theme-primary font-bold">
              <FaFilter size={14} className="text-[#2874F0]" />
              <span>Filters</span>
            </div>

            {/* Category Selector Links */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-theme-secondary uppercase tracking-wider mb-2.5">
                Categories
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleCategorySelect("")}
                  className={`text-left text-sm py-1.5 px-2.5 rounded-sm cursor-pointer transition-colors ${
                    selectedCategory === ""
                      ? "bg-[#2874F0]/10 text-[#2874F0] font-bold"
                      : "text-theme-secondary hover:bg-gray-100 dark:hover:bg-slate-800"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(String(category.id))}
                    className={`text-left text-sm py-1.5 px-2.5 rounded-sm cursor-pointer transition-colors ${
                      String(selectedCategory) === String(category.id)
                        ? "bg-[#2874F0]/10 text-[#2874F0] font-bold"
                        : "text-theme-secondary hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Filter Box (Dummy/Mock for styling only) */}
            <div className="pt-4 border-t border-theme/60">
              <h3 className="text-xs font-bold text-theme-secondary uppercase tracking-wider mb-2.5">
                Price Range
              </h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-theme-secondary cursor-pointer select-none">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={maxPrice === 10000}
                    onChange={() => {
                      setMinPrice(undefined);
                      setMaxPrice(10000);
                    }}
                    className="border-theme text-[#2874F0] focus:ring-[#2874F0]/30"
                  />
                  <span>Under ₹10,000</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-theme-secondary cursor-pointer select-none">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={minPrice === 10000 && maxPrice === 30000}
                    onChange={() => {
                      setMinPrice(10000);
                      setMaxPrice(30000);
                    }}
                    className="border-theme text-[#2874F0] focus:ring-[#2874F0]/30"
                  />
                  <span>₹10,000 - ₹30,000</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-theme-secondary cursor-pointer select-none">
                 <input
                    type="radio"
                    name="priceRange"
                    checked={minPrice === 30000 && maxPrice === undefined}
                    onChange={() => {
                      setMinPrice(30000);
                      setMaxPrice(undefined);
                    }}
                    className="border-theme text-[#2874F0] focus:ring-[#2874F0]/30"
                  />
                  <span>₹30,000 & Above</span>
                </label>
                <div className="mt-4 pt-4 border-t border-theme/60">
                  <h4 className="text-xs font-bold text-theme-secondary uppercase tracking-wider mb-3">
                    Custom Range
                  </h4>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice ?? ""}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value
                            ? Number(e.target.value)
                            : undefined
                        )
                      }
                      className="
                        w-full
                        rounded-md
                        border
                        border-theme
                        px-3
                        py-2
                        text-sm
                        bg-theme-card
                      "
                    />

                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice ?? ""}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value
                            ? Number(e.target.value)
                            : undefined
                        )
                      }
                      className="
                        w-full
                        rounded-md
                        border
                        border-theme
                        px-3
                        py-2
                        text-sm
                        bg-theme-card
                      "
                    />
                  </div>

                  <button
                    onClick={() => {
                      setMinPrice(undefined);
                      setMaxPrice(undefined);
                    }}
                    className="
                      mt-3
                      text-sm
                      text-[#2874F0]
                      hover:underline
                    "
                  >
                    Clear Price Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Product Grid Column */}
        <div className="flex-1">
          {/* Controls Panel */}
          <div className="bg-theme-card border border-theme rounded-md p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between transition-colors duration-200">
            
            {/* Search Input field inside Catalog */}
         <div className="relative w-full sm:max-w-[320px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <FaSearch
              className="text-theme-muted dark:text-gray-400"
              size={14}
            />
          </div>

            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full !pl-10 pr-4 py-2 rounded-sm border-theme text-sm bg-white dark:bg-[#1e293b] text-gray-900 dark:text-white placeholder-gray-500"
            />
        </div>
            {/* Total Results Summary */}
            <div className="text-xs text-theme-muted font-medium shrink-0">
              Showing {products.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} – {Math.min(pageNumber * pageSize, (pageNumber - 1) * pageSize + products.length)} of items
            </div>
          </div>

          {/* Loading / Results Area */}
          {loading ? (
            <div className="py-20 flex justify-center bg-theme-card border border-theme rounded-md shadow-sm">
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-theme-card border border-theme rounded-md shadow-sm flex flex-col items-center justify-center">
              <p className="text-lg font-bold text-theme-primary mb-2">No products found</p>
              <p className="text-sm text-theme-muted">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {products.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-8 bg-theme-card border border-theme rounded-md py-3 px-6 shadow-sm transition-colors duration-200">
              <Button
                disabled={pageNumber === 1}
                onClick={() => setPageNumber((prev) => prev - 1)}
                variant="secondary"
                className="px-3 py-1.5 flex items-center gap-1.5"
              >
                <FaChevronLeft size={10} />
                <span>Prev</span>
              </Button>

              <span className="text-sm font-semibold text-theme-primary">
                Page {pageNumber}
              </span>

              <Button
                disabled={products.length < pageSize}
                onClick={() => setPageNumber((prev) => prev + 1)}
                variant="secondary"
                className="px-3 py-1.5 flex items-center gap-1.5"
              >
                <span>Next</span>
                <FaChevronRight size={10} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default ProductsPage;