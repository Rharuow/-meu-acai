"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import t from "@/util/translate.json";
import { api } from "@/services/api";
import { setCookie } from "cookies-next";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Image } from "@/components/ui/image";

const signInFormSchema = z.object({
  name: z
    .string({ required_error: t["pt-BR"].pages.signIn.form.required })
    .min(1, { message: t["pt-BR"].pages.signIn.form.required }),
  password: z
    .string({ required_error: t["pt-BR"].pages.signIn.form.required })
    .min(1, { message: t["pt-BR"].pages.signIn.form.required }),
});

type Schema = z.infer<typeof signInFormSchema>;

export const SignIn = () => {
  const methods = useForm<Schema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      password: "",
      name: "",
    },
  });
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleSubmit, control } = methods;
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = (data: Schema) => {
    api
      .post("/signin", data)
      .then((res) => {
        const { message, ...session } = res.data;
        setCookie("session", JSON.stringify(session));
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: t["pt-BR"].messages.error["Uh oh! Something went wrong."],
          description:
            t["pt-BR"].messages.error["There was a problem with your request."],
        });
      });
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3">
      <Image
        className="h-auto w-[250px] object-contain"
        alt="logo of market place"
        src="/logo.png"
      />
      {loading ? (
        <Skeleton className="h-[304px] w-[269px] rounded-lg" />
      ) : (
        <Card className="flex flex-col items-center gap-5 bg-[var(--primary)] p-3">
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormField
                control={control}
                name="name"
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
                            className="absolute right-2 top-1/2 -translate-y-1/2 transform text-slate-500"
                          />
                        ) : (
                          <EyeOff
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 transform text-slate-500"
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="bg-[var(--secondary)] hover:bg-[var(--secondary-active)] focus:bg-[var(--secondary-active)]">
                Entrar
              </Button>
            </form>
          </FormProvider>
        </Card>
      )}
    </main>
  );
};
