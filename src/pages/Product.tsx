"use client"

import Image from "next/image";
import Link from "next/link";
import { FlaskConical, AlertTriangle, Star, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export const products: Product[] = [
    {
        _id: "p1",
        name: "Acetone",
        formula: "C₃H₆O",
        casNumber: "67-64-1",
        category: "Solvent",
        price: 850,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "High purity acetone for laboratory and analytical use.",
        purity: "99.9%",
        molecularWeight: 58.08,
        hazards: ["Flammable", "Irritant"],
        inStock: true,
        stockLevel: 120
    },
    {
        _id: "p2",
        name: "Ethanol",
        formula: "C₂H₆O",
        casNumber: "64-17-5",
        category: "Solvent",
        price: 540,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Absolute ethanol suitable for pharma and lab use.",
        purity: "99.8%",
        molecularWeight: 46.07,
        hazards: ["Flammable"],
        inStock: true,
        stockLevel: 200,
    },
    {
        _id: "p3",
        name: "Methanol",
        formula: "CH₄O",
        casNumber: "67-56-1",
        category: "Solvent",
        price: 480,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "HPLC grade methanol for analytical chemistry.",
        purity: "99.9%",
        molecularWeight: 32.04,
        hazards: ["Flammable", "Toxic"],
        inStock: true,
        stockLevel: 95,
        
    },
    {
        _id: "p4",
        name: "Isopropyl Alcohol",
        formula: "C₃H₈O",
        casNumber: "67-63-0",
        category: "Solvent",
        price: 510,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "IPA for cleaning and laboratory use.",
        purity: "99.9%",
        molecularWeight: 60.10,
        hazards: ["Flammable"],
        inStock: true,
        stockLevel: 140,
        
    },
    {
        _id: "p5",
        name: "Sulfuric Acid",
        formula: "H₂SO₄",
        casNumber: "7664-93-9",
        category: "Acid",
        price: 620,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Concentrated sulfuric acid for industrial and lab use.",
        purity: "98%",
        molecularWeight: 98.08,
        hazards: ["Corrosive"],
        inStock: true,
        stockLevel: 60,
    },
    {
        _id: "p6",
        name: "Hydrochloric Acid",
        formula: "HCl",
        casNumber: "7647-01-0",
        category: "Acid",
        price: 410,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Analytical grade hydrochloric acid.",
        purity: "37%",
        molecularWeight: 36.46,
        hazards: ["Corrosive"],
        inStock: true,
        stockLevel: 75,
    },
    {
        _id: "p7",
        name: "Nitric Acid",
        formula: "HNO₃",
        casNumber: "7697-37-2",
        category: "Acid",
        price: 690,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Highly reactive nitric acid for lab use.",
        purity: "69%",
        molecularWeight: 63.01,
        hazards: ["Corrosive", "Oxidizer"],
        inStock: true,
        stockLevel: 40,
    },
    {
        _id: "p8",
        name: "Sodium Hydroxide",
        formula: "NaOH",
        casNumber: "1310-73-2",
        category: "Base",
        price: 390,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "High purity sodium hydroxide pellets.",
        purity: "98%",
        molecularWeight: 40.00,
        hazards: ["Corrosive"],
        inStock: false,
        stockLevel: 0,
        
    },
    {
        _id: "p9",
        name: "Potassium Chloride",
        formula: "KCl",
        casNumber: "7447-40-7",
        category: "Salt",
        price: 260,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Analytical grade potassium chloride.",
        purity: "99%",
        molecularWeight: 74.55,
        hazards: [],
        inStock: true,
        stockLevel: 180,
        
    },
    {
        _id: "p10",
        name: "Hydrogen Peroxide",
        formula: "H₂O₂",
        casNumber: "7722-84-1",
        category: "Oxidizer",
        price: 520,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Hydrogen peroxide solution for lab use.",
        purity: "30%",
        molecularWeight: 34.01,
        hazards: ["Oxidizer"],
        inStock: true,
        stockLevel: 70,
        
    },
    {
        _id: "p11",
        name: "Phenol",
        formula: "C₆H₆O",
        casNumber: "108-95-2",
        category: "Organic Compound",
        price: 780,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Phenol crystals for organic synthesis.",
        purity: "99%",
        molecularWeight: 94.11,
        hazards: ["Toxic", "Corrosive"],
        inStock: true,
        stockLevel: 40,
        
    },
    {
        _id: "p12",
        name: "Urea",
        formula: "CH₄N₂O",
        casNumber: "57-13-6",
        category: "Organic Compound",
        price: 310,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "High purity urea for lab and industrial use.",
        purity: "99%",
        molecularWeight: 60.06,
        hazards: [],
        inStock: true,
        stockLevel: 210,
        
    },
    {
        _id: "p13",
        name: "Glucose",
        formula: "C₆H₁₂O₆",
        casNumber: "50-99-7",
        category: "Organic Compound",
        price: 340,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "D-Glucose for biochemical applications.",
        purity: "99%",
        molecularWeight: 180.16,
        hazards: [],
        inStock: true,
        stockLevel: 190,
        
    },
    {
        _id: "p14",
        name: "Sodium Chloride",
        formula: "NaCl",
        casNumber: "7647-14-5",
        category: "Salt",
        price: 220,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Pharmaceutical grade sodium chloride.",
        purity: "99.5%",
        molecularWeight: 58.44,
        hazards: [],
        inStock: true,
        stockLevel: 300,
       
    },
    {
        _id: "p15",
        name: "Potassium Permanganate",
        formula: "KMnO₄",
        casNumber: "7722-64-7",
        category: "Oxidizer",
        price: 610,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Strong oxidizing agent for laboratory use.",
        purity: "99%",
        molecularWeight: 158.04,
        hazards: ["Oxidizer"],
        inStock: true,
        stockLevel: 55,
        
    },
    {
        _id: "p16",
        name: "Calcium Chloride",
        formula: "CaCl₂",
        casNumber: "10043-52-4",
        category: "Salt",
        price: 290,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Anhydrous calcium chloride pellets.",
        purity: "97%",
        molecularWeight: 110.98,
        hazards: ["Irritant"],
        inStock: true,
        stockLevel: 140,
        
    },
    {
        _id: "p17",
        name: "Ammonium Chloride",
        formula: "NH₄Cl",
        casNumber: "12125-02-9",
        category: "Salt",
        price: 270,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Analytical grade ammonium chloride.",
        purity: "99%",
        molecularWeight: 53.49,
        hazards: ["Irritant"],
        inStock: true,
        stockLevel: 165,

    },
    {
        _id: "p18",
        name: "Magnesium Sulfate",
        formula: "MgSO₄",
        casNumber: "7487-88-9",
        category: "Salt",
        price: 300,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Anhydrous magnesium sulfate for lab drying.",
        purity: "99%",
        molecularWeight: 120.37,
        hazards: [],
        inStock: true,
        stockLevel: 155,
        
    },
    {
        _id: "p19",
        name: "Copper Sulfate",
        formula: "CuSO₄",
        casNumber: "7758-99-8",
        category: "Salt",
        price: 340,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "Copper sulfate crystals for analytical use.",
        purity: "99%",
        molecularWeight: 159.61,
        hazards: ["Toxic"],
        inStock: true,
        stockLevel: 90,
       
    },
    {
        _id: "p20",
        name: "Zinc Oxide",
        formula: "ZnO",
        casNumber: "1314-13-2",
        category: "Inorganic Compound",
        price: 360,
        image: "https://thumbs.dreamstime.com/b/chemical-glassware-15530107.jpg",
        description: "High purity zinc oxide powder.",
        purity: "99%",
        molecularWeight: 81.38,
        hazards: [],
        inStock: true,
        stockLevel: 130,
        
    },
];

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
