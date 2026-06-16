import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProducts } from "../../services/productService";

import { getCategories } from "../../services/categoryService";

 import { getAllOrders } from "../../services/adminOrderService";

function AdminDashboardPage() {
  const [productCount,
  setProductCount] =
  useState(0);

  const [categoryCount,
    setCategoryCount] =
    useState(0);

  const [orderCount,
    setOrderCount] =
    useState(0);
    useEffect(() => {

  loadStats();

  }, []);
  const [recentOrders,setRecentOrders] =  useState<any[]>([]);

  const loadStats =
  async () => {

    try {

      const products =
        await getProducts();

      const categories =
        await getCategories();

      const orders =
        await getAllOrders();

      setProductCount(
        products.length
      );

      setCategoryCount(
        categories.length
      );

      setOrderCount(
        orders.length
      );

      setRecentOrders(
        [...orders]
          .sort(
            (a: any, b: any) =>
              b.id - a.id
          )
          .slice(0, 5)
      );

    }
    catch (error) {

      console.error(error);

    }
};  

  return (
    <MainLayout>

      <div
        className="
        container-custom
        py-10
        "
      >
        <h1
          className="
          text-4xl
          font-bold
          mb-8
          "
        >
          Admin Dashboard
        </h1>

        <div
  className="
  grid
  grid-cols-1
  md:grid-cols-3
  gap-6
  mb-10
  "
>

  <div
    className="
    bg-slate-800
    p-6
    rounded-lg
    text-center
    "
  >
    <h2
      className="
      text-xl
      mb-2
      "
    >
      Products
    </h2>

    <p
      className="
      text-4xl
      font-bold
      text-blue-400
      "
    >
      {productCount}
    </p>
  </div>

  <div
    className="
    bg-slate-800
    p-6
    rounded-lg
    text-center
    "
  >
    <h2
      className="
      text-xl
      mb-2
      "
    >
      Categories
    </h2>

    <p
      className="
      text-4xl
      font-bold
      text-green-400
      "
    >
      {categoryCount}
    </p>
  </div>

  <div
    className="
    bg-slate-800
    p-6
    rounded-lg
    text-center
    "
  >
    <h2
      className="
      text-xl
      mb-2
      "
    >
      Orders
    </h2>

    <p
      className="
      text-4xl
      font-bold
      text-yellow-400
      "
    >
      {orderCount}
    </p>
  </div>

      </div>
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
          w-400
          "
          >
            <div
                className="
                bg-slate-800
                p-6
                rounded-lg
                mb-10
                "
              >

            <h2
              className="
              text-2xl
              font-bold
              mb-4
              "
            >
              Recent Orders
            </h2>

            {
              recentOrders.length === 0
                ? (
                  <p>
                    No orders yet
                  </p>
                )
                : (
                  recentOrders.map(
                    order => (

                      <div
                        key={order.id}
                        className="
                        flex
                        justify-between
                        items-center
                        border-b
                        border-slate-700
                        py-3
                        "
                      >

                        <div>
                          Order #{order.id}
                        </div>

                        <div>
                          {order.status}
                        </div>

                        <div>
                          ₹{order.totalAmount}
                        </div>

                      </div>

                    ))
                )
            }

          </div>

          
             <Link
                to="/admin/products"
                className="
                block
                bg-slate-800
                p-4
                h-50
                w-110   
                rounded-lg
                hover:bg-slate-700
                hover:scale-105
                transition
                duration-200
                cursor-pointer
                "
              >
                <h2>
                  Products
                </h2>

                <p>
                  Manage products
                </p>
            </Link>
           

              
                 <Link
                to="/admin/categories"
                className="
                block
                bg-slate-800
                p-6
                rounded-lg
                hover:bg-slate-700
                hover:scale-105
                transition
                duration-200
                cursor-pointer
                "
              >
                <h2>
                  Categories
                </h2>

                <p>
                  Manage categories
                </p>
            </Link>
              
            <Link
                to="/admin/orders"
                className="
                block
                bg-slate-800
                p-6
                h-50
                w-110
                rounded-lg
                hover:bg-slate-700
                hover:scale-105
                transition
                duration-200
                cursor-pointer
                "
              >
                <h2>
                  Orders
                </h2>

                <p>
                  Manage orders
                </p>
            </Link>
            <Link
              to="/admin/users"
              className="
              block
              bg-slate-800
              p-6
              rounded-lg
              hover:bg-slate-700
              "
              >
              <h2>
                Users
              </h2>

              <p>
                Manage users
              </p>
            </Link>

        </div>

      </div>

    </MainLayout>
  );
}

export default AdminDashboardPage;