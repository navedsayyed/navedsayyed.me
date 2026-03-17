"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ScreenshotLightboxProps {
  screenshots: string[];
  projectTitle: string;
}

export default function ScreenshotLightbox({
  screenshots,
  projectTitle,
}: ScreenshotLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

  const open = (index: number) => {
    setActiveIndex(index);
    setDragOffset(0);
  };

  const close = () => setActiveIndex(null);

  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex(Math.min(screenshots.length - 1, activeIndex + 1));
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  // swipe handlers
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDelta.current = 0;
    isDragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const delta = e.clientX - dragStartX.current;
    dragDelta.current = delta;
    setDragOffset(delta);
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;

    const threshold = 80;

    if (dragDelta.current < -threshold) next();
    else if (dragDelta.current > threshold) prev();

    setDragOffset(0);

    dragStartX.current = null;
    dragDelta.current = 0;
    isDragging.current = false;
  };

  return (
    <>
      {/* Thumbnail row */}
      <div className="flex flex-row gap-3 overflow-x-auto pb-2">
        {screenshots.map((src, index) => (
          <button
            key={src}
            onClick={() => open(index)}
            className="overflow-hidden rounded-2xl border shrink-0 cursor-zoom-in"
          >
            <Image
              src={src}
              alt={`${projectTitle} screenshot ${index + 1}`}
              width={220}
              height={420}
              className="h-80 w-auto object-contain"
              unoptimized
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {mounted &&
        activeIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={close}
          >
            {/* Back button */}
            <button
              onClick={close}
              className="absolute left-4 top-4 text-white bg-black/50 p-2 rounded-full"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>

            {/* Counter */}
            <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {activeIndex + 1} / {screenshots.length}
            </p>

            {/* Slider */}
            <div
              className="relative w-full h-[82vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ touchAction: "none" }}
            >
              <div
                className="flex h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `translate3d(calc(${
                    -activeIndex * 100
                  }% + ${dragOffset}px),0,0)`,
                }}
              >
                {screenshots.map((src, i) => (
                  <div
                    key={src}
                    className="w-full flex-shrink-0 flex items-center justify-center"
                  >
                    <img
                      src={src}
                      alt={`${projectTitle} screenshot ${i + 1}`}
                      className="max-h-[78vh] w-auto max-w-[92vw] rounded-2xl object-contain shadow-2xl"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div
              className="absolute bottom-6 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-6 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}