"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import axios from "axios";
import {
  AlertTriangle,
  FlaskConical,
  ShoppingCart,
  Check
} from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  /* 🔹 FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("/api/getallproducts");
        if (res.data.success) {
          const found = res.data.data.find((p: any) => {
            const pSlug = `${p.name.toLowerCase().replace(/\s+/g, "-")}-${p.casNumber}`;
            return pSlug === slug;
          });
          setProduct(found || null);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!loading && !product) notFound();

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* 🛒 ADD TO CART (BACKEND) */
  const addToCart = async () => {
    try {
      await axios.post(`/api/auth/cart/${slug}`);

      // update navbar cart badge
      window.dispatchEvent(new Event("cart-updated"));

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-4xl mx-auto glass border border-white/20 rounded-2xl p-8 sm:p-10 shadow-sm">

          {/* IMAGE */}
          <div className="relative w-full h-80 mb-10 bg-white/50 rounded-xl p-4 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              {/* TITLE */}
              <div className="flex items-start gap-3 text-primary mb-3">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold text-slate-800 leading-tight">{product.name}</h1>
              </div>

              <p className="text-slate-500 mb-6 flex items-center gap-2">
                <span className="font-semibold text-xs uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded">CAS Number</span>
                {product.casNumber}
              </p>

              {/* DESCRIPTION */}
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">{product.description}</p>
            </div>

            <div className="space-y-6">
              {/* DETAILS */}
              <div className="bg-white/50 rounded-xl p-6 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4 border-b border-slate-100 pb-2">Specifications</h3>
                <div className="space-y-3 text-slate-600 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Formula</span>
                    <span className="font-mono text-slate-700">{product.formula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Purity</span>
                    <span className="font-medium text-secondary">{product.purity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Molecular Weight</span>
                    <span>{product.molecularWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category</span>
                    <span>{product.category}</span>
                  </div>
                </div>
              </div>

              {/* HAZARDS */}
              {product.hazards.length > 0 && (
                <div className="bg-rose-50/50 rounded-xl p-6 border border-rose-100">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-rose-600">
                    <AlertTriangle className="w-5 h-5" />
                    Hazards / Safety
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.hazards.map((hazard: string) => (
                      <span key={hazard} className="text-xs font-medium text-rose-600 bg-white px-3 py-1 rounded-full border border-rose-100">
                        {hazard}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-900 tracking-tight">
                ₹{product.price}
              </span>
              <p className="text-sm text-slate-500 mt-1">
                {product.inStock ? `In Stock (${product.stockLevel} units)` : "Currently Out of Stock"}
              </p>
            </div>

            <button
              onClick={addToCart}
              disabled={added || !product.inStock || product.stockLevel <= 0}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg active:scale-95 sm:min-w-[200px]
                ${!product.inStock || product.stockLevel <= 0
                  ? "bg-slate-200 cursor-not-allowed text-slate-400 shadow-none border border-slate-300"
                  : added
                    ? "bg-emerald-500 text-white cursor-default shadow-emerald-500/30 ring-2 ring-emerald-500 ring-offset-2"
                    : "bg-primary hover:bg-sky-700 text-white shadow-primary/30 hover:shadow-primary/50"
                }`}
            >
              {!product.inStock || product.stockLevel <= 0 ? (
                <>Out of Stock</>
              ) : added ? (
                <>
                  <Check className="w-6 h-6" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
