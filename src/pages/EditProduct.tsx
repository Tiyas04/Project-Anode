"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/NavBar";

function EditProductContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");

    const [form, setForm] = useState({
        price: "",
        inStock: true,
        stockLevel: "",
        unit: "mg", // Default, will update from DB
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
                            inStock: product.inStock,
                            stockLevel: product.stockLevel,
                            unit: product.unit || "mg",
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
                inStock: form.inStock,
                stockLevel: Number(form.stockLevel),
                unit: form.unit,
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
        <div className="min-h-screen bg-[#F4F8FA] font-sans">
            <Navbar />

            <main className="pt-24 px-4 pb-20">
                <div className="max-w-xl mx-auto bg-white rounded-xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">

                    <h1 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
                        Edit Product
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6 text-slate-700">

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Price per Unit (₹)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Stock Level</label>
                            <input
                                name="stockLevel"
                                type="number"
                                value={form.stockLevel}
                                onChange={handleChange}
                                placeholder="Stock Level"
                                disabled={!form.inStock}
                                className={`w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium ${!form.inStock ? "opacity-50 cursor-not-allowed bg-slate-100" : ""}`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Unit</label>
                            <select
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                            >
                                <option value="mg">mg</option>
                                <option value="ml">ml</option>
                                <option value="g">g</option>
                                <option value="l">L</option>
                                <option value="kg">kg</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Availability</label>
                            <select
                                value={form.inStock ? "yes" : "no"}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        inStock: e.target.value === "yes",
                                        stockLevel: e.target.value === "no" ? "0" : form.stockLevel
                                    })
                                }
                                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                            >
                                <option value="yes">In Stock</option>
                                <option value="no">Out of Stock</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-bold shadow-md transition-all mt-4 active:scale-[0.98] text-lg ${loading ? "bg-[#14B8A6]/70 cursor-not-allowed" : "bg-[#14B8A6] hover:bg-[#0D9486] cursor-pointer"}`}
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>

                    </form>
                </div>
            </main>
        </div>
    );
}

export default function EditProductPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <EditProductContent />
        </Suspense>
    );
}
