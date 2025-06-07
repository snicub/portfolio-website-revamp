import React, { useState, useEffect, useRef } from "react";

const getRandomChar = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
};

const TextEffect = ({ text = "" }: { text?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        // eslint-disable-next-line
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || hasRun.current) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => {
          const randomChars = Array.from({ length: index })
            .map(() => getRandomChar())
            .join("");
          const updatedText = randomChars + (text[index] || "");
          return updatedText;
        });
        index++;
      } else {
        clearInterval(interval);
        setDisplayedText(text);
        setIsComplete(true);
        hasRun.current = true;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isInView, text]);

  const textEffectStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    display: "inline-block",
    width: `${text.length}ch`,
  };

  const cursorStyle: React.CSSProperties = {
    display: "inline-block",
    width: "10px",
    background: "black",
    animation: "blink 1s step-start infinite",
  };

  return (
    <span ref={textRef} style={textEffectStyle}>
      {displayedText}
      {!isComplete && <span style={cursorStyle}>|</span>}
    </span>
  );
};

export default TextEffect;
