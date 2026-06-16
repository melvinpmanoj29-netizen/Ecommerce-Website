import {  useEffect,  useState} from "react";

import MainLayout from "../../layouts/MainLayout";

import {  getAllOrders,  updateOrderStatus} from "../../services/adminOrderService";

import toast from "react-hot-toast";

function AdminOrdersPage() {

  const [orders,
    setOrders] =
    useState<any[]>([]);

  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders =
    async () => {

      const data =
        await getAllOrders();

      setOrders(data);
    };
    const handleStatusChange =
  async (
    id: number,
    status: string
  ) => {

    try {

      await updateOrderStatus(
        id,
        status
      );

      toast.success(
        "Status Updated"
      );

      loadOrders();

    }
    catch {

      toast.error(
        "Update Failed"
      );

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
          text-3xl
          font-bold
          mb-8
          "
        >
          Manage Orders
        </h1>

        {
          orders.map(order => (

            <div
              key={order.id}
              className="
bg-slate-800
p-6
rounded-xl
mb-4
shadow-lg
border
border-slate-700
"
            >

              <h3
  className="
  text-xl
  font-semibold
  mb-3
  "
>
  Order #{order.id}
</h3>
<div className="mb-3">

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
          : order.status === "Shipped"
          ? "bg-purple-500 text-white"
          : "bg-slate-500 text-white"
      }
    `}
  >
    {order.status}
  </span>

</div>
             <div className="mt-2">

  <select
    value={order.status}
    onChange={(e) =>
      handleStatusChange(
        order.id,
        e.target.value
      )
    }
    className="
bg-slate-700
border
border-slate-600
p-2
rounded-lg
focus:outline-none
focus:ring-2
focus:ring-blue-500
"
  >

    <option>
      Pending
    </option>

    <option>
      Processing
    </option>

    <option>
      Shipped
    </option>

    <option>
      Delivered
    </option>

    <option>
      Cancelled
    </option>

  </select>

</div>

              <p
  className="
  text-lg
  font-bold
  text-blue-400
  mt-3
  "
>
  ₹{order.totalAmount}
</p>
             <p
  className="
  text-slate-400
  text-sm
  mt-1
  "
>
  {new Date(
    order.createdDate
  ).toLocaleDateString()}
</p>

            </div>

          ))
        }

      </div>

    </MainLayout>
  );
}

export default AdminOrdersPage;