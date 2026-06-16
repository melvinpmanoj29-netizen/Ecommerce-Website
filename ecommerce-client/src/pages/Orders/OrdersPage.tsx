import { useEffect, useState }
from "react";

import MainLayout
from "../../layouts/MainLayout";

import { getOrders }
from "../../services/orderService";

import type { Order }
from "../../types/Order";

function OrdersPage() {

  const [orders, setOrders] =
    useState<Order[]>([]);

  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders =
    async () => {

      const data =
        await getOrders();

      setOrders(data);
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
          text-3xl
          font-bold
          mb-8
          "
        >
          My Orders
        </h1>

        {orders.map(order => (

          <div
            key={order.id}
            className="
            bg-slate-800
            p-6
            rounded-lg
            mb-4
            "
          >
           <h2
  className="
  text-xl
  font-semibold
  mb-2
  "
>
  Order #{order.id}
</h2>
<div
  className="
  flex
  items-center
  gap-2
  mt-2
  "
>
  <span>
    Status:
  </span>

  <span
    className={`
      px-3
      py-1
      rounded-full
      text-sm
      font-semibold
      ${
        order.status === "Delivered"
          ? "bg-green-500 text-white"
          : order.status === "Processing"
          ? "bg-blue-500 text-white"
          : order.status === "Pending"
          ? "bg-yellow-500 text-black"
          : order.status === "Cancelled"
          ? "bg-red-500 text-white"
          : "bg-slate-500 text-white"
      }
    `}
  >
    <p className="mt-2">
  Status: {order.status}
</p>
  </span>
</div>
<div className="mt-4 space-y-3">

  {order.items.map(
    (item: any, index: number) => (

      <div
        key={index}
        className="
        flex
        items-center
        gap-4
        bg-slate-700
        p-3
        rounded
        "
      >

        <img
          src={item.imageUrl}
          alt={item.productName}
          className="
          w-16
          h-16
          object-cover
          rounded
          "
        />

        <div>

          <p className="font-semibold">
            {item.productName}
          </p>

          <p className="text-sm text-slate-400">
            Qty: {item.quantity}
          </p>

          <p className="text-blue-400">
            ₹{item.price}
          </p>

        </div>

      </div>

    )
  )}

</div>

<p
  className="
  mt-4
  text-xl
  font-bold
  text-green-400
  "
>
  Total: ₹{order.totalAmount}
</p>

            <p
  className="
  text-slate-400
  text-sm
  "
>
              {new Date(
                order.createdDate
              ).toLocaleString()}
            </p>
          </div>

        ))}

      </div>

    </MainLayout>
  );
}

export default OrdersPage;