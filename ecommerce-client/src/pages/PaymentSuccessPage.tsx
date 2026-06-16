import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { checkoutSuccess } from "../services/paymentService";

function PaymentSuccessPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const placeOrder = async () => {
      // Prevent duplicate calls due to React StrictMode double-mount or page refresh
      if (
        sessionStorage.getItem("paymentCompleted") === "true" ||
        sessionStorage.getItem("paymentProcessing") === "true"
      ) {
        setLoading(false);
        return;
      }

      sessionStorage.setItem("paymentProcessing", "true");

      try {
        await checkoutSuccess();
        sessionStorage.setItem("paymentCompleted", "true");
      } catch (error) {
        console.error("Error placing order:", error);
      } finally {
        sessionStorage.removeItem("paymentProcessing");
        setLoading(false);
      }
    };

    placeOrder();
  }, []);

  return (
    <MainLayout>
      <div className="container-custom py-20 text-center">
        {loading ? (
          <h1 className="text-2xl font-bold">
            Processing your order...
          </h1>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-green-500">
              Payment Successful
            </h1>

            <p className="mt-4 text-slate-400">
              Your order has been placed successfully.
            </p>

            <Link
              to="/orders"
              className="
                inline-block
                mt-8
                px-6
                py-3
                bg-green-600
                hover:bg-green-700
                rounded-lg
                text-white
              "
            >
              View Orders
            </Link>
          </>
        )}
      </div>
    </MainLayout>
  );
}

export default PaymentSuccessPage;