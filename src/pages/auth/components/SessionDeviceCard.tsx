import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import type { UserLoginConflictResponseData } from "@/schemas/user/auth.zod";

type SessionItem = UserLoginConflictResponseData["data"]["sessions"][number];

type SessionDeviceCardProps = {
  session: SessionItem;
  isPending: boolean;
  onRevoke: (sessionId: string) => void;
  formatSessionTime: (timestamp: number) => string;
};

export const SessionDeviceCard = ({
  session,
  isPending,
  onRevoke,
  formatSessionTime,
}: SessionDeviceCardProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{session.deviceName}</p>
        <p className="text-xs text-muted-foreground">IP: {session.ip}</p>
        <p className="text-xs text-muted-foreground">
          Last used: {formatSessionTime(session.lastUsedAt)}
        </p>
        <p className="text-xs text-muted-foreground">
          Expires in {session.daysLeft} day{session.daysLeft === 1 ? "" : "s"}
        </p>
      </div>

      <Button
        variant="destructive"
        disabled={isPending}
        onClick={() => onRevoke(session.sessionId)}
      >
        {isPending ? (
          <>
            <Loader2Icon data-icon="inline-start" className="animate-spin" />
            Revoking...
          </>
        ) : (
          "Revoke session"
        )}
      </Button>
    </div>
  );
};
