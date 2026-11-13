"use client";

import { motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";
import LazyBackground from "@/components/invitation/LazyBackground";

const BG_IMAGE =
  "/images/cmwdgsc0wzfl25lw0.jpg";

// Couple photo for the closing capsule — foto baru per user request.
const COUPLE_PHOTO =
  "/images/cmwdb82qqqrqizphy.jpg";

const CLOSING_DOA =
  "Merupakan suatu kebahagiaan dan kehormatan bagi kami, apabila Bapak/Ibu/Saudara/i, berkenan hadir dan memberikan do’a restu kepada kami.";

// Social links — revisi per user request.
const WHATSAPP_URL = "https://wa.me/6285731219074";
const INSTAGRAM_URL = "https://www.instagram.com/memoraainvitation/";
const TIKTOK_URL = "https://www.tiktok.com/@memoraainvtitation._";

const WHATSAPP_ICON =
  "/images/cmw79rb651wumgvv6.png";
const INSTAGRAM_ICON =
  "/images/cmw79repvzc30frlt.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Slide9() {
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      <LazyBackground src={BG_IMAGE} alt="Latar penutup" />
      {/* Bg solid overlay putih (60% opacity, no blur) — di slide 9 aja.
          position: absolute supaya scoped ke slide 9, nggak bocor ke slide lain. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-white/60"
      />
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

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center px-6"
      >
        {/* Konten utama — di-center di sisa ruang */}
        <div className="flex w-full max-w-[24rem] flex-1 flex-col items-center justify-center py-16 text-center">
        {/* Couple photo — capsule shape */}
        <motion.div
          variants={item}
          className="relative h-64 w-44 overflow-hidden rounded-full border border-white/70 shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48"
        >
          <img
            src={COUPLE_PHOTO}
            alt="Foto pengantin Yayak & Eci"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Terima Kasih — font latin wedding (Great Vibes) */}
        <motion.h2
          variants={item}
          className="font-wedding mt-6 text-[3rem] leading-none text-[#544c39] sm:text-[3.6rem]"
        >
          Terima Kasih
        </motion.h2>

        {/* Doa */}
        <motion.p
          variants={item}
          className="font-script mt-5 text-[0.82rem] leading-relaxed text-black sm:text-[0.9rem]"
        >
          {CLOSING_DOA}
        </motion.p>

        {/* Wassalamu'alaikum */}
        <motion.p
          variants={item}
          className="font-script mt-5 text-[0.82rem] leading-relaxed text-black sm:text-[0.9rem]"
        >
          Wassalamu&rsquo;alaikum warahmatullahi wabarakatuh
        </motion.p>

        {/* thin ornamental divider */}
        <motion.span
          variants={item}
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#544c39]/40 to-transparent"
        />

        {/* Kami yang berbahagia */}
        <motion.p
          variants={item}
          className="font-latin text-[0.62rem] font-medium uppercase tracking-[0.28em] text-black sm:text-[0.68rem]"
        >
          Kami yang berbahagia
        </motion.p>

        {/* Yayak & Eci — font latin wedding */}
        <motion.p
          variants={item}
          className="font-wedding mt-2 text-[2rem] leading-none text-[#5b0101] sm:text-[2.4rem]"
        >
          Yayak &amp; Eci
        </motion.p>
        </div>

        {/* Footer brand — dipatok ke batas bawah page per user request */}
        <motion.div
          variants={item}
          className="flex w-full max-w-[24rem] flex-col items-center pb-6"
        >
          {/* Divider sebelum footer brand */}
          <span
            aria-hidden
            className="h-px w-24 bg-gradient-to-r from-transparent via-[#544c39]/40 to-transparent"
          />

          {/* Footer — celebrete with memoraa' */}
          <p className="font-script mt-4 text-[0.85rem] italic text-black sm:text-[0.9rem]">
            celebrete with memoraa&rsquo;
          </p>

          {/* Social icons — ukuran visual disamakan ke ukuran icon instagram */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {/* WhatsApp — img digedein (h-[47px]) biar visualnya setara IG */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Hubungi kami via WhatsApp"
              className="group flex h-12 w-12 items-center justify-center"
            >
              <img
                src={WHATSAPP_ICON}
                alt="Ikon WhatsApp"
                className="h-[47px] w-[47px] object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </a>

            {/* Instagram — acuan ukuran (h-8, visual ≈ 25px) */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Memora'a Invitation"
              className="group flex h-9 w-9 items-center justify-center"
            >
              <img
                src={INSTAGRAM_ICON}
                alt="Ikon Instagram"
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </a>

            {/* TikTok — svg dikecilin (h-[25px]) biar visualnya setara IG */}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Memora'a Invitation"
              className="group flex h-9 w-9 items-center justify-center"
            >
              <svg
                viewBox="0 0 36 36"
                className="h-[25px] w-[25px] transition-transform duration-300 group-hover:scale-110"
                aria-hidden
              >
                <circle cx="18" cy="18" r="18" fill="#000000" />
                <path
                  fill="#ffffff"
                  d="M22.13 10.5h-3.06v11.86a2.53 2.53 0 1 1-2.53-2.53c.26 0 .5.04.74.11v-3.1a5.62 5.62 0 0 0-.74-.05 5.57 5.57 0 1 0 5.57 5.57v-5.83a6.78 6.78 0 0 0 3.87 1.2v-3.06a3.85 3.85 0 0 1-3.85-3.85c0-.11 0-.22.01-.32z"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
