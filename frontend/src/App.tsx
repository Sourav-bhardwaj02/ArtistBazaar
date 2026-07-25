import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SellerPage from "./pages/SellerPage";
// import AdminPanel from "./pages/AdminPanel";
import { CustomerLayout } from "./components/customer/Layout/CustomerLayout";
import Login from "@/components/Login";
import Signup from "./components/Signup";
import AlertState from "./context/alert/AlertState";
import FindSuppliers from "./components/customer/FindSuppliers";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Artisans from "./pages/Artisans";
import Chat from "./pages/Chat";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CartProvider } from "./context/CartContext/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProductProvider } from "./context/ProductContext/ProductContext";
import ProfileView from "./pages/ProfileView";
import DirectChat from "./pages/DirectChat";
import Settings from "@/components/PanelLout/Settings";
import AboutCustom from "@/components/customer/CustomerAbout";
import Analytics from "@/components/customer/CustomerAnalytics";
import CustomerOrders from "@/components/customer/CustomerOrders";
import ServicePanel from "@/components/customer/CustomerServicePanel";
import ServiceServicePanel from "@/components/customer/CustomerServicePanel";
import CustomerDashboard from "@/components/customer/CustomerDashboard";
import CustomerSettings from "@/components/customer/CustomerSettings";
import Dashboard from "@/components/customer/Layout/CustomerDashboard";
import Services from "@/components/services/Services";
import SellerDashboard from "@/components/seller/SellerDashboard";
import SellerAnalytics from "@/components/seller/SellerAnalytics";
import SellerSettings from "@/components/seller/SellerSettings";
import SellerAbout from "@/components/seller/SellerAbout";
import SellerProducts from "./pages/SellerProducts";
import SellerChats from "@/components/seller/SellerChats";
import SellerChatThread from "@/components/seller/SellerChatThread";
import { SellerLayout } from "@/components/seller/Layout/SellerLayout"
import ServiceDashboard from "@/components/services/ServiceDashboard";
import ServiceAnalytics from "@/components/services/ServiceAnalytics";
import ServiceSettings from "@/components/services/ServiceSettings";
import ServiceAbout from "@/components/services/ServiceAbout";
import ServiceProducts from "./pages/SellerProducts";
import ServiceChats from "@/components/services/ServiceChats";
import ServiceChatThread from "@/components/services/ServiceChatThread";
import { ServiceLayout } from "@/components/services/Layout/ServiceLayout"
import AdminAnalytics from "@/components/Admin/AdminAnalytics";
import Overview from "@/components/Admin/Overview";
import DataEntity from "@/components/Admin/DataEntity";
import Logs from "@/components/Admin/Logs";
import Security from "@/components/Admin/Security";
import Users from "@/components/Admin/Users";
import { AdminLayout } from "@/components/Admin/Layout/AdminLayout";
import About from "@/pages/About";
import { AuthProvider } from "@/context/auth/AuthContext";
import ChatThread from "@/pages/ChatThread";
import { DrawerProvider, useDrawer } from "./context/DrawerContext/DrawerContext";
import CartSidebar from "@/components/CartSidebar";
import WishlistDrawer from "@/components/WishlistDrawer";
import Checkout from "@/pages/Checkout";
import Payments from "@/pages/Payments";

const queryClient = new QueryClient();

// ✅ Separate component to use useDrawer hook inside DrawerProvider
const AppContent = () => {
  const { cartOpen, wishlistOpen, closeCart, closeWishlist } = useDrawer();

  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/artisans" element={<Artisans />} />
              <Route path="/profile/:id" element={<ProfileView />} />
              <Route path="/chat/:id" element={<ProtectedRoute roles={["Customer", "Seller", "Services", "Admin"]}><DirectChat /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute roles={["Customer", "Seller", "Services", "Admin"]}><Chat /></ProtectedRoute>} />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="overview" element={<Overview />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="data-entity" element={<DataEntity />} />
                <Route path="logs" element={<Logs />} />
                <Route path="security" element={<Security />} />
                <Route path="data/:entity" element={<DataEntity />} />
                <Route path="users" element={<Users />} />
                <Route path="domains" element={<div className="p-6">Domains management coming soon...</div>} />
                <Route path="code" element={<div className="p-6">Code management coming soon...</div>} />
                <Route path="settings" element={<div className="p-6">Settings coming soon...</div>} />
              </Route>

              <Route
                path="/services/:id"
                element={
                  <ProtectedRoute roles={["Services"]}>
                    <ServiceLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<ServiceServicePanel />} />
                <Route path="home" element={<ServiceServicePanel />} />
                <Route path="about" element={<ServiceAbout />} />
                <Route path="dashboard" element={<ServiceDashboard />} />
                <Route path="settings" element={<ServiceSettings />} />
                <Route path="analytics" element={<ServiceAnalytics />} />
                <Route path="services" element={<Services />} />
                <Route path="products" element={<ServiceProducts />} />
                <Route path="chats" element={<ServiceChats />} />
                <Route path="chats/:conversationId" element={<ServiceChatThread />} />
              </Route>
              <Route
                path="/seller/:id"
                element={
                  <ProtectedRoute roles={["Seller"]}>
                    <SellerLayout />
                  </ProtectedRoute>
                }
              >

                <Route index element={<SellerDashboard />} />
                <Route path="home" element={<SellerDashboard />} />
                <Route path="about" element={<SellerAbout />} />
                <Route path="dashboard" element={<SellerDashboard />} />
                <Route path="settings" element={<SellerSettings />} />
                <Route path="analytics" element={<SellerAnalytics />} />
                <Route path="services" element={<Services />} />
                <Route path="products" element={<SellerProducts />} />
                <Route path="chats" element={<SellerChats />} />
                <Route path="chats/:conversationId" element={<SellerChatThread />} />
              </Route>

              <Route
                path="/customer/:id"
                element={
                  <ProtectedRoute roles={["Customer"]}>
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CustomerDashboard  />} />
                <Route path="home" element={<CustomerDashboard />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="about" element={<AboutCustom />} />
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="settings" element={<CustomerSettings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="services" element={<Services />} />
                <Route path="suppliers" element={<FindSuppliers />} />
              </Route>

              <Route path="about" element={<About />} />
              <Route path="/chat/thread/:conversationId" element={<ProtectedRoute roles={["Customer", "Seller", "Services", "Admin"]}><ChatThread /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute roles={["Customer", "Seller", "Services", "Admin"]}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute roles={["Customer", "Seller", "Services", "Admin"]}>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        <CartSidebar isOpen={cartOpen} onClose={closeCart} />
        <WishlistDrawer isOpen={wishlistOpen} onClose={closeWishlist} />
        </BrowserRouter>

        {/* ✅ GLOBAL DRAWERS - Rendered at root level */}
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AlertState>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <DrawerProvider>
              <AppContent />
            </DrawerProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </AlertState>
  </QueryClientProvider>
);

export default App;
