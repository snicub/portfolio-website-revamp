"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, createTimeline, spring, stagger, utils } from "animejs";
import { DUR, EASE, SPRING, motionEnabled, useAnimeScope } from "@/lib/motion";

interface LightboxProps {
  images: { src: string }[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const directionRef = useRef(1);

  const total = images.length;

  const { root, scope } = useAnimeScope<HTMLDivElement>((self) => {
    const overlay = self.root as HTMLElement;
    const [figure] = utils.$(".lightbox__figure") as HTMLElement[];

    createTimeline()
      .add(overlay, { opacity: [0, 1], duration: DUR.fast, ease: EASE.out }, 0)
      .add(figure, { opacity: [0, 1], scale: [0.94, 1], ease: spring(SPRING.pop) }, 60)
      .add(
        ".lightbox__chrome",
        { opacity: [0, 1], y: [10, 0], duration: DUR.fast, ease: EASE.out },
        stagger(50, { start: 140 }),
      );

    // Called with the travel direction when the index changes: the incoming
    // photo enters from the side you asked for.
    self.add("swap", (dir: number) => {
      animate(figure, {
        opacity: [0, 1],
        x: [dir * 44, 0],
        duration: DUR.base,
        ease: EASE.expo,
      });
    });

    self.add("dismiss", (done: () => void) => {
      createTimeline({ defaults: { ease: EASE.out } })
        .add(figure, { opacity: 0, scale: 0.96, duration: DUR.fast }, 0)
        .add(".lightbox__chrome", { opacity: 0, duration: DUR.micro }, 0)
        .add(overlay, { opacity: 0, duration: DUR.fast, onComplete: done }, 80);
    });
  });

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    const dismiss = scope.current?.methods.dismiss;
    if (!motionEnabled() || !dismiss) {
      onClose();
      return;
    }
    closingRef.current = true;
    dismiss(onClose);
  }, [onClose, scope]);

  const goNext = useCallback(() => {
    directionRef.current = 1;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    directionRef.current = -1;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Animate the swap after React has already put the new src in place.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scope.current?.methods.swap?.(directionRef.current);
  }, [currentIndex, scope]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Lets the CSS stand the page chrome down while a viewer is open, so a
    // fixed, backdrop-filtered nav can't compete with a full-screen photo.
    document.documentElement.dataset.modal = "open";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      delete document.documentElement.dataset.modal;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [requestClose, goNext, goPrev]);

  // Focus trap: anything that escapes the overlay is pulled back to close.
  useEffect(() => {
    const overlay = root.current;
    if (!overlay) return;
    const handleFocusTrap = (e: FocusEvent) => {
      if (!overlay.contains(e.target as Node)) {
        e.stopPropagation();
        closeButtonRef.current?.focus();
      }
    };
    document.addEventListener("focus", handleFocusTrap, true);
    return () => document.removeEventListener("focus", handleFocusTrap, true);
  }, [root]);

  // Rendered into <body> so the viewer never inherits a stacking or overflow
  // context from whatever page opened it.
  return createPortal(
    <div
      ref={root}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      data-cursor="close"
      onClick={(e) => e.target === e.currentTarget && requestClose()}
    >
      <button
        ref={closeButtonRef}
        onClick={requestClose}
        className="lightbox__chrome lightbox__btn lightbox__close"
        aria-label="Close lightbox"
      >
        [ close ]
      </button>

      {total > 1 && (
        <button
          onClick={goPrev}
          className="lightbox__chrome lightbox__btn lightbox__arrow lightbox__arrow--prev"
          aria-label="Previous image"
        >
          &#8592;
        </button>
      )}

      <figure className="lightbox__figure">
        <img
          src={images[currentIndex].src}
          alt={`Image ${currentIndex + 1} of ${total}`}
          decoding="async"
        />
      </figure>

      {total > 1 && (
        <button
          onClick={goNext}
          className="lightbox__chrome lightbox__btn lightbox__arrow lightbox__arrow--next"
          aria-label="Next image"
        >
          &#8594;
        </button>
      )}

      {total > 1 && (
        <p className="lightbox__chrome lightbox__counter mono">
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      )}
    </div>,
    document.body,
  );
};

export default Lightbox;
