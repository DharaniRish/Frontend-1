import axios from "axios";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/contact`, form);
      alert("Message sent successfully");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      alert("Failed to send message");
    }
  };

  return (
    <main className="container-page grid gap-10 py-10 lg:grid-cols-[0.8fr_1fr]">
      <section>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-gold">Concierge</p>
        <h1 className="section-title mt-2">We are here to help.</h1>
        <p className="mt-4 leading-7 text-ink/60">Ask about sizing, gifting, shipping, returns, or corporate orders.</p>
        <div className="mt-8 space-y-4 text-sm font-semibold">
          <p className="flex gap-3"><Mail className="text-gold" /> care@maisonluxe.com</p>
          <p className="flex gap-3"><Phone className="text-gold" /> +91 98765 43210</p>
          <p className="flex gap-3"><MapPin className="text-gold" /> Bandra West, Mumbai</p>
        </div>
      </section>
      <form onSubmit={submit} className="rounded-lg border border-black/10 bg-white p-6 shadow-premium">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input className="input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <input className="input mt-4" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
        <textarea className="input mt-4 min-h-40" name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
        <button className="btn-primary mt-5">Send message</button>
      </form>
    </main>
  );
};

export default Contact;
