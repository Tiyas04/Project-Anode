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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
        <input
          name="name"
          placeholder="John Doe"
          className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number</label>
        <input
          name="phoneno"
          placeholder="+1 234 567 8900"
          className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Institution / Company</label>
        <input
          name="institution"
          placeholder="Your Organization"
          className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#20B9CE] text-white py-2.5 rounded-lg mt-2 font-medium hover:bg-[#1AA3B5] transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
