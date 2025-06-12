"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/context/authcontext";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const { login, isLoading, error } = useAuth();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      await login(email, password, remember);
    } catch (err) {
      console.error("Error de login:", err);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <Link href="/" passHref>
        <Button variant="ghost" className="text-sm text-primary hover:bg-primary/10 dark:text-text-secondary">
          ← Back to Landing
        </Button>
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-text">
          Welcome back to{" "}
          <span>
            <span className="dark:text-secondary text-primary">Move</span>
            <span className="text-primary">Inn</span>
          </span>
        </h1>
        <p className="text-text-secondary">Sign in to continue your Erasmus journey</p>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-foreground shadow-sm">
        <h2 className="font-semibold text-lg mb-1 text-text">Login to your account</h2>
        <p className="text-sm text-text-secondary mb-6">
          Enter your credentials to access your account
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-text">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none dark:border-text-secondary">
                {/* Icono de correo */}
                <Mail className="h-5 w-5 text-text-secondary" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@gmail.com"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text text-sm dark:border-text-secondary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-text">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* Icono de correo */}
                <LockKeyhole className="h-5 w-5 text-text-secondary" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-text text-sm dark:border-text-secondary"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-text"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary/30 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-text">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="text-primary hover:text-primary-dark dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-gray-900 bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
          >
            {isLoading ? (
  <>
    <svg
      className="animate-spin h-5 w-5 text-white mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
      />
    </svg>
    Logging in...
  </>
) : (
  "Login"
)}

          </button>
        </form>

        <div className="mt-4 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <button
  onClick={() => {
    setIsRegistering(true);
    router.push("/register");
  }}
  disabled={isRegistering}
  className="text-primary hover:text-primary-dark dark:text-gray-400 dark:hover:text-gray-200 font-medium inline-flex items-center transition-colors"
>
  {isRegistering ? (
    <>
      <svg
        className="animate-spin h-4 w-4 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16 8 8 0 01-8-8z"
        />
      </svg>
      Loading...
    </>
  ) : (
    <>
      Register Now
      <svg
        className="ml-1 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </>
  )}
</button>

        </div>
      </div>
    </div>
  );
}
