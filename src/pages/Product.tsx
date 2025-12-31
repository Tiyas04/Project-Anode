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

    const addToCart = async () => {
        try {
            await axios.post(`/api/auth/cart/${slug}`);

            // Notify navbar / cart badge
            window.dispatchEvent(new Event("cart-updated"));

            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error: any) {
            console.error("Failed to add to cart", error);
        }
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
                    disabled={!product.inStock || product.stockLevel <= 0}
                    className={`flex-1 rounded-md py-2 text-sm font-medium transition flex items-center justify-center gap-2 cursor-pointer ${!product.inStock || product.stockLevel <= 0
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : isAdded
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
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

            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-700">
                            Products
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Laboratory and industrial chemicals with verified specifications.
                        </p>
                    </div>

                    {/* 🔍 FILTERS & SEARCH */}
                    <div className="bg-white p-4 rounded-lg border shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or CAS number..."
                                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="text-gray-500 w-4 h-4" />
                            <span className="text-sm font-medium text-gray-700">Category:</span>
                            <select
                                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* 🛒 GRID */}
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Loading products...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Search className="w-12 h-12 mb-4 text-gray-300" />
                            <p>No products found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                                className="mt-4 text-blue-600 hover:underline text-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
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
                                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-md text-sm font-medium transition
                                                    ${currentPage === i + 1
                                                        ? "bg-blue-600 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
