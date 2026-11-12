"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";

// Video intro — file LOKAL (public/video/intro.mp4) biar loading-nya cepat
// & stabil, nggak tergantung CDN eksternal (per user report: spinner macet
// terus karena video eksternal lambat/blok di preview).
const INTRO_VIDEO = "/video/intro.mp4";

// Wallpaper utama — muncul setelah video selesai.
const WALLPAPER =
  "https://imglinkv-3.vercel.app/api/images/cmwdgsc0wzfl25lw0/file";

// Foto mempelai — bergantian setiap 2 detik di dalam coverpage arch.
const PHOTOS = [
  "https://imglinkv-3.vercel.app/api/images/cmwdb82qqqrqizphy/file",
  "https://imglinkv-3.vercel.app/api/images/cmwdb85hpv14akk91/file",
];

const ROTATE_INTERVAL_MS = 2000;

// Ayat Ar-Rum:21 — teks revisi per user request.
const AYAH_TEXT =
  "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const AYAH_SOURCE = "QS Ar-Rum: 21";

// Safety net — kalau video nggak kunjung siap (stall/blok), jangan biarin
// user terjebak di spinner: otomatis lanjut ke wallpaper.
const VIDEO_FALLBACK_TIMEOUT_MS = 15_000;

export default function Slide2() {
  const goTo = useInvitation((s) => s.goTo);

  // Phase "video" = intro video full screen; phase "main" = wallpaper + card.
  const [phase, setPhase] = useState<"video" | "main">("video");

  // Status buffer video — "loading" = belum siap (tampil spinner),
  // "playing" = video sudah jalan (spinner disembunyiin).
  const [videoStatus, setVideoStatus] = useState<"loading" | "playing">(
    "loading"
  );

  // index foto yang sedang tampil (bergantian tiap 2 detik)
  const [idx, setIdx] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  const goToMain = () => setPhase("main");

  // Autoplay video dari awal begitu section muncul.
  useEffect(() => {
    if (phase !== "video") return;
    videoRef.current?.play().catch(() => {
      // Autoplay keblock — coba lagi begitu video ready (onCanPlay),
      // kalau tetap gagal user tinggal tap layar (bukan stuck grey screen).
    });

    const fallback = setTimeout(() => goToMain(), VIDEO_FALLBACK_TIMEOUT_MS);
    return () => clearTimeout(fallback);
  }, [phase]);

  // Foto bergantian setiap 2 detik (hanya saat phase main).
  useEffect(() => {
    if (phase !== "main") return;
    const t = setInterval(() => {
      setIdx((v) => (v + 1) % PHOTOS.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [phase]);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-hidden bg-[#171210]">
      {/* ── PHASE 1: video intro (full screen, mute biar autoplay jalan) ── */}
      {phase === "video" && (
        <>
          <video
            ref={videoRef}
            src={INTRO_VIDEO}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            onLoadedData={() => {
              // Frame pertama sudah tersedia — langsung tampilkan & play.
              videoRef.current?.play().catch(() => {});
              setVideoStatus("playing");
            }}
            onCanPlay={() => {
              // Video ready — mulai play (kalau autoplay awal gagal) &
              // sembunyiin spinner.
              videoRef.current?.play().catch(() => {});
              setVideoStatus("playing");
            }}
            onCanPlayThrough={() => setVideoStatus("playing")}
            onPlaying={() => setVideoStatus("playing")}
            onWaiting={() => setVideoStatus("loading")}
            onEnded={goToMain}
            onError={goToMain}
          />

          {/* Spinner saat video masih buffering — biar user lihat sesuatu,
              bukan layar kosong. Background gelap hangat, senada video. */}
          {videoStatus === "loading" && (
            <div
              aria-hidden
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#171210]"
            >
              <Loader2 className="size-8 animate-spin text-[#C8B48A]" />
              <p className="font-latin text-[0.6rem] uppercase tracking-[0.3em] text-[#C8B48A]/70">
                Memuat video
              </p>
            </div>
          )}
        </>
      )}

      {/* ── PHASE 2: wallpaper baru + coverpage arch ── */}
      {phase === "main" && (
        <>
          {/* Wallpaper baru — fade in setelah video habis */}
          <motion.img
            src={WALLPAPER}
            alt="Latar undangan pernikahan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            // @ts-expect-error -- fetchPriority is valid in React 19 but not in older types
            fetchPriority="high"
          />

          {/* Back button — top-left */}
          <motion.button
            type="button"
            onClick={() => goTo("cover")}
            aria-label="Kembali ke cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="group absolute left-4 top-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#544c39]/40 bg-white/60 text-[#544c39] backdrop-blur-sm transition-colors hover:border-[#544c39] hover:bg-white hover:text-[#3a3424] sm:left-8 sm:top-8"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          </motion.button>

          <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-14">
            {/* Coverpage: setengah capsule menghadap ke atas (arch) + bagian
                bawah persegi, masih nyambung jadi satu card. Warna putih 85%. */}
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.7,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex w-[315px] flex-col items-center rounded-t-full bg-white/85 px-3 pt-3 shadow-[0_28px_60px_-20px_rgba(60,45,25,0.55)] ring-1 ring-white/70 backdrop-blur-sm sm:w-[357px]"
            >
              {/* Foto mempelai — arch, bergantian tiap 2 detik */}
              <div className="relative h-[374px] w-[291px] overflow-hidden rounded-t-full shadow-[0_22px_55px_-15px_rgba(0,0,0,0.45)] ring-1 ring-white/10 sm:h-[416px] sm:w-[333px]">
                <AnimatePresence mode="sync">
                  <motion.img
                    key={idx}
                    src={PHOTOS[idx]}
                    alt={`Foto mempelai ${idx + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                </AnimatePresence>

                {/* dot indicators */}
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {PHOTOS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                        i === idx ? "bg-white" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bagian bawah card (persegi, nyambung) — ayat Ar-Rum */}
              <div className="mb-8 mt-5 flex w-full flex-col items-center px-3">
                {/* ornamental quote mark */}
                <span
                  aria-hidden
                  className="font-script mb-2 text-3xl leading-none text-black/40"
                >
                  &ldquo;
                </span>

                <p className="font-script text-center text-[0.78rem] leading-relaxed text-black sm:text-[0.85rem]">
                  {AYAH_TEXT}
                </p>

                {/* thin ornamental divider */}
                <span
                  aria-hidden
                  className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-black/40 to-transparent"
                />

                <p className="font-latin text-[0.66rem] font-medium uppercase tracking-[0.28em] text-black sm:text-[0.7rem]">
                  {AYAH_SOURCE}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </main>
  );
}
