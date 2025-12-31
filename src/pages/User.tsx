"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { User, Lock, LogOut, Package } from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

type UserProfile = {
  name: string;
  email: string;
  institution: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  orders: Order[];
};



export default function UserPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* 🔹 FETCH USER PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/auth/profile");
        setUser(res.data.data);
      } catch (error) {
        console.error("Profile fetch failed", error);
        window.location.href = "/auth";
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* 🔹 LOGOUT */
  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      toast.success("Logged out successfully");
      window.dispatchEvent(new Event("auth-updated"));

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* LEFT – USER MENU */}
          <aside className="bg-white border rounded-lg p-6 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
                <p className="text-xs text-gray-400">
                  {user.institution}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-[10px] text-gray-400">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  {user.lastLogin && (
                    <p className="text-[10px] text-green-600">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()} {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <nav className="space-y-3 text-sm">
              <Link
                href="/user"
                className="flex items-center gap-2 text-blue-600 font-medium"
              >
                <Package className="w-4 h-4" />
                Your Orders
              </Link>

              <Link href="/changepassword" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <Lock className="w-4 h-4" />
                Change Password
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT – ORDERS */}
          <section className="md:col-span-3 bg-white border rounded-lg p-6">
            <h1 className="text-2xl font-bold text-blue-700 mb-6">
              Your Orders
            </h1>

            {user.orders.length === 0 ? (
              <p className="text-gray-600">
                You haven’t placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {user.orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">
                        Order #{order._id.slice(-6)}
                      </p>
                      <span className="text-xs text-green-600 capitalize">
                        {order.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {order.items.map((item, idx) => (
                        <p key={idx}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <p className="mt-2 font-semibold text-gray-800">
                      Total: ₹{order.totalAmount}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Ordered on{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
