// Cache blob video intro di memori modul.
//
// ARSITEKTUR PENGIRIMAN VIDEO INTRO (pelajaran dari 3x kegagalan lapangan):
//   1. fetch streaming .mp4 → di jalur preview HANG (spinner muter terus).
//   2. warm-up element video + element autoplay (URL sama) → berebut
//      pipeline media → play <1 detik lalu mati.
//   3. element video mandiri streaming .mp4 → di perangkat user TIDAK
//      play sama sekali (padahal lewat Caddy lokal 100% bersih — berarti
//      jalur streaming .mp4 di perangkat/jaringan user yang bermasalah).
//
// SOLUSI: byte video di-embed di chunk JS (src/lib/intro-data.ts) —
// transport yang PERSIS SAMA dengan seluruh bundle/gambar/font aplikasi
// yang terbukti selalu sampai. Byte di-decode → Blob → objectURL →
// <video src="blob:..."> → decode lokal, NOL ketergantungan streaming.
// Kalau pun gagal (ekstrem), caller fallback ke <video src> network biasa
// dengan spinner + timeout, jadi user tidak pernah terjebak.

let cachedUrl: string | null = null;
let pending: Promise<string | null> | null = null;

/**
 * Pastikan blob video intro siap. Resolve dengan objectURL `blob:...`
 * (byte utuh di memori), atau `null` kalau gagal — caller wajib fallback
 * ke `<video src>` network. Aman dipanggil berkali-kali (dedup otomatis).
 */
export function ensureIntroBlobUrl(): Promise<string | null> {
  if (cachedUrl) return Promise.resolve(cachedUrl);
  if (pending) return pending;

  pending = (async () => {
    try {
      const mod = await import("./intro-data");
      const bin = atob(mod.INTRO_BASE64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(
        new Blob([bytes], { type: "video/mp4" })
      );
      cachedUrl = url;
      return url;
    } catch {
      return null;
    } finally {
      pending = null;
    }
  })();

  return pending;
}

/**
 * Preload di background sejak cover dibuka — TANPA element video
 * tersembunyi (pelajaran dari bug "video cuma jalan <1 detik": dua media
 * element dengan URL sama saling merusak pipeline). Murni unduh chunk JS
 * + simpan blob di memori, jadi pas user klik "Buka Undangan" video
 * langsung play dari memori.
 */
export function prefetchIntroBlobUrl(): void {
  ensureIntroBlobUrl().catch(() => {});
}
