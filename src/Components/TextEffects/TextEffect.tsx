import React, { useState, useEffect, useRef } from "react";

const getRandomChar = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return chars[Math.floor(Math.random() * chars.length)];
};

const TextEffect = ({ text = "" }: { text?: string }) => {
  // Set default empty string
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isInView, setIsInView] = useState(false); // To track if the component is in view
  const textRef = useRef<HTMLSpanElement>(null); // Ref to the text element
  const hasRun = useRef(false); // Ref to track if the effect has already run

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInView || hasRun.current) return; // Exit early if not in view or effect already run

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => {
          const randomChars = Array.from({ length: index })
            .map(() => getRandomChar())
            .join("");
          const updatedText = randomChars + (text[index] || ""); // Ensure no undefined character
          return updatedText;
        });
        index++;
      } else {
        clearInterval(interval);
        setDisplayedText(text);
        setIsComplete(true);
        hasRun.current = true; // Mark the effect as complete
      }
    }, 100); // Speed of the effect

    return () => clearInterval(interval);
  }, [isInView, text]);

  const textEffectStyle: React.CSSProperties = {
    fontFamily: "monospace",
    fontSize: "1rem",
    whiteSpace: "nowrap",
    display: "inline-block",
    width: `${text.length}ch`, // Adjust width to fit the text length
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
