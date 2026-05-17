"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { Braces } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <div className='w-full min-h-dvh min-w-dvw relative'>
      <nav className='w-full flex justify-between items-center px-6 h-16 shadow mx-auto max-w-7xl mb-6 sticky top-0 bg-white'>
        <Link
          href='/'
          className='flex items-center gap-1.5 self-center font-medium'
        >
          <div className='flex w-6 h-5.5 items-center justify-center bg-primary text-primary-foreground'>
            <Braces className='size-4' />
          </div>
          BHAI CODE.
        </Link>
        <Button
          className='cursor-pointer'
          onClick={async () => {
            await authClient.signOut();
            router.push("/sign-in");
          }}
        >
          Sign out
        </Button>
      </nav>
      {children}
    </div>
  );
}
