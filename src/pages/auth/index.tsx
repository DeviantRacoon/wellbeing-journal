import { Seo } from "@/commons/components/seo";
import { Button } from "@/commons/components/ui/button";
import { Input } from "@/commons/components/ui/input";
import { Brain } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { callbackUrl } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setStatus("error");
      setErrorMessage("Por favor completa todos los campos");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    setStatus("loading");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error && result.error !== "undefined") {
        setStatus("error");
        setErrorMessage(result.error);
        setTimeout(() => setStatus("idle"), 2500);
      } else {
        setStatus("success");
        router.push((callbackUrl as string) || "/");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Error al iniciar sesión");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <section className="fixed inset-0 h-[100dvh] w-full bg-slate-950 overscroll-none overflow-y-auto">
      <Seo
        title="Iniciar Sesión"
        description="Accede a tu diario personal y continúa tu camino hacia el bienestar emocional con PaM."
      />
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-full w-full items-center justify-center px-4 py-8">
        <article className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-teal-500 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
              <div className="relative bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl shadow-inner border border-white/10">
                <Brain
                  className="w-8 h-8 text-white fill-white/20"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-3">
              PaM<span className="text-teal-400">App</span>
            </h1>
            <p className="text-base text-slate-400">
              Tu diario personal y asistente de bienestar emocional
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                error={status === "error" && !email ? " " : undefined}
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
                disabled={status === "loading"}
                error={status === "error" && !password ? " " : undefined}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-white/5 checked:border-teal-500 checked:bg-teal-500 transition-all cursor-pointer"
                  />
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-medium">Recordarme</span>
              </label>

              <Link
                href="/auth/recovery"
                className="text-teal-400 hover:text-teal-300 transition-colors hover:underline font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="relative pt-2">
              {/* Mensaje de Error: Aumentado a text-sm */}
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
                {errorMessage || "Credenciales incorrectas o acceso denegado."}
              </div>

              <Button
                variant="primary"
                type="submit"
                loading={status}
                className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800"
              >
                Iniciar Sesión
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              ¿No tienes una cuenta?{" "}
              <Link
                href="/auth/register"
                className="text-teal-400 hover:text-teal-300 font-medium transition-colors hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
