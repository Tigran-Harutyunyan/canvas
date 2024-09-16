import { createUploadthing } from "uploadthing/h3";
import type { FileRouter } from "uploadthing/h3";

const f = createUploadthing();

/**
 * This is your Uploadthing file router. For more information:
 * @see https://docs.uploadthing.com/api-reference/server#file-routes
 */
export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", } })
    .onUploadComplete(({ file, metadata }) => {
      return file;
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;