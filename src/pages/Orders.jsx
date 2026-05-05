import axios from "axios";
import { CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const trackingSteps = ["Booked", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

const getAuthHeaders = () => {
  const stored = localStorage.getItem("user");
  const token = stored ? JSON.parse(stored).token : "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const formatAddress = (address) => {
  if (!address) return "No delivery address";
  return [address.fullName, address.phone, address.street, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(", ");
};

const WhatsAppIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16.02 3.2A12.74 12.74 0 0 0 5.08 22.5L3.2 29l6.66-1.75A12.75 12.75 0 1 0 16.02 3.2Zm0 2.34a10.41 10.41 0 1 1-5.3 19.36l-.38-.23-3.96 1.04 1.06-3.86-.25-.4A10.41 10.41 0 0 1 16.02 5.54Zm-4.45 4.79c-.24 0-.62.09-.95.45-.33.36-1.25 1.22-1.25 2.98 0 1.75 1.28 3.45 1.46 3.69.18.24 2.49 3.98 6.08 5.42 3 .84 3.61.67 4.26.63.65-.04 2.1-.86 2.4-1.69.29-.83.29-1.54.2-1.69-.09-.15-.33-.24-.68-.42-.36-.18-2.1-1.04-2.43-1.16-.33-.12-.57-.18-.8.18-.24.36-.92 1.16-1.13 1.4-.21.24-.42.27-.77.09-.36-.18-1.5-.55-2.86-1.77-1.06-.94-1.77-2.1-1.98-2.46-.21-.36-.02-.55.16-.73.16-.16.36-.42.54-.63.18-.21.24-.36.36-.6.12-.24.06-.45-.03-.63-.09-.18-.8-1.94-1.1-2.66-.29-.7-.59-.6-.8-.61h-.74Z" />
  </svg>
);

const sendOrderToWhatsApp = (order) => {
  const products = order.products?.length ? order.products : order.orderItems || [];
  const totalAmount = order.totalAmount ?? order.totalPrice ?? 0;
  const orderStatus = order.orderStatus || order.status || "Booked";
  const address = order.deliveryAddress || order.shippingAddress;
  const productText = products.map((item) => `${item.name} x ${item.quantity} - ${currency.format(item.price * item.quantity)}`).join("\n");
  const message = `Order Details\n\nOrder ID: ${order._id}\nStatus: ${orderStatus}\n\nProducts:\n${productText}\n\nTotal: ${currency.format(totalAmount)}\nPayment Method: ${order.paymentMethod}\nPayment Status: ${order.paymentStatus || "Pending"}\nDelivery Address: ${formatAddress(address)}`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/orders/my-orders`, { headers: getAuthHeaders() });
      setOrders(data);
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    const cancellationReason = window.prompt("Please enter cancellation reason");
    if (!cancellationReason) return;

    try {
      await axios.put(`${API_URL}/orders/${orderId}/cancel`, { cancellationReason }, { headers: getAuthHeaders() });
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <main className="container-page py-10">
      <h1 className="section-title">Order history</h1>

      <div className="mt-8 space-y-5">
        {loading && <p className="text-ink/60">Loading orders...</p>}

        {!loading && !orders.length && <p className="text-ink/60">No orders found</p>}

        {orders.map((order) => {
          const products = order.products?.length ? order.products : order.orderItems || [];
          const totalAmount = order.totalAmount ?? order.totalPrice ?? 0;
          const orderStatus = order.orderStatus || order.status || "Booked";
          const trackingStatus = order.trackingStatus || orderStatus;
          const activeStepIndex = trackingSteps.indexOf(trackingStatus);
          const isCancelled = orderStatus === "Cancelled";
          const canCancel = orderStatus !== "Delivered" && orderStatus !== "Cancelled";

          return (
            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm" key={order._id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <p className="font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-ink/60">Order ID: {order._id}</p>
                  <p className="mt-1 text-sm text-ink/55">Ordered date: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-sm font-semibold ${isCancelled ? "bg-red-50 text-red-700" : "bg-pearl text-ink"}`}>
                    {isCancelled ? "Order Cancelled" : orderStatus}
                  </span>
                  <strong>{currency.format(totalAmount)}</strong>
                  <Link className="btn-outline py-2" to={`/order-confirmation/${order._id}`}>Details</Link>
                  <button className="inline-flex items-center justify-center gap-2 rounded-md border border-green-200 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50" onClick={() => sendOrderToWhatsApp(order)}>
                    <WhatsAppIcon /> WhatsApp
                  </button>
                  {canCancel && (
                    <button className="rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50" onClick={() => cancelOrder(order._id)}>
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                <div className="space-y-3">
                  {products.map((item) => (
                    <div className="flex gap-4 rounded-lg border border-black/10 p-4" key={`${order._id}-${item.product}`}>
                      {item.image && <img src={item.image} alt={item.name} className="h-20 w-16 rounded-md object-cover" />}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-ink/60">Quantity: {item.quantity}</p>
                        <p className="mt-1 text-sm text-ink/60">Price: {currency.format(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg bg-pearl/60 p-4 text-sm">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <p><span className="block text-ink/50">Payment method</span><strong>{order.paymentMethod}</strong></p>
                    <p><span className="block text-ink/50">Payment status</span><strong>{order.paymentStatus || "Pending"}</strong></p>
                    <p><span className="block text-ink/50">Order status</span><strong>{orderStatus}</strong></p>
                    <p><span className="block text-ink/50">Tracking status</span><strong>{trackingStatus}</strong></p>
                  </div>
                  <p className="mt-4"><span className="block text-ink/50">Delivery address</span><strong>{formatAddress(order.deliveryAddress || order.shippingAddress)}</strong></p>
                  {isCancelled && (
                    <p className="mt-4 rounded-md bg-red-50 p-3 text-red-700">
                      <strong>Cancellation reason:</strong> {order.cancellationReason || "No reason provided"}
                    </p>
                  )}
                </div>
              </div>

              {!isCancelled && (
                <div className="mt-6 overflow-x-auto">
                  <div className="flex min-w-[720px] items-center">
                    {trackingSteps.map((step, index) => {
                      const done = activeStepIndex >= index;
                      return (
                        <div className="flex flex-1 items-center" key={step}>
                          <div className="flex flex-col items-center gap-2 text-center">
                            <span className={done ? "text-green-600" : "text-ink/30"}>
                              {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                            </span>
                            <span className={`text-xs font-semibold ${done ? "text-ink" : "text-ink/40"}`}>{step}</span>
                          </div>
                          {index < trackingSteps.length - 1 && <div className={`mx-3 h-px flex-1 ${activeStepIndex > index ? "bg-green-500" : "bg-black/10"}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
};

export default Orders;
