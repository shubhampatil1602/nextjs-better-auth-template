"use client";

import { usePathname } from "next/navigation";
import { AuthNavbar } from "@/components/auth/auth-navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const activeTab = pathname.includes("sign-up") ? "sign-up" : "sign-in";
  return (
    <div className='min-h-screen w-full bg-[#f9fafb] relative'>
      {/* Diagonal Fade Center Grid Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
        linear-gradient(to right, #d1d5db .3px, transparent .3px),
        linear-gradient(to bottom, #d1d5db .3px, transparent .3px)
      `,
          backgroundSize: "50px 50px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 70%)",
        }}
      />

      <div className='relative z-10'>
        <AuthNavbar activeTab={activeTab} />

        <div className='flex h-188 flex-col items-center justify-center gap-6 p-6 md:p-10'>
          <div className='flex w-full max-w-md flex-col gap-6'>{children}</div>
        </div>
      </div>
    </div>
  );
}
