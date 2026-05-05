import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import Rating from "./Rating";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = async () => {
    if (!user) return navigate("/login");
    const { data } = await api.post("/wishlist", { productId: product._id });
    setWishlisted(data.products?.some((item) => item._id === product._id));
  };

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    await addToCart(product._id);
  };

  return (
    <article className="group rounded-lg border border-black/10 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-premium">
      <Link to={`/products/${product._id}`} className="block overflow-hidden rounded-md bg-pearl">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-3 p-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{product.brand}</p>
          <Link to={`/products/${product._id}`} className="mt-1 line-clamp-2 font-semibold text-ink">
            {product.name}
          </Link>
        </div>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold">{currency.format(product.price)}</p>
            {product.originalPrice && <p className="text-xs text-ink/45 line-through">{currency.format(product.originalPrice)}</p>}
          </div>
          <div className="flex gap-2">
            <button
              className={`rounded-md border p-2 transition ${
                wishlisted ? "border-red-500 bg-red-50 text-red-600" : "border-black/10 hover:border-red-500 hover:text-red-600"
              }`}
              onClick={toggleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
            <button className="rounded-md bg-ink p-2 text-white hover:bg-black" onClick={handleAddToCart} aria-label="Add to cart">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
