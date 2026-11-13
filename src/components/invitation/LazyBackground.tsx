"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * LazyBackground — wallpaper parallax (position: fixed) yang barunya
 * di-download saat section-nya mendekati viewport.
 *
 * Kenapa nggak pakai loading="lazy" biasa? Karena img-nya position:fixed —
 * browser selalu anggap dia "di viewport", jadi lazy loading native nggak
 * pernah menunda-nya. Triknya: IntersectionObserver dipasang ke HOST
 * (div absolute inset-0 di dalam section — ikut scroll), bukan ke img.
 * Begitu host mendekati viewport (rootMargin 600px), img baru dipasang.
 *
 * Ini kunci performa klik "Buka Undangan": 7 wallpaper slide berikutnya
 * (~1.1MB) nggak lagi berebut bandwidth dengan video intro (416KB) di
 * detik-detik pertama — video dapat jalan duluan, wallpaper menyusul
 * begitu user mulai scroll.
 */
export default function LazyBackground({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Observer langsung mengevaluasi posisi saat observe() — kalau section
    // memang sudah dekat viewport, callback ini terpanggil hampir seketika.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute inset-0 z-0 bg-stone-200"
    >
      {ready && (
        <motion.img
          src={src}
          alt={alt}
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full object-cover"
          style={{ position: "fixed", inset: 0, zIndex: 0 }}
          loading="eager"
          decoding="async"
          // @ts-expect-error -- fetchPriority is valid in React 19 but not in older types
          fetchPriority="high"
        />
      )}
    </div>
  );
}
