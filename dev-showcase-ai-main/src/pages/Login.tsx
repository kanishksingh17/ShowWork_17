import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Github, ArrowLeft, Code2, Sparkles, Zap, Star, Layers, Terminal, Rocket } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [socialLoading, setSocialLoading] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? navigate("/dashboard") : setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
    const payload = isSignup ? form : { email: form.email, password: form.password };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (isSignup ? "Signup failed" : "Login failed"));
      if (isSignup) {
        setIsSignup(false);
        setSuccess("Account created! Please log in.");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(isSignup ? "Signup failed" : "Login failed");
    }
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setSocialLoading(provider);
    window.location.href = `/api/auth/${provider}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Light Background for Forms */}
      <div className="flex-1 bg-surface flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8 group hover:scale-105 transition-all duration-300">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">
              <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">ShowWork</span>
          </div>

          {/* Form */}
          <div className="animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isSignup ? "Create your account" : "Log in to your account"}
              </h1>
              <p className="text-foreground-muted mb-8">
                {isSignup ? "Join thousands of developers showcasing their work" : "Welcome back to ShowWork"}
              </p>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-surface text-foreground-muted">or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={socialLoading !== ""}
                  className={`flex items-center justify-center py-3 px-4 border border-input-border rounded-lg bg-input text-foreground font-medium hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 transition-all duration-300 ${
                    socialLoading === "google" ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {socialLoading === "google" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                  disabled={socialLoading !== ""}
                  className={`flex items-center justify-center py-3 px-4 border border-input-border rounded-lg bg-input text-foreground font-medium hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 transition-all duration-300 ${
                    socialLoading === "github" ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {socialLoading === "github" ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  ) : (
                    <Github className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>

              {/* Form Fields */}
              {isSignup && (
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
              )}

              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email or Username"
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
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-medium rounded-lg hover:from-primary-glow hover:to-accent shadow-glow hover:scale-105 hover:shadow-xl transition-all duration-300 mb-4"
              >
                {isSignup ? "Create Account" : "Log In"}
              </button>

              {/* Forgot Password Link */}
              {!isSignup && (
                <div className="text-center mb-6">
                  <button
                    type="button"
                    className="text-primary hover:text-primary-glow text-sm transition-colors"
                    onClick={() => {/* Handle forgot password */}}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Error/Success Messages */}
              {error && (
                <p className="text-destructive text-center mt-2 font-medium animate-fade-in">{error}</p>
              )}
              {success && (
                <p className="text-success text-center mt-2 font-medium animate-fade-in">{success}</p>
              )}

              {/* Toggle Sign Up/Sign In */}
              <p className="text-center text-sm text-foreground-muted mt-6">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary-glow font-medium transition-colors"
                      onClick={() => setIsSignup(false)}
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-primary hover:text-primary-glow font-medium transition-colors"
                      onClick={() => setIsSignup(true)}
                    >
                      Sign up
                    </button>
                  </>
                )}
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

      {/* Right Panel - Primary Gradient Background with Tech Visualization */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary via-primary-glow to-accent relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated Particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-accent rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-accent-glow rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-32 left-40 w-3 h-3 bg-primary-foreground rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent-glow rounded-full animate-pulse opacity-30"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary-foreground rounded-full animate-ping opacity-50"></div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-lg animate-pulse"></div>

          {/* Floating Code Elements */}
          <div className="absolute top-1/4 right-1/2 text-blue-400/30 text-6xl font-mono animate-pulse transform rotate-12">&lt;/&gt;</div>
          <div className="absolute bottom-1/3 left-1/2 text-purple-400/20 text-4xl font-mono animate-bounce transform -rotate-12">{ }</div>
          <div className="absolute top-2/3 right-1/3 text-cyan-400/30 text-3xl font-mono animate-pulse">=&gt;</div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center p-12">
          <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-glow rounded-2xl flex items-center justify-center mb-8 animate-pulse">
            <Sparkles className="h-8 w-8 text-accent-foreground" />
          </div>
          
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-glow">
              Idea to app,
            </span>
            <br />
            <span className="text-primary-foreground">fast</span>
          </h2>
          
          <p className="text-xl text-primary-foreground/80 max-w-md leading-relaxed mb-8">
            Build a stunning portfolio, connect with opportunities, and let your code tell your story.
          </p>

          {/* Feature Highlights */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm">Lightning-fast portfolio creation</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-sm">AI-powered project recommendations</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-sm">Multiple project showcase formats</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4 text-pink-400" />
              </div>
              <span className="text-sm">Direct GitHub integration</span>
            </div>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-sm">Career growth tracking</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-gray-400">Developers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-gray-400">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
