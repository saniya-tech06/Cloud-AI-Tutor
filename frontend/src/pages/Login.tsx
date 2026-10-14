import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../api/authApi";

function Login() {

  const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await loginUser({
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", response);

    localStorage.setItem("token", response.token);

localStorage.setItem(
  "user",
  JSON.stringify(response.user)
);

navigate("/dashboard");

  } catch (err:any) {

    setError(
      err.response?.data?.message || "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg">
            AI
          </div>

        </div>

        {/* Heading */}

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          Cloud AI Study Assistant
        </h1>

        <p className="text-center text-slate-400 mt-3 text-sm sm:text-base">
          Welcome back! Sign in to continue your learning journey.
        </p>

        {/* Email */}

        <div className="mt-8">

          <label className="block text-slate-300 mb-2 font-medium">
            Email Address
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-blue-500 transition">

            <Mail className="text-slate-400" size={20} />

           <input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full bg-transparent p-3 outline-none text-white placeholder-slate-500"
/>

          </div>

        </div>

        {/* Password */}

        <div className="mt-5">

          <label className="block text-slate-300 mb-2 font-medium">
            Password
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-blue-500 transition">

            <Lock className="text-slate-400" size={20} />

            <input
  type="password"
  placeholder="Enter your password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full bg-transparent p-3 outline-none text-white placeholder-slate-500"
/>

          </div>

        </div>

        {/* Forgot Password */}

       <div className="flex justify-end mt-3">
  <button className="text-blue-400 hover:text-blue-300 text-sm transition">
    Forgot Password?
  </button>
</div>

{error && (
  <p className="text-red-500 text-sm mt-4 text-center">
    {error}
  </p>
)}

          
       

        {/* Login Button */}

        <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
>

          <LogIn size={20} />

          {loading ? "Logging in..." : "Login"}

        </button>

        {/* Register */}

        <p className="text-center text-slate-400 mt-6 text-sm sm:text-base">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>
 </div>
   
);
}

export default Login;