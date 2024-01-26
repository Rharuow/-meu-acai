"use client";
import Lottie from "lottie-react";

import { Card } from "@/components/ui/card";

import notFound from "@public/animations/404.json";

import t from "@/util/translate.json";
import { Image } from "@/components/ui/image";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Image
        className="h-auto w-[200px] object-contain"
        alt="logo of market place"
        src="/logo.png"
      />
      <Card className="bg-[var(--secondary-active)] p-3">
        <Lottie animationData={notFound} className="h-[150px]" />
        <p className="text-center font-bold text-muted">
          {t["pt-BR"].pages[404]["Ops... Not found here..."]}
        </p>
      </Card>
    </main>
  );
}
