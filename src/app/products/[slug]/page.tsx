"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import axios from "axios";
import {
  AlertTriangle,
  FlaskConical,
  ShoppingCart,
  Check
} from "lucide-react";
import Navbar from "@/components/NavBar";
import { toast } from "react-toastify";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [amount, setAmount] = useState<string>("");

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
        <div className="min-h-screen bg-[#F4F8FA] flex items-center justify-center">
            <Navbar />
            <div className="text-slate-500 font-medium">Loading details...</div>
        </div>
    );
  }

  /* 🛒 ADD TO CART (BACKEND) */
  const addToCart = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error(`Please enter a valid amount in ${product.unit || 'mg'}`);
      return;
    }

    try {
      await axios.post(`/api/auth/cart/${slug}`, { quantity: Number(amount) });

      // update navbar cart badge
      window.dispatchEvent(new Event("cart-updated"));

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error: any) {
      console.log("Add to cart error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.push("/auth");
        return;
      }
      console.error("Failed to add to cart", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-2xl p-8 sm:p-10">

          {/* IMAGE */}
          <div className="relative w-full h-80 mb-10 bg-[#FAFAFA] border border-slate-50 rounded-xl p-4 flex items-center justify-center">
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
              <div className="flex items-start gap-3 mb-3">
                <h1 className="text-3xl font-bold text-slate-800 leading-tight">{product.name}</h1>
              </div>

              <p className="text-slate-500 mb-6 flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wide bg-slate-100 text-slate-600 px-2 py-1 rounded">CAS Number</span>
                <span className="font-mono">{product.casNumber}</span>
              </p>

              {/* DESCRIPTION */}
              <p className="text-slate-600 mb-8 leading-relaxed text-lg">{product.description}</p>
            </div>

            <div className="space-y-6">
              {/* DETAILS */}
              <div className="bg-[#FAFAFA] rounded-xl p-6 border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Specifications</h3>
                <div className="space-y-3 text-slate-600 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Formula</span>
                    <span className="font-mono font-bold text-slate-700">{product.formula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Purity</span>
                    <span className="font-bold text-[#14B8A6]">{product.purity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Molecular Weight</span>
                    <span className="font-bold text-slate-700">{product.molecularWeight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-500">Category</span>
                    <span className="font-bold text-slate-700">{product.category}</span>
                  </div>
                </div>
              </div>

              {/* HAZARDS */}
              {product.hazards && product.hazards.length > 0 && (
                <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
                  <h3 className="font-bold mb-3 flex items-center gap-2 text-rose-500">
                    <AlertTriangle className="w-5 h-5" />
                    Hazards / Safety
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.hazards.map((hazard: string) => (
                      <span key={hazard} className="text-xs font-bold text-rose-600 bg-white px-3 py-1 rounded-md border border-rose-100 shadow-sm">
                        {hazard}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BAR */}
          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-slate-800 tracking-tight">
                ₹{product.price} <span className="text-lg font-semibold text-slate-500">/ {product.unit || 'mg'}</span>
              </span>
              <p className="text-sm font-semibold text-slate-500 mt-1">
                {product.inStock ? `In Stock (${product.stockLevel} units)` : "Currently Out of Stock"}
              </p>

              <div className="mt-4">
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Amount in ${product.unit || 'mg'}`}
                    className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-bold">
                    {product.unit || 'mg'}
                  </span>
                </div>
                {amount && !isNaN(Number(amount)) && (
                  <div className="mt-2 text-sm text-[#14B8A6] font-bold">
                    Total: ₹{(Number(amount) * product.price).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={addToCart}
              disabled={added || !product.inStock || product.stockLevel <= 0}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-sm active:scale-95 sm:min-w-[200px]
                ${!product.inStock || product.stockLevel <= 0
                  ? "bg-slate-100 cursor-not-allowed text-slate-400 border border-slate-200 shadow-none"
                  : added
                    ? "bg-[#14B8A6] text-white cursor-default shadow-md ring-2 ring-[#0D9486] ring-offset-2"
                    : "bg-[#20B9CE] hover:bg-[#1AA3B5] text-white hover:shadow-md"
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
    </div>
  );
}
