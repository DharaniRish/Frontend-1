import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const Cart = () => {
  const { cart, total, refreshCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <main className="container-page py-10">
      <h1 className="section-title">Shopping cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {cart.items?.map((item) => (
            <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[96px_1fr_auto]" key={item.product._id}>
              <img src={item.product.images?.[0]} alt={item.product.name} className="h-24 w-24 rounded-md object-cover" />
              <div>
                <h2 className="font-bold">{item.product.name}</h2>
                <p className="mt-1 text-sm text-ink/55">{item.product.brand}</p>
                <p className="mt-3 font-semibold">{currency.format(item.product.price)}</p>
              </div>
              <div className="flex items-center gap-3">
                <input className="input w-24" type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))} />
                <button className="rounded-md border border-black/10 p-3 hover:border-red-500 hover:text-red-600" onClick={() => removeFromCart(item.product._id)} aria-label="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {!cart.items?.length && <p className="text-ink/60">Your cart is empty.</p>}
        </section>
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><strong>{currency.format(total)}</strong></div>
            <div className="flex justify-between"><span>Shipping</span><strong>{total > 5000 ? "Free" : currency.format(299)}</strong></div>
          </div>
          <Link className="btn-primary mt-6 w-full" to="/checkout">Checkout</Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
