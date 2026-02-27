"use client";

import { useState } from "react";
import axios from "axios";
import { Lock, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Navbar from "@/components/NavBar";

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
    <div className="min-h-screen bg-[#F4F8FA] font-sans">
      <Navbar />

      <main className="pt-24 px-4 pb-20">
        <div className="max-w-md mx-auto bg-white rounded-xl p-8 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8 text-slate-800 border-b border-slate-100 pb-4">
            <div className="bg-[#14B8A6]/10 p-2 rounded-lg">
              <Lock className="w-6 h-6 text-[#14B8A6]" />
            </div>
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-slate-700">

            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                name="oldpassword"
                placeholder="Current Password"
                value={form.oldpassword}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14B8A6] transition-colors"
              >
                {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                name="newpassword"
                placeholder="New Password"
                value={form.newpassword}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14B8A6] transition-colors"
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#FAFAFA] border border-slate-200 rounded-lg px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#14B8A6] transition-colors"
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.98] text-lg ${loading ? "bg-[#14B8A6]/70 cursor-not-allowed" : "bg-[#14B8A6] hover:bg-[#0D9486] cursor-pointer"}`}
            >
              <Save className="w-5 h-5" />
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
