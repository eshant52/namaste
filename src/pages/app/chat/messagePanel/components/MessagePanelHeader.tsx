import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type MessagePanelHeaderProps = {
  displayName: string;
  subtitle: string;
  avatarUrl?: string | null;
  activeGroupId: string | null;
  isLeaving: boolean;
  onLeaveGroup: () => void;
};

export const MessagePanelHeader = ({
  displayName,
  subtitle,
  avatarUrl,
  activeGroupId,
  isLeaving,
  onLeaveGroup,
}: MessagePanelHeaderProps) => {
  return (
    <header className="h-16 shrink-0 border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            <AvatarImage src={avatarUrl ?? ""} alt={displayName} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeGroupId ? (
            <Button
              size="sm"
              variant="outline"
              disabled={isLeaving}
              onClick={onLeaveGroup}
            >
              {isLeaving ? "Leaving..." : "Leave Group"}
            </Button>
          ) : null}

          <Button variant="ghost" size="icon" aria-label="Chat options">
            <MoreVertical data-icon="inline-start" />
          </Button>
        </div>
      </div>
    </header>
  );
};
