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

            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-xl mx-auto bg-white border rounded-lg p-8">

                    <h1 className="text-2xl font-bold text-blue-700 mb-6">
                        Edit Product
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">

                        <input
                            name="price"
                            type="number"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price (₹) *"
                            className="border rounded-md px-3 py-2 w-full"
                        />

                        <input
                            name="quantity"
                            value={form.quantity}
                            onChange={handleChange}
                            placeholder="Quantity (e.g. 250ml / 1kg) *"
                            className="border rounded-md px-3 py-2 w-full"
                        />

                        <input
                            name="stockLevel"
                            type="number"
                            value={form.stockLevel}
                            onChange={handleChange}
                            placeholder="Stock Level *"
                            className="border rounded-md px-3 py-2 w-full"
                        />

                        <select
                            value={form.inStock ? "yes" : "no"}
                            onChange={(e) =>
                                setForm({ ...form, inStock: e.target.value === "yes" })
                            }
                            className="border rounded-md px-3 py-2 w-full"
                        >
                            <option value="yes">In Stock</option>
                            <option value="no">Out of Stock</option>
                        </select>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
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
