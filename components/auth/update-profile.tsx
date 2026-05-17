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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "../image-upload";
import { updateProfile } from "@/actions/update-profile";

interface ProfileFormProps {
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  username: string;
}

const profileSchema = z.object({
  firstName: z
    .string({ error: "First name is required." })
    .check(z.minLength(2, { error: "Please enter valid first name." })),
  lastName: z
    .string({ error: "Last name is required." })
    .check(z.minLength(2, { error: "Please enter valid last name." })),
  email: z.email(),
  username: z.string(),
  image: z.string().nullable().optional(),
});
type ProfileSchema = z.infer<typeof profileSchema>;
export function UpdateProfile({
  firstName,
  lastName,
  email,
  image,
  username,
}: ProfileFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isDirty },
    control,
    reset,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email,
      firstName,
      lastName,
      image,
      username,
    },
  });

  const onSubmit: SubmitHandler<ProfileSchema> = async (
    data: ProfileSchema,
  ) => {
    if (!isDirty) {
      toast.info("No changes made");
      return;
    }
    try {
      await updateProfile({
        name: `${data.firstName} ${data.lastName}`,
        image: data.image ?? null,
      });
      toast.success("Profile updated successfully");
      reset();
    } catch (error) {
      console.log("Update profile error-----", error);
      toast.error("Something went wrong, please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 w-full")}>
      <Card>
        <CardHeader className='text-left'>
          <CardTitle className='text-xl'>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className='flex flex-col gap-3'>
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
                  disabled
                  {...register("email")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor='username'>Username</FieldLabel>
                <Input id='username' disabled {...register("username")} />
              </Field>
              <Controller
                name='image'
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='image'>Image</FieldLabel>
                    <ImageUpload
                      endpoint='imageUploader'
                      defaultUrl={field.value ?? null}
                      onChange={(url) => field.onChange(url)}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
              <Field>
                <Button
                  disabled={isSubmitting}
                  type='submit'
                  className='cursor-pointer'
                >
                  {isSubmitting && (
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  {isSubmitting ? "Updating your profile..." : "Update Profile"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
