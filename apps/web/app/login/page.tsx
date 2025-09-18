"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/signin`,
      { username: email, password }
    );
    // Redirect after successful login
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="flex pt-8 max-w-4xl w-full">
        <div className="flex-1 pt-20 px-4">
          <h1 className="font-semibold text-3xl pb-4">
            Welcome back to Flowrge
          </h1>
        </div>

        <div className="flex-1 mt-12 px-6 py-8 border rounded border-gray-200 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border rounded p-2"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded p-2"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
