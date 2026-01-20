"use client"

import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Truck,
  ArrowRight,
} from "lucide-react";

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

      <main className="text-slate-200 pt-20">

        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl -z-10 opacity-30 animate-pulse"></div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
                Premium Laboratory
              </span>
              <br />
              Chemicals & Supplies
            </h1>
            <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              High-purity chemicals with verified sourcing, compliance,
              and complete safety documentation for research and industry.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-sky-700 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                Browse Chemicals
                <ArrowRight className="w-5 h-5" />
              </Link>

              {!isLoggedIn && (
                <Link
                  href="/auth"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-slate-200 rounded-xl font-semibold hover:bg-white/10 hover:border-sidebar-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Chemical Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Laboratory Chemicals",
                "Industrial Chemicals",
                "Pharmaceutical Grade",
                "Solvents & Reagents",
              ].map((category) => (
                <div
                  key={category}
                  className="glass p-8 rounded-2xl text-center hover:scale-[1.02] transition-transform duration-300 border border-white/20 shadow-sm"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-200">{category}</h3>
                  <p className="text-sm text-slate-400 mt-2">
                    Verified quality & traceability
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-20 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Why Choose Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Feature
                icon={<ShieldCheck className="w-8 h-8 text-secondary" />}
                title="Certified Quality"
                description="Sourced from approved manufacturers with batch traceability for every product."
              />
              <Feature
                icon={<FileText className="w-8 h-8 text-primary" />}
                title="Full Documentation"
                description="Safety Data Sheets (SDS) and compliance files included with every order."
              />
              <Feature
                icon={<Truck className="w-8 h-8 text-accent" />}
                title="Secure Delivery"
                description="Specialized handling and delivery following strict safety regulations."
              />
            </div>
          </div>
        </section>

      </main>

      <Footer />
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
    <div className="glass p-8 rounded-2xl text-center hover:shadow-md transition-shadow duration-300 border border-white/10">
      <div className="flex justify-center mb-6 p-4 bg-white/5 rounded-full w-20 h-20 mx-auto items-center shadow-inner ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
