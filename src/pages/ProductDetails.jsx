import axios from "axios";
import { Heart, PackageCheck, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const authHeaders = () => {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/products/${id}`).then((res) => setProduct(res.data)).catch((err) => setError(err.response?.data?.message || "Product not found"));
  }, [id]);

  if (error) return <main className="container-page py-10"><ErrorState message={error} /></main>;
  if (!product) return <Loader label="Loading product" />;

  const requireUser = (action) => {
    if (!user) return navigate("/login");
    return action();
  };

  const toggleWishlist = async () => {
    const { data } = await axios.post(`${API_URL}/wishlist`, { productId: product._id }, { headers: authHeaders() });
    setWishlisted(data.products?.some((item) => item._id === product._id));
  };

  const buyNow = () => {
    navigate("/checkout", {
      state: {
        buyNowProduct: {
          productId: product._id,
          name: product.name,
          image: product.images?.[selected],
          quantity,
          price: product.price
        }
      }
    });
  };

  return (
    <main className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4 md:grid-cols-[96px_1fr]">
          <div className="flex gap-3 md:flex-col">
            {product.images.map((image, index) => (
              <button className={`overflow-hidden rounded-md border ${selected === index ? "border-ink" : "border-black/10"}`} onClick={() => setSelected(index)} key={image}>
                <img src={image} alt="" className="h-20 w-20 object-cover" />
              </button>
            ))}
          </div>
          <img src={product.images[selected]} alt={product.name} className="aspect-[4/5] w-full rounded-lg object-cover" />
        </div>
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">{product.brand}</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{product.name}</h1>
          <div className="mt-4"><Rating value={product.rating} count={product.numReviews} /></div>
          <div className="mt-6 flex items-end gap-3">
            <p className="text-3xl font-bold">{currency.format(product.price)}</p>
            {product.originalPrice && <p className="pb-1 text-ink/45 line-through">{currency.format(product.originalPrice)}</p>}
          </div>
          <p className="mt-6 leading-8 text-ink/65">{product.description}</p>
          <ul className="mt-5 space-y-2 text-sm text-ink/70">
            {product.details?.map((detail) => <li key={detail}>- {detail}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <input className="input max-w-28" type="number" min="1" max={product.countInStock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <button className="btn-primary" onClick={() => requireUser(() => addToCart(product._id, quantity))} disabled={product.countInStock === 0}>
              <ShoppingBag size={18} /> Add to cart
            </button>
            <button className="btn-outline" onClick={() => requireUser(buyNow)} disabled={product.countInStock === 0}>
              <PackageCheck size={18} /> Buy Now
            </button>
            <button
              className={`inline-flex items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition ${
                wishlisted ? "border-red-500 bg-red-50 text-red-600" : "border-ink/15 text-ink hover:border-red-500 hover:text-red-600"
              }`}
              onClick={() => requireUser(toggleWishlist)}
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} /> Wishlist
            </button>
          </div>
          <div className="mt-10">
            <h2 className="text-xl font-bold">Reviews</h2>
            <div className="mt-4 space-y-3">
              {product.reviews?.length ? product.reviews.map((review) => (
                <div className="rounded-lg border border-black/10 bg-white p-4" key={review._id}>
                  <Rating value={review.rating} />
                  <p className="mt-2 font-semibold">{review.name}</p>
                  <p className="mt-1 text-sm text-ink/60">{review.comment}</p>
                </div>
              )) : <p className="text-sm text-ink/55">No reviews yet.</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
