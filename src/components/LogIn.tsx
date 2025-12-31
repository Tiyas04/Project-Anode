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
    phoneno: "",
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

    if (!form.password || (!form.email && !form.phoneno)) {
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
          // Fallback for old behavior if needed, though API is changed
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
      <form onSubmit={handleForgotPassword} className="space-y-4 text-gray-700">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Reset Password</h3>
          <p className="text-sm text-gray-500">Enter your email to receive a new password</p>
        </div>

        <input
          type="email"
          placeholder="Enter your email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          className="border rounded-md px-3 py-2 w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Sending..." : "Send New Password"}
        </button>

        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Back to Login
        </button>
      </form>
    );
  }

  if (step === "otp") {
    return (
      <form onSubmit={handleOtpSubmit} className="space-y-4 text-gray-700">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Verification Required</h3>
          <p className="text-sm text-gray-500">Enter the 4-digit code sent to {emailForVerify}</p>
        </div>

        <input
          name="otp"
          placeholder="Enter 4-digit Code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={4}
          className="border rounded-md px-3 py-2 w-full text-center text-lg tracking-widest"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>

        <button
          type="button"
          onClick={() => setStep("credentials")}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Back to Login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4 text-gray-700">
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

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={() => setStep("forgot")}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Sending Code..." : "Continue"}
      </button>
    </form >
  );
}
