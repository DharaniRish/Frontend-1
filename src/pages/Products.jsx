import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ErrorState from "../components/ErrorState";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    category: params.get("category") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    sort: "featured"
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: Object.fromEntries(Object.entries(filters).filter(([, value]) => value)) })
      .then((res) => {
        setProducts(res.data.products);
        setParams(Object.fromEntries(Object.entries(filters).filter(([, value]) => value)));
        setError("");
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load products"))
      .finally(() => setLoading(false));
  }, [filters, setParams]);

  const update = (field, value) => setFilters((current) => ({ ...current, [field]: value }));

  return (
    <main className="container-page py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Catalog</p>
          <h1 className="section-title mt-2">Shop the collection</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-ink/60"><SlidersHorizontal size={18} /> Refine your selection</div>
      </div>
      <div className="grid gap-7 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-black/10 bg-white p-5">
          <div className="space-y-4">
            <input className="input" placeholder="Search products" value={filters.search} onChange={(e) => update("search", e.target.value)} />
            <select className="input" value={filters.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input className="input" type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => update("minPrice", e.target.value)} />
              <input className="input" type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} />
            </div>
            <select className="input" value={filters.rating} onChange={(e) => update("rating", e.target.value)}>
              <option value="">Any rating</option>
              <option value="4">4 stars and up</option>
              <option value="3">3 stars and up</option>
            </select>
            <select className="input" value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="priceLow">Price low to high</option>
              <option value="priceHigh">Price high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </aside>
        <section>
          {error && <ErrorState message={error} />}
          {loading ? <Loader /> : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => <ProductCard product={product} key={product._id} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Products;
