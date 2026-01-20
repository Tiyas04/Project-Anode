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
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-700">
      <input
        name="name"
        placeholder="Full Name"
        className="w-full border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 backdrop-blur-sm text-slate-100 placeholder:text-slate-500"
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 backdrop-blur-sm text-slate-100 placeholder:text-slate-500"
        onChange={handleChange}
      />
      <input
        name="phoneno"
        placeholder="Phone Number"
        className="w-full border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 backdrop-blur-sm text-slate-100 placeholder:text-slate-500"
        onChange={handleChange}
      />
      <input
        name="institution"
        placeholder="Institution / Company"
        className="w-full border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 backdrop-blur-sm text-slate-100 placeholder:text-slate-500"
        onChange={handleChange}
      />
      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full border border-white/10 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 backdrop-blur-sm text-slate-100 placeholder:text-slate-500"
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

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
