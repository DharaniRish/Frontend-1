import { Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-20 bg-ink text-white">
    <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      <div>
        <h3 className="font-display text-3xl font-bold">Maison Luxe</h3>
        <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
          Curated watches, audio, bags, and home pieces for people who care about craft and utility.
        </p>
      </div>
      <div className="space-y-3 text-sm text-white/70">
        <h4 className="font-semibold text-white">Shop</h4>
        <Link className="block hover:text-white" to="/products">All products</Link>
        <Link className="block hover:text-white" to="/wishlist">Wishlist</Link>
        <Link className="block hover:text-white" to="/cart">Cart</Link>
      </div>
      <div className="space-y-3 text-sm text-white/70">
        <h4 className="font-semibold text-white">Account</h4>
        <Link className="block hover:text-white" to="/profile">Profile</Link>
        <Link className="block hover:text-white" to="/orders">Order history</Link>
        <Link className="block hover:text-white" to="/contact">Support</Link>
      </div>
      <div className="space-y-3 text-sm text-white/70">
        <h4 className="font-semibold text-white">Concierge</h4>
        <p className="flex gap-2"><Mail size={16} /> care@maisonluxe.com</p>
        <p className="flex gap-2"><Phone size={16} /> +91 98765 43210</p>
        <p className="flex gap-2"><MapPin size={16} /> Mumbai, India</p>
        <p className="flex gap-2"><Instagram size={16} /> @maisonluxe</p>
      </div>
    </div>
  </footer>
);

export default Footer;
