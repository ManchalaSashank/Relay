"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { UserContext } from "@/utils/UserContext";
import AlertBox from "@/components/AlertBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { setUsername: setCtxUsername, setId } = useContext(UserContext);

  // --- State for form fields and error ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- Handle login form submission ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- Required field checks ---
    if (!username) {
      setError("Username is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const res = await axios.post("/auth/login", { username, password });
      if (res.data.valid) {
        setCtxUsername(res.data.username);
        setId(res.data.id);
        router.push("/chat");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1b] via-[#0a0a23] to-[#040411] text-white px-4">
      <Card className="w-full max-w-md py-6 px-4 sm:px-6 sm:py-8 rounded-2xl shadow-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to Relay
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Please enter your credentials to log in.
          </p>
        </CardHeader>

        <CardContent className="mt-4 space-y-6">
          <form onSubmit={handleLogin} noValidate className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 transition duration-300 hover:border-blue-400 hover:shadow-[0_0_6px_1px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-[0_0_8px_2px_rgba(99,102,241,0.6)]"
                placeholder="your_username"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 transition duration-300 hover:border-purple-400 hover:shadow-[0_0_6px_1px_rgba(168,85,247,0.3)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_8px_2px_rgba(168,85,247,0.5)]"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* --- Show error if present --- */}
            {error && <AlertBox type="error" message={error} />}

            <Button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
            >
              Login
            </Button>

            <p className="text-sm text-center text-zinc-400 pt-2">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => router.push("/signup")}
                className="text-blue-400 hover:text-blue-500 hover:underline cursor-pointer transition"
              >
                Sign Up
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}