"use client";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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

export const ResetPasswordForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

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
    try {
      await authClient.resetPassword(
        { newPassword, token: token as string },
        {
          onSuccess: async () => {
            router.push("/");
            toast.success("Password reset successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      );
    } catch {
      throw new Error("Something went wrong");
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
