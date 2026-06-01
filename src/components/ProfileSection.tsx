type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ProfileSection({ title, children }: Props) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-[#6b4f1d] mb-2 px-1">
        {title}
      </h2>

      <div
        className="
          rounded-3xl
          p-5
          border
          border-[#d9a441]
          bg-[#faf7f0]
          shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]
        "
      >
        {children}
      </div>
    </div>
  );
}