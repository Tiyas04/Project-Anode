"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneno: "",
    institution: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phoneno ||
      !form.password ||
      !form.institution
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/register", form, {
        withCredentials: true,
      });

      toast.success("Signup successful! 🎉");

      // redirect to home
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
      <input
        name="name"
        placeholder="Full Name"
        className="w-full border rounded-md px-3 py-2"
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border rounded-md px-3 py-2"
        onChange={handleChange}
      />
      <input
        name="phoneno"
        placeholder="Phone Number"
        className="w-full border rounded-md px-3 py-2"
        onChange={handleChange}
      />
      <input
        name="institution"
        placeholder="Institution / Company"
        className="w-full border rounded-md px-3 py-2"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="w-full border rounded-md px-3 py-2"
        onChange={handleChange}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
