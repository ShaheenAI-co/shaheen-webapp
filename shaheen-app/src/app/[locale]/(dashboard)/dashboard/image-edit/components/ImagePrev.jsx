import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
//import { toast } from "sonner";
import { useMediaQuery } from 'react-responsive';


export const ImageUpload = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const handleFile = useCallback(
    (file) => {
      if (!file.type.startsWith("image/")) {
        //toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageUpload(e.target.result);
          //toast.success("Image uploaded successfully");
        }
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Upload Image
        </h3>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg text-center transition-all duration-200
            ${isMobile ? "p-6" : "p-8"}
            ${
              isDragOver
                ? "border-primary bg-primary/5 scale-105"
                : "border-border hover:border-muted-foreground hover:bg-muted/30"
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <div className="flex justify-center">
              {isDragOver ? (
                <ImageIcon
                  className={`${isMobile ? "h-8 w-8" : "h-12 w-12"} text-primary animate-pulse`}
                />
              ) : (
                <Upload
                  className={`${isMobile ? "h-8 w-8" : "h-12 w-12"} text-muted-foreground`}
                />
              )}
            </div>

            <div>
              <p
                className={`${isMobile ? "text-xs" : "text-sm"} font-medium text-foreground mb-1`}
              >
                {isDragOver
                  ? "Drop your image here"
                  : isMobile
                    ? "Tap to upload image"
                    : "Drag & drop an image here"}
              </p>
              {!isMobile && (
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="pointer-events-none"
            >
              Choose File
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Supported formats: JPG, PNG, GIF, WebP
      </div>
    </div>
  );
};
