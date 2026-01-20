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
import "react-toastify/dist/ReactToastify.css";

type OrderItem = {
  name?: string;
  quantity: number;
  product?: { name: string };
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount?: number;
  totalamount?: number; // Handle lowercase from API
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
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        const userData = response.data.data;

        // Transform populated data to match UI structure
        if (userData.orders && Array.isArray(userData.orders)) {
          userData.orders = userData.orders.map((order: any) => ({
            ...order,
            items: order.orderitems?.map((item: any) => ({
              ...item,
              product: item.productid // Map populated productid to product
            })) || []
          }));
        }

        setUser(userData);
      } catch (error) {
        console.error("Profile fetch failed", error);
        window.location.href = "/auth";
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
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

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT – USER MENU */}
          <aside className="glass rounded-xl p-6 h-fit border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-secondary font-medium mt-0.5 truncate">
                  {user.institution}
                </p>
              </div>
            </div>

            <div className="mb-6 px-4 py-3 bg-white/5 rounded-lg space-y-2 border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Activity</p>
              <p className="text-xs text-slate-400 flex justify-between">
                <span>Joined:</span>
                <span className="font-mono text-slate-300">{new Date(user.createdAt).toLocaleDateString()}</span>
              </p>
              {user.lastLogin && (
                <p className="text-xs text-slate-400 flex justify-between">
                  <span>Last login:</span>
                  <span className="font-mono text-slate-300">{new Date(user.lastLogin).toLocaleDateString()}</span>
                </p>
              )}
            </div>

            <nav className="space-y-2 text-sm font-medium">
              <Link
                href="/user"
                className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-lg transition-colors border border-primary/10"
              >
                <Package className="w-4 h-4" />
                Your Orders
              </Link>

              <Link href="/changepassword" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors">
                <Lock className="w-4 h-4" />
                Change Password
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT – ORDERS */}
          <section className="lg:col-span-3 glass rounded-xl p-8 border border-white/20">
            <h1 className="text-2xl font-bold text-white mb-2">
              Order History
            </h1>
            <p className="text-slate-400 mb-8 text-sm">
              Track your past and current orders.
            </p>

            {user.orders.length === 0 ? (
              <div className="text-center py-12 bg-white/30 rounded-lg border border-dashed border-slate-300">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">
                  You haven’t placed any orders yet.
                </p>
                <Link href="/products" className="text-primary text-sm hover:underline mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">

                {user.orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-bold text-white font-mono">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${order.status === "delivered" ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                            order.status === "cancelled" ? "bg-rose-100 text-rose-700 border-rose-200" :
                              order.status === "shipped" ? "bg-sky-100 text-sky-700 border-sky-200" :
                                "bg-amber-100 text-amber-700 border-amber-200"
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-white text-xl">
                          ₹{order.totalamount || order.totalAmount}
                        </p>
                        {(order.status === "pending" || order.status === "ordered") && (
                          <button
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors border border-rose-100"
                            onClick={() => {
                              const performCancel = async () => {
                                try {
                                  const res = await axios.patch(`/api/auth/order?id=${order._id}`, { status: "cancelled" });
                                  if (res.data.success) {
                                    toast.success("Order cancelled");
                                    // Refresh profile/orders
                                    const updatedUser = { ...user };
                                    const orderIndex = updatedUser.orders.findIndex(o => o._id === order._id);
                                    if (orderIndex > -1) {
                                      updatedUser.orders[orderIndex].status = "cancelled";
                                      setUser(updatedUser);
                                    }
                                  }
                                } catch (err) {
                                  toast.error("Failed to cancel order");
                                }
                              };

                              toast(
                                ({ closeToast }) => (
                                  <div>
                                    <p className="font-semibold text-slate-800 mb-3 text-sm">Cancel this order?</p>
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={closeToast}
                                        className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                                      >
                                        Back
                                      </button>
                                      <button
                                        onClick={() => {
                                          performCancel();
                                          closeToast();
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition-colors shadow-sm"
                                      >
                                        Confirm
                                      </button>
                                    </div>
                                  </div>
                                ),
                                {
                                  position: "top-center",
                                  autoClose: false,
                                  closeOnClick: false,
                                  draggable: false,
                                  className: "!bg-white !rounded-xl !shadow-xl !border !border-slate-100"
                                }
                              );
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg border border-white/10 divide-y divide-white/10">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 text-sm">
                          <span className="text-slate-300 font-medium">{item.product?.name || item.name}</span>
                          <span className="text-slate-400 font-mono">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
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
