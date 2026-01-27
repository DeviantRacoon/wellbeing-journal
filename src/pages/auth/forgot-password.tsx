import { Button, Input } from "@/commons/components";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import Link from "next/link";

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setErrorMessage("Por favor ingresa tu email");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    setStatus("loading");

    // Simulación de envío de recuperación
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      // Opcionalmente redirigir o mostrar mensaje de éxito duradero
    } catch (error) {
      setStatus("error");
      setErrorMessage("No se pudo enviar el correo de recuperación");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Background Orbs */}
      <div className="absolute -top-[20%] -left-[10%] h-125 w-125 rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] h-100 w-100 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

      <article className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-brand-primary blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
            <div className="relative bg-linear-to-br from-brand-primary to-indigo-600 p-4 rounded-2xl shadow-inner border border-white/10">
              <KeyRound
                className="w-8 h-8 text-white fill-white/20"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
            Recuperar <span className="text-indigo-400">Acceso</span>
          </h1>
          <p className="text-base text-slate-400">
            Te enviaremos las instrucciones por correo
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <Mail className="h-8 w-8 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                ¡Correo enviado!
              </h2>
              <p className="text-slate-400 text-sm">
                Si el correo existe en nuestro sistema, recibirás instrucciones
                en unos minutos.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/auth">Volver al inicio de sesión</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email de recuperación"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                disabled={status === "loading"}
                error={status === "error" && !email ? " " : undefined}
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
                {errorMessage || "Error al procesar la solicitud."}
              </div>

              <Button
                variant="primary"
                type="submit"
                loading={status}
                className="w-full"
              >
                Enviar instrucciones
              </Button>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Volver al inicio de sesión
              </Link>
            </div>
          </form>
        )}
      </article>
    </section>
  );
}
