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
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          Order #{order._id.slice(-6)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "cancelled" ? "bg-red-100 text-red-700" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                              "bg-yellow-100 text-yellow-700"
                          }`}>
                          {order.status.toUpperCase()}
                        </span>

                        {(order.status === "pending" || order.status === "ordered") && (
                          <button
                            className="text-xs text-red-600 hover:text-red-800 font-medium underline"
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
                                    <p className="font-semibold text-gray-800 mb-3">Cancel this order?</p>
                                    <div className="flex gap-3 justify-end">
                                      <button
                                        onClick={closeToast}
                                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                                      >
                                        No, Keep it
                                      </button>
                                      <button
                                        onClick={() => {
                                          performCancel();
                                          closeToast();
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                                      >
                                        Yes, Cancel
                                      </button>
                                    </div>
                                  </div>
                                ),
                                {
                                  position: "top-center",
                                  autoClose: false,
                                  closeOnClick: false,
                                  draggable: false,
                                }
                              );
                            }}
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 border-t pt-2 mt-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.product?.name || item.name}</span>
                          <span>x {item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <p className="mt-2 font-semibold text-gray-800 text-right">
                      Total: ₹{order.totalamount || order.totalAmount}
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
