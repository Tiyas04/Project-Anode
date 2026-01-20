"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

function EditProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");

    const [form, setForm] = useState({
        price: "",
        quantity: "",
        inStock: true,
        stockLevel: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch product details on mount
    useEffect(() => {
        if (!id) {
            toast.error("No product ID provided");
            router.push("/admin/dashboard");
            return;
        }

        const fetchProduct = async () => {
            try {
                // Since we don't have a single product fetch API yet, filtering from all
                const res = await axios.get("/api/getallproducts");
                if (res.data.success) {
                    const product = res.data.data.find((p: any) => p._id === id);
                    if (product) {
                        setForm({
                            price: product.price,
                            quantity: product.quantity,
                            inStock: product.inStock,
                            stockLevel: product.stockLevel,
                        });
                    } else {
                        toast.error("Product not found");
                        router.push("/admin/dashboard");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
                toast.error("Failed to load product details");
            }
        };

        fetchProduct();
    }, [id, router]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.price ||
            !form.quantity ||
            !form.stockLevel
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);
            // Append ID to the URL query params
            await axios.patch(`/api/auth/admin/editproduct?id=${id}`, {
                price: Number(form.price),
                quantity: form.quantity,
                inStock: form.inStock,
                stockLevel: Number(form.stockLevel),
            });

            toast.success("Product updated successfully");

            setTimeout(() => {
                router.push("/admin/dashboard");
            }, 2000);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Failed to update product"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen pt-24 px-6 pb-20">
                <div className="max-w-xl mx-auto glass rounded-xl p-8 border border-white/20">

                    <h1 className="text-2xl font-bold text-white mb-8 border-b border-white/20 pb-4">
                        Edit Product
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 text-slate-300">

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Price (₹)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Quantity</label>
                            <input
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Quantity (e.g. 250ml / 1kg)"
                                className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Stock Level</label>
                            <input
                                name="stockLevel"
                                type="number"
                                value={form.stockLevel}
                                onChange={handleChange}
                                placeholder="Stock Level"
                                className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Availability</label>
                            <select
                                value={form.inStock ? "yes" : "no"}
                                onChange={(e) =>
                                    setForm({ ...form, inStock: e.target.value === "yes" })
                                }
                                className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100"
                            >
                                <option value="yes" className="bg-slate-800">In Stock</option>
                                <option value="no" className="bg-slate-800">Out of Stock</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-lg text-white font-bold shadow-lg shadow-primary/25 transition-all mt-4 active:scale-[0.99] ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-sky-700 cursor-pointer hover:shadow-primary/40"}`}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>

                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default function EditProductPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <EditProductContent />
        </Suspense>
    );
}
