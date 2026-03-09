"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertCircle, User as UserIcon, UserPlus } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/glass-card";
import { AetherisLogo } from "@/components/aetheris-logo";

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Login fields
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  
  // Register fields
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const login = useAppStore((state) => state.login);
  const register = useAppStore((state) => state.register);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!identifier || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      await login(identifier, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!registerName || !registerEmail || !registerUsername || !registerPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register(registerName, registerEmail, registerUsername, registerPassword);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "linear-gradient(to bottom right, var(--background-start), var(--background-end))" }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px] animate-pulse" 
          style={{ backgroundColor: "var(--accent)", opacity: 0.2 }}
        />
        <div 
          className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full blur-[120px]"
          style={{ backgroundColor: "var(--accent)", opacity: 0.1 }}
        />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <AetherisLogo className="h-16 w-auto" style={{ filter: "drop-shadow(0 0 30px var(--accent))" }} />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-100">
              {isRegisterMode ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {isRegisterMode ? "Start your Aetheris journey" : "Sign in to your Aetheris workspace"}
            </p>
          </div>

          {/* Auth Card */}
          <GlassCard glow="cyan" className="p-6">
            {!isRegisterMode ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email or Username Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Email or Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="email@example.com or username"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm text-red-200"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-gradient-to-r from-cyan-400/20 to-cyan-300/10 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/30 hover:text-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{isLoading ? "Signing in..." : "Sign In"}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type="text"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder="your_username"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-300/60" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/10 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm text-red-200"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-300/40 bg-gradient-to-r from-cyan-400/20 to-cyan-300/10 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/30 hover:text-cyan-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{isLoading ? "Creating account..." : "Create Account"}</span>
                </button>
              </form>
            )}
          </GlassCard>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError("");
              }}
              className="text-sm text-slate-400 hover:text-cyan-300 transition"
            >
              {isRegisterMode ? (
                <span>Already have an account? <span className="font-medium text-cyan-300">Sign In</span></span>
              ) : (
                <span>Do not have an account? <span className="font-medium text-cyan-300">Create one</span></span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
