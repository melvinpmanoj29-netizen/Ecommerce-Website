import { Routes, Route } from "react-router-dom";
import ProductDetailsPage from "../pages/ProductDetails/ProductDetailsPage";
import HomePage from "../pages/Home/HomePage";
import ProductsPage from "../pages/Products/ProductsPage";
import CartPage from "../pages/Cart/CartPage";
import LoginPage from "../pages/Auth/LoginPage";
import OrdersPage from "../pages/Orders/OrdersPage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminProductsPage from "../pages/Admin/AdminProductsPage";
import CreateProductPage from "../pages/Admin/CreateProductPage";
import EditProductPage from "../pages/Admin/EditProductPage";
import AdminRoute from "./AdminRoute";
import AdminCategoriesPage from "../pages/Admin/AdminCategoriesPage";
import CreateCategoryPage from "../pages/Admin/CreateCategoryPage";
import EditCategoryPage from "../pages/Admin/EditCategoryPage";
import AdminOrdersPage from "../pages/Admin/AdminOrdersPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelledPage from "../pages/PaymentCancelledPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import AnalyticsPage from "../pages/Admin/AnalyticsPage";
import DeliveryDashboard from "../pages/DeliveryDashboard";
import AdminEmergencyDeliveriesPage from "../pages/Admin/AdminEmergencyDeliveriesPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />}/>
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin"  element={<AdminRoute> <AdminDashboardPage /> </AdminRoute>}/>
      <Route path="/admin/products" element={<AdminRoute> <AdminProductsPage /> </AdminRoute>}/>
      <Route path="/admin/products/create"  element={<AdminRoute> <CreateProductPage /> </AdminRoute>}/>
      <Route path="/admin/products/edit/:id"  element={<AdminRoute> <EditProductPage /> </AdminRoute>}/>
      <Route path="/admin/categories" element={<AdminRoute> <AdminCategoriesPage /> </AdminRoute>}/>
      <Route path="/admin/categories/create" element={<AdminRoute><CreateCategoryPage /></AdminRoute>}/>  
      <Route path="/admin/categories/edit/:id" element={<AdminRoute><EditCategoryPage /></AdminRoute>}/>
      <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>}/>
      <Route path="/admin/users"  element={<AdminUsersPage />}/>
      <Route path="/register"  element={<RegisterPage />}/>
      <Route path="/payment-success" element={<PaymentSuccessPage />}/>
      <Route path="/payment-cancelled" element={<PaymentCancelledPage />}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
      <Route path="/reset-password" element={<ResetPasswordPage />}/>
      <Route path="/admin/analytics" element={<AdminRoute><AnalyticsPage/></AdminRoute>}/>
      <Route path="/delivery" element={<DeliveryDashboard />}/>
      <Route path="/admin/emergency-deliveries" element={<AdminRoute><AdminEmergencyDeliveriesPage /></AdminRoute>}/>
      <Route path="/checkout" element={<CheckoutPage />}/>
    </Routes>
  );
}

export default AppRoutes;