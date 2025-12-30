import { Mail, Lock, User, Building2 } from "lucide-react";

export default function Signup() {
  return (
    <form className="space-y-5">

      <h2 className="text-2xl font-semibold text-center text-blue-600">
        Create an account
      </h2>

      {/* NAME */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Full Name
        </label>
        <div className="flex items-center border rounded-md px-3">
          <User className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-2 py-2 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* COMPANY */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Company / Institution
        </label>
        <div className="flex items-center border rounded-md px-3">
          <Building2 className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ABC Labs Pvt Ltd"
            className="w-full px-2 py-2 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Email
        </label>
        <div className="flex items-center border rounded-md px-3">
          <Mail className="w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full px-2 py-2 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Password
        </label>
        <div className="flex items-center border rounded-md px-3">
          <Lock className="w-4 h-4 text-gray-400" />
          <input
            type="password"
            placeholder="Minimum 8 characters"
            className="w-full px-2 py-2 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition cursor-pointer"
      >
        Create Account
      </button>

      {/* <p className="text-xs text-center text-gray-500">
        Account verification is required before purchasing chemicals
      </p> */}
    </form>
  );
}
