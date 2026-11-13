"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, Check, ChevronDown } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";
import LazyBackground from "@/components/invitation/LazyBackground";

const BG_IMAGE =
  "/images/cmwdgsc0wzfl25lw0.jpg";

const GIFT_INTRO =
  "Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih, Anda dapat memberi melalui dibawah ini.";

type BankAccount = {
  /** Nama tampilan, mis. "Bank Mandiri" atau "Dana" */
  label: string;
  /** Huruf kecil di badge logo */
  badgeLetter: string;
  number: string;
  holder: string;
  /** tailwind text class + small logo letter color used in the badge */
  accent: string;
  badge: string;
};

const ACCOUNTS: BankAccount[] = [
  { label: "Dana", badgeLetter: "D", number: "083133024029", holder: "Eci Kurnia", accent: "text-[#10847e]", badge: "bg-[#10847e]" },
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

function AccountRow({ acc }: { acc: BankAccount }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(acc.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard may be blocked (e.g. non-secure context); still toggle UI
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/70 px-4 py-3.5 shadow-[0_8px_20px_-12px_rgba(60,45,25,0.4)] ring-1 ring-[#544c39]/10">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl text-[0.7rem] font-bold text-white ${acc.badge}`}
        >
          {acc.badgeLetter}
        </span>
        <div className="flex flex-col">
          <span className={`font-latin text-[0.62rem] font-medium uppercase tracking-[0.2em] ${acc.accent}`}>
            {acc.label}
          </span>
          <span className="font-serif-display text-[0.95rem] font-medium tracking-wide text-[#3a3424]">
            {acc.number}
          </span>
          <span className="font-script text-[0.7rem] text-[#544c39]">a.n {acc.holder}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Salin nomor ${acc.label}`}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/30 text-[#544c39] transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424]"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

export default function Slide7() {
  const goTo = useInvitation((s) => s.goTo);
  const [open, setOpen] = useState(false);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center overflow-hidden bg-stone-100">
      <LazyBackground src={BG_IMAGE} alt="Latar wedding gift" />
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
        className="relative z-10 flex w-full max-w-[24rem] flex-col items-center px-6 py-20 text-center"
      >
        <motion.div variants={item} className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f4ec] text-[#544c39] shadow-[0_10px_25px_-10px_rgba(60,45,25,0.45)]">
          <Gift className="size-7" />
        </motion.div>

        {/* Wedding Gift heading + doa intro wrapped in #f4f4ec solid card */}
        <motion.div
          variants={item}
          className="flex w-full flex-col items-center rounded-3xl bg-[#f4f4ec] px-6 py-8 text-center shadow-[0_22px_50px_-18px_rgba(60,45,25,0.4)]"
        >
          <h2 className="font-wedding text-[2.6rem] leading-none text-[#544c39] sm:text-[3.2rem]">
            Wedding Gift
          </h2>

          <p className="font-script mt-5 text-[0.82rem] leading-relaxed text-[#3a3424] sm:text-[0.9rem]">
            {GIFT_INTRO}
          </p>
        </motion.div>

        {/* Toggle button — click to unhide/hide the account list */}
        <motion.button
          variants={item}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#544c39]/40 bg-[#f4f4ec] px-6 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#544c39] transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:text-[0.68rem]"
        >
          <span>Klik Disini</span>
          <ChevronDown
            className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </motion.button>

        {/* Animated reveal/hide of the accounts */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="accounts"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full overflow-hidden"
            >
              <div className="mt-6 flex flex-col gap-3">
                {ACCOUNTS.map((a) => (
                  <AccountRow key={a.label} acc={a} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
