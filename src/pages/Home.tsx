"use client"

import Navbar from "@/components/NavBar";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
    };

    checkAuth();

    // Listen for custom event just in case
    window.addEventListener("auth-updated", checkAuth);
    return () => {
      window.removeEventListener("auth-updated", checkAuth);
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pt-16">

        {/* HERO */}
        <section className="relative overflow-hidden bg-linear-to-b from-sky-50/40 to-white pb-12 pt-6">
          <div className="max-w-8xl mx-auto px-10 py-10 lg:py-20 flex flex-col lg:flex-row items-center gap-6">
            
            <div className="flex-1 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100/50 text-cyan-700 font-medium text-xs mb-6 border border-cyan-200/50">
                ISO Certified Laboratory Supplier
              </div>
              
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Premium Laboratory <br/>
                <span className="text-cyan-500">Chemicals & Supplies</span>
              </h1>
              
              <p className="text-lg text-slate-500 max-w-xl leading-relaxed mb-10">
                Your trusted partner for high-quality reagents, chemicals, and laboratory equipment. Supporting research and innovation with excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cyan-500 text-white rounded-xl font-semibold hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
                >
                  Browse Products
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-800 rounded-xl font-semibold hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
                >
                  Contact Sales
                </Link>
              </div>

              {/* STATS */}
              <div className="flex items-center gap-24">
                <div>
                  <div className="text-3xl font-bold text-cyan-600 mb-1">500+</div>
                  <div className="text-sm text-slate-500 font-medium">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-600 mb-1">ISO</div>
                  <div className="text-sm text-slate-500 font-medium">Certified</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-600 mb-1">24/7</div>
                  <div className="text-sm text-slate-500 font-medium">Support</div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-2xl relative z-10">
              <div className="aspect-16/10 rounded-4xl overflow-hidden shadow-2xl relative ring-1 ring-slate-900/5">
                <img 
                  src="/hero-lab.jpg" 
                  alt="Laboratory" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg transition-shadow duration-300 border border-slate-100 shadow-sm">
      <div className="flex justify-center mb-6 p-4 bg-slate-50 rounded-full w-20 h-20 mx-auto items-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
