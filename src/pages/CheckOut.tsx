"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permissionProof, setPermissionProof] = useState<File | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phonenumber: ""
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/auth/cart");
        if (res.data.success) {
          setCartItems(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    const isEmpty = Object.values(form).some((v) => v.trim() === "");

    if (isEmpty || !permissionProof) {
      toast.error("All fields (including Permission Proof) are required");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", form.name);
      formData.append("email", form.email);
      formData.append("company", form.company);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("pincode", form.pincode);
      formData.append("permissionproof", permissionProof);

      const res = await axios.post("/api/auth/order", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Order placed successfully!");
        setTimeout(() => router.push("/user"), 2000);
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* SHIPPING */}
          <div className="md:col-span-2 glass rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Checkout
              </h1>
            </div>

            <div className="space-y-4 text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
                <input name="phonenumber" placeholder="Phone Number" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              </div>

              <input name="company" placeholder="Company / Laboratory Name" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input name="email" placeholder="Email" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input name="address" placeholder="Shipping Address" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="city" placeholder="City" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
                <input name="state" placeholder="State" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
                <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              </div>

              <div className="border border-white/10 p-4 rounded-lg bg-white/5">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Permission Proof (ID/License)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPermissionProof(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20 transition-colors file:cursor-pointer cursor-pointer"
                />
              </div>

              <div className="bg-sky-500/10 text-sky-300 text-sm p-4 rounded-lg border border-sky-500/20 flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-primary" />
                Payment Method: Cash on Delivery
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-primary/25 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="glass rounded-xl p-6 h-fit border border-white/20 sticky top-24">
            <h2 className="font-bold text-lg text-white mb-6 border-b border-white/20 pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                return (
                  <div key={item._id || index} className="flex gap-3 relative">
                    <div className="relative w-14 h-14 bg-white/50 rounded-lg shrink-0 p-1">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name || "Product Image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{product.name || "Unknown Product"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-white">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between font-bold text-lg border-t border-white/20 pt-4 text-white">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 mt-6 bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20 font-medium">
              <CheckCircle className="w-3 h-3" />
              Secure & compliant chemical delivery
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
