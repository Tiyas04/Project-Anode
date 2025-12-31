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

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* SHIPPING */}
          <div className="md:col-span-2 bg-white border rounded-lg p-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">
              Checkout
            </h1>

            <div className="space-y-4 text-gray-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" onChange={handleChange} className="border px-3 py-2 rounded-md" />
                <input name="phonenumber" placeholder="Phone Number" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              </div>

              <input name="company" placeholder="Company / Laboratory Name" onChange={handleChange} className="border px-3 py-2 rounded-md w-full" />
              <input name="email" placeholder="Email" onChange={handleChange} className="border px-3 py-2 rounded-md w-full" />
              <input name="address" placeholder="Shipping Address" onChange={handleChange} className="border px-3 py-2 rounded-md w-full" />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="city" placeholder="City" onChange={handleChange} className="border px-3 py-2 rounded-md" />
                <input name="state" placeholder="State" onChange={handleChange} className="border px-3 py-2 rounded-md" />
                <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              </div>

              <div className="border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Proof (ID/License)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPermissionProof(e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

              <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-md">
                Payment Method: <strong>Cash on Delivery</strong>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white border rounded-lg p-6 text-gray-800">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-3 mb-3">
                <div className="relative w-12 h-12">
                  <Image src={item.image} alt={item.name} fill className="object-contain" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}

            <div className="flex justify-between font-semibold mt-4">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600 mt-3">
              <CheckCircle className="w-4 h-4" />
              Secure & compliant chemical delivery
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
