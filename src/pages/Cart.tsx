"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Trash2, ArrowRight, ShoppingCart, Lock } from "lucide-react";
import { toast } from "react-toastify";
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

            <main className="min-h-screen pt-24 px-6 pb-20">
                <div className="max-w-5xl mx-auto">

                    {/* HEADER */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            Shopping Cart
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Review your selected items before checkout.
                        </p>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="glass rounded-xl p-12 text-center border border-white/20">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-8 h-8 text-slate-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Your cart is empty</h2>
                            <p className="text-slate-400 mt-2 mb-6">Looks like you haven't added anything yet.</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-sky-700 transition shadow-sm"
                            >
                                Browse Products
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* CART ITEMS */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.product._id}
                                        className="glass rounded-xl p-4 flex gap-4 border border-white/20 items-center"
                                    >
                                        {/* IMAGE */}
                                        <div className="relative w-24 h-24 bg-white/5 rounded-lg shrink-0 p-2">
                                            <Image
                                                src={item.product.image}
                                                alt={item.product.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg font-semibold text-white truncate">
                                                {item.product.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-400">
                                                <p>CAS: <span className="text-slate-300">{item.product.casNumber}</span></p>
                                                <p>Purity: <span className="text-slate-300">{item.product.purity}</span></p>
                                            </div>
                                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200">
                                                Qty: {item.quantity}
                                            </div>
                                        </div>

                                        {/* PRICE & ACTION */}
                                        <div className="flex flex-col justify-between items-end gap-4">
                                            <span className="font-bold text-white text-lg">
                                                ₹{item.price * item.quantity}
                                            </span>

                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const slug = `${item.product.name
                                                            .toLowerCase()
                                                            .replace(/\s+/g, "-")}-${item.product.casNumber}`;
                                                        await axios.delete(`/api/auth/cart/${slug}`);
                                                        setCartItems((prev) =>
                                                            prev.filter((p) => p.product._id !== item.product._id)
                                                        );
                                                        window.dispatchEvent(new Event("cart-updated"));
                                                        toast.success("Item removed");
                                                    } catch (error) {
                                                        console.error("Failed to remove item", error);
                                                        toast.error("Failed to remove item");
                                                    }
                                                }}
                                                className="text-rose-400 hover:text-rose-300 text-sm flex items-center gap-1.5 transition-colors font-medium px-2 py-1 hover:bg-rose-500/10 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SUMMARY */}
                            <div className="glass rounded-xl p-6 h-fit border border-white/20 sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/20 pb-4">
                                    Order Summary
                                </h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                        <span className="font-medium text-white">₹{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Shipping</span>
                                        <span className="text-emerald-400 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Tax</span>
                                        <span className="text-slate-500 italic">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end border-t border-white/20 pt-4 mb-6">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-primary/25 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <Lock className="w-3 h-3" />
                                    Secure Checkout
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}
