import React, { useEffect, useRef, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <div ref={elementRef} className={className}>
      <div className="flex flex-wrap justify-center gap-x-4">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className={`inline-block tracking-wide font-bold opacity-0 ${
              word === "nesso.link/" ? "animated-underline" : ""
            }`}
            style={{
              animation: isVisible
                ? `fadeInSlide 0.15s ease-out forwards ${index * 0.1}s`
                : "none",
            }}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
