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

      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-md mx-auto bg-white border rounded-lg p-8">

          {/* HEADER */}
          <div className="flex items-center gap-2 mb-6 text-blue-700">
            <Lock className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Change Password</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-gray-700">

            <div className="relative">
              <input
                type={showOldPass ? "text" : "password"}
                name="oldpassword"
                placeholder="Current Password"
                value={form.oldpassword}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className="w-full border rounded-md px-3 py-2 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                className="w-full border rounded-md px-3 py-2 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
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
