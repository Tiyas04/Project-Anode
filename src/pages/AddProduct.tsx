"use client";

import { useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/NavBar";

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
    mfcdNo: "",
    molecularWeight: "",
    hazards: [] as string[],
    inStock: true,
    stockLevel: "",
    unit: "mg",
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
      !form.mfcdNo ||
      !form.molecularWeight ||
      !form.stockLevel ||
      !form.unit ||
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
      formData.append("mfcdNo", form.mfcdNo);
      formData.append("description", form.description);
      formData.append("purity", form.purity);
      formData.append("molecularWeight", form.molecularWeight);
      formData.append("inStock", String(form.inStock));
      formData.append("stockLevel", form.stockLevel);
      formData.append("unit", form.unit);
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
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">

          <div className="flex items-center gap-2 mb-8 text-slate-800">
            <PlusCircle className="w-6 h-6 text-[#14B8A6]" />
            <h1 className="text-2xl font-bold">Add New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-700">

            {/* BASIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="name" placeholder="Product Name *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input name="formula" placeholder="Formula *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <input name="casNumber" placeholder="CAS Number *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input name="category" placeholder="Category *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
            </div>

            {/* PRICE & STOCK */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <input type="number" name="price" placeholder="Price per Unit *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />

              <div className="flex gap-2">
                <input
                  type="number"
                  name="stockLevel"
                  placeholder="Total Stock *"
                  onChange={handleChange}
                  disabled={!form.inStock}
                  value={form.stockLevel}
                  className={`w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium ${!form.inStock ? "opacity-50 cursor-not-allowed bg-slate-100" : ""}`}
                />
              </div>

              <select
                name="unit"
                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="l">L</option>
                <option value="kg">kg</option>
              </select>

              <select
                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                value={form.inStock ? "yes" : "no"}
                onChange={(e) => setForm({
                  ...form,
                  inStock: e.target.value === "yes",
                  stockLevel: e.target.value === "no" ? "0" : form.stockLevel
                })}
              >
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>

            {/* IMAGE */}
            <div className="border border-slate-200 bg-[#FAFAFA] rounded-lg p-6">
              <label className="block mb-3 text-sm font-bold text-slate-700">Product Image *</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-bold
                    file:bg-[#14B8A6]/10 file:text-[#0D9486]
                    hover:file:bg-[#14B8A6]/20 transition-colors file:cursor-pointer cursor-pointer shadow-sm"
              />
              {imagePreview && (
                <img src={imagePreview} className="mt-4 w-32 h-32 object-contain border border-slate-200 rounded-lg bg-white p-2 shadow-sm" />
              )}
            </div>

            {/* EXTRA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <input name="purity" placeholder="Purity *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input name="mfcdNo" placeholder="MFCD No *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
              <input type="number" name="molecularWeight" placeholder="Molecular Weight *" onChange={handleChange} className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium" />
            </div>

            <textarea
              name="description"
              placeholder="Description *"
              rows={4}
              onChange={handleChange}
              className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium resize-y"
            />

            {/* HAZARDS */}
            <div className="bg-[#FAFAFA] p-5 rounded-lg border border-slate-200">
              <p className="font-bold text-slate-700 mb-4">Hazards</p>
              <div className="flex gap-6 flex-wrap">
                {hazardOptions.map((hazard) => (
                  <label key={hazard} className="flex gap-2 items-center cursor-pointer text-slate-600 font-semibold hover:text-[#14B8A6] transition-colors">
                    <input type="checkbox" onChange={() => toggleHazard(hazard)} className="accent-[#14B8A6] w-4 h-4 rounded text-[#14B8A6] focus:ring-[#14B8A6]" />
                    {hazard}
                  </label>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold shadow-md transition-all active:scale-[0.98] mt-4 text-lg ${loading ? "bg-[#14B8A6]/70 cursor-not-allowed" : "bg-[#14B8A6] hover:bg-[#0D9486] cursor-pointer"}`}
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
