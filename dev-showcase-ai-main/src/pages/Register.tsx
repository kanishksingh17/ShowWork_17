import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Submitting form..."); // Debug: show alert when form submits
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log("Register response:", res.status, data); // Debug log
      if (!res.ok) throw new Error(data.message || "Registration failed");
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Register error:", err.message); // Debug log
      } else {
        setError("Registration failed");
        console.error("Register error: unknown"); // Debug log
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input name="name" type="text" placeholder="Name" className="input mb-4 w-full" required value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" className="input mb-4 w-full" required value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="input mb-6 w-full" required value={form.password} onChange={handleChange} />
        <button type="submit" className="btn w-full">Create Account</button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <p className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-primary">Sign In</a>
        </p>
      </form>
    </div>
  );
}
