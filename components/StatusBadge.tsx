type Props = { label: string };
export default function StatusBadge({ label }: Props) {
  return (
    <span className={`ml-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-semibold`}>
      {label}
    </span>
  );
}
