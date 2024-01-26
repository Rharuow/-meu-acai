"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import t from "@root/translate.json";

const signInFormSchema = z.object({
  username: z.string({ required_error: t["pt-BR"].pages.signIn.form.required }),
  password: z.string({ required_error: t["pt-BR"].pages.signIn.form.required }),
});

type Schema = z.infer<typeof signInFormSchema>;

export const SignIn = () => {
  const methods = useForm<Schema>({
    resolver: zodResolver(signInFormSchema),
  });
  const { handleSubmit, control } = methods;
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (data: Schema) => {
    console.log(data);
  };

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
      <FormProvider {...methods}>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Senha"
                      type={showPassword ? "text" : "password"}
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="bg-[var(--secondary)] focus:bg-[var(--secondary-active)] hover:bg-[var(--secondary-active)]">
            Entrar
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
};
