import { TextElement } from "./ImageEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";

const FONT_OPTIONS = [
  // Custom fonts registered via @font-face
  { value: '"Alexandria", sans-serif', label: "Alexandria" },

  // System / common web fonts
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: '"Times New Roman", serif', label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: '"Playfair Display", serif', label: "Playfair Display" },
  { value: '"Open Sans", sans-serif', label: "Open Sans" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: '"Montserrat", sans-serif', label: "Montserrat" },
  { value: '"Poppins", sans-serif', label: "Poppins" },
  { value: '"Dancing Script", cursive', label: "Dancing Script" },
  { value: '"Courier New", monospace', label: "Courier New" },
  { value: "Impact, sans-serif", label: "Impact" },
];

export const TextControls = ({ textElement, onUpdate, onDelete, t }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">
          {t("textProperties")}
        </h3>
        <button
          onClick={onDelete}
          variant="destructive"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Text Content */}
        <div>
          <Label htmlFor="text-content" className="text-xs text-white">
            {t("text")}
          </Label>
          <Input
            id="text-content"
            value={textElement.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder={t("enterText")}
            className="mt-1"
          />
        </div>

        {/* Font Family */}
        <div>
          <Label className="text-xs text-white mb-2 block">
            {t("fontFamily")}
          </Label>
          <Select
            value={textElement.fontFamily}
            onValueChange={(value) => onUpdate({ fontFamily: value })}
          >
            <SelectTrigger className="mt-1">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem
                  key={font.value}
                  value={font.value}
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div>
          <Label className="text-xs text-white mb-2 block">
            {t("fontSize")}: {textElement.fontSize}px
          </Label>
          <Slider
            value={[textElement.fontSize]}
            onValueChange={(value) => onUpdate({ fontSize: value[0] })}
            min={12}
            max={120}
            step={1}
            className="mt-1 "
          />
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="text-color" className="text-xs text-white">
            {t("color")}
          </Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="text-color"
              type="color"
              value={textElement.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              className="w-12 h-8 p-1 cursor-pointer"
            />
            <Input
              value={textElement.color}
              onChange={(e) => onUpdate({ color: e.target.value })}
              placeholder="#ffffff"
              className="flex-1"
            />
          </div>
        </div>

        {/* Style Controls */}
        <div>
          <Label className="text-xs text-white mb-2 block">{t("style")}</Label>
          <div className="flex items-center gap-1">
            <Toggle
              pressed={textElement.fontWeight === "bold"}
              onPressedChange={(pressed) =>
                onUpdate({ fontWeight: pressed ? "bold" : "normal" })
              }
              size="sm"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={textElement.fontStyle === "italic"}
              onPressedChange={(pressed) =>
                onUpdate({ fontStyle: pressed ? "italic" : "normal" })
              }
              size="sm"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <Label className="text-xs text-white mb-2 block">
            {t("alignment")}
          </Label>
          <div className="flex items-center gap-1">
            <Toggle
              pressed={textElement.textAlign === "left"}
              onPressedChange={() => onUpdate({ textAlign: "left" })}
              size="sm"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={textElement.textAlign === "center"}
              onPressedChange={() => onUpdate({ textAlign: "center" })}
              size="sm"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
              pressed={textElement.textAlign === "right"}
              onPressedChange={() => onUpdate({ textAlign: "right" })}
              size="sm"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </div>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-2">
          {/* <div>
            <Label htmlFor="pos-x" className="text-xs text-white">
              {t("xPosition")}
            </Label>
            <Input
              id="pos-x"
              type="number"
              value={textElement.x}
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
              min={0}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-xs text-white">
              {t("yPosition")}
            </Label>
            <Input
              id="pos-y"
              type="number"
              value={textElement.y}
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
              min={0}
              className="mt-1"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};
