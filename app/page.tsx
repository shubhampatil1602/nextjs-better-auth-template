import { authSession } from "@/lib/auth/auth-utils";
import Link from "next/link";

export default async function Home() {
  const session = await authSession();
  return (
    <div>
      {session ? (
        <div className='flex gap-3'>
          <Link href='/update-profile'>Update Profile</Link>
        </div>
      ) : (
        <div className='flex gap-3'>
          <Link href='/sign-in'>Sign In</Link>
          <Link href='/sign-up'>Sign Up</Link>{" "}
        </div>
      )}
    </div>
  );
}
