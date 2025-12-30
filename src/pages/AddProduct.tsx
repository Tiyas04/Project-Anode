"use client";

import { useState } from "react";
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

  const [form, setForm] = useState({
    name: "",
    formula: "",
    casNumber: "",
    category: "",
    price: "",
    image: "",
    description: "",
    purity: "",
    molecularWeight: "",
    hazards: [] as string[],
    inStock: true,
    stockLevel: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, image: file.name }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggleHazard = (hazard: string) => {
    setForm((prev) => ({
      ...prev,
      hazards: prev.hazards.includes(hazard)
        ? prev.hazards.filter((h) => h !== hazard)
        : [...prev.hazards, hazard],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Validation
    if (
      !form.name ||
      !form.casNumber ||
      !form.price ||
      !form.category ||
      !form.image
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    // ✅ Simulate success
    console.log("NEW PRODUCT:", {
      ...form,
      price: Number(form.price),
      molecularWeight: Number(form.molecularWeight),
      stockLevel: Number(form.stockLevel),
    });

    toast.success("Product added successfully");

    // ⏳ Redirect after toast
    setTimeout(() => {
      router.push("/admin/dashboard");
    }, 2000);
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

            {/* BASIC INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name *"
                className="border rounded-md px-3 py-2"
              />
              <input
                name="formula"
                value={form.formula}
                onChange={handleChange}
                placeholder="Chemical Formula"
                className="border rounded-md px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="casNumber"
                value={form.casNumber}
                onChange={handleChange}
                placeholder="CAS Number *"
                className="border rounded-md px-3 py-2"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category *"
                className="border rounded-md px-3 py-2"
              />
            </div>

            {/* PRICE + STOCK */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (₹) *"
                className="border rounded-md px-3 py-2"
              />
              <input
                name="stockLevel"
                type="number"
                value={form.stockLevel}
                onChange={handleChange}
                placeholder="Stock Level"
                className="border rounded-md px-3 py-2"
              />
              <select
                value={form.inStock ? "yes" : "no"}
                onChange={(e) =>
                  setForm({ ...form, inStock: e.target.value === "yes" })
                }
                className="border rounded-md px-3 py-2"
              >
                <option value="yes">In Stock</option>
                <option value="no">Out of Stock</option>
              </select>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="border rounded-md p-4">
              <label className="text-sm font-medium mb-2 block">
                Upload Product Image *
              </label>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {imagePreview && (
                <img
                  src={imagePreview}
                  className="mt-4 w-40 h-40 object-contain border rounded-md"
                  alt="Preview"
                />
              )}
            </div>

            {/* EXTRA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="purity"
                value={form.purity}
                onChange={handleChange}
                placeholder="Purity"
                className="border rounded-md px-3 py-2"
              />
              <input
                name="molecularWeight"
                type="number"
                value={form.molecularWeight}
                onChange={handleChange}
                placeholder="Molecular Weight"
                className="border rounded-md px-3 py-2"
              />
            </div>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              rows={4}
              className="border rounded-md px-3 py-2 w-full"
            />

            {/* HAZARDS */}
            <div>
              <p className="font-medium mb-2">Hazards</p>
              <div className="flex flex-wrap gap-3">
                {hazardOptions.map((hazard) => (
                  <label key={hazard} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.hazards.includes(hazard)}
                      onChange={() => toggleHazard(hazard)}
                    />
                    {hazard}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition cursor-pointer"
            >
              Add Product
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
