import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { App } from "@/components/app";
import { Toaster } from "@/components/ui/toaster";
import { hasCookie } from "cookies-next";
import { cookies } from "next/headers";
import { SignIn } from "@/components/domain/home/signIn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin - Meu Açai",
  description: "Admin plataform to manage the resources of 'Meu Açai'",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = hasCookie("session", { cookies });

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Toaster />
        <App>{session ? children : <SignIn />}</App>
      </body>
    </html>
  );
}
