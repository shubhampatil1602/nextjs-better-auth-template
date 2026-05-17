"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 6 characters")
      .max(100),
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password cannot be the same as the current password",
    path: ["newPassword"],
  });
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export function ChangePassword({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ChangePasswordSchema> = async (
    data: ChangePasswordSchema,
  ) => {
    try {
      await authClient.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          onSuccess: async () => {
            toast.success("Password changed successfully");
            reset();
          },
          onError: (ctx) => {
            console.log("password change ctx error-----", ctx);
            toast.error(ctx.error.message);
          },
        },
      );
    } catch (error) {
      console.log("password change error-----", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className='text-left'>
          <CardTitle className='text-xl'>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='flex flex-col gap-3'>
              <Field>
                <FieldLabel htmlFor='currentPassword'>
                  Current Password
                </FieldLabel>
                <Input id='currentPassword' {...register("currentPassword")} />
                <FieldError>{errors.currentPassword?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                <Input id='newPassword' {...register("newPassword")} />
                <FieldError>{errors.newPassword?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor='confirmNewPassword'>
                  Confirm New Password
                </FieldLabel>
                <Input
                  id='confirmNewPassword'
                  {...register("confirmNewPassword")}
                />
                <FieldError>{errors.confirmNewPassword?.message}</FieldError>
              </Field>
              <Field>
                <Button
                  disabled={isSubmitting}
                  type='submit'
                  className='cursor-pointer'
                >
                  {isSubmitting && (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  {isSubmitting ? "Updating password..." : "Update Password"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
