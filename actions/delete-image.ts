"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteImage(fileKey: string) {
  await utapi.deleteFiles(fileKey);
}
