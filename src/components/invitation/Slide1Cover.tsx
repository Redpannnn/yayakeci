"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdm864566insd66/file";
const COUPLE_PHOTO =
  "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file";

// Video intro slide 2 — file LOKAL di /public/video biar loading-nya cepat
// & stabil (nggak tergantung CDN eksternal). Di-preload diam-diam di cover.
const INTRO_VIDEO = "/video/intro.mp4";

// Staggered entrance animation
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide1Cover() {
  const openInvitation = useInvitation((s) => s.openInvitation);

  // Guest name — di-resolve dari URL ?to=<code|name>.
  //   • ?to=budi      → lookup ke DB /api/guests/lookup → "Budi Santoso" (jika terdaftar)
  //   • ?to=Budi+Sapo → tidak terdaftar → tampil "Budi Sapo" literal
  //   • (tanpa ?to=)  → fallback "Tamu Undangan"
  const [guestName, setGuestName] = useState("Tamu Undangan");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("to");
    if (!raw) return;
    const decoded = decodeURIComponent(raw.replace(/\+/g, " ")).trim();
    if (!decoded) return;

    // Cek di database dulu — kalau code terdaftar, pakai nama lengkapnya.
    fetch(`/api/guests/lookup?code=${encodeURIComponent(decoded)}`)
      .then((r) => r.json())
      .then((data) => {
        setGuestName(data?.name ?? decoded);
      })
      .catch(() => {
        setGuestName(decoded);
      });
  }, []);

  return (
    <main className="relative flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Hidden preloader — buffer video intro slide 2 dari sekarang */}
      <video
        src={INTRO_VIDEO}
        muted
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
      />

      {/* Wallpaper — file .mp4, diputar sebagai video background */}
      <motion.video
        src={BG_IMAGE}
        aria-label="Latar video undangan pernikahan"
        autoPlay
        muted
        loop
        playsInline
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
        // @ts-expect-error -- fetchPriority is valid in React 19 but not in older types
        fetchPriority="high"
      />

      {/* Content — cover card capsule di tengah wallpaper */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-3">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex h-[76%] w-[70%] max-w-[400px] flex-col items-center justify-center rounded-full border border-[#C8B48A] bg-[#FFF3E3]/85 px-5 shadow-[0_25px_60px_-20px_rgba(76,58,40,0.35)] backdrop-blur-[2px] sm:h-[80%] sm:px-6"
        >
          {/* The Wedding Of */}
          <motion.p
            variants={item}
            className="font-wedding text-[1.7rem] leading-none text-[#544c39] sm:text-[2.3rem]"
          >
            The Wedding Of
          </motion.p>

          {/* Foto pengantin — bentuk capsule, outline putih */}
          <motion.div
            variants={item}
            className="mt-4 h-[178px] w-[122px] overflow-hidden rounded-full border-[3px] border-white shadow-[0_16px_38px_-12px_rgba(76,58,40,0.45)] sm:mt-5 sm:h-[248px] sm:w-[172px] sm:border-4"
          >
            <img
              src={COUPLE_PHOTO}
              alt="Foto mempelai Yayak & Eci"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Nama mempelai */}
          <motion.h1
            variants={item}
            className="font-serif-display mt-4 whitespace-nowrap text-center text-[1.25rem] font-medium uppercase tracking-[0.04em] text-[#740404] sm:mt-5 sm:text-[1.7rem]"
          >
            Yayak{" "}
            <span className="font-script text-[1.4em] font-normal italic text-[#740404]">
              &amp;
            </span>{" "}
            Eci
          </motion.h1>

          {/* Recipient block */}
          <motion.div
            variants={item}
            className="mt-2 flex flex-col items-center sm:mt-3"
          >
            <p className="font-serif-display text-[0.72rem] text-[#3a3424] sm:text-[0.8rem]">
              Kepada Yth.
            </p>
            <p className="font-serif-display mt-0.5 text-[0.72rem] text-[#3a3424] sm:text-[0.8rem]">
              Bapak/ Ibu/ Saudara/i
            </p>
            <p className="font-serif-display mt-1 text-[0.9rem] font-medium italic text-[#3a3424] sm:text-[1rem]">
              {guestName}
            </p>
          </motion.div>

          {/* Button kecil — Buka Undangan */}
          <motion.div variants={item} className="mt-3 w-full sm:mt-4">
            <motion.button
              type="button"
              onClick={openInvitation}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group mx-auto flex h-[1.75rem] w-full max-w-[8.6rem] items-center justify-center gap-1.5 rounded-full border border-[#740404]/40 bg-[#740404] px-3 text-[0.42rem] uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#740404]/90 sm:text-[0.46rem]"
            >
              <Mail className="size-2.5 transition-transform group-hover:-rotate-6" />
              <span>Buka Undangan</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
