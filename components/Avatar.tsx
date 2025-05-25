import Image from "next/image";

export function Avatar({
  name,
  avatarUrl,
  size = 44,
  className = "",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      className={`rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initial}
    </div>
  );
}
