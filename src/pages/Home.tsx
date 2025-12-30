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

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="bg-white text-gray-800">

        {/* HERO */}
        <section className="bg-blue-50 border-b">
          <div className="max-w-7xl mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
              Premium Laboratory Chemicals & Supplies
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              High-purity chemicals with verified sourcing, compliance,
              and complete safety documentation.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Browse Chemicals
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-8 text-center">
              Chemical Categories
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Laboratory Chemicals",
                "Industrial Chemicals",
                "Pharmaceutical Grade",
                "Solvents & Reagents",
              ].map((category) => (
                <div
                  key={category}
                  className="border rounded-lg p-6 text-center hover:shadow-md transition"
                >
                  <h3 className="font-medium text-gray-800">{category}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Verified quality & traceability
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-semibold text-blue-900 mb-10 text-center">
              Why Choose Us
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Feature
                icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                title="Certified Quality"
                description="Sourced from approved manufacturers with batch traceability."
              />
              <Feature
                icon={<FileText className="w-6 h-6 text-blue-600" />}
                title="Full Documentation"
                description="Safety Data Sheets (SDS) and compliance files included."
              />
              <Feature
                icon={<Truck className="w-6 h-6 text-blue-600" />}
                title="Secure Delivery"
                description="Handled and delivered following safety regulations."
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
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600 text-sm">{description}</p>
    </div>
  );
}
