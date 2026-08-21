"use client";

import { Download, FileText, Mail, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ProfilePhotoModalProps {
  src: string;
  alt: string;
  name: string;
  designation: string;
  email?: string;
  resume?: string;
  children: React.ReactNode;
}

export default function ProfilePhotoModal({
  src,
  alt,
  name,
  designation,
  email,
  resume,
  children,
}: ProfilePhotoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const open = () => {
    setIsOpen(true);
    requestAnimationFrame(() => setIsAnimating(true));
  };

  const close = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 250);
  };

  // Lock scroll & handle Escape
  useEffect(() => {
    if (!isOpen) return;

    // Measure scrollbar width before hiding overflow
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <>
      {/* Clickable avatar wrapper */}
      <button
        type="button"
        onClick={open}
        className="cursor-pointer group relative inline-flex shrink-0 rounded border-none bg-transparent p-0"
        aria-label={`View ${name}'s profile photo`}
      >
        {children}
        {/* Hover overlay */}
        <span className="absolute inset-0 flex items-center justify-center rounded bg-black/0 transition-all duration-300 group-hover:bg-black/30">
          <span className="scale-0 rounded-full bg-white/20 p-1.5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-100">
            {/* Decorative — the wrapping button already carries an aria-label */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </span>
        </span>
      </button>

      {/* Modal */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${name}'s profile photo`}
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close modal"
              className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-250 ${
                isAnimating ? "opacity-100" : "opacity-0"
              }`}
              onClick={close}
            />

            {/* Content */}
            <div
              className={`relative z-10 flex flex-col items-center gap-5 transition-all duration-250 ${
                isAnimating
                  ? "scale-100 opacity-100 translate-y-0"
                  : "scale-95 opacity-0 translate-y-4"
              }`}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={close}
                className="absolute -top-2 -right-2 z-20 rounded-full bg-foreground/10 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-foreground/20"
                aria-label="Close"
                style={{ transform: "translate(50%, -50%)" }}
              >
                <X className="size-5" />
              </button>

              {/* Large photo */}
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                <Image
                  src={src}
                  alt={alt}
                  width={320}
                  height={320}
                  priority
                  className="h-56 w-56 sm:h-72 sm:w-72 md:h-80 md:w-80 object-cover"
                />
              </div>

              {/* Name & designation */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">{name}</h3>
                <p className="text-sm text-white/60 uppercase tracking-[0.15em]">{designation}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {email && (
                  <Link
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/25"
                  >
                    <Mail className="size-4" />
                    Email Me
                  </Link>
                )}
                {resume && (
                  <Link
                    href={resume}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/25"
                  >
                    <FileText className="size-4" />
                    Resume
                  </Link>
                )}
                <Link
                  href={src}
                  download
                  target="_blank"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/25"
                  aria-label="Download photo"
                  title="Download photo"
                >
                  <Download className="size-4" />
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
