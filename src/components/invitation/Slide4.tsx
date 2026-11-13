"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInvitation } from "@/lib/invitation-store";

const BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Background image untuk cover card tiap acara (dipotong mengikuti bentuk
// capsule card per user request).
const EVENT_BG_IMAGE =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Target countdown: Akad Nikah — Minggu, 10 Januari 2027, Pukul 08.00 WIB.
// 08:00 WIB (UTC+7) = 01:00 UTC → 2027-01-10T01:00:00Z.
const AKAD_TARGET = new Date("2027-01-10T01:00:00Z").getTime();

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

/** Live countdown to AKAD_TARGET. Returns days/hours/minutes/seconds left. */
function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1_000);
  return { days, hours, minutes, seconds };
}

type EventData = {
  title: string;
  /** Hari acara, mis. "Minggu" */
  day: string;
  /** Tanggal acara — ditampilkan besar warna merah maroon */
  date: string;
  /** Bulan + tahun acara, mis. "Januari 2027" */
  monthYear: string;
  time: string;
  location: string;
};

const EVENTS: EventData[] = [
  {
    title: "Akad Nikah",
    day: "Minggu",
    date: "10",
    monthYear: "Januari 2027",
    time: "Pukul 08.00 - 09.00",
    location: "Dusun 4 Desa Gajah Mati",
  },
  {
    title: "Resepsi",
    day: "Minggu",
    date: "10",
    monthYear: "Januari 2027",
    time: "Pukul 09.00 - Selesai",
    location: "Dusun 4 Desa Gajah Mati",
  },
  {
    title: "Ngunduh Mantu",
    day: "Minggu",
    date: "17",
    monthYear: "Januari 2027",
    time: "Pukul 10.00 - Selesai",
    location: "C5 Rimba Ukur (Rumah Mempelai Pria)",
  },
];

/**
 * EventCapsuleCard — cover card WAJIB bentuk capsule (rounded-full) dengan
 * background image. Di dalamnya ada cover card capsule lagi berwarna putih
 * 85% berisi detail acara: hari → tanggal besar (maroon) → bulan+tahun.
 * Ukuran slim & compact (max-w-[18rem], aspect 3.5/5) — nggak melebar.
 */
function EventCapsuleCard({ event }: { event: EventData }) {
  return (
    <motion.div
      variants={item}
      className="relative w-full max-w-[18rem] overflow-hidden rounded-full shadow-[0_22px_50px_-18px_rgba(60,45,25,0.45)] ring-1 ring-white/50 aspect-[3.5/5]"
    >
      {/* Background image — mengikuti bentuk capsule card */}
      <img
        src={EVENT_BG_IMAGE}
        alt={`Latar acara ${event.title}`}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Cover card dalam — capsule putih 85% opacity berisi detail acara */}
      <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white/85 px-7 text-center backdrop-blur-[2px]">
        <h3 className="font-wedding text-[2rem] leading-none text-[#5b0101] sm:text-[2.2rem]">
          {event.title}
        </h3>

        <span
          aria-hidden
          className="my-3 h-px w-16 bg-gradient-to-r from-transparent via-[#5b0101]/40 to-transparent"
        />

        {/* Hari acara */}
        <p className="font-script text-[0.9rem] text-black sm:text-[1rem]">
          {event.day}
        </p>

        {/* Tanggal acara — besar, merah maroon */}
        <p className="font-serif-display mt-1 text-[3.1rem] font-semibold leading-none text-[#5b0101] sm:text-[3.5rem]">
          {event.date}
        </p>

        {/* Bulan + tahun */}
        <p className="font-script mt-1 text-[0.95rem] text-black sm:text-[1.05rem]">
          {event.monthYear}
        </p>

        {/* Jam acara */}
        <p className="font-script mt-2.5 text-[0.85rem] text-black sm:text-[0.92rem]">
          {event.time}
        </p>

        <span
          aria-hidden
          className="my-3 h-px w-16 bg-gradient-to-r from-transparent via-[#5b0101]/40 to-transparent"
        />

        {/* Lokasi */}
        <p className="font-latin text-[0.55rem] font-medium uppercase tracking-[0.24em] text-[#5b0101]">
          Lokasi
        </p>
        <p className="font-script mt-1 max-w-[10.5rem] text-[0.82rem] leading-relaxed text-black sm:text-[0.88rem]">
          {event.location}
        </p>
      </div>
    </motion.div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 font-latin text-[1.4rem] font-medium text-[#3a3424] shadow-[0_8px_20px_-8px_rgba(60,45,25,0.4)] sm:h-16 sm:w-16 sm:text-[1.7rem]">
        {padded}
      </div>
      <span className="font-latin mt-2 text-[0.55rem] font-medium uppercase tracking-[0.2em] text-[#C8B48A] sm:text-[0.6rem]">
        {label}
      </span>
    </div>
  );
}

export default function Slide4() {
  const { days, hours, minutes, seconds } = useCountdown(AKAD_TARGET);
  const goTo = useInvitation((s) => s.goTo);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      {/* Background image — fixed (parallax) like other slides */}
      <motion.img
        src={BG_IMAGE}
        alt="Latar slide acara"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full object-cover"
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        loading="eager"
      />
      {/* Bg solid overlay #4D2A00 (80% opacity) — per user request, opacity
          tetap sama seperti versi putih. position: absolute supaya scoped ke
          slide 4, nggak bocor ke slide lain. */}
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
        className="relative z-10 flex w-full flex-col items-center px-6 py-20"
      >
        {/* SAVE THE DATE — cream biar kontras di atas overlay coklat gelap */}
        <motion.h2
          variants={item}
          className="font-wedding text-[2.6rem] leading-none text-[#FFF3E3] sm:text-[3.2rem]"
        >
          Save The Date
        </motion.h2>

        {/* 3 acara — Akad Nikah, Resepsi, Ngunduh Mantu.
            Tiap acara = cover card capsule berbg image + inner capsule putih. */}
        <div className="mt-12 flex w-full flex-col items-center gap-8">
          {EVENTS.map((event) => (
            <EventCapsuleCard key={event.title} event={event} />
          ))}
        </div>

        {/* Countdown — diarahkan ke acara Akad Nikah */}
        <motion.div
          variants={item}
          className="mt-14 flex w-full flex-col items-center"
        >
          <p className="font-latin text-[0.72rem] font-medium uppercase tracking-[0.32em] text-[#C8B48A] sm:text-[0.78rem]">
            Menuju Akad Nikah
          </p>

          <div className="mt-6 flex items-start gap-3 sm:gap-4">
            <CountdownUnit value={days} label="Hari" />
            <span className="font-latin mt-5 text-[1.4rem] text-[#C8B48A] sm:text-[1.7rem]">:</span>
            <CountdownUnit value={hours} label="Jam" />
            <span className="font-latin mt-5 text-[1.4rem] text-[#C8B48A] sm:text-[1.7rem]">:</span>
            <CountdownUnit value={minutes} label="Menit" />
            <span className="font-latin mt-5 text-[1.4rem] text-[#C8B48A] sm:text-[1.7rem]">:</span>
            <CountdownUnit value={seconds} label="Detik" />
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
