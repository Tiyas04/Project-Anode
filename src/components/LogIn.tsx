"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    phoneno: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.password || (!form.email && !form.phoneno)) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/login", form, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Login successful");
        window.dispatchEvent(new Event("auth-updated"));

        // small delay so toast is visible
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 800);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
      <input
        name="email"
        placeholder="Email (optional)"
        value={form.email}
        onChange={handleChange}
        className="border rounded-md px-3 py-2 w-full"
      />

      <input
        name="phoneno"
        placeholder="Phone number (optional)"
        value={form.phoneno}
        onChange={handleChange}
        className="border rounded-md px-3 py-2 w-full"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="border rounded-md px-3 py-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
