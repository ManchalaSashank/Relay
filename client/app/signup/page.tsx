"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/utils/axios";
import { UserContext } from "@/utils/UserContext";
import { cn } from "@/lib/utils";

import AlertBox from "@/components/AlertBox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// --- Validation helpers ---
const NAME_REGEX = /^[A-Za-z\s]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9@]{5,}$/; // min 5 chars, letters, numbers, @
const PASSWORD_MIN_LENGTH = 8;

export default function SignupPage() {
  const router = useRouter();
  const { setUsername: setCtxUsername, setId } = useContext(UserContext);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // --- Validation logic ---
  const validateFields = () => {
    if (!name) return "Name is required.";
    if (!NAME_REGEX.test(name))
      return "Name should contain only letters and spaces.";
    if (!username) return "Username is required.";
    if (!USERNAME_REGEX.test(username))
      return "Username must be at least 5 characters and contain only letters, numbers, or @.";
    if (!password) return "Password is required.";
    if (password.length < PASSWORD_MIN_LENGTH)
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    if (!confirm) return "Please confirm your password.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  // --- Signup handler ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        username,
        password,
      });

      if (res.data.valid) {
        setCtxUsername(res.data.username);
        setId(res.data.id);
        router.push("/chat");
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1b] via-[#0a0a23] to-[#040411] text-white px-4">
      <Card className="w-full max-w-md py-6 px-4 sm:px-6 sm:py-8 rounded-2xl shadow-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Create Your Account
          </CardTitle>
          <p className="text-sm text-zinc-400">
            Please fill in the following information to sign up.
          </p>
        </CardHeader>

        <CardContent className="mt-4 space-y-4">
          <form onSubmit={handleSignup} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 hover:border-cyan-400 hover:shadow-[0_0_6px_1px_rgba(34,211,238,0.3)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_8px_2px_rgba(34,211,238,0.4)] transition duration-300"
                placeholder="Your full name"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 hover:border-blue-400 hover:shadow-[0_0_6px_1px_rgba(99,102,241,0.4)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-[0_0_8px_2px_rgba(99,102,241,0.6)] transition duration-300"
                placeholder="At least 5 chars, letters, numbers, or @"
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 hover:border-purple-400 hover:shadow-[0_0_6px_1px_rgba(168,85,247,0.3)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_8px_2px_rgba(168,85,247,0.5)] transition duration-300"
                placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="rounded-lg bg-zinc-800 border border-zinc-600 hover:border-purple-400 hover:shadow-[0_0_6px_1px_rgba(168,85,247,0.3)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-[0_0_8px_2px_rgba(168,85,247,0.5)] transition duration-300"
                placeholder="Re-enter password"
                autoComplete="off"
              />
            </div>

            {error && <AlertBox type="error" message={error} />}

            <Button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
            >
              Sign Up
            </Button>

            <p className="text-sm text-center text-zinc-400 pt-1.5">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="text-blue-400 hover:text-blue-500 hover:underline cursor-pointer transition"
              >
                Login
              </span>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
