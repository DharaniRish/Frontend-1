import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/products/featured"), api.get("/categories")]).then(([productRes, categoryRes]) => {
      setProducts(productRes.data);
      setCategories(categoryRes.data);
    });
  }, []);

  return (
    <div>
      <section className="bg-ink text-white">
        <div className="container-page grid min-h-[620px] items-center gap-10 py-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-gold">Spring private edit</p>
            <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">Premium essentials with quiet confidence.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Discover design-led pieces across watches, audio, travel, and home, selected for lasting craft and everyday pleasure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary bg-white text-ink hover:bg-pearl" to="/products">Shop collection <ArrowRight size={18} /></Link>
              <Link className="btn-outline border-white/25 text-white hover:bg-white hover:text-ink" to="/contact">Concierge support</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85"
              alt="Premium watch and accessories"
              className="h-[520px] w-full rounded-lg object-cover shadow-premium"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-md bg-white/92 p-5 text-ink backdrop-blur">
              <p className="text-sm font-semibold">Members receive complimentary express delivery and gift packaging this week.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Curated Quality", Sparkles, "Every item is selected for build, finish, and long-term usefulness."],
            ["Secure Checkout", ShieldCheck, "JWT-authenticated accounts, protected orders, and clear payment UI."],
            ["Fast Delivery", Truck, "Premium packaging, status tracking, and responsive order support."]
          ].map(([title, Icon, copy]) => (
            <div className="rounded-lg border border-black/10 bg-white p-6" key={title}>
              <Icon className="text-gold" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/60">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Featured</p>
            <h2 className="section-title mt-2">Editor picks</h2>
          </div>
          <Link className="btn-outline hidden md:flex" to="/products">View all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard product={product} key={product._id} />)}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Categories</p>
          <h2 className="section-title mt-2">Shop by mood</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {categories.map((category) => (
            <Link to={`/products?category=${category._id}`} className="group relative overflow-hidden rounded-lg" key={category._id}>
              <img src={category.image} alt={category.name} className="h-72 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="mt-1 text-sm text-white/75">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-pearl py-16">
        <div className="container-page grid gap-8 md:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Private offer</p>
            <h2 className="section-title mt-2">Save up to 25% on travel-ready accessories.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {["Impeccable curation and packaging.", "The checkout felt polished and quick."].map((quote, index) => (
              <blockquote className="rounded-lg bg-white p-6 shadow-sm" key={quote}>
                <p className="text-lg font-semibold">"{quote}"</p>
                <footer className="mt-4 text-sm text-ink/55">Verified customer {index + 1}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
