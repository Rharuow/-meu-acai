"use client";
import Lottie from "lottie-react";
import { ChevronLeft } from "lucide-react";

import { Card } from "@/components/ui/card";

import notFound from "@public/animations/404.json";

import t from "@/util/translate.json";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-3">
      <Button
        variant="secondary"
        className="absolute left-3 top-3 rounded-full p-2"
        onClick={() => router.back()}
      >
        <ChevronLeft />
      </Button>
      <Image
        className="h-auto w-[200px] object-contain"
        alt="logo of market place"
        src="/logo.png"
      />
      <Card className="bg-[var(--secondary-active)] p-3 ">
        <Lottie animationData={notFound} className="h-[150px]" />
        <p className="text-center font-bold text-muted">
          {t["pt-BR"].pages[404]["Ops... Not found here..."]}
        </p>
      </Card>
    </main>
  );
}
