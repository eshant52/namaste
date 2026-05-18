import { Button } from "@/components/ui/button";
import type { NotificationsResponseData } from "@/schemas/user/protected.zod";

type NotificationItem = NotificationsResponseData["data"][number];

type GroupInviteListItemProps = {
  notification: NotificationItem;
  isPending: boolean;
  onRespond: (action: "accept" | "reject") => void;
};

export const GroupInviteListItem = ({
  notification,
  isPending,
  onRespond,
}: GroupInviteListItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="font-medium">{notification.actor.name}</p>
        <p className="text-sm text-muted-foreground">
          invited you to join this group
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          disabled={isPending}
          onClick={() => onRespond("accept")}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => onRespond("reject")}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
