"use client"

import { useState } from "react";
import Login from "@/components/LogIn";
import Signup from "@/components/SignUp";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md glass rounded-xl p-8 border border-white/20 relative z-10">

          {/* TOGGLE */}
          <div className="flex mb-6 rounded-lg overflow-hidden bg-white/5 p-1 border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => setMode("login")}
              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${mode === "login"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${mode === "signup"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-400 hover:text-white"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          {mode === "login" ? <Login /> : <Signup switchToLogin={() => setMode("login")} />}
        </div>
      </main>

      <Footer />
    </>
  );
}
