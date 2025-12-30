"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Lock, LogOut, Package } from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function UserPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("orders");
    window.location.href = "/";
  };

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
                <p className="font-semibold text-gray-800">Demo User</p>
                <p className="text-sm text-gray-500">user@example.com</p>
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

              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <Lock className="w-4 h-4" />
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
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

            {orders.length === 0 ? (
              <p className="text-gray-600">
                You haven’t placed any orders yet.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-medium text-gray-800">
                        Order #{index + 1}
                      </p>
                      <span className="text-xs text-green-600">
                        Confirmed
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      {order.items.map((item: any) => (
                        <p key={item._id}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <p className="mt-2 font-semibold text-gray-800">
                      Total: ₹{order.total}
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
