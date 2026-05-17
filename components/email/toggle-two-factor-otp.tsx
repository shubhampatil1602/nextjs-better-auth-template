"use client";

import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Loader } from "lucide-react";

interface ToggleOtpProps {
  twoFactorEnabled: boolean;
}

const formSchema = z.object({
  password: z.string().min(6, "Invalid password"),
});

export function ToggleTwoFactorOtp({ twoFactorEnabled }: ToggleOtpProps) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = () => {
    setIsOpen(true);
  };

  const onSubmit = async ({ password }: z.infer<typeof formSchema>) => {
    try {
      if (twoFactorEnabled) {
        const { error } = await authClient.twoFactor.disable({ password });

        if (error) {
          toast.error(error.message);
          reset({ password: "" });
          return;
        }

        toast.success("Two factor authentication disabled");
        reset({ password: "" });
        router.refresh();
      } else {
        const { error } = await authClient.twoFactor.enable({ password });

        if (error) {
          toast.error(error.message);
          reset({ password: "" });
          return;
        }

        toast.success("Two factor authentication enabled");
        reset({ password: "" });
        router.refresh();
      }
    } catch {
      throw new Error("Something went wrong");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>
            Enable/Disable Two Factor Auth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-between items-center'>
            <Label>
              {!twoFactorEnabled
                ? "Enable two factor authentication"
                : "Disable two factor authentication"}
            </Label>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleChange} />
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {!twoFactorEnabled
                    ? "Enable two factor authentication"
                    : "Disable two factor authentication"}
                </DialogTitle>
                <DialogDescription>
                  Please confirm your password to{" "}
                  {!twoFactorEnabled ? "enable" : "disable"} 2FA in your
                  account.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex flex-col gap-6'
                id='toggle-otp-form'
              >
                <FieldGroup>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className='gap-1'
                      >
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          {...field}
                          autoComplete='off'
                          aria-invalid={fieldState.invalid}
                          type='password'
                        />
                        <FieldError>{errors.password?.message}</FieldError>
                      </Field>
                    )}
                  />
                  <Field>
                    <Button
                      disabled={isSubmitting}
                      type='submit'
                      className='cursor-pointer'
                      id='toggle-otp-form'
                    >
                      {isSubmitting ? (
                        <Loader className='mr-2 h-4 w-4 animate-spin' />
                      ) : !twoFactorEnabled ? (
                        "Enable 2FA"
                      ) : (
                        "Disable 2FA"
                      )}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
