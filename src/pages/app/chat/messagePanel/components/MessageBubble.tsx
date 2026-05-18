import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  message: string;
  createdAt: Date;
  isMine: boolean;
};

export const MessageBubble = ({
  message,
  createdAt,
  isMine,
}: MessageBubbleProps) => {
  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
          isMine
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {message}
        <div
          className={cn(
            "mt-1 text-right text-[10px]",
            isMine ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
