import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogIn, FlaskConical } from "lucide-react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    };

    const checkAuth = async () => {
      try {
        // We can check if the user is logged in by trying to fetch the profile
        // or by checking a non-httpOnly cookie if we had one.
        // For now, let's assume if the /api/auth/profile call succeeds, they are logged in.
        // However, to avoid excessive API calls on every page load if not needed, we can try a lighter approach
        // or just rely on the API. using fetch for now.
        const res = await fetch("/api/auth/profile", {
          headers: {
            // We need to ensure credentials are sent if we are using cookies
            // But usually fetch() credentials: 'include' is needed.
            // Since this is Next.js app router/pages router mix, let's be careful.
            // Actually, axios in User page used default headers? No, it used nothing. 
            // But cookies are sent automatically by browser to same origin.
          }
        });
        // The Profile route returns 200 if found.
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    }

    // Initial checks
    updateCount();
    checkAuth();

    // Listen for custom events
    window.addEventListener("cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    window.addEventListener("auth-updated", checkAuth);

    return () => {
      window.removeEventListener("cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("auth-updated", checkAuth);
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

          {isLoggedIn ? (
            <Link
              href="/user"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <FlaskConical className="w-4 h-4" /> {/* Using different icon or User icon if available */}
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
