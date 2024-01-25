import { Dashboard } from "@/components/domain/home/dashboard";
import { SignIn } from "@/components/domain/home/signIn";
import { cn } from "@/lib/utils";
import { getCookie } from "cookies-next";

export default function Home() {
  const user = getCookie("user");
  return (
    <main
      className={cn({ "min-h-screen flex justify-center items-center": !user })}
    >
      {user ? <Dashboard /> : <SignIn />}
    </main>
  );
}
