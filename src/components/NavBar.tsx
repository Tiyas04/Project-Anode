import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogIn, FlaskConical } from "lucide-react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    };

    // Initial count
    updateCount();

    // Listen for custom event and storage event
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-700"
        >
          <FlaskConical className="w-6 h-6" />
          Sai PSB Laboratory
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/products"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="group flex items-center gap-1 text-gray-700 hover:text-blue-600 relative"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          <Link
            href="/auth"
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
