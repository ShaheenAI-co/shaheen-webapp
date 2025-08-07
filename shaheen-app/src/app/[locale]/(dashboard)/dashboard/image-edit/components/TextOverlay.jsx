import { useState, useRef, useCallback, useEffect } from "react";
import { TextElement } from "./ImageEditor";

export const TextOverlay = ({ element, isSelected, onSelect, onUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({
    x: element.x,
    y: element.y,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    elementX: 0,
    elementY: 0,
  });
  const textRef = useRef(null);
  const inputRef = useRef(null);

  const handleMouseDown = useCallback(
    (e) => {
      if (isEditing) return;

      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        elementX: element.x,
        elementY: element.y,
      });
      onSelect();
    },
    [element.x, element.y, onSelect, isEditing]
  );

  // Touch event handlers for mobile
  const handleTouchStart = useCallback(
    (e) => {
      if (isEditing) return;

      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX,
        y: touch.clientY,
        elementX: element.x,
        elementY: element.y,
      });
      onSelect();
    },
    [element.x, element.y, onSelect, isEditing]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newX = Math.max(0, dragStart.elementX + deltaX);
      const newY = Math.max(0, dragStart.elementY + deltaY);

      setDragPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;

      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const newX = Math.max(0, dragStart.elementX + deltaX);
      const newY = Math.max(0, dragStart.elementY + deltaY);

      setDragPosition({ x: newX, y: newY });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      // Only update the actual element position when dragging ends
      onUpdate({
        x: dragPosition.x,
        y: dragPosition.y,
      });
    }
    setIsDragging(false);
  }, [isDragging, dragPosition, onUpdate]);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleTextChange = useCallback(
    (e) => {
      onUpdate({ text: e.target.value });
    },
    [onUpdate]
  );

  const handleTextBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  }, []);

  // Sync drag position when element position changes externally
  useEffect(() => {
    if (!isDragging) {
      setDragPosition({ x: element.x, y: element.y });
    }
  }, [element.x, element.y, isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const textStyle = {
    fontSize: `${element.fontSize}px`,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight,
    fontStyle: element.fontStyle,
    textAlign: element.textAlign,
    textShadow: "var(--shadow-text)",
  };

  return (
    <div
      ref={textRef}
      style={{
        position: "absolute",
        left: `${isDragging ? dragPosition.x : element.x}px`,
        top: `${isDragging ? dragPosition.y : element.y}px`,
        cursor: isDragging ? "grabbing" : isEditing ? "text" : "grab",
        zIndex: isSelected ? 10 : 1,
        transition: isDragging ? "none" : "var(--transition-smooth)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      className={`
        select-none min-w-[60px] will-change-transform touch-none
        ${isSelected ? "ring-2 ring-primary ring-opacity-50" : ""}
        ${isDragging ? "opacity-90 scale-105" : ""}
      `}
    >
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={element.text}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={handleKeyDown}
          style={{
            ...textStyle,
            backgroundColor: "transparent",
            border: "2px dashed hsl(var(--primary))",
            borderRadius: "4px",
            padding: "4px",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: "1.2",
            minHeight: `${element.fontSize * 1.2}px`,
          }}
          className="bg-transparent"
        />
      ) : (
        <div
          style={textStyle}
          className={`
            whitespace-pre-wrap break-words leading-tight
            hover:opacity-90 transition-opacity
            ${isSelected ? "ring-2 ring-primary ring-opacity-30 ring-offset-1" : ""}
          `}
        >
          {element.text}
        </div>
      )}
    </div>
  );
};
