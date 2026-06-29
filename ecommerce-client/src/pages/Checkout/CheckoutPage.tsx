import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import { checkout } from "../../services/paymentService";

function CheckoutPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    deliveryNotes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!formData.addressLine1.trim()) {
      toast.error("Address Line 1 is required");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (!formData.state.trim()) {
      toast.error("State is required");
      return false;
    }

    if (!formData.postalCode.trim()) {
      toast.error("PIN Code is required");
      return false;
    }

    return true;
  };

  const handleContinueToPayment = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      localStorage.setItem(
        "checkoutDetails",
        JSON.stringify(formData)
      );

      sessionStorage.removeItem("paymentCompleted");
      sessionStorage.removeItem("paymentProcessing");

      const url = await checkout();

      window.location.href = url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-theme-primary hover:underline cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-theme-card border border-theme rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-theme-primary mb-6">
            Shipping Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number *
              </label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="Enter phone number"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address Line 1 *
              </label>

              <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="House No, Street, Area"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Address Line 2
              </label>

              <input
                type="text"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="Apartment, Landmark, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                City *
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                State *
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                PIN Code *
              </label>

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-full border border-theme rounded-md p-3 bg-theme-body"
                placeholder="PIN Code"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Delivery Notes
              </label>

              <textarea
                name="deliveryNotes"
                value={formData.deliveryNotes}
                onChange={handleChange}
                rows={4}
                className="w-full border border-theme rounded-md p-3 bg-theme-body resize-none"
                placeholder="Optional delivery instructions..."
              />
            </div>
          </div>

          <button
            onClick={handleContinueToPayment}
            disabled={loading}
            className="w-full mt-6 bg-[#fb641b] hover:bg-[#e04f0b] text-white font-bold py-3 rounded-md transition-colors disabled:opacity-50"
          >
            {loading
              ? "Redirecting to Payment..."
              : "Continue To Payment"}
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

export default CheckoutPage;