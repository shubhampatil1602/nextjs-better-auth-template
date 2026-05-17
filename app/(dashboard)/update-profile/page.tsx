import { getProfile } from "@/actions/user";
import { ChangePassword } from "@/components/auth/change-password";
import { UpdateProfile } from "@/components/auth/update-profile";
import { ToggleTwoFactorOtp } from "@/components/email/toggle-two-factor-otp";
import { authIsRequired } from "@/lib/auth/auth-utils";
import { redirect } from "next/navigation";

export default async function UpdateProfilePage() {
  await authIsRequired();
  const user = await getProfile();
  if (!user) redirect("/sign-in");
  return (
    <div className='w-full max-w-7xl h-full grid grid-cols-2 gap-6 mx-auto'>
      <UpdateProfile
        email={user?.email}
        firstName={user.name.split(" ")[0]}
        lastName={user.name.split(" ")[1]}
        image={user.image ?? ""}
        username={user.username}
      />
      <div className='flex flex-col gap-6'>
        <ChangePassword />
        <ToggleTwoFactorOtp twoFactorEnabled={user.twoFactorEnabled} />
      </div>
    </div>
  );
}
