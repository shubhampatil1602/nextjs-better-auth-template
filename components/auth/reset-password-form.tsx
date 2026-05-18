"use client";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Loader } from "lucide-react";

const resetPasswordFormSchema = z
  .object({
    newPassword: z.z.string().min(6, "Invalid password"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordFormSchema>;

export const ResetPasswordForm = ({ token }: { token: string | undefined }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async ({ newPassword }: ResetPasswordFormSchema) => {
    if (!token) {
      toast.error("Invalid or expired reset link.");
      router.push("/request-password");
      return;
    }
    try {
      await authClient.resetPassword(
        { newPassword, token },
        {
          onSuccess: async () => {
            toast.success("Password reset successful. Please sign in.");
            router.push("/sign-in");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader className='text-left'>
          <CardTitle className='text-xl'>Enter your email</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='flex flex-col gap-3'>
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
                  {isSubmitting ? "Resetting password..." : "Reset Password"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
