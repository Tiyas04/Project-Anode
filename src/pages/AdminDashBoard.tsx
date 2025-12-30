"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  PlusCircle,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { products } from "@/pages/Product";

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
  const [orders, setOrders] = useState(mockOrders);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-blue-700">
              Admin Dashboard
            </h1>
<Link href="/admin/addproduct">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition cursor-pointer">
              <PlusCircle className="w-5 h-5" />
              Add Product
            </button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              icon={<Package className="w-6 h-6 text-blue-600" />}
              label="Total Products"
              value={products.length}
            />
            <StatCard
              icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
              label="Total Orders"
              value={orders.length}
            />
          </div>

          {/* ORDERS */}
          <section className="bg-white border rounded-lg p-6 text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Orders
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-600 border-b">
                  <tr>
                    <th className="py-2 text-left">Order ID</th>
                    <th className="py-2 text-left">Customer</th>
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="py-3">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {order.date}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="text-right font-medium">
                        ₹{order.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PRODUCT LIST */}
          <section className="bg-white border rounded-lg p-6 text-gray-600">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product List
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-600 border-b">
                  <tr>
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-left">Category</th>
                    <th className="py-2 text-left">CAS</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-center">Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 font-medium">
                        {product.name}
                      </td>
                      <td>{product.category}</td>
                      <td>{product.casNumber}</td>
                      <td className="text-right">
                        ₹{product.price}
                      </td>
                      <td className="text-center">
                        {product.inStock ? product.stockLevel : "Out"}
                      </td>
                    </tr>
                  ))}
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
    <div className="bg-white border rounded-lg p-6 flex items-center gap-4">
      <div className="p-3 bg-blue-50 rounded-md">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
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
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
