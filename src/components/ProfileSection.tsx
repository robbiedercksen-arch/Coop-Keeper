type Props = {
  title: string;
  children: React.ReactNode;
};

export default function ProfileSection({ title, children }: Props) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      <div className="bg-white rounded-xl shadow p-3">
        {children}
      </div>
    </div>
  );
}