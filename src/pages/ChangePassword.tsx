"use client";

import { useState } from "react";
import axios from "axios";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    oldpassword: "",
    newpassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.oldpassword || !form.newpassword || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (form.newpassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.patch("/api/auth/changepassword", {
        oldpassword: form.oldpassword,
        newpassword: form.newpassword,
      });

      toast.success(res.data.message || "Password changed successfully");

      // Redirect after success
      setTimeout(() => {
        router.push("/user");
      }, 2000);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-6 pb-20">
        <div className="max-w-md mx-auto glass rounded-xl p-8 border border-white/20">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8 text-white border-b border-white/20 pb-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-300">

            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                name="oldpassword"
                placeholder="Current Password"
                value={form.oldpassword}
                onChange={handleChange}
                className="w-full border border-white/10 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
              >
                {showOldPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                name="newpassword"
                placeholder="New Password"
                value={form.newpassword}
                onChange={handleChange}
                className="w-full border border-white/10 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-white/10 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/5 text-slate-100 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] ${loading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-sky-700 cursor-pointer hover:shadow-primary/40"}`}
            >
              <Save className="w-4 h-4" />
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
