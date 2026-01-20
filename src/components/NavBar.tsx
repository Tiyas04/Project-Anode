import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogIn, FlaskConical, Menu, X, Package, Home } from "lucide-react";

import axios from "axios";

export default function Navbar() {
  /* MODIFIED: Added state for mobile menu */
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const updateCount = async () => {
      try {
        const res = await axios.get("/api/auth/cart");
        if (res.data.success && Array.isArray(res.data.data)) {
          const count = res.data.data.reduce(
            (acc: number, item: any) => acc + (item.quantity || 1),
            0
          );
          setCartCount(count);
        }
      } catch (error) {
        // If 401 unauth, just set count to 0
        setCartCount(0);
      }
    };

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile");
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
    <nav className="w-full glass fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-white tracking-tight"
        >
          <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-sm border border-primary/20">
            <FlaskConical className="w-6 h-6 text-primary" />
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            Sai PSB Laboratory
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center gap-1 text-slate-300 hover:text-primary transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-1 text-slate-300 hover:text-primary transition-colors duration-200"
          >
            <Package className="w-4 h-4" />
            Products
          </Link>

          <Link
            href="/cart"
            className="group flex items-center gap-1 text-slate-300 hover:text-primary relative transition-colors duration-200"
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
              className="flex items-center gap-1 text-slate-300 hover:text-primary transition-colors duration-200"
            >
              <FlaskConical className="w-4 h-4" />
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-sky-700 transition-all duration-200 shadow-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="md:hidden p-2 text-slate-300 hover:bg-white/10 rounded-md relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <Menu
            className={`w-6 h-6 absolute transition-all duration-300 ease-in-out ${isMobileOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
              }`}
          />
          <X
            className={`w-6 h-6 absolute transition-all duration-300 ease-in-out ${isMobileOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
              }`}
          />
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden absolute top-full left-0 w-full glass shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col p-4 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-primary font-medium p-2 hover:bg-white/5 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 text-slate-300 hover:text-primary font-medium p-2 hover:bg-white/5 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Package className="w-5 h-5" />
            Products
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 text-slate-300 hover:text-primary font-medium p-2 hover:bg-white/5 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
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
              className="flex items-center gap-2 text-slate-300 hover:text-primary font-medium p-2 hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <FlaskConical className="w-5 h-5" />
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-slate-300 hover:text-primary font-medium p-2 hover:bg-white/5 rounded-md transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
