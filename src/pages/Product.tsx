"use client"

import Image from "next/image";
import Link from "next/link";
import { FlaskConical, AlertTriangle, Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ product }: { product: Product }) => {
    const [isAdded, setIsAdded] = useState(false);

    const addToCart = async () => {
        try {
            await axios.post(`/api/auth/cart/${slug}`);

            // Notify navbar / cart badge
            window.dispatchEvent(new Event("cart-updated"));
            toast.success("Added to cart successfully");

            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error: any) {
            console.error("Failed to add to cart", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const slug = `${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${product.casNumber}`;

    return (
        <div className="glass rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border border-white/20 shadow-sm group">
            {/* IMAGE */}
            <div className="relative w-full h-40 mb-6 bg-white/50 rounded-lg p-2 group-hover:bg-white/70 transition-colors">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* TITLE */}
            <div className="flex items-start gap-2 mb-2">
                <div className="mt-1 p-1 bg-primary/20 rounded-md">
                    <FlaskConical className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-lg text-white leading-tight">
                    {product.name}
                </h2>
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <p className="text-sm text-slate-400 font-mono">
                    CAS: <span className="text-slate-300">{product.casNumber}</span>
                </p>
                <p className="text-sm text-slate-400">
                    Purity: <span className="font-medium text-secondary">{product.purity}</span>
                </p>
            </div>

            {/* HAZARD */}
            {product.hazards.length > 0 && (
                <div className="mt-auto mb-4 flex items-center gap-1.5 text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md w-fit">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {product.hazards[0]} {product.hazards.length > 1 && `+${product.hazards.length - 1}`}
                </div>
            )}

            {/* PRICE */}
            <div className="mt-auto mb-4 border-t border-white/20 pt-4">
                <span className="font-bold text-white text-xl tracking-tight">
                    ₹{product.price}
                </span>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
                <button
                    onClick={addToCart}
                    disabled={!product.inStock || product.stockLevel <= 0}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${!product.inStock || product.stockLevel <= 0
                        ? "bg-slate-200 cursor-not-allowed text-slate-400"
                        : isAdded
                            ? "bg-emerald-500 text-white shadow-emerald-500/25"
                            : "bg-primary text-white hover:bg-sky-700 shadow-primary/25 hover:shadow-primary/40"
                        }`}
                >
                    {!product.inStock || product.stockLevel <= 0 ? (
                        <>Out of Stock</>
                    ) : isAdded ? (
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
                    className="flex-1 border border-white/20 text-slate-300 rounded-lg py-2.5 text-center text-sm font-medium hover:bg-white/10 hover:border-white/30 hover:text-white transition-colors"
                >
                    Details
                </Link>
            </div>

            <p className="mt-3 text-xs text-slate-400 text-center font-medium">
                {product.inStock
                    ? `In stock (${product.stockLevel} units)`
                    : "Currently unavailable"}
            </p>
        </div >
    );
};

import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Filter & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

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

    // 🔹 Derived Data
    const uniqueCategories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.casNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 px-6 pb-20">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Our Products
                        </h1>
                        <p className="mt-3 text-lg text-slate-400 max-w-2xl">
                            Premium laboratory and industrial chemicals containing verified specifications and complete safety documentation.
                        </p>
                    </div>

                    {/* 🔍 FILTERS & SEARCH */}
                    <div className="glass p-4 rounded-xl shadow-sm mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border border-white/20">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or CAS number..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-700 text-sm placeholder:text-slate-400 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-medium">Category:</span>
                            </div>
                            <select
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-200 cursor-pointer min-w-[150px]"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-slate-800 text-slate-200">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 🛒 GRID */}
                    {loading ? (
                        <Loading />
                    ) : filteredProducts.length === 0 ? (
                        <div className="glass rounded-xl p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">No products found</h3>
                            <p className="text-slate-500 mt-1 max-w-md">
                                We couldn't find any products matching "{searchTerm}" in {selectedCategory}.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                                className="mt-6 text-primary hover:text-sky-700 font-medium hover:underline text-sm transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* 📄 PAGINATION */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all
                                                    ${currentPage === i + 1
                                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                                        : "text-slate-600 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
