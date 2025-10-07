"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`,
        { username: email, password }
      );
      const token = res.data.token;
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (e) {
      console.log(e);
      alert("Login failed. Please check your credentials and try again.");
    }
  }

  return (
    <div className="min-h-[92vh] w-full flex overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Left message */}
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 text-white ml-20">
        <h1 className="text-5xl font-bold mb-6">
          Welcome Back to Flowrge
        </h1>
        <p className="text-lg text-gray-300">
          Automate your Solana workflows in minutes. Create triggers, actions, and connect Web2 & Web3 seamlessly.
        </p>
      </div>

      {/* Login form */}
      <div className="flex flex-1 justify-center items-center px-6 mr-20">
        <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Log In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-700 rounded-md p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full border border-gray-700 rounded-md p-3 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-md transition-colors"
              type="submit"
            >
              Log In
            </button>
          </form>

          <p className="mt-4 text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-amber-400 cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
