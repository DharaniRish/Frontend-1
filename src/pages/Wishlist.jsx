import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    api.get("/wishlist").then((res) => setProducts(res.data.products || []));
  }, []);
  return (
    <main className="container-page py-10">
      <h1 className="section-title">Wishlist</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => <ProductCard product={product} key={product._id} />)}
      </div>
      {!products.length && <p className="mt-8 text-ink/60">Your wishlist is empty.</p>}
    </main>
  );
};

export default Wishlist;
