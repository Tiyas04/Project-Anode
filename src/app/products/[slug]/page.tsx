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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get("/api/getallproducts");
        if (response.data.success) {
          const products = response.data.data;
          const found = products.find((p: any) => {
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

  /* 🛒 ADD TO CART */
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: any) => item._id === product._id);

    let updatedCart;
    if (existing) {
      updatedCart = cart.map((item: any) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white border rounded-lg p-8">

          {/* IMAGE */}
          <div className="relative w-full h-64 mb-6">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* TITLE */}
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <FlaskConical className="w-6 h-6" />
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          <p className="text-gray-600 mb-4">
            CAS Number: {product.casNumber}
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-600">
            <p><strong>Formula:</strong> {product.formula}</p>
            <p><strong>Purity:</strong> {product.purity}</p>
            <p><strong>Molecular Weight:</strong> {product.molecularWeight}</p>
            <p><strong>Category:</strong> {product.category}</p>
          </div>

          {/* HAZARDS */}
          {product.hazards.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Hazards
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {product.hazards.map((hazard: string) => (
                  <li key={hazard}>{hazard}</li>
                ))}
              </ul>
            </div>
          )}

          {/* PRICE + CART BUTTON */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
            <span className="text-2xl font-bold text-gray-800">
              ₹{product.price}
            </span>

            <button
              onClick={addToCart}
              disabled={added}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-md font-medium transition
                ${added
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
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
