"use client";

import { useRef, useEffect, useCallback, useState } from "react";

export interface PixelGridProps {
  /** Pixel data as 2D boolean array [row][col] */
  pixels: boolean[][];
  /** Scale factor (pixels per grid cell) */
  scale?: number;
  /** Show grid lines between pixels */
  showGrid?: boolean;
  /** Grid line color */
  gridColor?: string;
  /** Grid line thickness in pixels */
  gridThickness?: number;
  /** Foreground (on) pixel color */
  foregroundColor?: string;
  /** Background (off) pixel color */
  backgroundColor?: string;
  /** Callback when a pixel is clicked (isRightClick indicates right mouse button) */
  onPixelClick?: (row: number, col: number, isRightClick?: boolean) => void;
  /** Callback during pixel drag */
  onPixelDrag?: (row: number, col: number) => void;
  /** Callback when drag ends */
  onDragEnd?: () => void;
  /** Callback when mouse hovers over a pixel (for coordinate display) */
  onPixelHover?: (row: number, col: number) => void;
  /** Callback when mouse leaves the canvas */
  onPixelLeave?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Whether clicking is enabled */
  interactive?: boolean;
  /** Show checkered pattern for mixed pixels (batch editing) */
  mixedPixels?: Set<string>;
  /** Mixed pixel pattern color */
  mixedColor?: string;
}

/**
 * Canvas-based pixel grid component
 *
 * Efficiently renders character pixels with optional grid lines.
 * Supports click/drag interaction for editing.
 */
export function PixelGrid({
  pixels,
  scale = 1,
  showGrid = false,
  gridColor = "#333333",
  gridThickness = 1,
  foregroundColor = "#ffffff",
  backgroundColor = "#000000",
  onPixelClick,
  onPixelDrag,
  onDragEnd,
  onPixelHover,
  onPixelLeave,
  className = "",
  interactive = true,
  mixedPixels,
  mixedColor = "#666666",
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastPixelRef = useRef<{ row: number; col: number } | null>(null);

  const height = pixels.length;
  const width = pixels[0]?.length || 0;

  // Calculate canvas dimensions
  const gridOffset = showGrid ? gridThickness : 0;
  const canvasWidth = width * scale + (showGrid ? (width + 1) * gridThickness : 0);
  const canvasHeight = height * scale + (showGrid ? (height + 1) * gridThickness : 0);

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = showGrid ? gridColor : backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw pixels
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const x = showGrid
          ? col * (scale + gridThickness) + gridThickness
          : col * scale;
        const y = showGrid
          ? row * (scale + gridThickness) + gridThickness
          : row * scale;

        const pixelKey = `${row},${col}`;
        const isMixed = mixedPixels?.has(pixelKey);
        const isOn = pixels[row]?.[col] || false;

        if (isMixed) {
          // Draw checkered pattern for mixed pixels
          const halfScale = Math.floor(scale / 2);
          ctx.fillStyle = foregroundColor;
          ctx.fillRect(x, y, halfScale, halfScale);
          ctx.fillRect(x + halfScale, y + halfScale, scale - halfScale, scale - halfScale);
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(x + halfScale, y, scale - halfScale, halfScale);
          ctx.fillRect(x, y + halfScale, halfScale, scale - halfScale);
        } else {
          ctx.fillStyle = isOn ? foregroundColor : backgroundColor;
          ctx.fillRect(x, y, scale, scale);
        }
      }
    }
  }, [
    pixels,
    scale,
    showGrid,
    gridColor,
    gridThickness,
    foregroundColor,
    backgroundColor,
    canvasWidth,
    canvasHeight,
    width,
    height,
    mixedPixels,
    mixedColor,
  ]);

  // Convert canvas coordinates to pixel coordinates
  const getPixelFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number;
      let clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Scale to canvas coordinates
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const canvasX = x * scaleX;
      const canvasY = y * scaleY;

      // Calculate pixel position
      const cellSize = scale + (showGrid ? gridThickness : 0);
      const col = Math.floor((canvasX - gridOffset) / cellSize);
      const row = Math.floor((canvasY - gridOffset) / cellSize);

      if (row >= 0 && row < height && col >= 0 && col < width) {
        return { row, col };
      }

      return null;
    },
    [scale, showGrid, gridThickness, gridOffset, height, width]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;

      // Prevent context menu for right-click
      if (e.button === 2) {
        e.preventDefault();
      }

      const pixel = getPixelFromEvent(e);
      if (pixel && onPixelClick) {
        // Pass right-click indicator (button 2 = right click)
        onPixelClick(pixel.row, pixel.col, e.button === 2);
        lastPixelRef.current = pixel;
        setIsDragging(true);
      }
    },
    [interactive, getPixelFromEvent, onPixelClick]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Prevent default context menu when interactive
      if (interactive) {
        e.preventDefault();
      }
    },
    [interactive]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!interactive) return;

      const pixel = getPixelFromEvent(e);

      // Always track hover for coordinates display
      if (pixel && onPixelHover) {
        onPixelHover(pixel.row, pixel.col);
      }

      // Handle drag painting
      if (isDragging && onPixelDrag && pixel) {
        // Only trigger if moved to a different pixel
        if (
          !lastPixelRef.current ||
          lastPixelRef.current.row !== pixel.row ||
          lastPixelRef.current.col !== pixel.col
        ) {
          onPixelDrag(pixel.row, pixel.col);
          lastPixelRef.current = pixel;
        }
      }
    },
    [interactive, isDragging, getPixelFromEvent, onPixelDrag, onPixelHover]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      lastPixelRef.current = null;
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      lastPixelRef.current = null;
      onDragEnd?.();
    }
    // Notify that mouse left the canvas (clear coordinates display)
    onPixelLeave?.();
  }, [isDragging, onDragEnd, onPixelLeave]);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      e.preventDefault();

      const pixel = getPixelFromEvent(e);
      if (pixel && onPixelClick) {
        onPixelClick(pixel.row, pixel.col);
        lastPixelRef.current = pixel;
        setIsDragging(true);
      }
    },
    [interactive, getPixelFromEvent, onPixelClick]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (!interactive || !isDragging || !onPixelDrag) return;
      e.preventDefault();

      const pixel = getPixelFromEvent(e);
      if (pixel) {
        if (
          !lastPixelRef.current ||
          lastPixelRef.current.row !== pixel.row ||
          lastPixelRef.current.col !== pixel.col
        ) {
          onPixelDrag(pixel.row, pixel.col);
          lastPixelRef.current = pixel;
        }
      }
    },
    [interactive, isDragging, getPixelFromEvent, onPixelDrag]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      lastPixelRef.current = null;
      onDragEnd?.();
    }
  }, [isDragging, onDragEnd]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className={`${interactive ? "cursor-crosshair" : ""} ${className}`}
      style={{
        imageRendering: "pixelated",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
}
