"use client"

import { useState } from "react";
import Login from "@/components/LogIn";
import Signup from "@/components/SignUp";
import Navbar from "@/components/NavBar";
import { FlaskConical } from "lucide-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#F4F8FA] flex flex-col items-center justify-center pt-32 p-4 font-sans">
      {/* Header section */}
      <div className="flex flex-col items-center mb-8 mt-[-40px]">
        <Link href="/" className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center border border-slate-100">
            <FlaskConical className="w-8 h-8 text-[#14B8A6]" />
          </div>
          <div className="text-center mt-3">
            <h1 className="text-2xl font-bold text-slate-800">Sai PSB Laboratory</h1>
            <p className="text-sm text-slate-500">Welcome back</p>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Account Access</h2>
          <p className="text-sm text-slate-500">Login or create a new account</p>
        </div>

        {/* Toggle */}
        <div className="flex p-1 mb-6 bg-slate-100 rounded-lg">
          <button
            onClick={() => setMode("login")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === "login"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`w-1/2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              mode === "signup"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        {mode === "login" ? <Login /> : <Signup switchToLogin={() => setMode("login")} />}
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm text-slate-500">
        Need help? <Link href="/contact" className="text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">Contact Support</Link>
      </div>
    </div>
    </>
  );
}
