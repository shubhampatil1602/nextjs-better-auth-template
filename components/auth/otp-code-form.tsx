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

const otpFormSchema = z.object({
  code: z.string().min(6, "Invalid code"),
});

type OtpFormSchema = z.infer<typeof otpFormSchema>;

export const OtpCodeForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async ({ code }: OtpFormSchema) => {
    try {
      await authClient.twoFactor.verifyOtp(
        { code },
        {
          onSuccess: async () => {
            toast.success("Otp code verified. Welcome back!");
            router.push("/");
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
          <CardTitle className='text-xl'>Enter your otp code</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id='otp-code'
            className='flex flex-col gap-6'
          >
            <FieldGroup className='flex flex-col gap-3'>
              <Field>
                <FieldLabel htmlFor='currentPassword'>Code</FieldLabel>
                <Input id='code' {...register("code")} />
                <FieldError>{errors.code?.message}</FieldError>
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
                  {isSubmitting ? "Verifying Otp..." : "Verify Otp"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
