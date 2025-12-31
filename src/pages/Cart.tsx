"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Trash2, ArrowRight } from "lucide-react";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

type CartItem = {
    quantity: number;
    price: number;
    product: {
        _id: string;
        name: string;
        casNumber: string;
        purity: string;
        image: string;
        price: number;
    };
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    /* 🔹 FETCH CART FROM BACKEND */
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get("/api/auth/cart");
                setCartItems(res.data.data || []);
            } catch (error) {
                console.error("Failed to fetch cart", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 px-6 py-12">
                <div className="max-w-5xl mx-auto">

                    {/* HEADER */}
                    <h1 className="text-3xl font-bold text-blue-700 mb-8">
                        Shopping Cart
                    </h1>

                    {cartItems.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* CART ITEMS */}
                            <div className="md:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="bg-white border rounded-lg p-4 flex gap-4"
                                    >
                                        {/* IMAGE */}
                                        <div className="relative w-24 h-24">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className="flex-1">
                                            <h2 className="text-md font-semibold text-gray-800">
                                                {item.product.name}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                CAS: {item.product.casNumber}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Purity: {item.product.purity}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Quantity: {item.quantity}
                                            </p>
                                        </div>

                                        {/* PRICE */}
                                        <div className="flex flex-col justify-between items-end">
                                            <span className="font-semibold text-gray-800">
                                                ₹{item.price * item.quantity}
                                            </span>


                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const slug = `${item.product.name
                                                            .toLowerCase()
                                                            .replace(/\s+/g, "-")}-${item.product.casNumber}`;
                                                        await axios.delete(`/api/auth/cart/${slug}`);
                                                        // Refresh cart or remove locally
                                                        // For simplicity, refetching cart here or filtering state
                                                        // Let's filter state for instant feedback
                                                        setCartItems((prev) =>
                                                            prev.filter((p) => p.product._id !== item.product._id)
                                                        );
                                                        // Also dispatch event for navbar
                                                        window.dispatchEvent(new Event("cart-updated"));
                                                    } catch (error) {
                                                        console.error("Failed to remove item", error);
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SUMMARY */}
                            <div className="bg-white border rounded-lg p-6 h-fit">
                                <h3 className="font-semibold text-gray-800 mb-4">
                                    Order Summary
                                </h3>

                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Items</span>
                                    <span>
                                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                                    </span>
                                </div>

                                <div className="flex justify-between font-semibold text-gray-800 mb-4">
                                    <span>Total</span>
                                    <span>₹{totalPrice}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
