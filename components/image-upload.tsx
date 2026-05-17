"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  defaultUrl?: string | null;
  onChange?: (url: string | null) => void;
  endpoint: keyof OurFileRouter;
}

export function ImageUpload({
  defaultUrl,
  onChange,
  endpoint,
}: ImageUploadProps) {
  const [value, setValue] = useState<string | null>(defaultUrl ?? null);
  const [showDropzone, setShowDropzone] = useState<boolean>(!defaultUrl);

  const handleChangeImage = (url: string | null) => {
    setValue(url);
    onChange?.(url);
  };

  const handleDeleteImage = () => {
    setShowDropzone(true);
    handleChangeImage(null);
  };

  if (!showDropzone && value) {
    return (
      <div className='relative'>
        <div className='relative size-50 border shadow-lg overflow-hidden'>
          <Image src={value} className='object-cover' fill alt='user image' />
        </div>

        <div className='mt-3 flex gap-2'>
          <Trash
            onClick={handleDeleteImage}
            className='absolute rounded-full left-60 cursor-pointer top-0 text-rose-600'
          />
        </div>
      </div>
    );
  }
  return (
    <main className='flex flex-col items-center justify-between mb-4'>
      <UploadDropzone
        endpoint={endpoint}
        content={{
          label: value
            ? "Drop or click to replace the image"
            : "Drop or click to upload an image",
        }}
        appearance={{
          container: "rounded-xl border",
          button: "!bg-neutral-700",
        }}
        onClientUploadComplete={(res) => {
          const url = res?.[0]?.ufsUrl;

          if (url) {
            setShowDropzone(false);
            handleChangeImage(url);
          }
        }}
      />
    </main>
  );
}
