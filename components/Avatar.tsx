import Image from "next/image";

interface AvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: number; // px
  className?: string;
}

export function Avatar({ name, avatarUrl, size = 40, className = "" }: AvatarProps) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      className={`rounded-full bg-gray-300 text-gray-800 flex items-center justify-center font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {initial}
    </div>
  );
}
