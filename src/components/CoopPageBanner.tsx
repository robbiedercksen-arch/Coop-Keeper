import { useEffect, useState } from "react";

export default function CoopPageBanner({
  eyebrow = "COOP KEEPER",
  title = "Welcome back.",
  subtitle = "Your flock at a glance",
}: any) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateText = now.toLocaleDateString("en-ZA", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timeText = now.toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className="
        relative overflow-hidden rounded-[28px] mb-6 min-h-[210px]
        bg-gradient-to-r from-[#2d1b0f] via-[#6f7f3a] to-[#f2c94c]
        border border-[#d9a441]/80
        shadow-[0_22px_45px_rgba(53,36,12,0.35),inset_0_1px_0_rgba(255,255,255,0.35)]
        text-white
      "
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-white/10" />

      <div className="absolute bottom-0 right-0 w-[45%] h-[85px] bg-[#315c2b]/70 rounded-tl-[100%]" />
      <div className="absolute bottom-0 right-0 w-[32%] h-[58px] bg-[#d9a441]/60 rounded-tl-[100%]" />
      <div className="absolute bottom-0 left-0 w-full h-[28px] bg-[#203b1f]/35" />

      <div className="relative z-10 flex justify-between items-start gap-6 p-8">
        <div className="pt-2">
          <div className="text-sm tracking-[0.32em] font-extrabold text-[#ffe8a3] mb-4 uppercase">
            {eyebrow}
          </div>

          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            {title}
          </h1>

          <p className="text-lg text-white/90">{subtitle}</p>
        </div>

        <div
          className="
            w-[255px] rounded-2xl
            bg-white/18 backdrop-blur-md
            border border-white/25
            shadow-[0_12px_25px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.30)]
            p-5
            hidden md:block
          "
        >
          <div className="text-[11px] tracking-[0.28em] font-bold text-[#ffe8a3] mb-2">
            TODAY
          </div>

          <div className="text-base font-bold text-white">{dateText}</div>

          <div className="h-px bg-white/30 my-3" />

          <div className="text-3xl font-extrabold tracking-wider">
            {timeText}
          </div>

          <div className="text-[11px] text-white/75 mt-2">
            South Africa (SAST)
          </div>
        </div>
      </div>
    </div>
  );
}