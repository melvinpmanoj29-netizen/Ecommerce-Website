import { useEffect, useState }
from "react";

import MainLayout
from "../../layouts/MainLayout";

import {getCart,updateCart,removeCartItem} from "../../services/cartService";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import type { CartItem }
from "../../types/CartItem";

import { Link } from "react-router-dom";

import { checkout } from "../../services/paymentService";

function CartPage() {
  const navigate = useNavigate();

  const [items, setItems] =
    useState<CartItem[]>([]);

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
    toast.error("Failed to start payment");
  }
};


  const increaseQuantity =
  async (
    itemId: number,
    currentQty: number
  ) => {

    await updateCart(
      itemId,
      currentQty + 1
    );

    loadCart();
};

const decreaseQuantity =
  async (
    itemId: number,
    currentQty: number
  ) => {

    if (currentQty <= 1)
      return;

    await updateCart(
      itemId,
      currentQty - 1
    );

    loadCart();
};

const removeItem =
  async (
    itemId: number
  ) => {

    await removeCartItem(
      itemId
    );

    loadCart();
};

  const loadCart =
    async () => {

      const data =
        await getCart();

      setItems(data);
    };

  const total =
    items.reduce(
      (sum, item) =>
        sum + item.subTotal,
      0);

      if (items.length === 0) {
  return (
    <MainLayout>
      <div
        className="
        container-custom
        py-20
        text-center
        "
      >
        <h2
          className="
          text-3xl
          font-bold
          mb-4
          "
        >
          🛒 Your cart is empty
        </h2>

        <p
          className="
          text-slate-400
          mb-6
          "
        >
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/products"
          className="
          bg-blue-600
          px-6
          py-3
          rounded-lg
          "
        >
          Browse Products
        </Link>
      </div>
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
        <h1
          className="
          text-3xl
          font-bold
          mb-8
          "
        >
          Cart
        </h1>

        {items.map(item => (

         <div
              key={item.id}
              className="
              bg-slate-800
              p-4
              rounded-lg
              mb-4
              flex
              gap-4
              items-center
              "
            >
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="
              w-24
              h-24
              object-cover
              rounded
              "
            />
            <div>

              <h3
                className="
                text-xl
                font-semibold
                "
              >
                {item.productName}
              </h3>

              <div
  className="
  flex
  items-center
  gap-3
  mt-3
  "
>

  <button
    onClick={() =>
      decreaseQuantity(
        item.id,
        item.quantity
      )
    }
    className="
    bg-slate-700
    px-3
    py-1
    rounded
    hover:bg-slate-600
    "
  >
    -
  </button>

  <span>
    {item.quantity}
  </span>

  <button
    onClick={() =>
      increaseQuantity(
        item.id,
        item.quantity
      )
    }
    className="
    bg-slate-700
    px-3
    py-1
    rounded
    hover:bg-slate-600
    "
  >
    +
  </button>

</div>

              <p>
                ₹{item.subTotal}
              </p>
      <button
        onClick={() =>
          removeItem(item.id)
        }
        className="
        mt-3
        bg-red-600
        px-4
        py-2
        rounded
        hover:bg-red-700
        "
      >
        Remove
      </button>
      
                  </div>
                </div>

              ))}

            <div
        className="
        mt-8
        text-2xl
        font-bold
        "
      >
        Total: ₹{total}
      </div>

      <button
      onClick={handleCheckout}
      className="
      w-full
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-semibold
      py-3
      rounded-lg
      mt-6
      "
    >
     Proceed to Payment
    </button>
</div>

    </MainLayout>
  );

  
  
}

export default CartPage;