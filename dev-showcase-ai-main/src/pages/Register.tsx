import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, ArrowLeft } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Light Background for Forms */}
      <div className="flex-1 bg-surface flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 group hover:scale-105 transition-all duration-300">
            <div className="w-8 h-8 logo-bg rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:logo-text transition-colors duration-300">
              ShowWork
            </span>
          </div>

          {/* Form */}
          <div className="animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create your account
              </h1>
              <p className="text-foreground-muted mb-8">
                Join thousands of developers showcasing their work
              </p>

              {/* Form Fields */}
              <div className="mb-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-input text-foreground placeholder:text-foreground-muted"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-input text-foreground placeholder:text-foreground-muted"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-6">
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-input-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 bg-input text-foreground placeholder:text-foreground-muted"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 logo-bg text-white font-medium rounded-lg hover:opacity-90 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 mb-4"
              >
                Create Account
              </button>

              {/* Error Message */}
              {error && (
                <p className="text-destructive text-center mt-2 font-medium animate-fade-in">
                  {error}
                </p>
              )}

              {/* Sign In Link */}
              <p className="text-center text-sm text-foreground-muted mt-6">
                Already have an account?{" "}
                <button
                  type="button"
                  className="logo-text hover:opacity-80 font-medium transition-colors"
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </p>

              {/* Back to Home */}
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center text-foreground-muted hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Primary Gradient Background */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated Particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-accent rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-accent-glow rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-primary-foreground rounded-full animate-bounce opacity-50"></div>

          {/* Floating Code Elements */}
          <div className="absolute top-1/4 right-1/2 text-blue-400/30 text-6xl font-mono animate-pulse transform rotate-12">
            &lt;/&gt;
          </div>
          <div className="absolute bottom-1/3 left-1/2 text-purple-400/20 text-4xl font-mono animate-bounce transform -rotate-12">
            {}
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-glow rounded-2xl flex items-center justify-center mb-8 animate-pulse">
            <Code2 className="h-8 w-8 text-accent-foreground" />
          </div>

          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-glow">
              Join ShowWork
            </span>
            <br />
            <span className="text-primary-foreground">today</span>
          </h2>

          <p className="text-xl text-primary-foreground/80 max-w-md leading-relaxed mb-8">
            Start building your professional portfolio and showcase your work to
            the world.
          </p>
        </div>
      </div>
    </div>
  );
}
