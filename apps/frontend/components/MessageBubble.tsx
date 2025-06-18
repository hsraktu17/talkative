import { format } from "date-fns"; // For formatting timestamps
import type { Message } from "@/lib/types";

type Props = { message: Message; self: boolean };

export default function MessageBubble({ message, self }: Props) {
  // Format the timestamp as HH:mm
  let timeStr = "";
  try {
    timeStr = format(new Date(message.created_at), "HH:mm");
  } catch {
    timeStr = "";
  }

  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-lg shadow
        ${self ? "bg-green-100 text-right" : "bg-white"}`}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-[10px] text-gray-400 flex justify-end space-x-1 mt-1">
          <span>{timeStr}</span>
          {self && <span>✓✓</span>}
        </div>
      </div>
    </div>
  );
}
