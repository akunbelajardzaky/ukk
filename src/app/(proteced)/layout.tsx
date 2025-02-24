import { auth } from "@/auth";
import { WelcomeScreen } from "@/components/welcome";
import { redirect } from "next/navigation";

export default async function ProtectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


 const session = await auth();

 if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
        <WelcomeScreen name={session.user?.name}/>

        {children}

    </>
  )
}
