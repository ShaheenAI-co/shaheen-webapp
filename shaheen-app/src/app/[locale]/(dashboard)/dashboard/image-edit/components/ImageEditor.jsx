"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { ImageUpload } from "./ImagePrev";
import { TextOverlay } from "./TextOverlay";
import { TextControls } from "./TextControls";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Download, Plus, Type, Settings, Menu } from "lucide-react";
import html2canvas from "html2canvas";
import { useMediaQuery } from "react-responsive";

export const ImageEditor = ({ imageUrl = null, onImageChange = null }) => {
  const [uploadedImage, setUploadedImage] = useState(imageUrl);
  const [textElements, setTextElements] = useState([]); // to store all the text layers
  const [selectedTextId, setSelectedTextId] = useState(null); // points to the current selected text layer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const workspaceRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
    if (isMobile) setSidebarOpen(false);
    // Notify parent component if callback is provided
    if (onImageChange) {
      onImageChange(null);
    }
  }, [isMobile, onImageChange]);

  const selectedElement = textElements.find((el) => el.id === selectedTextId);

  const SidebarContent = () => (
    <div className="space-y-6">
      {!uploadedImage ? (
        <ImageUpload onImageUpload={handleImageUpload} />
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Image</h3>
            <div className="relative group">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              <Button
                onClick={handleImageRemove}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </Button>
            </div>
          </div>

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
              <h3 className="text-sm font-medium text-white mb-3">
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
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTextId === element.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <p className="text-sm truncate">{element.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const exportImage = useCallback(async () => {
    if (!workspaceRef.current || !uploadedImage) {
      toast.error("No image to export");
      return;
    }

    try {
      const canvas = await html2canvas(workspaceRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true, // Added for S3 images
      });

      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = canvas.toDataURL();
      link.click();
      toast.success("Image exported successfully");
    } catch (error) {
      toast.error("Failed to export image");
      console.error("Export error:", error);
    }
  }, [uploadedImage]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="  px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
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
            <h1 className="text-lg lg:text-xl font-semibold text-white">
              {isMobile ? "Text Editor" : "Image Text Editor"}
            </h1>
          </div>
          <div className="flex items-center gap-1 lg:gap-2">
            <Button
              onClick={addTextElement}
              disabled={!uploadedImage}
              variant="secondary"
              size={isMobile ? "sm" : "default"}
              className="gap-1 bg-[#7F4BF3] hover:bg-[#ad8cf5] text-white lg:gap-2"
            >
              <Plus className="h-4 w-4" />
              {!isMobile && "Add Text"}
            </Button>
            <Button
              onClick={exportImage}
              disabled={!uploadedImage}
              variant="primary"
              size={isMobile ? "sm" : "default"}
              className="gap-1 lg:gap-2 "
            >
              <Download className="h-4 w-4" />
              {!isMobile && "Export"}
            </Button>
            {isMobile &&
              selectedElement && ( // Mobile Sidebar
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 overflow-y-auto">
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

      <div className="flex flex-1 min-h-0">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-80 border-r border-border bg-black p-6 overflow-y-auto flex-shrink-0">
            <SidebarContent />
          </div>
        )}

        {/* Workspace */}
        <div className="flex-1 bg-workspace p-2 lg:p-8 overflow-auto">
          <div className="flex items-center justify-center min-h-full">
            {uploadedImage ? (
              <div
                ref={workspaceRef}
                className="relative bg-white rounded-lg shadow-editor overflow-hidden max-w-full"
                style={{
                  maxWidth: isMobile ? "100%" : "800px",
                  maxHeight: isMobile ? "calc(100vh - 200px)" : "600px",
                }}
              >
                <img
                  src={uploadedImage}
                  alt="Editing"
                  className="max-w-full max-h-full block"
                  draggable={false}
                  crossOrigin="anonymous" // Added for S3 CORS support
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
              <div className="text-center px-4">
                <Type className="h-12 lg:h-16 w-12 lg:w-16 text-workspace-foreground/30 mx-auto mb-4" />
                <p className="text-base lg:text-lg text-workspace-foreground/70">
                  {isMobile
                    ? "Upload an image to start"
                    : "Upload an image to start editing"}
                </p>
                {isMobile && (
                  <Button
                    onClick={() => setSidebarOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
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
