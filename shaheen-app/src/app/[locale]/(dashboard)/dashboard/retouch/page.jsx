"use client";
import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Palette,
  Sparkles,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Settings,
  Image as ImageIcon,
  Filter,
  Brush,
  Eraser,
  Droplets,
  Sun,
  Moon,
  Contrast,
  Layers,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const RetouchPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [activeTool, setActiveTool] = useState("select");
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const fileInputRef = useRef(null);

  // Image adjustments
  const [adjustments, setAdjustments] = useState({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    vibrance: 0,
    sharpness: 0,
    noise: 0,
    grain: 0,
  });

  // Filters
  const [activeFilter, setActiveFilter] = useState("none");
  const [filterIntensity, setFilterIntensity] = useState(50);

  const filters = [
    { name: "none", label: "Original" },
    { name: "vintage", label: "Vintage" },
    { name: "blackwhite", label: "Black & White" },
    { name: "sepia", label: "Sepia" },
    { name: "cool", label: "Cool" },
    { name: "warm", label: "Warm" },
    { name: "dramatic", label: "Dramatic" },
    { name: "soft", label: "Soft" },
    { name: "sharp", label: "Sharp" },
    { name: "fade", label: "Fade" },
  ];

  const tools = [
    {
      id: "select",
      icon: "👆",
      label: "Select",
      description: "Select and move elements",
    },
    {
      id: "crop",
      icon: "✂️",
      label: "Crop",
      description: "Crop and resize image",
    },
    {
      id: "brush",
      icon: "🖌️",
      label: "Brush",
      description: "Paint and retouch",
    },
    {
      id: "eraser",
      icon: "🧽",
      label: "Eraser",
      description: "Erase parts of image",
    },
    { id: "heal", icon: "🩹", label: "Heal", description: "Remove blemishes" },
    {
      id: "clone",
      icon: "🔄",
      label: "Clone",
      description: "Clone stamp tool",
    },
    {
      id: "blur",
      icon: "💫",
      label: "Blur",
      description: "Blur selected areas",
    },
    {
      id: "sharpen",
      icon: "✨",
      label: "Sharpen",
      description: "Sharpen selected areas",
    },
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setSelectedImage(file);
        addToHistory(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToHistory = (imageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setImageUrl(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setImageUrl(history[historyIndex + 1]);
    }
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      clarity: 0,
      vibrance: 0,
      sharpness: 0,
      noise: 0,
      grain: 0,
    });
  };

  const applyAdjustment = (key, value) => {
    setAdjustments((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "retouched-image.png";
      link.click();
    }
  };

  const getFilterStyle = () => {
    if (activeFilter === "none") return {};

    const intensity = filterIntensity / 100;
    const filters = {
      vintage: `sepia(${intensity}) contrast(${1 + intensity * 0.3})`,
      blackwhite: `grayscale(1)`,
      sepia: `sepia(${intensity})`,
      cool: `hue-rotate(${intensity * 30}deg) saturate(${1 + intensity * 0.2})`,
      warm: `sepia(${intensity * 0.5}) hue-rotate(${intensity * 15}deg)`,
      dramatic: `contrast(${1 + intensity * 0.5}) brightness(${1 - intensity * 0.1})`,
      soft: `blur(${intensity * 2}px) brightness(${1 + intensity * 0.1})`,
      sharp: `contrast(${1 + intensity * 0.3}) saturate(${1 + intensity * 0.2})`,
      fade: `opacity(${0.7 + intensity * 0.3}) contrast(${1 - intensity * 0.2})`,
    };

    return { filter: filters[activeFilter] };
  };

  return (
    <div className="px-12 pt-6 bg-[#0f0f0f] min-h-screen">
      <div className="mt-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize satoshi-bold">
              Image Retouch
            </h2>
            <p className="text-white/60 mt-1">
              Professional image editing and retouching
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button
              onClick={downloadImage}
              disabled={!imageUrl}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="space-y-4">
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brush className="w-5 h-5" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                      activeTool === tool.id
                        ? "bg-purple-500/20 border border-purple-500/30 text-black bg-white"
                        : "text-black bg-white/90 hover:bg-white hover:text-black"
                    )}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className="font-medium">{tool.label}</div>
                      <div className="text-xs opacity-70">
                        {tool.description}
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* History */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                    className="flex-1 border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                    className="flex-1 border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetAdjustments}
                  className="w-full border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Canvas</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      className="border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                    >
                      {showBeforeAfter ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      Before/After
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {imageUrl ? (
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-lg bg-white/5 border border-white/10">
                      <img
                        src={imageUrl}
                        alt="Retouch canvas"
                        className="w-full h-auto max-h-[600px] object-contain"
                        style={getFilterStyle()}
                      />
                    </div>
                    {showBeforeAfter && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ImageIcon className="w-16 h-16 text-white/20 mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      No Image Selected
                    </h3>
                    <p className="text-white/60 mb-4">
                      Upload an image to start retouching
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Adjustments Panel */}
          <div className="space-y-4">
            {/* Filters */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.name}
                      onClick={() => setActiveFilter(filter.name)}
                      className={cn(
                        "p-2 rounded text-sm transition-colors",
                        activeFilter === filter.name
                          ? "bg-purple-500/20 border border-purple-500/30 text-black bg-white"
                          : "bg-white/90 text-black hover:bg-white hover:text-black"
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {activeFilter !== "none" && (
                  <div>
                    <Label className="text-black text-sm bg-white/90 px-2 py-1 rounded">
                      Intensity
                    </Label>
                    <Slider
                      value={[filterIntensity]}
                      onValueChange={([value]) => setFilterIntensity(value)}
                      max={100}
                      step={1}
                      className="mt-2 [&>div]:bg-white/20 [&>div>div]:bg-purple-500 [&>div>div+div]:bg-white [&>div>div+div]:border-purple-500"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Adjustments */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Adjustments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(adjustments).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-black text-sm capitalize bg-white/90 px-2 py-1 rounded">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <span className="text-black text-xs bg-white/90 px-2 py-1 rounded">
                        {value}
                      </span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) =>
                        applyAdjustment(key, newValue)
                      }
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full [&>div]:bg-white/20 [&>div>div]:bg-purple-500 [&>div>div+div]:bg-white [&>div>div+div]:border-purple-500"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/10 border border-white/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Rotate Left
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Rotate Right
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                >
                  <ZoomIn className="w-4 h-4 mr-2" />
                  Zoom In
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/20 text-black bg-white/90 hover:bg-white hover:text-black"
                >
                  <ZoomOut className="w-4 h-4 mr-2" />
                  Zoom Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default RetouchPage;
