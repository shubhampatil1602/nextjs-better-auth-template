"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { signUp } from "@/actions/sign-up";

const signUpSchema = z.object({
  firstName: z
    .string({ error: "First name is required." })
    .check(z.minLength(2, { error: "Please enter valid first name." }))
    .trim(),
  lastName: z
    .string({ error: "Last name is required." })
    .check(z.minLength(2, { error: "Please enter valid last name." }))
    .trim(),
  email: z
    .email({
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      error: "Please enter a valid email address.",
    })
    .trim(),
  password: z
    .string({ error: "Password is required." })
    .check(z.minLength(6, { error: "Password must be at least 6 characters." }))
    .trim(),
});
type SignUpSchema = z.infer<typeof signUpSchema>;
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpSchema> = async (data: SignUpSchema) => {
    // try {
    //   await authClient.signUp.email(
    //     {
    //       email: data.email,
    //       password: data.password,
    //       name: `${data.firstName} ${data.lastName}`,
    //     },
    //     {
    //       onSuccess: async () => {
    //         toast.success(
    //           "Account created successfully. Please verify your email.",
    //         );
    //         reset();
    //       },
    //       onError: (ctx) => {
    //         console.log("Sign up ctx error-----", ctx);
    //         toast.error(ctx.error.message);
    //       },
    //     },
    //   );
    // } catch (error) {
    //   console.log("Sign up error-----", error);
    //   toast.error("Something went wrong, please try again.");
    // }
    try {
      const response = await signUp({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success("Account created successfully. Please verify your email.");

      reset();
    } catch {
      toast.error("Something went wrong, please try again.");
    }
  };

  const authWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const authWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
    });
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card>
        <CardHeader className='text-left'>
          <CardTitle className='text-xl'>Sign Up</CardTitle>
          <CardDescription>
            Enter your email below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='flex flex-col gap-3'>
              <Field className='grid grid-cols-2'>
                <Button
                  variant='outline'
                  type='button'
                  onClick={authWithGithub}
                  className='cursor-pointer'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
                      fill='currentColor'
                    />
                  </svg>
                  Login with Github
                </Button>
                <Button
                  variant='outline'
                  type='button'
                  onClick={authWithGoogle}
                  className='cursor-pointer'
                >
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                    <path
                      d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
                      fill='currentColor'
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className='*:data-[slot=field-separator-content]:bg-card my-1'>
                Or continue with
              </FieldSeparator>
              <div className='flex gap-4'>
                <Field>
                  <FieldLabel htmlFor='firstname'>First Name</FieldLabel>
                  <Input
                    id='firstname'
                    type='text'
                    placeholder='Jameel'
                    {...register("firstName")}
                  />
                  {<FieldError>{errors.firstName?.message}</FieldError>}
                </Field>
                <Field>
                  <FieldLabel htmlFor='lastname'>Last Name</FieldLabel>
                  <Input
                    id='lastname'
                    type='text'
                    placeholder='Jamali'
                    {...register("lastName")}
                  />
                  <FieldError>{errors.lastName?.message}</FieldError>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register("email")}
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  {...register("password")}
                />
                <FieldError>{errors.password?.message}</FieldError>
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
                  {isSubmitting ? "Signing up..." : "Sign Up"}
                </Button>
                <FieldDescription className='text-center'>
                  Already have an account? <Link href='/sign-in'>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className='px-6 text-center'>
        By clicking continue, you agree to our <a href='#'>Terms of Service</a>{" "}
        and <a href='#'>Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
