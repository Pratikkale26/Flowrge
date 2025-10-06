"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signup`, {
        username: email,
        password,
        name,
      });
      router.push("/login");
    } catch (e) {
      console.error("Signup failed:", e);
      alert("Sign-up failed. Please check your details and try again.");
    }
  };

  return (
    <div className="flex min-h-[92vh] bg-black overflow-x-hidden">
      {/* Left Graphic / Marketing */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-800 via-purple-900 to-black p-16 flex-col justify-center text-white">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Automate your Web3 workflow <br /> in minutes
        </h1>
        <p className="text-lg text-gray-300">
          Flowrge helps you trigger Solana transactions, integrate apps, and save hours of manual work. Build automation like a pro.
        </p>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-lg border border-gray-800 rounded-2xl p-10 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="w-full rounded-lg px-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg px-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg px-4 py-3 bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Get Started
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{" "}
            <span
              className="text-purple-500 hover:underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
