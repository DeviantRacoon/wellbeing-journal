"use client";

import { Seo } from "@/commons/components/seo";
import { Button } from "@/commons/components/ui/button";
import { Input } from "@/commons/components/ui/input";
import { Brain, Calendar, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setStatus("error");
      setErrorMessage("Por favor completa todos los campos");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setErrorMessage("Las contraseñas no coinciden");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          birthDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrarse");
      }

      // Auto login after registration
      const result = await import("next-auth/react").then((mod) =>
        mod.signIn("credentials", {
          email,
          password,
          redirect: false,
        }),
      );

      if (result?.error) {
        setStatus("success"); // Registration worked, but login failed?? weird case.
        // fallback to redirecting to login
        setTimeout(() => router.push("/auth"), 1500);
      } else {
        setStatus("success");
        router.push("/");
      }
    } catch (error: any) {
      setStatus("error");
      setErrorMessage(error.message || "Error al crear la cuenta");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <section className="fixed inset-0 h-[100dvh] w-full bg-slate-950 overscroll-none overflow-y-auto">
      <Seo
        title="Crear Cuenta"
        description="Únete a PaM y comienza a cuidar tu salud mental hoy mismo. Registro rápido y seguro."
      />

      {/* Background Orbs - Fixed to stay in place while scrolling */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Content Wrapper - Allows centering but grows if content overflows */}
      <div className="relative z-10 flex min-h-full w-full items-center justify-center px-4 py-12">
        <article className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 p-8 shadow-2xl backdrop-blur-xl group">
          <div className="absolute inset-0 bg-indigo-500/10 blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center mb-10">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-indigo-500 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-inner border border-white/10">
                <Brain
                  className="w-8 h-8 text-white fill-white/20"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
              Crear <span className="text-indigo-400">Cuenta</span>
            </h1>
            <p className="text-base text-slate-400">
              Únete a PaM y empieza tu camino al bienestar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
            <div className="space-y-2">
              <Input
                label="Nombre Completo"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading" || status === "success"}
                className="bg-slate-950/30 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                error={status === "error" && !name ? " " : undefined}
              />

              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading" || status === "success"}
                className="bg-slate-950/30 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                error={status === "error" && !email ? " " : undefined}
              />

              <Input
                label="Fecha de Nacimiento"
                type="date"
                placeholder="dd/mm/yyyy"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading" || status === "success"}
                className="bg-slate-950/30 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                error={status === "error" && !birthDate ? " " : undefined}
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading" || status === "success"}
                className="bg-slate-950/30 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                error={status === "error" && !password ? " " : undefined}
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading" || status === "success"}
                className="bg-slate-950/30 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                error={status === "error" && !confirmPassword ? " " : undefined}
              />
            </div>

            <div className="relative pt-2">
              <div
                className={`
                absolute -top-5 left-0 w-full text-center text-sm font-medium text-red-400
                transition-all duration-300 transform
                ${
                  status === "error"
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2 pointer-events-none"
                }
              `}
              >
                {errorMessage || "Ha ocurrido un error."}
              </div>

              <Button
                variant="primary"
                type="submit"
                loading={status}
                className="w-full h-12 rounded-xl font-medium transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
              >
                Registrarse
              </Button>
            </div>
          </form>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href="/auth"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
