import { Heart, LayoutDashboard, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? "text-ink" : "text-ink/60 hover:text-ink"}`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const links = (
    <>
      <NavLink className={navClass} to="/products">Shop</NavLink>
      <NavLink className={navClass} to="/wishlist">Wishlist</NavLink>
      <NavLink className={navClass} to="/orders">Orders</NavLink>
      <NavLink className={navClass} to="/contact">Contact</NavLink>
      {user?.isAdmin && <NavLink className={navClass} to="/admin"><LayoutDashboard size={16} /> Admin</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl font-bold">Maison Luxe</Link>
        <nav className="hidden items-center gap-7 md:flex">{links}</nav>
        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-md p-2 hover:bg-pearl" aria-label="Search" onClick={() => navigate("/products")}>
            <Search size={20} />
          </button>
          <Link className="rounded-md p-2 hover:bg-pearl" to={user ? "/profile" : "/login"} aria-label="Profile">
            <User size={20} />
          </Link>
          <Link className="relative rounded-md p-2 hover:bg-pearl" to="/cart" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-gold px-1.5 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          {user ? (
            <button className="btn-outline py-2" onClick={logout}>Logout</button>
          ) : (
            <Link className="btn-primary py-2" to="/login">Login</Link>
          )}
        </div>
        <button className="rounded-md p-2 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-white p-6 md:hidden">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl font-bold" onClick={() => setOpen(false)}>Maison Luxe</Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X /></button>
          </div>
          <nav className="flex flex-col gap-5" onClick={() => setOpen(false)}>{links}</nav>
          <div className="mt-8 flex gap-3">
            <Link className="btn-outline flex-1" to="/cart" onClick={() => setOpen(false)}><ShoppingBag size={18} /> Cart</Link>
            <Link className="btn-primary flex-1" to={user ? "/profile" : "/login"} onClick={() => setOpen(false)}><User size={18} /> Account</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
