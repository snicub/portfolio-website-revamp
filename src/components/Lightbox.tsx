"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";

interface LightboxProps {
  images: { src: string }[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const total = images.length;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Fade in on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the close button on mount for focus trapping
  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  // Keyboard handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goNext, goPrev]);

  // Focus trap
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const handleFocusTrap = (e: FocusEvent) => {
      if (!overlay.contains(e.target as Node)) {
        e.stopPropagation();
        closeButtonRef.current?.focus();
      }
    };

    document.addEventListener("focus", handleFocusTrap, true);
    return () => document.removeEventListener("focus", handleFocusTrap, true);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const buttonBase: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "#ffffff",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSize: "0.85rem",
    cursor: "pointer",
    padding: "8px 12px",
    letterSpacing: "0.03em",
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.25s ease-in",
      }}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          ...buttonBase,
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 10001,
        }}
      >
        [ close ]
      </button>

      {/* Previous arrow */}
      {total > 1 && (
        <button
          onClick={goPrev}
          aria-label="Previous image"
          style={{
            ...buttonBase,
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.5rem",
            zIndex: 10001,
          }}
        >
          &#8592;
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex].src}
        alt={`Image ${currentIndex + 1} of ${total}`}
        style={{
          maxWidth: "calc(100vw - 120px)",
          maxHeight: "calc(100vh - 120px)",
          objectFit: "contain",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {/* Next arrow */}
      {total > 1 && (
        <button
          onClick={goNext}
          aria-label="Next image"
          style={{
            ...buttonBase,
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.5rem",
            zIndex: 10001,
          }}
        >
          &#8594;
        </button>
      )}

      {/* Image counter */}
      {total > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffffff",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: "0.8rem",
            letterSpacing: "0.05em",
            userSelect: "none",
          }}
        >
          {currentIndex + 1} / {total}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
