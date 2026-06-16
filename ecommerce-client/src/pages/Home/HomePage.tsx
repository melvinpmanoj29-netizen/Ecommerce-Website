import { useEffect, useState } from "react";

import MainLayout
from "../../layouts/MainLayout";

import Button
from "../../components/buttons/Button";

import ProductCard
from "../../components/cards/ProductCard";

import { getProducts }
from "../../services/productService";

import { getCategories }
from "../../services/categoryService";

import { useNavigate } from "react-router-dom";

function HomePage() {
  const [products,
  setProducts] =
  useState<any[]>([]);

const [categories,
  setCategories] =
  useState<any[]>([]);


  useEffect(() => {

  loadData();

}, []);

const navigate = useNavigate();

const loadData =
  async () => {

    try {

      const productsData =
        await getProducts();

      const categoriesData =
        await getCategories();

      setProducts(
        productsData.slice(0, 6)
      );

      setCategories(
        categoriesData
      );

    }
    catch (error) {

      console.error(error);

    }
};
  return (
    <MainLayout>
     <section
  className="
  min-h-[70vh]
  flex
  flex-col
  items-center
  justify-center
  text-center
  px-4
  "
>
       <h1
  className="
  text-6xl
  font-bold
  mb-4
  "
>Welcome to   
 ME10XLUXE 
</h1>

<p
  className="
  text-xl
  text-slate-400
  max-w-2xl
  "
>
  Discover the latest mobiles,
  laptops and accessories
  at the best prices.
</p>

<div
  className="
  mt-8
  flex
  gap-4
  "
>
 <div
  className="
  mt-8
  flex
  gap-4
  "
>
  <Button
    onClick={() =>
      navigate("/products")
    }
  >
    Shop Now
  </Button>

  <Button
    onClick={() =>
      navigate("/register")
    }
  >
    Join Now
  </Button>
</div>
</div>
      </section>


  <section
  className="
  container-custom
  py-16
  "
>

  <h2
    className="
    text-3xl
    font-bold
    mb-8
    text-center
    "
  >
    Shop By Category
  </h2>

  <div
    className="
    grid
    grid-cols-2
    md:grid-cols-4
    gap-6
    "
  >

    {
      categories.map(
        category => (

          <div
            key={category.id}
            className="
            bg-slate-800
            p-6
            rounded-lg
            text-center
            hover:bg-slate-700
            transition
            "
          >

            <h3
              className="
              text-lg
              font-semibold
              "
            >
              {category.name}
            </h3>

          </div>

        ))
    }

  </div>

</section>
<section
  className="
  py-20
  container-custom
  "
>
  <h2
    className="
    text-3xl
    font-bold
    text-center
    mb-12
    "
  >
    Why Choose Us?
  </h2>

  <div
    className="
    grid
    md:grid-cols-3
    gap-8
    "
  >

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold">
        🚚 Fast Delivery
      </h3>

      <p className="text-slate-400 mt-2">
        Quick and secure shipping.
      </p>
    </div>

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold">
        💳 Secure Shopping
      </h3>

      <p className="text-slate-400 mt-2">
        Protected checkout process.
      </p>
    </div>

    <div className="bg-slate-800 p-6 rounded-xl">
      <h3 className="text-xl font-semibold">
        ⭐ Trusted Reviews
      </h3>

      <p className="text-slate-400 mt-2">
        Real customer feedback.
      </p>
    </div>

  </div>
</section>

<section
  className="
  container-custom
  py-16
  "
>

  <h2
    className="
    text-3xl
    font-bold
    mb-8
    text-center
    "
  >
    Trending Products
  </h2>

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
      products.map(
        product => (

          <ProductCard
            key={product.id}
            product={product}
          />

        ))
    }

  </div>

</section>
    </MainLayout>
  );
}

export default HomePage;
