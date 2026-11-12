"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// 5 foto galeri per user request.
const PHOTOS = [
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb8d7dmvk2g9xg/file",
    alt: "Momen 1",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb8ashjtaehyzw/file",
    alt: "Momen 2",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb88at0dzea3y0/file",
    alt: "Momen 3",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb85hpv14akk91/file",
    alt: "Momen 4",
  },
  {
    src: "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file",
    alt: "Momen 5",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide5() {
  const goTo = useInvitation((s) => s.goTo);
  const [selected, setSelected] = useState(0);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax), PURE wallpaper tanpa overlay
          merah maroon (per user request). */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar our moment"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Back button */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <svg className="size-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-full max-w-[26rem] flex-col items-center px-6 py-20"
      >
        <motion.h2
          variants={item}
          className="font-wedding text-[2.6rem] leading-none text-[#5b0101] sm:text-[3.2rem]"
        >
          Our Moment
        </motion.h2>

        <span
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#5b0101]/40 to-transparent"
        />

        {/* Preview besar — gambar aktif, crossfade saat ganti */}
        <motion.div
          variants={item}
          className="relative w-full overflow-hidden rounded-[2.5rem] shadow-[0_22px_50px_-18px_rgba(60,45,25,0.45)] ring-1 ring-white/60 aspect-[3/4]"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selected}
              src={PHOTOS[selected].src}
              alt={PHOTOS[selected].alt}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          </AnimatePresence>
        </motion.div>

        {/* Preview kecil (thumbnail) — klik untuk tampil di preview besar */}
        <motion.div
          variants={item}
          className="mt-6 grid w-full grid-cols-5 justify-items-center gap-2.5"
          role="tablist"
          aria-label="Pilih foto galeri"
        >
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Tampilkan ${p.alt}`}
              onClick={() => setSelected(i)}
              className={`group relative aspect-square w-full max-w-[4.5rem] cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
                selected === i
                  ? "ring-2 ring-[#5b0101] ring-offset-2 ring-offset-white/70 scale-105"
                  : "ring-1 ring-white/70 opacity-80 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img
                src={p.src}
                alt={p.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
