import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, LogIn, FlaskConical, Menu, X, Package, Home, LayoutDashboard, User, Search } from "lucide-react";

import axios from "axios";

export default function Navbar() {
  /* MODIFIED: Added state for mobile menu */
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Added isAdmin state
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
          const data = await res.json();
          setIsLoggedIn(true);
          // Check for admin role from response (header or user data)
          if (data.role === 'admin' || data.data?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
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
    <nav className="w-full bg-white border-b border-gray-100 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3 z-20 relative"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            {/* Some colorful flask icon */}
            <img src="/logo.png" alt="" className="w-8 h-8 object-contain hidden" />
            <FlaskConical className="w-8 h-8 text-cyan-600 drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-800 leading-tight">
              Sai PSB Laboratory
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Premium Lab Chemicals
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS (CENTERED) */}
        <div className="hidden md:flex absolute inset-x-0 w-full justify-center pointer-events-none">
          <div className="flex items-center gap-8 text-sm font-semibold text-slate-700 pointer-events-auto">
            <Link
              href="/"
              className="hover:text-cyan-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-cyan-600 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/contact"
              className="hover:text-cyan-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* RIGHT SECTION: SEARCH & ICONS */}
        <div className="hidden md:flex items-center gap-6 z-20 relative">
          <Link
            href="/cart"
            className="group flex items-center gap-1 text-slate-600 hover:text-slate-900 relative transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </Link>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              href="/user"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md relative w-10 h-10 flex items-center justify-center z-20"
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
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isMobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col p-4 gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Home className="w-5 h-5" />
            Home
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Package className="w-5 h-5" />
            Products
          </Link>
          
          <Link
            href="/contact"
            className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <Search className="w-5 h-5" />
            Contact Us
          </Link>

          <Link
            href="/cart"
            className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              href="/user"
              className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              <User className="w-5 h-5" />
              Profile
            </Link>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 text-slate-700 hover:text-cyan-600 font-medium p-2 hover:bg-slate-50 rounded-md transition-colors"
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
