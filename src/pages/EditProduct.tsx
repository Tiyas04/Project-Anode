"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function EditProductPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        casNumber: "",
        price: "",
        quantity: "",
        inStock: true,
        stockLevel: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !form.casNumber ||
            !form.price ||
            !form.quantity ||
            !form.stockLevel
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            await axios.patch("/api/auth/editproduct", {
                casNumber: form.casNumber,
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
                            name="casNumber"
                            value={form.casNumber}
                            onChange={handleChange}
                            placeholder="CAS Number *"
                            className="border rounded-md px-3 py-2 w-full"
                        />

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
                            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition"
                        >
                            Update Product
                        </button>

                    </form>
                </div>
            </main>

            <Footer />
        </>
    );
}
