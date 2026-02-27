"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlaskConical, AlertTriangle, Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import Navbar from "@/components/NavBar";
import Loading from "@/components/Loading";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ product }: { product: Product }) => {
    const [isAdded, setIsAdded] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const router = useRouter();

    const addToCart = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error(`Please enter a valid amount in ${product.unit || 'mg'}`);
            return;
        }

        try {
            await axios.post(`/api/auth/cart/${slug}`, { quantity: Number(amount) });

            // Notify navbar / cart badge
            window.dispatchEvent(new Event("cart-updated"));
            toast.success("Added to cart successfully");

            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error: any) {
            if (error.response?.status === 403) {
                router.push("/auth");
                return;
            }
            if (error.response?.status === 401 || error.response?.status === 403) {
                router.push("/auth");
                return;
            }
            console.error("Failed to add to cart", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };

    const slug = `${product.name
        .toLowerCase()
        .replace(/\s+/g, "-")}-${product.casNumber}`;

    return (
        <div className="bg-white rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 flex flex-col h-full border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] group">
            {/* IMAGE */}
            <div className="relative w-full h-40 mb-4 bg-[#FAFAFA] border border-slate-50 rounded-lg p-2 group-hover:bg-slate-50 transition-colors">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                />
            </div>

            {/* TITLE */}
            <div className="flex items-start gap-2 mb-2">
                <h2 className="font-bold text-lg text-slate-800 leading-tight">
                    {product.name}
                </h2>
            </div>

            <div className="flex flex-col gap-1 mb-4">
                <p className="text-sm text-slate-500 font-mono">
                    CAS: <span className="text-slate-600">{product.casNumber}</span>
                </p>
                <p className="text-sm text-slate-500">
                    Purity: <span className="font-medium text-[#14B8A6]">{product.purity}</span>
                </p>
            </div>

            {/* HAZARD */}
            {product.hazards && product.hazards.length > 0 && (
                <div className="mt-auto mb-4 flex items-center gap-1.5 text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-1 rounded-md w-fit">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {product.hazards[0]} {product.hazards.length > 1 && `+${product.hazards.length - 1}`}
                </div>
            )}

            {/* PRICE & INPUT */}
            <div className="mt-auto mb-4 border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-slate-500">Price per {product.unit || 'mg'}</span>
                    <span className="font-bold text-slate-800 text-xl tracking-tight">
                        ₹{product.price}
                    </span>
                </div>

                <div>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={`Amount in ${product.unit || 'mg'}`}
                            className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                            {product.unit || 'mg'}
                        </span>
                    </div>

                    {amount && !isNaN(Number(amount)) && (
                        <div className="mt-2 flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-semibold">Total:</span>
                            <span className="font-bold text-[#14B8A6]">
                                ₹{(Number(amount) * product.price).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
                <button
                    onClick={addToCart}
                    disabled={!product.inStock || product.stockLevel <= 0}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] ${!product.inStock || product.stockLevel <= 0
                        ? "bg-slate-100 cursor-not-allowed text-slate-400"
                        : isAdded
                            ? "bg-[#14B8A6] text-white shadow-md shadow-[#14B8A6]/25"
                            : "bg-[#20B9CE] text-white hover:bg-[#1AA3B5] shadow-sm hover:shadow-md"
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
                    className="flex-1 border bg-white border-slate-200 text-slate-600 rounded-lg py-2.5 text-center text-sm font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-colors shadow-sm"
                >
                    Details
                </Link>
            </div>

            <p className="mt-3 text-xs text-slate-500 text-center font-semibold">
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
        <div className="min-h-screen bg-[#F4F8FA] font-sans">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-10 text-center text-slate-800">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Our Products
                        </h1>
                        <p className="mt-3 text-lg text-slate-500">
                            Browse our comprehensive catalog of laboratory chemicals and reagents
                        </p>
                    </div>

                    {/* 🔍 FILTERS & SEARCH */}
                    <div className="bg-white px-8 py-5 rounded-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name or CAS number..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Filter className="w-4 h-4" />
                                <span className="text-sm font-bold">Category:</span>
                            </div>
                            <select
                                className="bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] text-slate-700 cursor-pointer min-w-[150px] transition-all"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {uniqueCategories.map((cat) => (
                                    <option key={cat} value={cat} className="text-slate-800 font-medium">
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
                        <div className="bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-xl p-16 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Search className="w-10 h-10 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                            <p className="text-slate-500 mt-2 max-w-md">
                                We couldn't find any products matching "{searchTerm}" in {selectedCategory}.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                                className="mt-6 text-[#14B8A6] hover:text-[#0D9486] font-bold hover:underline transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
                                        className="p-2.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm
                                                    ${currentPage === i + 1
                                                        ? "bg-[#14B8A6] text-white border border-[#14B8A6]"
                                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
