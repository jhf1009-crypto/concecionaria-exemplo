"use client";
import { useEffect, useRef } from "react";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    if (element.getBoundingClientRect().top > innerHeight)
      element.classList.add("is-pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.remove("is-pending");
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
export function SmoothScroll() {
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(pointer: coarse)").matches
    )
      return;
    let destroyed = false;
    let cleanup: () => void = () => {};
    const timer = window.setTimeout(async () => {
      const { default: Lenis } = await import("lenis");
      if (destroyed) return;
      const lenis = new Lenis({ autoRaf: true, duration: 0.85, anchors: true });
      cleanup = () => lenis.destroy();
    }, 1200);
    return () => {
      destroyed = true;
      clearTimeout(timer);
      cleanup();
    };
  }, []);
  return null;
}
