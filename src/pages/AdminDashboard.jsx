import { Edit, PackagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import api from "../services/api";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const emptyProduct = { name: "", slug: "", brand: "", category: "", images: "", price: "", originalPrice: "", countInStock: "", description: "", details: "", featured: false };

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", image: "", description: "" });

  const load = async () => {
    const [dash, productRes, categoryRes, userRes, orderRes] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/products?limit=100"),
      api.get("/categories"),
      api.get("/admin/users"),
      api.get("/admin/orders")
    ]);
    setStats(dash.data);
    setProducts(productRes.data.products);
    setCategories(categoryRes.data);
    setUsers(userRes.data);
    setOrders(orderRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      images: productForm.images.split(",").map((item) => item.trim()).filter(Boolean),
      details: productForm.details.split(",").map((item) => item.trim()).filter(Boolean),
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      countInStock: Number(productForm.countInStock)
    };
    if (editing) await api.put(`/products/${editing}`, payload);
    else await api.post("/products", payload);
    setProductForm(emptyProduct);
    setEditing(null);
    load();
  };

  const editProduct = (product) => {
    setEditing(product._id);
    setProductForm({
      ...product,
      category: product.category?._id || product.category,
      images: product.images.join(", "),
      details: product.details?.join(", ") || ""
    });
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    await api.post("/categories", categoryForm);
    setCategoryForm({ name: "", slug: "", image: "", description: "" });
    load();
  };

  return (
    <main className="container-page py-10">
      <h1 className="section-title">Admin dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          ["Sales", currency.format(stats?.sales || 0)],
          ["Users", stats?.users || 0],
          ["Products", stats?.products || 0],
          ["Orders", stats?.orders || 0]
        ].map(([label, value]) => (
          <div className="rounded-lg border border-black/10 bg-white p-5" key={label}>
            <p className="text-sm font-semibold text-ink/55">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={saveProduct} className="rounded-lg border border-black/10 bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold"><PackagePlus size={20} /> {editing ? "Edit product" : "Add product"}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["name", "slug", "brand", "price", "originalPrice", "countInStock"].map((key) => (
              <input className="input" placeholder={key} value={productForm[key]} onChange={(e) => setProductForm({ ...productForm, [key]: e.target.value })} key={key} required={["name", "slug", "brand", "price", "countInStock"].includes(key)} />
            ))}
            <select className="input" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} required>
              <option value="">Category</option>
              {categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} /> Featured</label>
          </div>
          <input className="input mt-3" placeholder="Image URLs separated by comma" value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} required />
          <input className="input mt-3" placeholder="Details separated by comma" value={productForm.details} onChange={(e) => setProductForm({ ...productForm, details: e.target.value })} />
          <textarea className="input mt-3 min-h-28" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
          <button className="btn-primary mt-4">{editing ? "Update product" : "Create product"}</button>
        </form>

        <div>
          <h2 className="mb-4 text-xl font-bold">Products</h2>
          <AdminTable
            columns={["Product", "Price", "Stock", "Actions"]}
            rows={products}
            renderRow={(product) => (
              <tr key={product._id}>
                <td className="px-4 py-3 font-semibold">{product.name}</td>
                <td className="px-4 py-3">{currency.format(product.price)}</td>
                <td className="px-4 py-3">{product.countInStock}</td>
                <td className="flex gap-2 px-4 py-3">
                  <button className="rounded-md border p-2" onClick={() => editProduct(product)}><Edit size={16} /></button>
                  <button className="rounded-md border p-2 text-red-600" onClick={async () => { await api.delete(`/products/${product._id}`); load(); }}><Trash2 size={16} /></button>
                </td>
              </tr>
            )}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-bold">Manage orders</h2>
          <AdminTable
            columns={["Order", "Customer", "Total", "Status"]}
            rows={orders}
            renderRow={(order) => (
              <tr key={order._id}>
                <td className="px-4 py-3 font-semibold">#{order._id.slice(-8)}</td>
                <td className="px-4 py-3">{order.user?.name || "Customer"}</td>
                <td className="px-4 py-3">{currency.format(order.totalPrice)}</td>
                <td className="px-4 py-3">
                  <select className="input py-2" value={order.status} onChange={async (e) => { await api.put(`/admin/orders/${order._id}/status`, { status: e.target.value }); load(); }}>
                    {["Processing", "Packed", "Shipped", "Delivered", "Cancelled"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            )}
          />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-bold">Manage users</h2>
          <AdminTable
            columns={["Name", "Email", "Role", "Action"]}
            rows={users}
            renderRow={(user) => (
              <tr key={user._id}>
                <td className="px-4 py-3 font-semibold">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.isAdmin ? "Admin" : "Customer"}</td>
                <td className="px-4 py-3">
                  <button className="rounded-md border p-2 text-red-600" onClick={async () => { await api.delete(`/admin/users/${user._id}`); load(); }}><Trash2 size={16} /></button>
                </td>
              </tr>
            )}
          />
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xl font-bold">Manage categories</h2>
        <form className="mt-5 grid gap-3 md:grid-cols-5" onSubmit={saveCategory}>
          {["name", "slug", "image", "description"].map((key) => (
            <input className="input" placeholder={key} value={categoryForm[key]} onChange={(e) => setCategoryForm({ ...categoryForm, [key]: e.target.value })} key={key} required={key !== "description"} />
          ))}
          <button className="btn-primary">Add category</button>
        </form>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span className="rounded-full bg-pearl px-3 py-1 text-sm font-semibold" key={category._id}>{category.name}</span>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
