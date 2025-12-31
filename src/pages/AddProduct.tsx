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

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white border rounded-lg p-8">

          <div className="flex items-center gap-2 mb-6 text-blue-700">
            <PlusCircle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Add New Product</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">

            {/* BASIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="name" placeholder="Product Name *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <input name="formula" placeholder="Formula *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="casNumber" placeholder="CAS Number *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <input name="category" placeholder="Category *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
            </div>

            {/* PRICE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input type="number" name="price" placeholder="Price *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <input type="number" name="stockLevel" placeholder="Stock Level *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <select
                className="border px-3 py-2 rounded-md"
                value={form.inStock ? "yes" : "no"}
                onChange={(e) => setForm({ ...form, inStock: e.target.value === "yes" })}
              >
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>

            {/* IMAGE */}
            <div className="border rounded-md p-4">
              <label className="block mb-2 text-sm font-medium">Product Image *</label>
              <input type="file" accept="image/*" onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
              />
              {imagePreview && (
                <img src={imagePreview} className="mt-4 w-40 h-40 object-contain border rounded" />
              )}
            </div>

            {/* EXTRA */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input name="purity" placeholder="Purity *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <input name="quantity" placeholder="Quantity *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
              <input type="number" name="molecularWeight" placeholder="Molecular Weight *" onChange={handleChange} className="border px-3 py-2 rounded-md" />
            </div>

            <textarea
              name="description"
              placeholder="Description *"
              rows={4}
              onChange={handleChange}
              className="border px-3 py-2 rounded-md w-full"
            />

            {/* HAZARDS */}
            <div>
              <p className="font-medium mb-2">Hazards</p>
              <div className="flex gap-4 flex-wrap">
                {hazardOptions.map((hazard) => (
                  <label key={hazard} className="flex gap-2 items-center">
                    <input type="checkbox" onChange={() => toggleHazard(hazard)} />
                    {hazard}
                  </label>
                ))}
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full py-3 rounded-md text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
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
