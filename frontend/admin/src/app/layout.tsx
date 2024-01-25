import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { App } from "@/components/app";

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
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  );
}
