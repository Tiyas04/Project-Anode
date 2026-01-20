"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Package,
  ShoppingBag,
  PlusCircle,
  Calendar
} from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Product } from "@/types/product";
import axios from "axios";

/* TEMP MOCK ORDERS */
const mockOrders = [
  {
    id: "o1",
    customer: "LabTech India",
    date: "2024-11-12",
    status: "Pending",
    total: 2450,
  },
  {
    id: "o2",
    customer: "BioChem Labs",
    date: "2024-11-10",
    status: "Shipped",
    total: 1320,
  },
  {
    id: "o3",
    customer: "Hospital Pharmacy",
    date: "2024-11-08",
    status: "Delivered",
    total: 890,
  },
];



export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Products & Orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          axios.get("/api/getallproducts"),
          axios.get("/api/auth/admin/allorders", {
            headers: { admin: "admin" } // Pass admin header if needed, though simpler authentication is preferred
          })
        ]);

        if (prodRes.data.success) setProducts(prodRes.data.data);
        if (orderRes.data.success) setOrders(orderRes.data.data);

      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Status Update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await axios.patch(`/api/auth/order?id=${orderId}`, { status: newStatus }, {
        headers: { admin: "admin" }
      });
      if (res.data.success) {
        toast.success("Order status updated");
        // Update UI locally
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>

            <div className="flex gap-3">
              <Link href="/admin/addproduct">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-sky-700 transition cursor-pointer font-semibold shadow-sm hover:shadow-md">
                  <PlusCircle className="w-5 h-5" />
                  Add Product
                </button>
              </Link>
            </div>
          </div>



          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              icon={<Package className="w-6 h-6 text-primary" />}
              label="Total Products"
              value={products.length}
            />
            <StatCard
              icon={<ShoppingBag className="w-6 h-6 text-primary" />}
              label="Total Orders"
              value={orders.length}
            />
          </div>

          {/* ORDERS */}
          <section className="glass rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-secondary" />
              Recent Orders
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-white/20">
                  <tr>
                    <th className="py-3 text-left font-medium pl-4">Order ID</th>
                    <th className="py-3 text-left font-medium">Customer</th>
                    <th className="py-3 text-left font-medium">Date</th>
                    <th className="py-3 text-center font-medium">Proof</th>
                    <th className="py-3 text-left font-medium">Status</th>
                    <th className="py-3 text-right font-medium">Total</th>
                    <th className="py-3 text-center font-medium pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/30 transition-colors">
                      <td className="py-4 pl-4 font-mono text-xs text-slate-400">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-200">{order.customer?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-400">{order.customer?.email}</span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-400 py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center py-4">
                        {order.customer?.proof ? (
                          <Link href={order.customer.proof} target="_blank" className="text-primary hover:text-sky-700 underline text-xs font-medium">
                            View
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No Proof</span>
                        )}
                      </td>
                      <td className="py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs border rounded-md px-2 py-1 outline-none cursor-pointer font-medium bg-white/5 border-white/10 text-slate-300 ${order.status === 'delivered' ? 'text-emerald-400! border-emerald-500/30! bg-emerald-500/10!' :
                            order.status === 'cancelled' ? 'text-rose-400! border-rose-500/30! bg-rose-500/10!' :
                              order.status === 'shipped' ? 'text-sky-400! border-sky-500/30! bg-sky-500/10!' :
                                'text-amber-400! border-amber-500/30! bg-amber-500/10!'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="ordered">Ordered</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-right font-bold text-white py-4">
                        ₹{order.totalamount}
                      </td>
                      <td className="text-center py-4 pr-4">
                        <button
                          className="text-rose-500 hover:text-rose-700 text-xs font-medium bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded transition-colors"
                          onClick={() => {
                            const confirmToast = ({ closeToast }: { closeToast: any }) => (
                              <div className="text-sm">
                                <p className="mb-2 font-medium">Delete Order #{order._id.slice(-6)}?</p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-600 text-xs cursor-pointer"
                                    onClick={closeToast}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 text-xs cursor-pointer"
                                    onClick={async () => {
                                      closeToast();
                                      try {
                                        const res = await axios.delete(`/api/auth/admin/deleteorder?id=${order._id}`, {
                                          headers: { admin: "admin" },
                                        });
                                        if (res.data.success) {
                                          toast.success("Order deleted");
                                          setOrders((prev) => prev.filter((o) => o._id !== order._id));
                                        }
                                      } catch (error: any) {
                                        console.error(error);
                                        toast.error("Failed to delete order");
                                      }
                                    }}
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            );

                            toast(confirmToast, { autoClose: false, closeButton: false, className: "!rounded-xl" });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500 italic">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* PRODUCT LIST */}
          <section className="glass rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-secondary" />
              Product List
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-slate-400 border-b border-white/20">
                  <tr>
                    <th className="py-3 text-left font-medium pl-4">Name</th>
                    <th className="py-3 text-left font-medium">Category</th>
                    <th className="py-3 text-left font-medium">Qty</th>
                    <th className="py-3 text-left font-medium">CAS</th>
                    <th className="py-3 text-right font-medium">Price</th>
                    <th className="py-3 text-center font-medium">Stock</th>
                    <th className="py-3 text-center font-medium pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-white/30 transition-colors"
                    >
                      <td className="py-4 pl-4 font-semibold text-slate-200">
                        {product.name}
                      </td>
                      <td className="py-4 text-slate-300">{product.category}</td>
                      <td className="py-4 text-slate-300">{product.quantity}</td>
                      <td className="py-4 font-mono text-xs text-slate-400">{product.casNumber}</td>
                      <td className="text-right py-4 font-bold text-white">
                        ₹{product.price}
                      </td>
                      <td className="text-center py-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${product.inStock ? "bg-emerald-100/50 text-emerald-700 border-emerald-200" : "bg-rose-100/50 text-rose-700 border-rose-200"}`}>
                          {product.inStock ? product.stockLevel : "Out"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-center flex items-center justify-center gap-2">
                        <Link href={`/admin/editproduct?id=${product._id}`}>
                          <button className="text-primary hover:text-sky-700 text-xs font-semibold px-2 py-1 bg-primary/5 hover:bg-primary/10 rounded transition-colors cursor-pointer">
                            Edit
                          </button>
                        </Link>
                        <button
                          className="text-rose-500 hover:text-rose-700 text-xs font-semibold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                          onClick={() => {
                            const confirmToast = ({ closeToast }: { closeToast: any }) => (
                              <div className="text-sm cursor-pointer">
                                <p className="mb-2 font-medium">Delete {product.name}?</p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    className="px-3 py-1 bg-slate-100 rounded hover:bg-slate-200 text-slate-600 text-xs cursor-pointer"
                                    onClick={closeToast}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="px-3 py-1 bg-rose-600 text-white rounded hover:bg-rose-700 text-xs cursor-pointer"
                                    onClick={async () => {
                                      closeToast();
                                      try {
                                        const res = await axios.delete(`/api/auth/admin/deleteproduct?id=${product._id}`, {
                                          headers: { admin: "admin" },
                                        });
                                        if (res.data.success) {
                                          toast.success("Product deleted");
                                          setProducts((prev) => prev.filter((p) => p._id !== product._id));
                                        }
                                      } catch (error) {
                                        console.error(error);
                                        toast.error("Failed to delete product");
                                      }
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );

                            toast(confirmToast, { autoClose: false, closeButton: false, className: "!rounded-xl" });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500 italic">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

/* 🔹 REUSABLE COMPONENTS */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="glass rounded-xl p-6 flex items-center gap-4 border border-white/20">
      <div className="p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Shipped: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-600"
        }`}
    >
      {status}
    </span>
  );
}
