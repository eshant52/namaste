import { Button } from "@/components/ui/button";
import type { NotificationsResponseData } from "@/schemas/user/protected.zod";

type NotificationItem = NotificationsResponseData["data"][number];

type NotificationListItemProps = {
  notification: NotificationItem;
  label: string;
  onMarkRead: (notificationId: string) => void;
  isMarking: boolean;
};

export const NotificationListItem = ({
  notification,
  label,
  onMarkRead,
  isMarking,
}: NotificationListItemProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="font-medium">{notification.actor.name}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>

      {!notification.readAt ? (
        <Button
          size="sm"
          variant="secondary"
          disabled={isMarking}
          onClick={() => onMarkRead(notification.id)}
        >
          Mark read
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">Read</span>
      )}
    </div>
  );
};
