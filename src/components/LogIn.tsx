"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"credentials" | "otp" | "forgot">("credentials");
  const [otp, setOtp] = useState("");
  const [emailForVerify, setEmailForVerify] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/forgot-password", { email: forgotEmail });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep("credentials");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.password || !form.email) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/login", form, { withCredentials: true });

      if (res.data.success) {
        if (res.data.requireOtp) {
          toast.info("Validation code sent to your email");
          setEmailForVerify(res.data.email);
          setStep("otp");
        } else {
          toast.success("Login successful");
          completeLogin(res.data.data.role);
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid 4-digit code");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/verify", { email: emailForVerify, otp });

      if (res.data.success) {
        toast.success("Verification successful");
        completeLogin(res.data.data.role);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (role: string) => {
    window.dispatchEvent(new Event("auth-updated"));
    setTimeout(() => {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    }, 800);
  };

  if (step === "forgot") {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg text-slate-800 font-semibold">Reset Password</h3>
          <p className="text-sm text-slate-500">Enter your email to receive a new password</p>
        </div>

        <div>
           <input
            type="email"
             placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
           />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#20B9CE] text-white py-2.5 rounded-lg mt-2 font-medium hover:bg-[#1AA3B5] transition-all duration-200 shadow-sm disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send New Password"}
        </button>

        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="w-full text-sm text-slate-500 hover:text-slate-700 mt-2"
        >
          Back to Login
        </button>
      </form>
    );
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg text-slate-800 font-semibold">Verification Required</h3>
          <p className="text-sm text-slate-500">Enter the 4-digit code sent to {emailForVerify}</p>
        </div>

        <div>
          <input
            name="otp"
            placeholder="Enter 4-digit Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={4}
            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-center text-lg tracking-widest text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1EBAD6] text-white py-2.5 rounded-lg font-semibold hover:bg-[#1A9FB7] transition-all duration-200 shadow-sm disabled:opacity-50 mt-4"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="w-full text-sm text-slate-500 hover:text-slate-700 mt-2"
        >
          Back to Login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
        <input
          name="email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
        <div className="relative">
            <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="........"
            value={form.password}
            onChange={handleChange}
            className="w-full bg-[#FAFAFA] border border-slate-100 rounded-lg px-4 py-2.5 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all"
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
      
      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="text-xs text-[#14B8A6] hover:text-[#0F766E] hover:underline font-medium"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#20B9CE] text-white py-2.5 rounded-lg mt-2 font-medium hover:bg-[#1AA3B5] transition-all duration-200 shadow-sm disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
