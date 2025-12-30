import { Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <form className="space-y-5">
      
      <h2 className="text-2xl font-semibold text-center text-blue-600">
        Login to your account
      </h2>

      {/* EMAIL */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Email
        </label>
        <div className="flex items-center border rounded-md px-3">
          <Mail className="w-4 h-4 text-gray-500" />
          <input
            type="email"
            placeholder="you@company.com"
            className="w-full px-2 py-2 bg-transparent text-gray-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label className="block text-sm mb-1 text-gray-600">
          Password
        </label>
        <div className="flex items-center border rounded-md px-3">
          <Lock className="w-4 h-4 text-gray-500" />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-2 py-2 bg-transparent text-gray-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition cursor-pointer"
      >
        Login
      </button>

      {/* <p className="text-xs text-center text-gray-500">
        Access to restricted chemicals requires verification
      </p> */}
    </form>
  );
}
