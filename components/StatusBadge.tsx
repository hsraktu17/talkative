type StatusBadgeProps = { label: string; online?: boolean };
export default function StatusBadge({ label, online }: StatusBadgeProps) {
  return (
    <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium
      ${online ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}`}>
      {label}
    </span>
  );
}
