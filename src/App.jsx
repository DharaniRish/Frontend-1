import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";

const App = () => (
  <div className="min-h-screen bg-[#fbfaf8]">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/signup" element={<Auth mode="register" />} />
      <Route path="/contact" element={<Contact />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
    <Footer />
  </div>
);

export default App;
