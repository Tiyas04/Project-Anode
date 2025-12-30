"use client"

import { useState } from "react";
import Login from "@/components/LogIn";
import Signup from "@/components/SignUp";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white border rounded-lg shadow-md p-8">
          
          {/* TOGGLE */}
          <div className="flex mb-6 rounded-lg overflow-hidden border">
            <button
              onClick={() => setMode("login")}
              className={`w-1/2 py-2 text-sm font-medium ${
                mode === "login"
                  ? "bg-blue-600 text-white cursor-pointer"
                  : "bg-white text-gray-600 cursor-pointer"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`w-1/2 py-2 text-sm font-medium ${
                mode === "signup"
                  ? "bg-blue-600 text-white cursor-pointer"
                  : "bg-white text-gray-600 cursor-pointer"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          {mode === "login" ? <Login /> : <Signup />}
        </div>
      </main>

      <Footer />
    </>
  );
}
