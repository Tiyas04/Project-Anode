"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface SignupProps {
  switchToLogin?: () => void;
}

export default function Signup({ switchToLogin }: SignupProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneno: "",
    institution: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      toast.success("Signup successful! Please login to verify.");

      // switch to login tab
      if (switchToLogin) {
        switchToLogin();
      } else {
        window.location.reload();
      }

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
      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full border rounded-md px-3 py-2 pr-10"
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

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
