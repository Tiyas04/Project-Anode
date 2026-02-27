"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { User, Lock, LogOut, Package } from "lucide-react";
import Navbar from "@/components/NavBar";
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
  subtotal?: number;
  tax?: number;
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
      </>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* LEFT – USER MENU */}
          <aside className="bg-white rounded-xl p-6 h-fit border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-[#14B8A6]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 font-semibold truncate">
                  {user.email}
                </p>
                <p className="text-xs text-[#20B9CE] font-bold mt-0.5 truncate">
                  {user.institution}
                </p>
              </div>
            </div>

            <div className="mb-6 px-4 py-3 bg-[#FAFAFA] rounded-lg space-y-2 border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Activity</p>
              <p className="text-xs text-slate-500 font-semibold flex justify-between">
                <span>Joined:</span>
                <span className="font-mono text-slate-700 font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
              </p>
              {user.lastLogin && (
                <p className="text-xs text-slate-500 font-semibold flex justify-between">
                  <span>Last login:</span>
                  <span className="font-mono text-slate-700 font-bold">{new Date(user.lastLogin).toLocaleDateString()}</span>
                </p>
              )}
            </div>

            <nav className="space-y-2 text-sm font-bold">
              <Link
                href="/user"
                className="flex items-center gap-3 px-4 py-3 bg-[#14B8A6]/10 text-[#0D9486] rounded-lg transition-colors border border-[#14B8A6]/20"
              >
                <Package className="w-4 h-4" />
                Your Orders
              </Link>

              <Link href="/changepassword" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg transition-colors border border-transparent">
                <Lock className="w-4 h-4" />
                Change Password
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors text-left font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </aside>

          {/* RIGHT – ORDERS */}
          <section className="lg:col-span-3 bg-white rounded-xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Order History
            </h1>
            <p className="text-slate-500 mb-8 font-semibold text-sm">
              Track your past and current orders.
            </p>

            {user.orders.length === 0 ? (
              <div className="text-center py-12 bg-[#FAFAFA] rounded-lg border border-dashed border-slate-200">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">
                  You haven't placed any orders yet.
                </p>
                <Link href="/products" className="text-[#14B8A6] font-bold text-sm hover:underline mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">

                {user.orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-lg font-bold text-slate-800 font-mono">
                            #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${order.status === "delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            order.status === "cancelled" ? "bg-rose-50 text-rose-600 border-rose-100" :
                              order.status === "shipped" ? "bg-cyan-50 text-cyan-600 border-cyan-100" :
                                "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                          <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-slate-800 text-xl tracking-tight">
                          ₹{order.totalamount || order.totalAmount}
                        </p>
                        {(order.status === "pending" || order.status === "ordered") && (
                          <button
                            className="text-xs font-bold text-rose-500 hover:text-white bg-white hover:bg-rose-500 px-3 py-1.5 rounded-md transition-colors border border-rose-200 shadow-sm"
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
                                    <p className="font-bold text-slate-800 mb-3 text-sm">Cancel this order?</p>
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={closeToast}
                                        className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
                                      >
                                        Back
                                      </button>
                                      <button
                                        onClick={() => {
                                          performCancel();
                                          closeToast();
                                        }}
                                        className="px-3 py-1.5 text-xs font-bold text-white bg-rose-500 rounded-md hover:bg-rose-600 transition-colors shadow-sm"
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
                        {order.status === "delivered" && (order as any).receiptUrl && (
                          <Link
                            href={(order as any).receiptUrl}
                            target="_blank"
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-md transition-colors border border-emerald-100 flex items-center gap-1 shadow-sm"
                          >
                            <span className="hidden sm:inline">Download</span> Receipt
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#FAFAFA] rounded-lg border border-slate-100 divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 text-sm">
                          <span className="text-slate-700 font-bold">{item.product?.name || item.name}</span>
                          <span className="text-slate-500 font-mono font-semibold">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.subtotal && order.tax ? (
                        <div className="p-3 text-sm bg-slate-50 border-t border-slate-200 space-y-1 rounded-b-lg">
                          <div className="flex justify-between text-slate-500 font-semibold">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 font-semibold">
                            <span>Tax (18% GST)</span>
                            <span>₹{order.tax}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
