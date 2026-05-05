import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });

  const refreshCart = async () => {
    const { data } = await api.get("/cart");
    setCart(data);
    return data;
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart", { productId, quantity });
    setCart(data);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    setCart(data);
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
  };

  const clearCartLocal = () => setCart({ items: [] });
  const count = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cart.items?.reduce((sum, item) => sum + item.quantity * item.product.price, 0) || 0;

  const value = useMemo(
    () => ({ cart, count, total, refreshCart, addToCart, updateQuantity, removeFromCart, clearCartLocal }),
    [cart, count, total]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
