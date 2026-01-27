import { Toaster } from "@/commons/components/ui/toaster";
import { ToastProvider } from "@/commons/hooks/use-toast";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ToastProvider>
        <Component {...pageProps} />
        <Toaster />
      </ToastProvider>
    </SessionProvider>
  );
}
