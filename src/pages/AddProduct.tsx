"use client";

import { useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

const hazardOptions = [
  "Flammable",
  "Corrosive",
  "Toxic",
  "Oxidizer",
  "Irritant",
];

export default function AddProductPage() {
  const router = useRouter();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    formula: "",
    casNumber: "",
    category: "",
    price: "",
    description: "",
    purity: "",
    quantity: "",
    molecularWeight: "",
    hazards: [] as string[],
    inStock: true,
    stockLevel: "",
  });

  /* 🔹 IMAGE */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* 🔹 TEXT INPUT */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* 🔹 HAZARDS */
  const toggleHazard = (hazard: string) => {
    setForm((prev) => ({
      ...prev,
      hazards: prev.hazards.includes(hazard)
        ? prev.hazards.filter((h) => h !== hazard)
        : [...prev.hazards, hazard],
    }));
  };

  /* 🔹 SUBMIT */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.formula ||
      !form.casNumber ||
      !form.category ||
      !form.price ||
      !form.description ||
      !form.purity ||
      !form.quantity ||
      !form.molecularWeight ||
      !form.stockLevel ||
      !imageFile
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("formula", form.formula);
      formData.append("casNumber", form.casNumber);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("description", form.description);
      formData.append("purity", form.purity);
      formData.append("molecularWeight", form.molecularWeight);
      formData.append("inStock", String(form.inStock));
      formData.append("stockLevel", form.stockLevel);
      formData.append("hazards", JSON.stringify(form.hazards));
      formData.append("image", imageFile);

      await axios.post("/api/auth/admin/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);

    } catch (error: any) {
      setLoading(false);
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to add product"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-4xl mx-auto glass rounded-xl p-8 border border-white/20">

          <div className="flex items-center gap-2 mb-8 text-white">
            <PlusCircle className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Add New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-300">

            {/* BASIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="name" placeholder="Product Name *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input name="formula" placeholder="Formula *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="casNumber" placeholder="CAS Number *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input name="category" placeholder="Category *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <input type="number" name="price" placeholder="Price *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input type="number" name="stockLevel" placeholder="Stock Level *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <select
                className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100"
                value={form.inStock ? "yes" : "no"}
                onChange={(e) => setForm({ ...form, inStock: e.target.value === "yes" })}
              >
                <option value="yes" className="bg-slate-800 text-slate-100">In Stock</option>
                <option value="no" className="bg-slate-800 text-slate-100">Out of Stock</option>
              </select>
            </div>

            {/* IMAGE */}
            <div className="border border-white/10 bg-white/5 rounded-lg p-6">
              <label className="block mb-3 text-sm font-semibold text-slate-300">Product Image *</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20 transition-colors file:cursor-pointer cursor-pointer"
              />
              {imagePreview && (
                <img src={imagePreview} className="mt-4 w-32 h-32 object-contain border rounded-lg bg-white p-2" />
              )}
            </div>

            {/* EXTRA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <input name="purity" placeholder="Purity *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input name="quantity" placeholder="Quantity *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
              <input type="number" name="molecularWeight" placeholder="Molecular Weight *" onChange={handleChange} className="border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500" />
            </div>

            <textarea
              name="description"
              placeholder="Description *"
              rows={4}
              onChange={handleChange}
              className="border border-white/10 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500 resize-y"
            />

            {/* HAZARDS */}
            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
              <p className="font-semibold text-slate-300 mb-3">Hazards</p>
              <div className="flex gap-4 flex-wrap">
                {hazardOptions.map((hazard) => (
                  <label key={hazard} className="flex gap-2 items-center cursor-pointer hover:text-primary transition-colors">
                    <input type="checkbox" onChange={() => toggleHazard(hazard)} className="accent-primary w-4 h-4 rounded text-primary focus:ring-primary" />
                    {hazard}
                  </label>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-3.5 rounded-lg text-white font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.99] ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-sky-700 cursor-pointer hover:shadow-primary/40"}`}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
