"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";
import LazyBackground from "@/components/invitation/LazyBackground";

const BG_IMAGE =
  "/images/cmwdgsc0wzfl25lw0.jpg";

// Couple photos — foto mempelai pria & wanita (revisi per user request).
const GROOM_PHOTO =
  "/images/cmwdi06x5229yeabb.jpg";
const BRIDE_PHOTO =
  "/images/cmwdi05ceku7n8k3l.jpg";

// The "&" decorative separator between the bride and groom blocks.
const AMPERSAND_IMAGE =
  "https://the.invisimple.id/wp-content/uploads/2024/10/06.png";

// Bunga dekoratif tema 2 — ditaruh di pojok foto mempelai.
const FLOWER_ASSET =
  "https://the.invisimple.id/wp-content/uploads/2026/03/TEMA-2-BUNGA.png";

// Staggered entrance animation for the content cluster.
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

export default function Slide3() {
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — FIXED (parallax) so it stays put while the user
          scrolls through the long content. */}
      <LazyBackground src={BG_IMAGE} alt="Latar slide mempelai" />

      {/* Subtle top darkening so the back button & salam stays readable */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-black/15 to-transparent"
      />

      {/* Back button — top-left, scroll back to cover */}
      <button
        type="button"
        onClick={() => goTo("cover")}
        aria-label="Kembali ke cover"
        className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      </button>

      {/* Content — capsule card cream (#FFF3E3) dengan outline merah maroon.
          Semua teks gelap/hitam biar kontras di atas warna cream. */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex w-[calc(100%-2rem)] max-w-[26rem] flex-col items-center rounded-b-full rounded-t-full border-[3px] border-[#5b0101] bg-[#FFF3E3]/85 px-6 pb-16 pt-16 shadow-[0_28px_60px_-20px_rgba(60,45,25,0.45)] my-10 mx-4"
      >
        {/* Judul section */}
        <motion.h2
          variants={item}
          className="font-wedding text-center text-[2.6rem] leading-none text-[#5b0101] sm:text-[3rem]"
        >
          Groom &amp; Bride
        </motion.h2>

        {/* Salam pembuka */}
        <motion.p
          variants={item}
          className="font-script mt-3 text-center text-[0.8rem] leading-relaxed text-black sm:text-[0.86rem]"
        >
          Assalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
        </motion.p>

        {/* Doa pembuka */}
        <motion.p
          variants={item}
          className="font-script mt-2 max-w-[18rem] text-center text-[0.72rem] leading-relaxed text-black sm:text-[0.78rem]"
        >
          Maha Suci Allah yang telah menciptakan makhluk-Nya
          berpasang-pasangan. Ya Allah semoga ridho-Mu tercurah mengiringi
          pernikahan kami
        </motion.p>

        {/* ───── Groom block ───── */}
        <motion.div
          variants={item}
          className="mt-6 flex w-full flex-col items-center"
        >
          {/* Capsule photo + bunga ornamen di pojok kiri atas */}
          <div className="relative">
            <div className="relative z-[2] h-64 w-44 overflow-hidden rounded-full border border-white shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48">
              <img
                src={GROOM_PHOTO}
                alt="Foto mempelai pria"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Bunga pojok kiri atas foto groom. Mirror (-scale-x-100) lewat
                wrapper div biar nggak ditimpa Framer Motion inline transform. */}
            <div className="pointer-events-none absolute -left-10 top-0 z-[1] h-32 w-32 -scale-x-100 sm:h-36 sm:w-36">
              <motion.img
                src={FLOWER_ASSET}
                alt=""
                aria-hidden
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Nama panggilan — font latin wedding (Great Vibes) */}
          <p className="font-wedding mt-4 text-[3rem] leading-none text-[#5b0101] sm:text-[3.4rem]">
            Yayak
          </p>

          {/* Nama lengkap */}
          <p className="font-script mt-1 text-[0.85rem] text-black sm:text-[0.95rem]">
            Hendra
          </p>

          {/* Putra dari */}
          <p className="font-script mt-3 text-[0.72rem] text-black sm:text-[0.78rem]">
            Putra dari
          </p>
          <p className="font-script mt-1 text-[0.85rem] text-black sm:text-[0.95rem]">
            Bapak... &amp; Ibu....
          </p>
          <p className="font-script mt-1.5 max-w-[16rem] text-center text-[0.7rem] leading-relaxed text-black sm:text-[0.76rem]">
            C5 Rimba Ukur
          </p>
        </motion.div>

        {/* ───── Ampersand separator ───── */}
        <motion.div variants={item} className="my-6 flex items-center justify-center">
          <img
            src={AMPERSAND_IMAGE}
            alt="Pernikahan"
            className="h-auto w-16 object-contain opacity-90 sm:w-20"
            loading="lazy"
          />
        </motion.div>

        {/* ───── Bride block ───── */}
        <motion.div
          variants={item}
          className="flex w-full flex-col items-center"
        >
          {/* Capsule photo + bunga ornamen di pojok kanan atas */}
          <div className="relative">
            <div className="relative z-[2] h-64 w-44 overflow-hidden rounded-full border border-white shadow-[0_18px_45px_-12px_rgba(76,58,40,0.45)] ring-1 ring-stone-900/5 sm:h-72 sm:w-48">
              <img
                src={BRIDE_PHOTO}
                alt="Foto mempelai wanita"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Bunga pojok kanan atas foto bride */}
            <motion.img
              src={FLOWER_ASSET}
              alt=""
              aria-hidden
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute -right-10 top-0 z-[1] h-32 w-32 object-contain sm:h-36 sm:w-36"
              loading="lazy"
            />
          </div>

          {/* Nama panggilan — font latin wedding (Great Vibes) */}
          <p className="font-wedding mt-4 text-[3rem] leading-none text-[#5b0101] sm:text-[3.4rem]">
            Eci
          </p>

          {/* Nama lengkap */}
          <p className="font-script mt-1 text-[0.85rem] text-black sm:text-[0.95rem]">
            Eci Kurnia
          </p>

          {/* Putri dari */}
          <p className="font-script mt-3 text-[0.72rem] text-black sm:text-[0.78rem]">
            Putri dari
          </p>
          <p className="font-script mt-1 text-[0.85rem] text-black sm:text-[0.95rem]">
            Bapak ... &amp; Ibu ...
          </p>
          <p className="font-script mt-1.5 max-w-[16rem] text-center text-[0.7rem] leading-relaxed text-black sm:text-[0.76rem]">
            Dusun 4 Desa Gajah Mati
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
