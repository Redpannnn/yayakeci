"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useInvitation } from "@/lib/invitation-store";
import { ensureIntroBlobUrl } from "@/lib/intro-cache";

// Video intro — byte video DI-EMBED di chunk JS (src/lib/intro-data.ts),
// di-decode jadi Blob di memori lalu diputar dari `blob:` URL. Bukan
// streaming .mp4 lagi.
//
// Riwayat kegagalan streaming .mp4 di perangkat user (3x):
//   1. fetch streaming → hang (spinner muter terus).
//   2. warm-up element + autoplay element (URL sama) → play <1 detik lalu
//      mati (berebut pipeline media).
//   3. element video mandiri streaming → TIDAK play sama sekali, padahal
//      lewat Caddy lokal 100% bersih (range 206 OK, checksum identik) —
//      berarti jalur streaming .mp4 di perangkat/jaringan user yang
//      bermasalah, bukan file/server.
//
// Solusi: transport chunk JS = transport yang PERSIS SAMA dengan seluruh
// bundle/gambar/font aplikasi yang terbukti selalu sampai di perangkat
// user. Byte utuh di memori → decode lokal → NOL ketergantungan streaming.
// Konstanta di bawah cuma dipakai sbg FALLBACK TERAKHIR kalau blob gagal
// dibuat (ekstrem) — dengan spinner + timeout, user tidak pernah terjebak.
const INTRO_VIDEO = "/video/intro-v2.mp4";

// Wallpaper utama — gambar LOKAL (dulu dari CDN eksternal, 155KB).
const WALLPAPER = "/images/cmwdgsc0wzfl25lw0.jpg";

// Foto mempelai — LOKAL & terkompresi (~92KB/foto, dulu ~1MB/foto).
const PHOTOS = [
  "/images/cmwdb82qqqrqizphy.jpg",
  "/images/cmwdb85hpv14akk91.jpg",
];

// Poster = frame pertama video intro. Tampil INSTAN saat slide dibuka
// (sebelum frame video siap), jadi nggak ada layar hitam.
const INTRO_POSTER = "/video/intro-poster-v2.jpg";

const ROTATE_INTERVAL_MS = 2000;

// Ayat Ar-Rum:21 — teks revisi per user request.
const AYAH_TEXT =
  "Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.";
const AYAH_SOURCE = "QS Ar-Rum: 21";

// Safety net — kalau video nggak kunjung siap (stall/blok), jangan biarin
// user terjebak di spinner: otomatis lanjut ke wallpaper.
const VIDEO_FALLBACK_TIMEOUT_MS = 20_000;

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

  // Progres buffering REAL dari element video (0-99) — ditampilkan saat
  // video belum bisa play. Sumbernya attribute `buffered`, bukan fetch,
  // biar akurat dengan jalur streaming yang benar-benar dipakai.
  const [pct, setPct] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);

  // src video yang aktif: `blob:...` (byte utuh dari chunk JS — jalur
  // utama), `/video/intro-v2.mp4` (fallback network), atau null (masih
  // menyiapkan blob — poster + spinner tampil).
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  // Apakah playback sudah PERNAH jalan. Error yang muncul SETELAH video
  // pernah play = gangguan di akhir — jangan muter ulang dari awal,
  // langsung lanjut ke wallpaper.
  const startedRef = useRef(false);

  const goToMain = () => setPhase("main");

  // Media pipeline error: kalau src blob (data utuh di memori!) belum
  // sempat play → coba sekali lewat jalur network. Kalau sudah pernah
  // play / fallback network juga error → jangan biarin user nunggu,
  // lanjut wallpaper.
  const handleVideoError = () => {
    if (!startedRef.current && videoSrc && videoSrc.startsWith("blob:")) {
      setVideoSrc(INTRO_VIDEO);
      return;
    }
    goToMain();
  };

  // Progres = data yang sudah ter-buffer dibagi durasi (clamp 99 biar
  // nggak tampil "100%" padahal video belum jalan).
  const updatePct = () => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    const b = v.buffered;
    if (!b.length) return;
    setPct(Math.min(99, Math.round((b.end(b.length - 1) / v.duration) * 100)));
  };

  // Saat fase video mulai: siapkan blob (biasanya SUDAH ter-download sejak
  // cover lewat prefetchIntroBlobUrl → langsung play instan) dan pasang
  // safety net timeout. Kalau blob gagal (ekstrem), fallback ke <video src>
  // network biasa. Slide2 selalu fresh saat mount (AnimatePresence ganti
  // key), jadi nggak perlu reset state di sini.
  useEffect(() => {
    if (phase !== "video") return;

    let alive = true;

    ensureIntroBlobUrl().then((url) => {
      if (!alive) return;
      setVideoSrc(url ?? INTRO_VIDEO);
    });

    const fallback = setTimeout(() => goToMain(), VIDEO_FALLBACK_TIMEOUT_MS);
    return () => {
      alive = false;
      clearTimeout(fallback);
    };
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
      {/* ── PHASE 1: video intro (full screen, mute biar autoplay jalan).
          Tap di mana pun pada fase ini = lewati video. ── */}
      {phase === "video" && (
        <div
          role="button"
          aria-label="Lewati video intro"
          onClick={goToMain}
          className="absolute inset-0 cursor-pointer"
        >
          {/* Poster — frame pertama video, tampil INSTAN sebelum video siap. */}
          <motion.img
            src={INTRO_POSTER}
            alt=""
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Video — src = blob memori (byte utuh dari chunk JS, decode
              lokal, NOL streaming) atau fallback network. autoPlay muted
              playsInline — pola yang sama dengan wallpaper cover. */}
          {videoSrc && (
            <video
              key={videoSrc}
              ref={videoRef}
              src={videoSrc}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={updatePct}
              onProgress={updatePct}
              onCanPlay={updatePct}
              onPlaying={() => {
                startedRef.current = true;
                setVideoStatus("playing");
              }}
              onWaiting={() => setVideoStatus("loading")}
              onEnded={goToMain}
              onError={handleVideoError}
            />
          )}

          {/* Spinner + persentase buffering REAL + hint tap-untuk-lewati —
              cuma tampil kalau video belum bisa jalan. User TIDAK PERNAH
              stuck: begitu tap di mana pun, langsung lanjut wallpaper. */}
          {videoStatus === "loading" && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-end gap-3 bg-[#171210]/20 pb-16"
            >
              <Loader2 className="size-7 animate-spin text-[#C8B48A] drop-shadow" />
              <p className="font-latin text-[0.6rem] uppercase tracking-[0.3em] text-[#C8B48A]">
                {videoSrc ? `Memuat video ${pct}%` : "Menyiapkan video..."}
              </p>
              <p className="font-latin text-[0.5rem] uppercase tracking-[0.24em] text-[#C8B48A]/60">
                Ketuk untuk lanjut
              </p>
            </div>
          )}
        </div>
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
