"use client";

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useFileUpload } from "@/Hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

// Utility function to convert HEIC to JPEG using canvas
const convertHeicToJpeg = async (file) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          const convertedFile = new File(
            [blob],
            file.name.replace(/\.(heic|heif)$/i, ".jpg"),
            {
              type: "image/jpeg",
              lastModified: Date.now(),
            }
          );
          resolve(convertedFile);
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load HEIC image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

// Function to check if file is HEIC/HEIF
const isHeicFile = (file) => {
  const fileName = file.name.toLowerCase();
  return (
    fileName.endsWith(".heic") ||
    fileName.endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
};

export default function ImageUpload({ onFileChange }) {
  const maxSizeMB = 20;
  const maxSize = maxSizeMB * 1024 * 1024; // 20MB default
  const t = useTranslations("ImageUpload");

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept:
      "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/heic,image/heif,.heic,.heif",
    maxSize,
    onFilesChange: async (files) => {
      // Process HEIC files if present
      const processedFiles = await Promise.all(
        files.map(async (fileData) => {
          if (isHeicFile(fileData.file)) {
            try {
              const convertedFile = await convertHeicToJpeg(fileData.file);
              return {
                ...fileData,
                file: convertedFile,
                originalFile: fileData.file, // Keep reference to original
              };
            } catch (error) {
              console.error("Failed to convert HEIC file:", error);
              return fileData; // Return original if conversion fails
            }
          }
          return fileData;
        })
      );

      // Call the callback with processed files
      if (onFileChange) {
        onFileChange(processedFiles);
      }
    },
  });

  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative w-full">
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className="border-input w-full max-w-[600px] mx-auto data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-62 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px]"
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label={t("uploadImage")}
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt={files[0]?.file?.name || t("uploadedImage")}
                className="mx-auto max-h-full rounded object-contain"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className=" mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              <p className="mb-1.5 text-sm font-medium">{t("dropImageHere")}</p>
              <p className="text-muted-foreground text-xs">
                {t("fileTypes", { maxSize: maxSizeMB })}
              </p>

              <Button
                variant="primary "
                className="mt-4 border-1"
                onClick={openFileDialog}
              >
                <UploadIcon
                  className="-ms-1 size-4 opacity-60"
                  aria-hidden="true"
                />
                {t("selectImage")}
              </Button>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label={t("removeImage")}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
      {/* <p
        aria-live="polite"
        role="region"
        className="text-muted-foreground mt-2 text-center text-xs">
        Single image uploader w/ max size (drop area + button) ∙{" "}
        <a
          href="https://github.com/origin-space/originui/tree/main/docs/use-file-upload.md"
          className="hover:text-foreground underline">
          API
        </a>
      </p> */}
    </div>
  );
}
