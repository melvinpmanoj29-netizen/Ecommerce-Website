import { Link } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

function PaymentCancelledPage() {
  return (
    <MainLayout>
      <div className="container-custom py-20 text-center">
        <h1 className="text-4xl font-bold text-red-500">
          Payment Cancelled
        </h1>

        <p className="mt-4 text-slate-400">
          Your payment was not completed.
          Your cart items are still available.
        </p>

        <Link
          to="/cart"
          className="
            inline-block
            mt-8
            px-6
            py-3
            bg-blue-600
            hover:bg-blue-700
            rounded-lg
            text-white
          "
        >
          Return to Cart
        </Link>
      </div>
    </MainLayout>
  );
}

export default PaymentCancelledPage;    