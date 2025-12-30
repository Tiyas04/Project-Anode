"use client"

import Image from "next/image";
import Link from "next/link";
import { FlaskConical, AlertTriangle, Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ProductCard = ({ product }: { product: Product }) => {
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item: any) => item._id === product._id);

        let updatedCart;
        if (existingItem) {
            updatedCart = cart.map((item: any) =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            updatedCart = [...cart, { ...product, quantity: 1 }];
        }

        localStorage.setItem("cart", JSON.stringify(updatedCart));

        // Dispatch event for Navbar update
        window.dispatchEvent(new Event("cart-updated"));

        // Find existing quantity to show if needed, but for now just show "Added"
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const slug = `${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${product.casNumber}`;

    return (
        <div className="bg-white border rounded-lg p-6 hover:shadow-md transition flex flex-col h-full">
            {/* IMAGE */}
            <div className="relative w-full h-40 mb-4">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* TITLE */}
            <div className="flex items-center gap-2 mb-1 text-blue-600">
                <FlaskConical className="w-5 h-5" />
                <h2 className="font-semibold text-lg">
                    {product.name}
                </h2>
            </div>

            <p className="text-sm text-gray-600">
                CAS: {product.casNumber}
            </p>
            <p className="text-sm text-gray-600">
                Purity: {product.purity}
            </p>

            {/* HAZARD */}
            {product.hazards.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                    <AlertTriangle className="w-4 h-4" />
                    {product.hazards.join(", ")}
                </div>
            )}

            {/* PRICE */}
            <div className="mt-4 mb-4">
                <span className="font-semibold text-gray-800 text-lg">
                    ₹{product.price}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2 mt-auto">
                <button
                    onClick={addToCart}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${isAdded
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    {isAdded ? (
                        <>Added!</>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            Add
                        </>
                    )}
                </button>
                <Link
                    href={`/products/${slug}`}
                    className="flex-1 border border-blue-600 text-blue-600 rounded-md py-2 text-center text-sm font-medium hover:bg-blue-50 transition"
                >
                    Details
                </Link>
            </div>

            <p className="mt-2 text-xs text-gray-500 text-center">
                {product.inStock
                    ? `In stock (${product.stockLevel})`
                    : "Out of stock"}
            </p>
        </div>
    );
};

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/api/getallproducts");
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-blue-700">
                            Products
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Laboratory and industrial chemicals with verified specifications.
                        </p>
                    </div>

                    {/* GRID */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
