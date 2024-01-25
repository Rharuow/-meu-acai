"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const SignIn = () => {
  const { register } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Card className="bg-[var(--primary)] p-3 flex flex-col items-center gap-5">
      <Image
        width={0}
        height={0}
        sizes="100vw"
        className="w-[200px] h-auto object-contain"
        alt="logo of market place"
        src="/logo.png"
      />
      <form className="flex flex-col gap-3">
        <Input placeholder="Username" {...register("username")} />
        <div className="relative">
          <Input
            placeholder="Senha"
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          {!showPassword ? (
            <Eye
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-slate-500"
            />
          ) : (
            <EyeOff
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-slate-500"
            />
          )}
        </div>
        <Button className="bg-[var(--secondary)]">Entrar</Button>
      </form>
    </Card>
  );
};
