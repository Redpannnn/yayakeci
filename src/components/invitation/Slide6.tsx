"use client";

import { motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Timeline perjalanan cerita kami — revisi per user request.
const STORY = [
  {
    time: "Juni 2023",
    title: "Pertemuan Tanpa Sengaja",
    text: "Berawal dari perjodohan teman, kami saling bertukar nomor WhatsApp tanpa sengaja.",
  },
  {
    time: "3 Juli",
    title: "Mulai Pacaran",
    text: "Perkenalan itu berakhir indah — kami resmi menjalin hubungan serius.",
  },
  {
    time: "Kini",
    title: "Tunangan",
    text: "Dan sekarang kami bertunangan, melangkah menuju hari bahagia kami.",
  },
];

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

export default function Slide6() {
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax), pure wallpaper */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar our story"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Bg solid overlay #4D2A00 (80% opacity) — per user request, opacity
          tetap sama seperti versi putih. position: absolute supaya scoped
          ke slide 6. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-[#4D2A00]/80"
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
        className="relative z-10 flex w-full max-w-[24rem] flex-col items-center px-6 py-20"
      >
        <motion.h2
          variants={item}
          className="font-wedding text-[2.6rem] leading-none text-[#FFF3E3] sm:text-[3.2rem]"
        >
          Our Story
        </motion.h2>

        <span
          aria-hidden
          className="my-6 h-px w-24 bg-gradient-to-r from-transparent via-[#C8B48A]/50 to-transparent"
        />

        {/* Timeline vertikal — tiap milestone dalam kartu cream */}
        <div className="relative flex w-full flex-col gap-6">
          {/* Garis vertikal penghubung */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[1.35rem] top-2 bottom-2 w-px bg-gradient-to-b from-[#C8B48A]/50 via-[#C8B48A]/30 to-[#C8B48A]/50"
          />

          {STORY.map((s) => (
            <motion.div key={s.title} variants={item} className="relative z-[1] flex items-start gap-4">
              {/* Titik timeline */}
              <span
                aria-hidden
                className="mt-5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-[#C8B48A] bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#C8B48A]" />
              </span>

              {/* Kartu cerita */}
              <div className="flex-1 rounded-3xl bg-[#f4f4ec] px-5 py-4 shadow-[0_14px_30px_-14px_rgba(60,45,25,0.4)] ring-1 ring-[#544c39]/10">
                <span className="font-latin inline-block rounded-full bg-[#5b0101]/10 px-3 py-1 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-[#5b0101]">
                  {s.time}
                </span>
                <h3 className="font-wedding mt-2 text-[1.7rem] leading-none text-[#5b0101]">
                  {s.title}
                </h3>
                <p className="font-script mt-2 text-[0.8rem] leading-relaxed text-black sm:text-[0.86rem]">
                  {s.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
