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
        stockLevel: 120,
        reviews: [
            {
                _id: "r1",
                userName: "LabTech India",
                rating: 5,
                comment: "Excellent purity and packaging.",
                date: "2024-11-12",
            },
            {
                _id: "r2",
                userName: "Research Labs Pvt Ltd",
                rating: 4,
                comment: "Consistent quality, delivery was on time.",
                date: "2024-10-05",
            },
        ],
        averageRating: 4.6,
        reviewCount: 18,
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
        reviews: [
            {
                _id: "r3",
                userName: "BioChem Labs",
                rating: 5,
                comment: "Perfect for HPLC work.",
                date: "2024-09-18",
            },
        ],
        averageRating: 4.5,
        reviewCount: 22,
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
        reviews: [
            {
                _id: "r4",
                userName: "Analytical Chemist",
                rating: 4,
                comment: "Good quality but hazardous handling required.",
                date: "2024-08-22",
            },
        ],
        averageRating: 4.4,
        reviewCount: 16,
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
        reviews: [
            {
                _id: "r5",
                userName: "Electronics Lab",
                rating: 5,
                comment: "Very effective for cleaning applications.",
                date: "2024-10-01",
            },
        ],
        averageRating: 4.3,
        reviewCount: 19,
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
        reviews: [
            {
                _id: "r6",
                userName: "Industrial Chem",
                rating: 4,
                comment: "Strong acid, packaging was secure.",
                date: "2024-07-14",
            },
        ],
        averageRating: 4.2,
        reviewCount: 11,
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
        reviews: [
            {
                _id: "r7",
                userName: "QA Lab",
                rating: 4,
                comment: "Consistent concentration.",
                date: "2024-09-02",
            },
        ],
        averageRating: 4.1,
        reviewCount: 9,
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
        reviews: [
            {
                _id: "r8",
                userName: "Chem Research Unit",
                rating: 4,
                comment: "Works well, requires careful handling.",
                date: "2024-06-28",
            },
        ],
        averageRating: 4.0,
        reviewCount: 7,
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
        reviews: [
            {
                _id: "r9",
                userName: "Process Engineer",
                rating: 4,
                comment: "Good quality, currently out of stock.",
                date: "2024-05-19",
            },
        ],
        averageRating: 4.3,
        reviewCount: 14,
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
        reviews: [
            {
                _id: "r10",
                userName: "Biotech Lab",
                rating: 5,
                comment: "Very consistent batch quality.",
                date: "2024-10-08",
            },
        ],
        averageRating: 4.5,
        reviewCount: 12,
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
        reviews: [
            {
                _id: "r11",
                userName: "Medical Supplies",
                rating: 4,
                comment: "Meets required concentration standards.",
                date: "2024-09-11",
            },
        ],
        averageRating: 4.2,
        reviewCount: 10,
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
        reviews: [
            {
                _id: "r12",
                userName: "Organic Chemist",
                rating: 4,
                comment: "High purity, well packed.",
                date: "2024-07-30",
            },
        ],
        averageRating: 4.1,
        reviewCount: 9,
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
        reviews: [
            {
                _id: "r13",
                userName: "Agro Research",
                rating: 5,
                comment: "Excellent quality for experiments.",
                date: "2024-08-16",
            },
        ],
        averageRating: 4.6,
        reviewCount: 21,
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
        reviews: [
            {
                _id: "r14",
                userName: "Biochemistry Lab",
                rating: 5,
                comment: "Perfect for enzyme assays.",
                date: "2024-09-25",
            },
        ],
        averageRating: 4.7,
        reviewCount: 28,
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
        reviews: [
            {
                _id: "r15",
                userName: "Hospital Pharmacy",
                rating: 5,
                comment: "Reliable and consistent quality.",
                date: "2024-10-03",
            },
        ],
        averageRating: 4.7,
        reviewCount: 26,
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
        reviews: [
            {
                _id: "r16",
                userName: "Analytical Lab",
                rating: 4,
                comment: "Consistent oxidizing strength.",
                date: "2024-06-21",
            },
        ],
        averageRating: 4.3,
        reviewCount: 9,
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
        reviews: [
            {
                _id: "r17",
                userName: "Materials Lab",
                rating: 4,
                comment: "Works well as drying agent.",
                date: "2024-08-11",
            },
        ],
        averageRating: 4.4,
        reviewCount: 15,
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
        reviews: [
            {
                _id: "r18",
                userName: "Inorganic Lab",
                rating: 4,
                comment: "Good solubility and purity.",
                date: "2024-09-04",
            },
        ],
        averageRating: 4.2,
        reviewCount: 13,
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
        reviews: [
            {
                _id: "r19",
                userName: "Organic Lab",
                rating: 5,
                comment: "Excellent drying efficiency.",
                date: "2024-08-29",
            },
        ],
        averageRating: 4.6,
        reviewCount: 17,
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
        reviews: [
            {
                _id: "r20",
                userName: "Chemistry Dept",
                rating: 4,
                comment: "Color and purity as expected.",
                date: "2024-07-07",
            },
        ],
        averageRating: 4.3,
        reviewCount: 12,
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
        reviews: [
            {
                _id: "r21",
                userName: "Materials Research",
                rating: 5,
                comment: "Very fine particle size, great quality.",
                date: "2024-10-12",
            },
        ],
        averageRating: 4.5,
        reviewCount: 20,
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

            {/* RATING */}
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" />
                {product.averageRating} ({product.reviewCount})
            </div>

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
