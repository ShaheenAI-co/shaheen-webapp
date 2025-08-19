"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImageUpload } from "./ImagePrev";
import { TextOverlay } from "./TextOverlay";
import { TextControls } from "./TextControls";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Plus, Type, Settings, Menu, Sparkle } from "lucide-react";
import html2canvas from "html2canvas";
import { useMediaQuery } from "react-responsive";
import { useRouter, usePathname } from "next/navigation";

export const ImageEditor = ({ imageUrl = null, onImageChange = null, productInfo = null }) => {
  const [uploadedImage, setUploadedImage] = useState(imageUrl);
  const [textElements, setTextElements] = useState([]); // to store all the text layers
  const [selectedTextId, setSelectedTextId] = useState(null); // points to the current selected text layer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const workspaceRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  // Update uploadedImage when imageUrl prop changes
  useEffect(() => {
    if (imageUrl) {
      setUploadedImage(imageUrl);
      // Notify parent component if callback is provided
      if (onImageChange) {
        onImageChange(imageUrl);
      }
    }
  }, [imageUrl, onImageChange]);

  const generateAIText = async () => {
    if (!uploadedImage || !productInfo) {
      console.error("No image or product info available for AI text generation");
      return;
    }

    setIsGeneratingText(true);

    try {
      console.log("Generating AI text for:", { uploadedImage, productInfo });

      const response = await fetch("/api/generate-text-overlay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          productInfo: productInfo
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to generate text overlay");
      }

      console.log("AI generated text overlay:", result.textOverlay);

      // Create a new text element with the AI-generated properties
      const newTextElement = {
        id: `ai-text-${Date.now()}`,
        text: result.textOverlay.text,
        x: result.textOverlay.x,
        y: result.textOverlay.y,
        fontSize: result.textOverlay.fontSize,
        fontFamily: result.textOverlay.fontFamily,
        color: result.textOverlay.color,
        fontWeight: result.textOverlay.fontWeight,
        fontStyle: "normal",
        textAlign: result.textOverlay.textAlign,
      };

      // Add the new AI-generated text element
      setTextElements((prev) => [...prev, newTextElement]);
      setSelectedTextId(newTextElement.id);

      console.log("AI text element added successfully:", newTextElement);

    } catch (error) {
      console.error("AI text generation error:", error);
      alert(`Failed to generate AI text: ${error.message}`);
    } finally {
      setIsGeneratingText(false);
    }
  };

  const addTextElement = useCallback(() => {
    // function create a text element
    const newElement = {
      id: `text-${Date.now()}`,
      text: "Add your text here",
      x: 100,
      y: 100,
      fontSize: 24,
      fontFamily: "Inter, sans-serif",
      color: "#ffffff",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
    };
    setTextElements((prev) => [...prev, newElement]);
    setSelectedTextId(newElement.id);
  }, []);

  const updateTextElement = useCallback((id, updates) => {
    setTextElements(
      (prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)) // If text elements ID matches the one we want to update Replace it with a new object combining the old and new values.
    );
  }, []);

  const deleteTextElement = useCallback(
    (id) => {
      setTextElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedTextId === id) {
        setSelectedTextId(null);
      }
    },
    [selectedTextId]
  );

  const handleImageUpload = useCallback(
    (newImage) => {
      setUploadedImage(newImage);
      // Notify parent component if callback is provided
      if (onImageChange) {
        onImageChange(newImage);
      }
    },
    [onImageChange]
  );

  const handleImageRemove = useCallback(() => {
    setUploadedImage(null);
    setTextElements([]);
    setSelectedTextId(null);
    setImageDimensions({ width: 0, height: 0 });
    if (isMobile) setSidebarOpen(false);
    // Notify parent component if callback is provided
    if (onImageChange) {
      onImageChange(null);
    }
  }, [isMobile, onImageChange]);

  const handleImageLoad = useCallback(
    (event) => {
      const img = event.target;
      const { naturalWidth, naturalHeight } = img;

      // Calculate responsive dimensions while maintaining aspect ratio
      // Mobile: Account for smaller screen size and padding
      const maxContainerWidth = isMobile ? window.innerWidth - 32 : 800; // Account for padding
      const maxContainerHeight = isMobile ? window.innerHeight - 200 : 600;

      let displayWidth = naturalWidth;
      let displayHeight = naturalHeight;

      // Scale down if image is larger than container
      if (displayWidth > maxContainerWidth) {
        const scale = maxContainerWidth / displayWidth;
        displayWidth = maxContainerWidth;
        displayHeight = naturalHeight * scale;
      }

      if (displayHeight > maxContainerHeight) {
        const scale = maxContainerHeight / displayHeight;
        displayHeight = maxContainerHeight;
        displayWidth = displayWidth * scale;
      }

      setImageDimensions({ width: displayWidth, height: displayHeight });
      console.log("Image loaded successfully", {
        naturalWidth,
        naturalHeight,
        displayWidth,
        displayHeight,
      });
    },
    [isMobile]
  );

  const selectedElement = textElements.find((el) => el.id === selectedTextId);

  const SidebarContent = () => (
    <div className="space-y-4 sm:space-y-6">
      {!uploadedImage ? (
        <ImageUpload onImageUpload={handleImageUpload} />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white mb-2 sm:mb-3">
              Image
            </h3>
            <div className="relative group">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border"
              />
              <Button
                onClick={handleImageRemove}
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm"
              >
                Remove
              </Button>
            </div>
          </div>

          {/* AI Text Generation Section - Only show when product info is available */}
          {productInfo && (
            <div>
              <h3 className="text-sm font-medium text-white mb-2 sm:mb-3">
                AI Text Generation
              </h3>
              <Button
                onClick={generateAIText}
                disabled={isGeneratingText}
                variant="primary"
                size="sm"
                className="w-full gap-2 bg-[#FF6B35] hover:bg-[#ff8a5c] text-white"
              >
                {isGeneratingText ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkle className="h-4 w-4" />
                    Generate AI Text
                  </>
                )}
              </Button>
              <p className="text-xs text-white/60 mt-2">
                Generate Arabic marketing text with AI
              </p>
            </div>
          )}

          {selectedElement && (
            <TextControls
              textElement={selectedElement}
              onUpdate={(updates) =>
                updateTextElement(selectedElement.id, updates)
              }
              onDelete={() => {
                deleteTextElement(selectedElement.id);
                if (isMobile) setSidebarOpen(false);
              }}
            />
          )}

          {textElements.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-white mb-2 sm:mb-3">
                Text Layers
              </h3>
              <div className="space-y-2">
                {textElements.map((element) => (
                  <div
                    key={element.id}
                    onClick={() => {
                      setSelectedTextId(element.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTextId === element.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <p className="text-xs sm:text-sm truncate">
                      {element.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const saveAndNavigate = useCallback(async () => {
    if (!workspaceRef.current || !uploadedImage) {
      console.error("No image to save");
      return;
    }

    setIsSaving(true);

    try {
      console.log("Saving edited image...");

      // Temporarily override CSS variables to avoid oklch colors
      const originalRoot = document.documentElement.style;
      const originalVars = {};

      // Store original CSS variables
      const cssVars = [
        "--background",
        "--foreground",
        "--card",
        "--card-foreground",
        "--popover",
        "--popover-foreground",
        "--primary",
        "--primary-foreground",
        "--secondary",
        "--secondary-foreground",
        "--muted",
        "--muted-foreground",
        "--accent",
        "--accent-foreground",
        "--destructive",
        "--border",
        "--input",
        "--ring",
        "--sidebar",
        "--sidebar-foreground",
      ];

      cssVars.forEach((varName) => {
        const value = getComputedStyle(
          document.documentElement
        ).getPropertyValue(varName);
        if (value && value.includes("oklch")) {
          originalVars[varName] = value;
          // Replace with standard colors
          if (varName.includes("foreground") || varName.includes("text")) {
            document.documentElement.style.setProperty(varName, "#ffffff");
          } else if (varName.includes("background")) {
            document.documentElement.style.setProperty(varName, "transparent");
          } else if (varName.includes("border")) {
            document.documentElement.style.setProperty(varName, "#ffffff");
          } else {
            document.documentElement.style.setProperty(varName, "#ffffff");
          }
        }
      });

      // Ensure custom web fonts are loaded before rendering to canvas
      try {
        if (document.fonts && document.fonts.status !== "loaded") {
          const uniqueFamilies = Array.from(
            new Set(textElements.map((el) => el.fontFamily).filter(Boolean))
          );
          const fontLoadPromises = uniqueFamilies.map((family) => {
            // Attempt to load with a reasonable default size
            return document.fonts.load(`24px ${family}`);
          });
          await Promise.allSettled(fontLoadPromises);
          await document.fonts.ready;
        }
      } catch (e) {
        console.warn("Font preloading failed or unsupported:", e);
      }

      const canvas = await html2canvas(workspaceRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      // Restore original CSS variables
      Object.keys(originalVars).forEach((varName) => {
        document.documentElement.style.setProperty(
          varName,
          originalVars[varName]
        );
      });

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 0.95);
      });

      // Create FormData to upload the edited image
      const formData = new FormData();
      formData.append("file", blob, "edited-image.png");

      // Upload the edited image to S3
      const uploadResponse = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(`Upload failed: ${uploadResult.error}`);
      }

      const editedImageUrl = uploadResult.s3Url;
      console.log("Edited image uploaded:", editedImageUrl);

      // Navigate to Final-image page with the edited image URL
      router.push(
        `/${locale}/dashboard/generate/Final-Image?imageUrl=${encodeURIComponent(editedImageUrl)}&originalImageUrl=${encodeURIComponent(uploadedImage)}`
      );
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [uploadedImage, router, locale]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Responsive Header - Stacks vertically on mobile, horizontal on desktop */}
      <header className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-2 lg:gap-3">
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
              <Type className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-white">
              {isMobile ? "Text Editor" : "Image Text Editor"}
            </h1>
          </div>

          {/* MOBILE RIGHT SIDE - Action buttons */}
          <div className="flex items-center gap-1 lg:gap-2 justify-center sm:justify-end">
            <Button
              onClick={addTextElement}
              disabled={!uploadedImage}
              variant="primary"
              size="sm"
              className="gap-1 bg-[#7F4BF3] hover:bg-[#ad8cf5] text-white lg:gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              {!isMobile && "Add Text"}
            </Button>
            
            {/* AI Text Generation Button - Only show when product info is available */}
            {productInfo && (
              <Button
                onClick={generateAIText}
                disabled={!uploadedImage || isGeneratingText}
                variant="primary"
                size="sm"
                className="gap-1 bg-[#FF6B35] hover:bg-[#ff8a5c] text-white lg:gap-2 text-xs sm:text-sm"
              >
                {isGeneratingText ? (
                  <>
                    <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {!isMobile && "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {!isMobile && "AI Text"}
                  </>
                )}
              </Button>
            )}
            
            <Button
              onClick={saveAndNavigate}
              disabled={!uploadedImage || isSaving}
              variant="primary"
              size="sm"
              className="gap-1 lg:gap-2 text-xs sm:text-sm"
            >
              {isSaving ? (
                <>
                  <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {!isMobile && "Saving..."}
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  {!isMobile && "Save"}
                </>
              )}
            </Button>
            {isMobile &&
              selectedElement && ( // Mobile Sidebar
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white "
                    >
                      <Settings className="h-3 w-3  sm:h-4 sm:w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 px-4 py-8 overflow-y-auto bg-[#0f0f0f]"
                  >
                    <TextControls
                      textElement={selectedElement}
                      onUpdate={(updates) =>
                        updateTextElement(selectedElement.id, updates)
                      }
                      onDelete={() => deleteTextElement(selectedElement.id)}
                    />
                  </SheetContent>
                </Sheet>
              )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Flex layout that adapts to screen size */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar - Hidden on mobile, shown on desktop */}
        {!isMobile && (
          <div className="w-80 border-r border-border bg-[#0f0f0f] p-4 sm:p-6 overflow-y-auto flex-shrink-0">
            <SidebarContent />
          </div>
        )}

        {/* Workspace - Takes full width on mobile, remaining space on desktop */}
        <div className="flex-1 bg-workspace p-2 sm:p-4 lg:p-8 overflow-auto">
          <div className="flex items-center justify-center min-h-full">
            {uploadedImage || imageUrl ? (
              <div
                ref={workspaceRef}
                className="relative bg-white rounded-lg shadow-editor overflow-hidden"
                style={{
                  width: imageDimensions.width || "auto",
                  height: imageDimensions.height || "auto",
                  // Responsive max dimensions - smaller on mobile
                  maxWidth: isMobile ? "calc(100vw - 32px)" : "800px",
                  maxHeight: isMobile ? "calc(100vh - 180px)" : "600px",
                }}
              >
                <img
                  src={uploadedImage || imageUrl}
                  alt="Editing"
                  className="block w-full h-full"
                  draggable={false}
                  crossOrigin="anonymous" // Added for S3 CORS support
                  onLoad={handleImageLoad}
                  onError={(e) => {
                    console.error("Image failed to load:", e);
                    console.error(
                      "Failed image URL:",
                      uploadedImage || imageUrl
                    );
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
                {textElements.map((element) => (
                  <TextOverlay
                    key={element.id}
                    element={element}
                    isSelected={selectedTextId === element.id}
                    onSelect={() => setSelectedTextId(element.id)}
                    onUpdate={(updates) =>
                      updateTextElement(element.id, updates)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center px-4 sm:px-6">
                <Type className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-workspace-foreground/30 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base lg:text-lg text-workspace-foreground/70 mb-4 sm:mb-6">
                  {isMobile
                    ? "Upload an image to start"
                    : "Upload an image to start editing"}
                </p>
                {isMobile && (
                  <Button
                    onClick={() => setSidebarOpen(true)}
                    className="mt-2 sm:mt-4 bg-[#7F4BF3] hover:bg-[#ad8cf5] text-white"
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Upload Image
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
