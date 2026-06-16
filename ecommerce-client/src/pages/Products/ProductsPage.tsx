import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

import ProductCard from "../../components/cards/ProductCard";

import type { Product } from "../../types/Product";

import { searchProducts } from "../../services/productService";

import { getCategories } from "../../services/categoryService";

import LoadingSpinner from "../../components/common/LoadingSpinner";

function ProductsPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [categories,
    setCategories] =
    useState<any[]>([]);

  const [selectedCategory,
    setSelectedCategory] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [pageNumber,
    setPageNumber] =
    useState(1);

  const pageSize = 6;

  useEffect(() => {

    const loadCategories =
      async () => {

        const data =
          await getCategories();

        setCategories(data);
      };

    loadCategories();

  }, []);

  useEffect(() => {

    loadPagedProducts(search);

  }, [pageNumber]);

  const loadPagedProducts =
    async (
      searchText = ""
    ) => {

      try {

        const data =
          await searchProducts(
            searchText,
            pageNumber,
            pageSize
          );

        setProducts(data);

      }
      catch (error) {

        console.error(error);

      }
      finally {

        setLoading(false);

      }
    };

  const handleSearch =
    async (
      value: string
    ) => {

      setSearch(value);

      setPageNumber(1);

      try {

        const data =
          await searchProducts(
            value,
            1,
            pageSize
          );

        setProducts(data);

      }
      catch (error) {

        console.error(error);

      }
    };

  if (loading) {

    return (
      <MainLayout>
      <LoadingSpinner />
    </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div
        className="
        container-custom
        py-10
        "
      >

        <h1 className="mb-8">
          Products
        </h1>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          className="
          w-full
          mb-6
          p-3
          rounded
          bg-slate-800
          text-white
          "
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(
              e.target.value
            )
          }
          className="
          w-full
          mb-6
          p-3
          rounded
          bg-slate-800
          text-white
          "
        >

          <option value="">
            All Categories
          </option>

          {
            categories.map(
              category => (

                <option
                  key={category.id}
                  value={category.name}
                >
                  {category.name}
                </option>

              ))
          }

        </select>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
          "
        >

          {
            products
              .filter(product =>

                !selectedCategory ||

                product.categoryName ===
                selectedCategory

              )
              .map(product => (

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))
          }

        </div>

        <div
          className="
          flex
          justify-center
          gap-4
          mt-8
          "
        >

          <button
            disabled={
              pageNumber === 1
            }
            onClick={() =>
              setPageNumber(
                pageNumber - 1
              )
            }
            className="
            bg-slate-700
            px-4
            py-2
            rounded
            disabled:opacity-50
            "
          >
            Previous
          </button>

          <span
            className="
            flex
            items-center
            "
          >
            Page {pageNumber}
          </span>

          <button
            onClick={() =>
              setPageNumber(
                pageNumber + 1
              )
            }
            className="
            bg-slate-700
            px-4
            py-2
            rounded
            "
          >
            Next
          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default ProductsPage;