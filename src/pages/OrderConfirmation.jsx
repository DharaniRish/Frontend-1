import { CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const OrderConfirmation = () => {
  const { id } = useParams();
  return (
    <main className="container-page flex min-h-[560px] items-center justify-center py-10">
      <section className="max-w-xl rounded-lg border border-black/10 bg-white p-8 text-center shadow-premium">
        <CheckCircle2 className="mx-auto text-green-600" size={56} />
        <h1 className="mt-5 font-display text-4xl font-bold">Order confirmed</h1>
        <p className="mt-3 text-ink/60">Your order has been placed successfully. Order ID: <strong>{id}</strong></p>
        <div className="mt-7 flex justify-center gap-3">
          <Link className="btn-primary" to="/orders">View orders</Link>
          <Link className="btn-outline" to="/products">Continue shopping</Link>
        </div>
      </section>
    </main>
  );
};

export default OrderConfirmation;
