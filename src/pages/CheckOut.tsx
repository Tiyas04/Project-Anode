"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/NavBar";
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
    phoneno: ""
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

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subTotal * 0.18);
  const totalAmount = subTotal + tax;

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
      formData.append("phoneno", form.phoneno);
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
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* SHIPPING */}
          <div className="md:col-span-2 bg-white rounded-xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                Checkout
              </h1>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
                <input name="phoneno" placeholder="Phone Number" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              </div>

              <input name="company" placeholder="Company / Laboratory Name" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input name="email" placeholder="Email" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input name="address" placeholder="Shipping Address" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="city" placeholder="City" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
                <input name="state" placeholder="State" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
                <input name="pincode" placeholder="Pincode" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              </div>

              <div className="border border-slate-200 p-5 rounded-lg bg-[#FAFAFA]">
                <label className="block text-sm font-bold text-slate-700 mb-3">Permission Proof (ID/License)</label>
                <input
                  type="file"
                  onChange={(e) => setPermissionProof(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-bold
                    file:bg-[#14B8A6]/10 file:text-[#0D9486]
                    hover:file:bg-[#14B8A6]/20 transition-colors file:cursor-pointer cursor-pointer shadow-sm"
                />
              </div>

              <div className="bg-sky-50 text-sky-700 text-sm p-4 rounded-lg border border-sky-100 flex items-center gap-2 font-bold shadow-sm">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                Payment Method: Cash on Delivery
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-[#14B8A6] text-white py-4 rounded-xl font-bold hover:bg-[#0D9486] transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-lg mt-4"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white rounded-xl p-6 h-fit border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] sticky top-24">
            <h2 className="font-bold text-lg text-slate-800 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => {
                const product = item.product || {};
                return (
                  <div key={item._id || index} className="flex gap-3 relative bg-[#FAFAFA] p-2 rounded-lg border border-slate-50">
                    <div className="relative w-14 h-14 bg-white border border-slate-100 rounded-md shrink-0 p-1">
                      <Image
                        src={product.image || "/placeholder.png"}
                        alt={product.name || "Product Image"}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-bold text-slate-800 truncate">{product.name || "Unknown Product"}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">Qty: {item.quantity} {product.unit || 'mg'}</p>
                    </div>
                    <div className="flex items-center text-sm font-bold text-[#14B8A6] pr-2">
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600 font-semibold text-sm">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold text-sm">
                <span>Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t border-slate-100 text-slate-800">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 mt-6 bg-emerald-50 py-3 rounded-lg border border-emerald-100 font-bold shadow-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Secure & compliant chemical delivery
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
