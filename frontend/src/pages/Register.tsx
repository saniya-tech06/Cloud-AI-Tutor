import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { registerUser } from "../api/authApi";

function Register() {
const navigate = useNavigate();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleRegister = async () => {

  if(password !== confirmPassword){
    setError("Passwords do not match");
    return;
  }

  try {

    setLoading(true);
    setError("");

    await registerUser({
      name,
      email,
      password,
    });

    navigate("/");

  } catch(err:any){

    setError(
      err.response?.data?.message || "Registration failed"
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
          Create Account
        </h1>

        <p className="text-center text-slate-400 mt-3 text-sm sm:text-base">
          Join Cloud AI Study Assistant and start learning smarter.
        </p>

        {/* Name */}

        <div className="mt-8">

          <label className="block text-slate-300 mb-2 font-medium">
            Full Name
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-blue-500 transition">

            <User className="text-slate-400" size={20} />

            <input
 type="text"
 placeholder="Enter your full name"
 value={name}
 onChange={(e)=>setName(e.target.value)}
 className="w-full bg-transparent p-3 outline-none text-white placeholder-slate-500"
/>
          </div>

        </div>

        {/* Email */}

        <div className="mt-5">

          <label className="block text-slate-300 mb-2 font-medium">
            Email Address
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-blue-500 transition">

            <Mail className="text-slate-400" size={20} />

           <input
 type="email"
 placeholder="Enter your email"
 value={email}
 onChange={(e)=>setEmail(e.target.value)}
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
              placeholder="Create a password"
              value={password}
onChange={(e)=>setPassword(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-slate-500"
            />

          </div>

        </div>

        {/* Confirm Password */}

        <div className="mt-5">

          <label className="block text-slate-300 mb-2 font-medium">
            Confirm Password
          </label>

          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 focus-within:border-blue-500 transition">

            <Lock className="text-slate-400" size={20} />

            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full bg-transparent p-3 outline-none text-white placeholder-slate-500"
            />

          </div>

        </div>

        {/* Button */}

        {error && (
  <p className="text-red-500 text-sm mt-4 text-center">
    {error}
  </p>
)}

        <button
  onClick={handleRegister}
  disabled={loading}
  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
>

          <UserPlus size={20} />

          {loading ? "Creating..." : "Create Account"}

        </button>

        {/* Login */}

        <p className="text-center text-slate-400 mt-6 text-sm sm:text-base">

          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 font-semibold"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;