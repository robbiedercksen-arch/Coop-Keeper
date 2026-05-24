type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stat?: string | number;
  statLabel?: string;
};

export default function PageBanner({
  eyebrow,
  title,
  subtitle,
  stat,
  statLabel,
}: Props) {

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        p-6
        md:p-8
        mb-6
        text-white
        shadow-lg
      "
      style={{
        background:
          "linear-gradient(135deg, #4d8b63 0%, #6ea57b 100%)",
      }}
    >

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute
          top-0
          right-0
          w-72
          h-72
          opacity-20
          rounded-full
          blur-3xl
        "
        style={{
          background: "#d7f7d9",
        }}
      />

      {/* NOISE TEXTURE */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
        "
        style={{
          backgroundImage:
            "radial-gradient(#fff 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* CONTENT */}
      <div className="relative flex justify-between items-start gap-4">

        <div>

          <div
            className="
              text-xs
              uppercase
              tracking-[3px]
              font-semibold
              opacity-80
              mb-3
            "
          >
            {eyebrow}
          </div>

          <h1
            className="
              text-3xl
              md:text-5xl
              font-bold
              leading-tight
              mb-2
            "
          >
            {title}
          </h1>

          <p
            className="
              text-white/85
              max-w-xl
              text-sm
              md:text-base
            "
          >
            {subtitle}
          </p>

        </div>

        {stat && (
          <div
            className="
              bg-white/15
              backdrop-blur-md
              rounded-3xl
              px-5
              py-4
              min-w-[90px]
              text-center
              border
              border-white/10
            "
          >

            <div className="text-4xl font-bold">
              {stat}
            </div>

            <div
              className="
                text-[10px]
                uppercase
                tracking-[2px]
                mt-1
                opacity-80
              "
            >
              {statLabel}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}