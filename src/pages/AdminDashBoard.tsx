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
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-slate-800">
              Admin Dashboard
            </h1>

            <div className="flex gap-3">
              <Link href="/admin/addproduct">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#14B8A6] text-white rounded-lg hover:bg-[#0D9486] transition cursor-pointer font-bold shadow-sm hover:shadow-md">
                  <PlusCircle className="w-5 h-5" />
                  Add Product
                </button>
              </Link>
            </div>
          </div>



          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              icon={<Package className="w-6 h-6 text-[#14B8A6]" />}
              label="Total Products"
              value={products.length}
            />
            <StatCard
              icon={<ShoppingBag className="w-6 h-6 text-[#14B8A6]" />}
              label="Total Orders"
              value={orders.length}
            />
          </div>

          {/* ORDERS */}
          <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#20B9CE]" />
              Recent Orders
            </h2>

            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-[#FAFAFA]">
              <table className="w-full text-sm">
                <thead className="text-slate-500 border-b border-slate-200 bg-white">
                  <tr>
                    <th className="py-4 text-left font-bold pl-4">Order ID</th>
                    <th className="py-4 text-left font-bold">Customer</th>
                    <th className="py-4 text-left font-bold">Date</th>
                    <th className="py-4 text-center font-bold">Proof</th>
                    <th className="py-4 text-center font-bold">Receipt</th>
                    <th className="py-4 text-left font-bold">Status</th>
                    <th className="py-4 text-right font-bold">Total</th>
                    <th className="py-4 text-center font-bold pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-4 font-mono text-xs text-slate-500 font-semibold">{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{order.customer?.name || "Unknown"}</span>
                          <span className="text-xs text-slate-500 font-semibold">{order.customer?.email}</span>
                          <span className="text-xs text-slate-500 font-semibold">{order.customer?.phoneno}</span>
                          <span className="text-xs text-slate-400 font-medium mt-1">
                            {order.customer?.address}, {order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}
                          </span>
                        </div>
                      </td>
                      <td className="text-xs text-slate-600 font-bold py-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center py-4">
                        {order.customer?.proof ? (
                          <Link href={order.customer.proof} target="_blank" className="text-[#14B8A6] hover:text-[#0D9486] underline text-xs font-bold">
                            View
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs italic font-semibold">No Proof</span>
                        )}
                      </td>
                      <td className="text-center py-4">
                        {order.receiptUrl ? (
                          <Link href={order.receiptUrl} target="_blank" className="text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-1 rounded-md hover:bg-[#14B8A6]/20 transition-colors border border-[#14B8A6]/20 text-xs font-bold flex items-center justify-center gap-1 mx-auto max-w-fit">
                            Download
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs italic font-semibold">-</span>
                        )}
                      </td>
                      <td className="py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`text-xs border rounded-md px-2 py-1.5 outline-none cursor-pointer font-bold shadow-sm ${order.status === 'delivered' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                            order.status === 'cancelled' ? 'text-rose-700 border-rose-200 bg-rose-50' :
                              order.status === 'shipped' ? 'text-cyan-700 border-cyan-200 bg-cyan-50' :
                                'text-amber-700 border-amber-200 bg-amber-50'
                            }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="ordered">Ordered</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-right font-bold text-slate-800 text-sm tracking-tight py-4">
                        ₹{order.totalamount}
                      </td>
                      <td className="text-center py-4 pr-4">
                        <button
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold border border-rose-100 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-md transition-colors shadow-sm"
                          onClick={() => {
                            const confirmToast = ({ closeToast }: { closeToast: any }) => (
                              <div className="text-sm">
                                <p className="mb-3 font-bold text-slate-800">Delete Order #{order._id.slice(-6).toUpperCase()}?</p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    className="px-3 py-1.5 bg-slate-100 rounded-md hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                                    onClick={closeToast}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="px-3 py-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 font-bold text-xs cursor-pointer shadow-sm transition-colors"
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

                            toast(confirmToast, { autoClose: false, closeButton: false, className: "!bg-white !rounded-xl !shadow-xl !border !border-slate-100" });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-slate-500 italic bg-[#FAFAFA] font-semibold">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* PRODUCT LIST */}
          <section className="bg-white rounded-xl p-6 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#20B9CE]" />
              Product List
            </h2>

            <div className="overflow-x-auto rounded-lg border border-slate-100 bg-[#FAFAFA]">
              <table className="w-full text-sm">
                <thead className="text-slate-500 border-b border-slate-200 bg-white">
                  <tr>
                    <th className="py-4 text-left font-bold pl-4">Name</th>
                    <th className="py-4 text-left font-bold">Category</th>
                    <th className="py-4 text-left font-bold">Qty</th>
                    <th className="py-4 text-left font-bold">CAS</th>
                    <th className="py-4 text-right font-bold">Price</th>
                    <th className="py-4 text-center font-bold">Stock</th>
                    <th className="py-4 text-center font-bold pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 pl-4 font-bold text-slate-800">
                        {product.name}
                      </td>
                      <td className="py-4 text-slate-600 font-semibold">{product.category}</td>
                      <td className="py-4 text-slate-600 font-semibold">{product.quantity} {product.unit}</td>
                      <td className="py-4 font-mono text-xs text-slate-500 font-semibold">{product.casNumber}</td>
                      <td className="text-right py-4 font-bold text-slate-800 tracking-tight">
                        ₹{product.price}
                      </td>
                      <td className="text-center py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${product.inStock ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                          {product.inStock ? product.stockLevel : "Out"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-center flex items-center justify-center gap-2">
                        <Link href={`/admin/editproduct?id=${product._id}`}>
                          <button className="text-[#14B8A6] hover:text-[#0D9486] text-xs font-bold px-3 py-1.5 bg-[#14B8A6]/10 hover:bg-[#14B8A6]/20 rounded-md transition-colors border border-[#14B8A6]/20 cursor-pointer shadow-sm">
                            Edit
                          </button>
                        </Link>
                        <button
                          className="text-rose-500 hover:text-rose-600 text-xs font-bold px-3 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-100 cursor-pointer shadow-sm"
                          onClick={() => {
                            const confirmToast = ({ closeToast }: { closeToast: any }) => (
                              <div className="text-sm cursor-pointer">
                                <p className="mb-3 font-bold text-slate-800">Delete {product.name}?</p>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    className="px-3 py-1.5 bg-slate-100 rounded-md hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer transition-colors"
                                    onClick={closeToast}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    className="px-3 py-1.5 bg-rose-500 text-white rounded-md hover:bg-rose-600 font-bold text-xs cursor-pointer shadow-sm transition-colors"
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

                            toast(confirmToast, { autoClose: false, closeButton: false, className: "!bg-white !rounded-xl !shadow-xl !border !border-slate-100" });
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-500 italic bg-[#FAFAFA] font-semibold">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
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
    <div className="bg-white rounded-xl p-6 flex items-center gap-4 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
      <div className="p-3 bg-[#14B8A6]/10 rounded-lg shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-bold">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-700 border border-amber-200",
    Shipped: "bg-cyan-100 text-cyan-700 border border-cyan-200",
    Delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${colors[status] || "bg-slate-100 text-slate-600 border border-slate-200"
        }`}
    >
      {status}
    </span>
  );
}
