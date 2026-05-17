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
import { useState } from "react";

const requestPasswordFormSchema = z.object({
  email: z.email({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    error: "Please enter a valid email address.",
  }),
});

type RequestPasswordFormSchema = z.infer<typeof requestPasswordFormSchema>;

export const RequestPasswordForm = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestPasswordFormSchema>({
    resolver: zodResolver(requestPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async ({ email }: RequestPasswordFormSchema) => {
    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (data?.status) {
        toast.success("An email has been sent to you.");
        setIsEmailSent(true);
        router.refresh();
      }

      if (error) {
        toast.error(error.message);
        setIsEmailSent(false);
      }
    } catch {
      throw new Error("Something went wrong");
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      {isEmailSent ? (
        <Card>
          <CardHeader className='text-left'>
            <CardTitle>Check your email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex w-full mb-3'>
              A password reset link has been sent to your email.
            </div>
            <Button
              onClick={() => router.push("/sign-in")}
              className='cursor-pointer w-full'
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className='text-left'>
            <CardTitle className='text-xl'>Enter your email</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              id='reset-password'
              className='flex flex-col gap-6'
            >
              <FieldGroup className='flex flex-col gap-3'>
                <Field>
                  <FieldLabel htmlFor='currentPassword'>Email</FieldLabel>
                  <Input id='email' {...register("email")} type='email' />
                  <FieldError>{errors.email?.message}</FieldError>
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
                    {isSubmitting ? "Sending Request..." : "Send Request"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
