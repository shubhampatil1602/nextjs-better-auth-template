"use client";

import Link from "next/link";
import { Braces } from "lucide-react";
import { Button } from "../ui/button";

export function AuthNavbar({
  activeTab,
}: {
  activeTab: "sign-in" | "sign-up";
}) {
  return (
    <nav className='w-full h-12 flex items-center px-6 justify-between border-b font-heading '>
      <Link
        href='/'
        className='flex items-center gap-1.5 self-center font-medium'
      >
        <div className='flex w-6 h-5.5 items-center justify-center bg-primary text-primary-foreground'>
          <Braces className='size-4' />
        </div>
        AUTH TEMPLATE.
      </Link>
      <div className='flex gap-6 items-center'>
        <Button>Theme</Button>
        {activeTab === "sign-in" ? (
          <Link href='/sign-up'>Sign Up</Link>
        ) : (
          <Link href='/sign-in'>Sign In</Link>
        )}
      </div>
    </nav>
  );
}
