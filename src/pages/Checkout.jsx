import axios from "axios";
import { CreditCard, Landmark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const emptyAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India"
};

const getAuthHeaders = () => {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const WhatsAppIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16.02 3.2A12.74 12.74 0 0 0 5.08 22.5L3.2 29l6.66-1.75A12.75 12.75 0 1 0 16.02 3.2Zm0 2.34a10.41 10.41 0 1 1-5.3 19.36l-.38-.23-3.96 1.04 1.06-3.86-.25-.4A10.41 10.41 0 0 1 16.02 5.54Zm-4.45 4.79c-.24 0-.62.09-.95.45-.33.36-1.25 1.22-1.25 2.98 0 1.75 1.28 3.45 1.46 3.69.18.24 2.49 3.98 6.08 5.42 3 .84 3.61.67 4.26.63.65-.04 2.1-.86 2.4-1.69.29-.83.29-1.54.2-1.69-.09-.15-.33-.24-.68-.42-.36-.18-2.1-1.04-2.43-1.16-.33-.12-.57-.18-.8.18-.24.36-.92 1.16-1.13 1.4-.21.24-.42.27-.77.09-.36-.18-1.5-.55-2.86-1.77-1.06-.94-1.77-2.1-1.98-2.46-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.8-1.94-1.1-2.66-.29-.7-.59-.6-.8-.61h-.74Z" />
  </svg>
);

const openWhatsAppOrder = ({ orderId, products, totalAmount, paymentMethod, paymentStatus, deliveryAddress }) => {
  const productText = products.map((item) => `${item.name} x ${item.quantity} - ${currency.format(item.price * item.quantity)}`).join("\n");
  const addressText = [deliveryAddress.fullName, deliveryAddress.phone, deliveryAddress.street, deliveryAddress.city, deliveryAddress.state, deliveryAddress.postalCode, deliveryAddress.country].filter(Boolean).join(", ");
  const message = `Order placed successfully\n\nOrder ID: ${orderId}\n\nProducts:\n${productText}\n\nTotal: ${currency.format(totalAmount)}\nPayment Method: ${paymentMethod}\nPayment Status: ${paymentStatus}\nDelivery Address: ${addressText}`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

const Checkout = () => {
  const { cart, refreshCart, clearCartLocal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowProduct = location.state?.buyNowProduct;
  const [deliveryAddress, setDeliveryAddress] = useState(emptyAddress);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!buyNowProduct) refreshCart();
  }, [buyNowProduct]);

  const products = useMemo(() => {
    if (buyNowProduct) {
      return [{
        product: buyNowProduct.productId,
        productId: buyNowProduct.productId,
        name: buyNowProduct.name,
        image: buyNowProduct.image,
        quantity: buyNowProduct.quantity,
        price: buyNowProduct.price
      }];
    }

    return (cart.items || []).map((item) => ({
      product: item.product._id,
      productId: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0],
      quantity: item.quantity,
      price: item.product.price
    }));
  }, [buyNowProduct, cart.items]);

  const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const paymentStatus = paymentMethod === "Online Payment" ? "Paid" : "Pending";

  const submit = async (e) => {
    e.preventDefault();
    if (!products.length) return;

    try {
      setPlacingOrder(true);
      const { data } = await axios.post(
        `${API_URL}/orders`,
        {
          products,
          productId: products[0].productId,
          quantity: products[0].quantity,
          totalAmount,
          deliveryAddress,
          paymentMethod,
          paymentStatus,
          orderStatus: "Booked",
          clearCart: !buyNowProduct
        },
        { headers: getAuthHeaders() }
      );

      if (!buyNowProduct) clearCartLocal();
      alert("Order placed successfully");
      openWhatsAppOrder({
        orderId: data._id,
        products,
        totalAmount,
        paymentMethod,
        paymentStatus,
        deliveryAddress
      });
      navigate("/orders");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="container-page py-10">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-bold">Product summary</h2>
            <div className="mt-5 space-y-4">
              {products.length ? products.map((item) => (
                <div className="flex gap-4 rounded-lg border border-black/10 p-4" key={item.productId}>
                  <img src={item.image} alt={item.name} className="h-24 w-20 rounded-md object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="mt-1 text-sm text-ink/60">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex flex-wrap justify-between gap-3 text-sm">
                      <span>Price: <strong>{currency.format(item.price)}</strong></span>
                      <span>Total: <strong>{currency.format(item.price * item.quantity)}</strong></span>
                    </div>
                  </div>
                </div>
              )) : <p className="text-ink/60">No products selected for checkout.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-bold">Delivery address</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.keys(deliveryAddress).map((key) => (
                <input
                  className="input"
                  key={key}
                  placeholder={key.replace(/([A-Z])/g, " $1")}
                  value={deliveryAddress[key]}
                  onChange={(e) => setDeliveryAddress({ ...deliveryAddress, [key]: e.target.value })}
                  required
                />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6">
            <h2 className="text-xl font-bold">Payment method</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {[
                ["Cash on Delivery", Landmark],
                ["Online Payment", CreditCard]
              ].map(([method, Icon]) => (
                <button
                  type="button"
                  className={`rounded-lg border p-4 text-left transition ${
                    paymentMethod === method ? "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100" : "border-black/10 hover:border-red-300"
                  }`}
                  onClick={() => setPaymentMethod(method)}
                  key={method}
                >
                  <Icon />
                  <span className="mt-3 block font-semibold">{method}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold">Order booking</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Items</span><strong>{products.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
            <div className="flex justify-between"><span>Payment</span><strong className="text-red-600">{paymentMethod}</strong></div>
            <div className="flex justify-between"><span>Payment status</span><strong>{paymentStatus}</strong></div>
            <div className="flex justify-between border-t border-black/10 pt-3 text-lg"><span>Total</span><strong>{currency.format(totalAmount)}</strong></div>
          </div>
          <button className="btn-primary mt-6 w-full" disabled={!products.length || placingOrder}>
            {!placingOrder && <WhatsAppIcon />}
            {placingOrder ? "Placing order..." : "Place Order & Send WhatsApp"}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;
